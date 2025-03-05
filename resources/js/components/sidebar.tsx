import React from 'react';

const Sidebar = () => {
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
                        <div className="row">
                            <div className="col-xl-8">
                                <form className="bg-white p-4 rounded shadow-sm">
                                    <div className="row g-3">
                                        <div className="col-lg-5">
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="Job Title or Keyword"
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
                                            <button className="btn btn-primary btn-lg w-100" style={{ background: 'linear-gradient(135deg, #00b074 0%, #008c5d 100%)', border: 'none' }}>
                                                Find job
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
