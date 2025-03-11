// // import React, { FormEvent, useState } from 'react';
// import { Head, router } from '@inertiajs/react';

// interface Education {
//     institution: string;
//     degree: string;
//     field: string;
//     start_date: string;
//     end_date?: string;
// }

// interface Experience {
//     company: string;
//     position: string;
//     description?: string;
//     start_date: string;
//     end_date?: string;
// }

// interface Certification {
//     name: string;
//     issuer: string;
//     date: string;
// }

// interface Profile {
//     name: string;
//     email: string;
//     phone: string;
//     location: string;
//     education: Education[];
//     experience: Experience[];
//     skills: string[];
//     certifications: Certification[];
//     resume: string | null;
//     is_public: boolean;
//     about: string;
//     linkedin_url?: string;
//     github_url?: string;
//     portfolio_url?: string;
// }

// interface Props {
//     profile: Profile;
//     status?: string;
// }

// // First, add this helper type at the top of the file, after the interfaces
// type FormDataConvertible = string | number | boolean | File | Blob | null | undefined;

// export default function JobSeekerProfileEdit({ profile, status }: Props) {
//     const [formData, setFormData] = useState(profile);
//     const [activeTab, setActiveTab] = useState('basic');

//     const handleSubmit = (e: FormEvent) => {
//         e.preventDefault();

//         // Create a new object with serialized arrays
//         const formPayload = {
//             ...formData,
//             _method: 'PUT',
//             education: JSON.stringify(formData.education),
//             experience: JSON.stringify(formData.experience),
//             skills: JSON.stringify(formData.skills),
//             certifications: JSON.stringify(formData.certifications)
//         };

//         router.post(route('jobseeker.profile.update'), formPayload, {
//             forceFormData: true,
//             preserveScroll: true
//         });
//     };

//     const addEducation = () => {
//         setFormData(prev => ({
//             ...prev,
//             education: [...prev.education, {
//                 institution: '',
//                 degree: '',
//                 field: '',
//                 start_date: '',
//                 end_date: ''
//             }]
//         }));
//     };

//     const addExperience = () => {
//         setFormData(prev => ({
//             ...prev,
//             experience: [...prev.experience, {
//                 company: '',
//                 position: '',
//                 description: '',
//                 start_date: '',
//                 end_date: ''
//             }]
//         }));
//     };

//     const addSkill = (skill: string) => {
//         if (!formData.skills.includes(skill)) {
//             setFormData(prev => ({
//                 ...prev,
//                 skills: [...prev.skills, skill]
//             }));
//         }
//     };

//     return (
//         <div className="py-12">
//             <Head title="Edit Job Seeker Profile" />

//             <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                 {status && (
//                     <div className="alert alert-success mb-4">
//                         {status}
//                     </div>
//                 )}

//                 <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//                     <div className="p-6">
//                         <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

//                         <div className="mb-6">
//                             <ul className="nav nav-tabs">
//                                 <li className="nav-item">
//                                     <button
//                                         className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
//                                         onClick={() => setActiveTab('basic')}
//                                     >
//                                         Basic Info
//                                     </button>
//                                 </li>
//                                 <li className="nav-item">
//                                     <button
//                                         className={`nav-link ${activeTab === 'education' ? 'active' : ''}`}
//                                         onClick={() => setActiveTab('education')}
//                                     >
//                                         Education
//                                     </button>
//                                 </li>
//                                 <li className="nav-item">
//                                     <button
//                                         className={`nav-link ${activeTab === 'experience' ? 'active' : ''}`}
//                                         onClick={() => setActiveTab('experience')}
//                                     >
//                                         Experience
//                                     </button>
//                                 </li>
//                                 <li className="nav-item">
//                                     <button
//                                         className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`}
//                                         onClick={() => setActiveTab('skills')}
//                                     >
//                                         Skills & Certifications
//                                     </button>
//                                 </li>
//                                 <li className="nav-item">
//                                     <button
//                                         className={`nav-link ${activeTab === 'privacy' ? 'active' : ''}`}
//                                         onClick={() => setActiveTab('privacy')}
//                                     >
//                                         Privacy
//                                     </button>
//                                 </li>
//                             </ul>
//                         </div>

//                         <form onSubmit={handleSubmit}>
//                             {/* Basic Info Tab */}
//                             {activeTab === 'basic' && (
//                                 <div className="space-y-4">
//                                     {/* Basic info fields */}
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                             <label className="form-label">Name</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 value={formData.name}
//                                                 onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                                                 required
//                                             />
//                                         </div>
//                                         {/* Add other basic info fields */}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Education Tab */}
//                             {activeTab === 'education' && (
//                                 <div>
//                                     {formData.education.map((edu, index) => (
//                                         <div key={index} className="mb-4 p-4 border rounded">
//                                             {/* Education fields */}
//                                         </div>
//                                     ))}
//                                     <button
//                                         type="button"
//                                         className="btn btn-outline-primary"
//                                         onClick={addEducation}
//                                     >
//                                         Add Education
//                                     </button>
//                                 </div>
//                             )}

//                             {/* Experience Tab */}
//                             {activeTab === 'experience' && (
//                                 <div>
//                                     {formData.experience.map((exp, index) => (
//                                         <div key={index} className="mb-4 p-4 border rounded">
//                                             {/* Experience fields */}
//                                         </div>
//                                     ))}
//                                     <button
//                                         type="button"
//                                         className="btn btn-outline-primary"
//                                         onClick={addExperience}
//                                     >
//                                         Add Experience
//                                     </button>
//                                 </div>
//                             )}

//                             {/* Skills & Certifications Tab */}
//                             {activeTab === 'skills' && (
//                                 <div>
//                                     {/* Skills and certifications fields */}
//                                 </div>
//                             )}

//                             {/* Privacy Tab */}
//                             {activeTab === 'privacy' && (
//                                 <div className="space-y-4">
//                                     <div className="form-check">
//                                         <input
//                                             type="checkbox"
//                                             className="form-check-input"
//                                             checked={formData.is_public}
//                                             onChange={e => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
//                                             id="is_public"
//                                         />
//                                         <label className="form-check-label" htmlFor="is_public">
//                                             Make profile public
//                                         </label>
//                                     </div>
//                                     {/* Add other privacy settings */}
//                                 </div>
//                             )}

//                             <div className="mt-6 flex justify-end">
//                                 <button type="submit" className="btn btn-primary">
//                                     Save Changes
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// //
