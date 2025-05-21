<?php

namespace App\Http\Controllers;

use App\Models\JobSeekerProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class CandidatesController extends Controller
{
    public function __construct()
    {
        // Only use auth middleware
        $this->middleware('auth');
    }

    public function search(Request $request)
    {
        // Check if the user is an employer
        if ($request->user()->role !== 'employer') {
            return redirect()->route('home')->with('error', 'Only employers can access this page.');
        }
        
        Log::info('Employer searching for candidates with filters:', $request->all());
        
        // Get job seekers with profiles
        $query = User::where('role', 'job_seeker')
            ->with('jobSeekerProfile');
        
        // First, get all users for skill searching
        $allJobSeekers = $query->get();
        Log::info('Found ' . $allJobSeekers->count() . ' total job seekers');
        
        // Initialize matching users collection
        $matchingUsers = collect();
        
        // Combined search for name and skills
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = trim($request->search);
            Log::info('Searching with term: "' . $searchTerm . '"');
            
            // Get all job seeker names for debugging
            $allNames = User::where('role', 'job_seeker')->pluck('name')->toArray();
            Log::info('All job seeker names in database: ' . implode(', ', $allNames));
            
            // Search by name in users table - with detailed SQL logging
            $nameQuery = User::where('role', 'job_seeker')
                ->where('name', 'like', "%{$searchTerm}%");
            
            // Log the exact SQL query being executed
            Log::info('Name search SQL: ' . $nameQuery->toSql());
            Log::info('Name search bindings: ' . json_encode($nameQuery->getBindings()));
            
            $nameMatchUsers = $nameQuery->with('jobSeekerProfile')->get();
            
            Log::info('Found ' . $nameMatchUsers->count() . ' users matching name search');
            if ($nameMatchUsers->count() > 0) {
                Log::info('Name matches found: ' . $nameMatchUsers->pluck('name')->implode(', '));
            } else {
                Log::info('No name matches found for term: "' . $searchTerm . '"');
            }
            
            $matchingUsers = $matchingUsers->concat($nameMatchUsers);
            
            // Now search by skills in jobSeekerProfile
            $skillMatchUsers = $allJobSeekers->filter(function($user) use ($searchTerm) {
                // Skip users without profiles or skills
                if (!$user->jobSeekerProfile) {
                    return false;
                }
                
                // Debug what we're finding in the profile
                Log::info("Checking user #{$user->id} ({$user->name}) skills: " . json_encode($user->jobSeekerProfile->skills ?? 'no skills'));
                
                if (!$user->jobSeekerProfile->skills) {
                    return false;
                }
                
                // Handle skills whether it's JSON, array or string
                $profileSkills = $user->jobSeekerProfile->skills;
                
                // If skills is stored as JSON string, decode it
                if (is_string($profileSkills) && (strpos($profileSkills, '[') === 0 || strpos($profileSkills, '{') === 0)) {
                    try {
                        $profileSkills = json_decode($profileSkills, true);
                    } catch (\Exception $e) {
                        Log::error('Failed to decode skills JSON: ' . $e->getMessage());
                    }
                }
                
                // Convert to string for searching if it's an array
                if (is_array($profileSkills)) {
                    $profileSkills = implode(' ', $profileSkills);
                }
                
                // Case insensitive search within skills
                $found = stripos((string)$profileSkills, $searchTerm) !== false;
                if ($found) {
                    Log::info("User #{$user->id} ({$user->name}) matched skills search");
                }
                return $found;
            });
            
            Log::info('Found ' . $skillMatchUsers->count() . ' users matching skills search');
            $matchingUsers = $matchingUsers->concat($skillMatchUsers);
            
            // Remove duplicates
            $matchingUsers = $matchingUsers->unique('id');
            Log::info('Total unique matching users: ' . $matchingUsers->count());
        } else {
            // If no search term, use all users
            $matchingUsers = $allJobSeekers;
        }
        
        // Experience filter - apply this after retrieving results
        $experienceLevel = $request->experience;
        
        // Filter by experience manually
        if (!empty($experienceLevel)) {
            $matchingUsers = $matchingUsers->filter(function($user) use ($experienceLevel) {
                if (!$user->jobSeekerProfile || !isset($user->jobSeekerProfile->experience_years)) {
                    return false;
                }
                
                $years = $user->jobSeekerProfile->experience_years;
                
                switch($experienceLevel) {
                    case 'entry':
                        return $years <= 2;
                    case 'mid':
                        return $years >= 3 && $years <= 5;
                    case 'senior':
                        return $years >= 6 && $years <= 10;
                    case 'expert':
                        return $years > 10;
                    default:
                        return true;
                }
            });
            
            Log::info('After experience filtering: ' . $matchingUsers->count() . ' users');
        }
        
        // Paginate the results manually
        $page = $request->input('page', 1);
        $perPage = 10;
        $total = $matchingUsers->count();
        
        $candidates = new \Illuminate\Pagination\LengthAwarePaginator(
            $matchingUsers->forPage($page, $perPage),
            $total,
            $perPage,
            $page,
            ['path' => \Illuminate\Support\Facades\Request::url()]
        );
        
        return Inertia::render('Employer/Candidates/Index', [
            'candidates' => $candidates,
            'filters' => $request->only(['search', 'experience'])
        ]);
    }
    
    public function show(Request $request, $id)
    {
        // Check if the user is an employer
        if ($request->user()->role !== 'employer') {
            return redirect()->route('home')->with('error', 'Only employers can access this page.');
        }
        
        $candidate = User::where('role', 'job_seeker')
            ->with(['jobSeekerProfile'])
            ->findOrFail($id);
        
        return Inertia::render('Employer/Candidates/Show', [
            'candidate' => $candidate
        ]);
    }
} 