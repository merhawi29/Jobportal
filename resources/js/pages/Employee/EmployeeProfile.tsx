// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '@/hooks/auth';
// import { router } from '@inertiajs/react';

// interface EmployeeData {
//     id: number;
//     user_id: number;
//     position: string;
//     department: string;
//     hire_date: string;
//     salary: number;
//     employee_id: string;
//     photo: string | null;
//     country: string;
//     user: {
//         name: string;
//         email: string;
//     };
//     company_name: string;
// }

// const EmployeeProfile: React.FC = () => {
//     const [employee, setEmployee] = useState<EmployeeData | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isEditing, setIsEditing] = useState(false);
//     const [formData, setFormData] = useState<Partial<EmployeeData>>({});
//     const { user } = useAuth();

//     useEffect(() => {
//         fetchEmployeeProfile();
//     }, []);

//     const fetchEmployeeProfile = async () => {
//         try {
//             const response = await axios.get('/employee/profile');
//             setEmployee(response.data);
//             setFormData(response.data);
//         } catch (err) {
//             setError('Failed to load profile');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         try {
//             await router.put(route('employee.profile.update'), formData);
//         } catch (err) {
//             setError('Failed to update profile');
//         }
//     };

//     const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (!e.target.files?.length) return;

//         const formData = new FormData();
//         formData.append('photo', e.target.files[0]);

//         try {
//             const response = await axios.post(route('employee.profile.photo'), formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             setEmployee(prev => prev ? { ...prev, photo: response.data.photo } : null);
//         } catch (err) {
//             setError('Failed to upload photo');
//         }
//     };

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div className="text-red-500">{error}</div>;
//     if (!employee) return <div>No profile found</div>;

//     return (
//         <div className="max-w-4xl mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-6">Employee Profile</h1>

//             <div className="bg-white shadow rounded-lg p-6">
//                 <div className="flex items-center space-x-6 mb-6">
//                     <div className="relative">
//                         <img
//                             src={employee.photo || '/default-avatar.png'}
//                             alt="Profile"
//                             className="w-32 h-32 rounded-full object-cover"
//                         />
//                         <label className="block mt-2">
//                             <span className="sr-only">Choose profile photo</span>
//                             <input
//                                 type="file"
//                                 onChange={handlePhotoUpload}
//                                 accept="image/*"
//                                 className="block w-full text-sm text-slate-500
//                                     file:mr-4 file:py-2 file:px-4
//                                     file:rounded-full file:border-0
//                                     file:text-sm file:font-semibold
//                                     file:bg-blue-50 file:text-blue-700
//                                     hover:file:bg-blue-100"
//                             />
//                         </label>
//                     </div>

//                     <div>
//                         <h2 className="text-xl font-semibold">{employee.user.name}</h2>
//                         <p className="text-gray-600">{employee.employee_id}</p>
//                     </div>
//                 </div>

//                 {!isEditing ? (
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <h3 className="font-semibold">Position</h3>
//                             <p>{employee.position || 'Not set'}</p>
//                         </div>
//                         <div>
//                             <h3 className="font-semibold">Department</h3>
//                             <p>{employee.department || 'Not set'}</p>
//                         </div>
//                         <div>
//                             <h3 className="font-semibold">Hire Date</h3>
//                             <p>{employee.hire_date || 'Not set'}</p>
//                         </div>
//                         <div>
//                             <h3 className="font-semibold">Country</h3>
//                             <p>{employee.country || 'Not set'}</p>
//                         </div>
//                         <div>
//                             <h3 className="font-semibold">Company Name</h3>
//                             <p>{employee.company_name || 'Not set'}</p>
//                         </div>
//                         <button
//                             onClick={() => setIsEditing(true)}
//                             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                         >
//                             Edit Profile
//                         </button>
//                     </div>
//                 ) : (
//                     <form onSubmit={handleSubmit} className="mt-4">
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block font-semibold mb-1">Position</label>
//                                 <input
//                                     type="text"
//                                     name="position"
//                                     value={formData.position || ''}
//                                     onChange={handleInputChange}
//                                     className="w-full border rounded p-2"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block font-semibold mb-1">Department</label>
//                                 <input
//                                     type="text"
//                                     name="department"
//                                     value={formData.department || ''}
//                                     onChange={handleInputChange}
//                                     className="w-full border rounded p-2"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block font-semibold mb-1">Hire Date</label>
//                                 <input
//                                     type="date"
//                                     name="hire_date"
//                                     value={formData.hire_date || ''}
//                                     onChange={handleInputChange}
//                                     className="w-full border rounded p-2"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block font-semibold mb-1">Country</label>
//                                 <input
//                                     type="text"
//                                     name="country"
//                                     value={formData.country || ''}
//                                     onChange={handleInputChange}
//                                     className="w-full border rounded p-2"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block font-semibold mb-1">Company Name</label>
//                                 <input
//                                     type="text"
//                                     name="company_name"
//                                     value={formData.company_name || ''}
//                                     onChange={handleInputChange}
//                                     className="w-full border rounded p-2"
//                                 />
//                             </div>
//                         </div>
//                         <div className="mt-4 flex space-x-2">
//                             <button
//                                 type="submit"
//                                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                             >
//                                 Save Changes
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={() => setIsEditing(false)}
//                                 className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </form>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default EmployeeProfile;
