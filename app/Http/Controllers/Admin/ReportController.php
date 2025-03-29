<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\EmployerVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function downloadReport(Request $request)
    {
        try {
            $type = $request->query('type', 'all');
            $data = $this->getReportData($type);
            
            $pdf = Pdf::loadView('admin.reports.pdf', $data);
            
            return $pdf->download("job-portal-report-{$type}-" . now()->format('Y-m-d') . '.pdf');
        } catch (\Exception $e) {
            Log::error('Error generating report: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to generate report'], 500);
        }
    }

    private function getReportData($type)
    {
        $data = [
            'generated_at' => now()->format('Y-m-d H:i:s'),
            'type' => $type
        ];

        switch ($type) {
            case 'users':
                $data['job_seekers'] = User::where('role', User::ROLES['job_seeker'])->count();
                $data['employers'] = User::where('role', User::ROLES['employer'])->count();
                $data['active_users'] = User::where('status', 'active')->count();
                $data['suspended_users'] = User::where('status', 'suspended')->count();
                break;

            case 'jobs':
                $data['total_jobs'] = Job::count();
                $data['active_jobs'] = Job::where('status', 'active')->count();
                $data['pending_jobs'] = Job::where('status', 'pending')->count();
                $data['applications'] = JobApplication::count();
                $data['jobs_by_type'] = Job::select('type', \DB::raw('count(*) as count'))
                    ->groupBy('type')
                    ->get();
                break;

            case 'verifications':
                $data['total_verifications'] = EmployerVerification::count();
                $data['pending_verifications'] = EmployerVerification::where('status', 'pending')->count();
                $data['approved_verifications'] = EmployerVerification::where('status', 'verified')->count();
                $data['rejected_verifications'] = EmployerVerification::where('status', 'rejected')->count();
                break;

            default:
                // All stats
                $data['total_users'] = User::count();
                $data['total_jobs'] = Job::count();
                $data['total_applications'] = JobApplication::count();
                $data['pending_verifications'] = EmployerVerification::where('status', 'pending')->count();
                $data['recent_activities'] = \App\Models\ActivityLog::latest()
                    ->take(10)
                    ->get();
                break;
        }

        return $data;
    }
} 