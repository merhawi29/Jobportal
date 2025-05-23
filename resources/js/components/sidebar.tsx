import React, { useState, FormEvent } from 'react';
import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

interface Props {
    auth: {
        user: null | {
            role: string;
        };
    };
}
const Sidebar = ({ auth }: Props) => {
    const [search, setSearch] = useState('');
    const [combinedSearch, setCombinedSearch] = useState('');
    const [experience, setExperience] = useState('');
    const [location, setLocation] = useState('');
    

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        console.log('User role:', auth.user?.role); // Debug the role
        
        if (auth.user?.role === 'employer') {
            // For employers, search for candidates (job seekers) by name and skills with a single term
            router.get(route('employer.candidates.search'), { 
                search: combinedSearch || undefined, // Combined search term for both name and skills
                experience: experience || undefined
            });
        } else {
            // For job seekers, use the general search field and location to find jobs
            router.get(route('jobs.index'), { 
                search: search || undefined,
                location: location || undefined 
            });
        }
    };

    return (
        <div className="position-relative">
            <div className="vh-100">
                <div
                    className="d-flex align-items-center position-relative min-vh-100"
                    style={{
                        backgroundImage: "url('/assets/img/hero/h1_hero.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-6 col-lg-9 col-md-10">
                                <div className="text-white mb-5">
                                    <h1 className="display-4 fw-bold mb-4">Find the most exciting startup jobs</h1>
                                </div>
                            </div>
                        </div>
                       
                        <div className="row">
                            <div className="col-xl-8">
                                <form onSubmit={handleSearch} className="bg-white p-4 rounded shadow-sm">
                                    <div className="row g-3">
                                        {auth.user?.role === 'employer' ? (
                                            <>
                                                <div className="col-md-6 col-lg-6">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-lg"
                                                        placeholder="Search by name or skills"
                                                        value={combinedSearch}
                                                        onChange={(e) => setCombinedSearch(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <select 
                                                        className="form-select form-select-lg" 
                                                        value={experience}
                                                        onChange={(e) => setExperience(e.target.value)}
                                                    >
                                                        <option value="">Select Experience</option>
                                                        <option value="entry">Entry Level</option>
                                                        <option value="mid">Mid Level</option>
                                                        <option value="senior">Senior Level</option>
                                                        <option value="expert">Expert</option>
                                                    </select>
                                                </div>
                                                <div className="col-lg-3">
                                                    <button type="submit" className="btn btn-light btn-lg">
                                                        <i className="fas fa-search me-2"></i>
                                                        Search
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="col-lg-5">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-lg w-full max-w-lg text-gray-800"
                                                        placeholder="Search jobs by title, company, or location..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-lg-4">
                                                    <select 
                                                        className="form-select form-select-lg" 
                                                        value={location}
                                                        onChange={(e) => setLocation(e.target.value)}
                                                    >
                                                        <option value="">Select Location</option>
                                                        <option value="BD">Location MK</option>
                                                        <option value="PK">Location AA</option>
                                                        <option value="US">Location AK</option>
                                                        <option value="UK">Location DD</option>
                                                    </select>
                                                </div>
                                                <div className="col-lg-3">
                                                    <button type="submit" className="btn btn-light btn-lg">
                                                        <i className="fas fa-search me-2"></i>
                                                        Search
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
