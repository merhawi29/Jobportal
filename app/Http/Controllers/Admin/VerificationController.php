<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmployerVerification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VerificationController extends Controller
{
    public function index()
    {
        try {
            $verifications = EmployerVerification::with('user')
                ->where('status', 'pending')
                ->latest()
                ->get();

            return Inertia::render('Admin/Verifications/Index', [
                'verifications' => $verifications
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching verifications: ' . $e->getMessage());
            return Inertia::render('Admin/Verifications/Index', [
                'error' => 'Failed to fetch verifications'
            ]);
        }
    }

    public function verify(EmployerVerification $verification)
    {
        try {
            $verification->update([
                'status' => 'verified',
                'verified_at' => now()
            ]);

            // Update the user's verification status
            $verification->user->update([
                'verified' => true
            ]);

            return response()->json(['message' => 'Employer verified successfully']);
        } catch (\Exception $e) {
            Log::error('Error verifying employer: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to verify employer'], 500);
        }
    }

    public function reject(Request $request, EmployerVerification $verification)
    {
        try {
            $request->validate([
                'rejection_reason' => 'required|string|max:500'
            ]);

            $verification->update([
                'status' => 'rejected',
                'rejection_reason' => $request->rejection_reason
            ]);

            return response()->json(['message' => 'Employer verification rejected']);
        } catch (\Exception $e) {
            Log::error('Error rejecting verification: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to reject verification'], 500);
        }
    }

    public function viewDocument(EmployerVerification $verification)
    {
        try {
            if (!file_exists(storage_path('app/' . $verification->document_path))) {
                return response()->json(['error' => 'Document not found'], 404);
            }

            return response()->file(storage_path('app/' . $verification->document_path));
        } catch (\Exception $e) {
            Log::error('Error viewing document: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to view document'], 500);
        }
    }
} 