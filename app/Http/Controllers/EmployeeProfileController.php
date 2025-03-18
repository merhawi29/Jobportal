<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\Employee;
use Illuminate\Validation\ValidationException;

class EmployeeProfileController extends Controller
{
    public function edit()
    {
        $user = auth()->user();
        $profile = $user->employee ?? new Employee();
// dd($profile);
        return Inertia::render('Employee/profile/Edit', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'position' => $profile->position,
                'verified' => $user->email_verified_at ? true : false,
                'department' => $profile->department,
                'hire_date' => $profile->hire_date,
                // 'salary' => $profile->salary,
                // 'employee_id' => $profile->employee_id, // Unique identifier for the employee within the organization
                'photo' => $profile->photo,
                'country' => $profile->country,
                'company_name' => $profile->company_name,
            ]
        ]);
    }

    public function update(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'position' => 'nullable|string|max:255',
                'department' => 'nullable|string|max:255',
                'hire_date' => 'nullable|date',
                // 'salary' => 'nullable|numeric',
                // 'employee_id' => 'nullable|string|max:255',
                'country' => 'nullable|string|max:255',
                'company_name' => 'nullable|string|max:255',
                'photo' => 'nullable|image|max:2048', // 2MB max
            ]);
            // dd($validated);
            $user = auth()->user();

            // Update user basic info
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
            ]);

            // Handle photo upload
            $photoPath = null;
            if ($request->hasFile('photo')) {
                // Delete old photo if exists
                if ($user->employee?->photo) {
                    Storage::delete($user->employee->photo);
                }
                $photoPath = $request->file('photo')->store('employee_photos');
            }

            // Create or update employee profile
            $user->employee()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'position' => $validated['position'] ?? null,
                    'department' => $validated['department'] ?? null,
                    'hire_date' => $validated['hire_date'] ?? null,
                    // 'salary' => $validated['salary'] ?? null,
                    // 'employee_id' => $validated['employee_id'] ?? null,
                    'country' => $validated['country'] ?? null,
                    'company_name' => $validated['company_name'] ?? null,
                    'photo' => $photoPath ?? $user->employee?->photo,
                ]
            );

            return redirect()
                ->back()
                ->with('success', 'Profile updated successfully!');

        } catch (ValidationException $e) {
            return redirect()
                ->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to update profile: ' . $e->getMessage())
                ->withInput();
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
        return response()->json(['photo' => Storage::url($photoPath)]);
    }


}
