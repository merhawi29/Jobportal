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

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('jobs.index'), { search });
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
                        {/* Search Box */}
                        {/* <form onSubmit={handleSearch} className="flex gap-2 justify-center">
                                <input
                                    type="text"
                                    className="form-control form-control-lg w-full max-w-lg text-gray-800"
                                    placeholder="Search jobs by title, company, or location..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button type="submit" className="btn btn-light btn-lg">
                                    <i className="fas fa-search me-2"></i>
                                    Search
                                </button>
                            </form> */}
                        <div className="row">
                            <div className="col-xl-8">
                                <form onSubmit={handleSearch} className="bg-white p-4 rounded shadow-sm">
                                    <div className="row g-3">
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
                                            <select className="form-select form-select-lg" name="select" id="select1">
                                                <option value="">Select Location</option>
                                                <option value="BD">Location BD</option>
                                                <option value="PK">Location PK</option>
                                                <option value="US">Location US</option>
                                                <option value="UK">Location UK</option>
                                            </select>
                                        </div>
                                        <div className="col-lg-3">
                                        <button type="submit" className="btn btn-light btn-lg">
                                            <i className="fas fa-search me-2"></i>
                                            Search
                                         </button>
                                        </div>
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
