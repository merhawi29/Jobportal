<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\Employee;

class EmployeeProfileController extends Controller
{
    public function edit()
    {
        $user = auth()->user();
        $profile = $user->employee ?? new Employee();

        return Inertia::render('Employee/profile/Edit', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'position' => $profile->position,
                'department' => $profile->department,
                'hire_date' => $profile->hire_date,
                'salary' => $profile->salary,
                'employee_id' => $profile->employee_id,
                'photo' => $profile->photo,
                'country' => $profile->country,
                'company_name' => $profile->company_name,
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        // Update user basic info
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            if ($user->employee?->photo) {
                Storage::delete($user->employee->photo);
            }
            $photoPath = $request->file('photo')->store('employee_photos');
        }

        try {
            // Create or update employee profile
            $profile = $user->employee()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'position' => $request->position,
                    'department' => $request->department,
                    'hire_date' => $request->hire_date,
                    'country' => $request->country,
                    'company_name' => $request->company_name,
                    'photo' => $photoPath ?? $user->employee?->photo,
                ]
            );

            return back()->with('success', 'Profile updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update profile: ' . $e->getMessage()]);
        }
    }

    public function show($id = null)
    {
        if ($id) {
            $employee = Employee::with('user')->findOrFail($id);
            $isOwnProfile = auth()->id() === $employee->user_id;
        } else {
            $user = auth()->user();
            $employee = $user->employee ?? new Employee();
            $isOwnProfile = true;
        }

        return Inertia::render('Employee/profile/Show', [
            'employee' => [
                'name' => $employee->user?->name ?? '',
                'email' => $employee->user?->email ?? '',
                'phone' => $employee->user?->phone ?? '',
                'position' => $employee->position,
                'department' => $employee->department,
                'hire_date' => $employee->hire_date,
                'status' => $employee->status ?? 'Active',
                'avatar' => $employee->photo ? Storage::url($employee->photo) : null,
                'address' => $employee->address ?? '',
                'country' => $employee->country,
                'company_name' => $employee->company_name,
            ],
            'isOwnProfile' => $isOwnProfile
        ]);
    }

    // public function show()
    // {
    //     // dd('show');
    //     $user = auth()->user();
    //     // This line gets the user's employee profile if it exists, otherwise creates a new empty profile
    //     // The ?? is the null coalescing operator - returns left side if not null, right side if null
    //     $employee = $user->employee ?? new Employee();
    //     $isOwnProfile = true;

    //     return Inertia::render('Employee/profile/Show', [
    //         'employee' => [
    //             'name' => $employee->user->name,
    //             'email' => $employee->user->email,
    //             'phone' => $employee->user->phone ?? '',
    //             'position' => $employee->position,
    //             'department' => $employee->department,
    //             'hire_date' => $employee->hire_date,
    //             'status' => $employee->status ?? 'Active',
    //             'avatar' => $employee->photo ? Storage::url($employee->photo) : null,
    //             'address' => $employee->address ?? '',
    //             'country' => $employee->country,
    //             'company_name' => $employee->company_name,
    //         ],
    //         'isOwnProfile' => $isOwnProfile
    //     ]);
    // }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:2048'
        ]);

        $user = auth()->user();

        if ($user->employee?->photo) {
            Storage::delete($user->employee->photo);
        }

        $photoPath = $request->file('photo')->store('employee_photos');

        $user->employee()->update(['photo' => $photoPath]);

        return response()->json(['photo' => $photoPath]);
    }


}
