import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Nav from '../components/nav';
import Footer from '../components/Footer';

interface Props {
  flash?: {
    success?: string;
    error?: string;
  };
  error?: string;
}
const jobTypes = [
  {
    name: 'Full-time',
    icon: 'fas fa-business-time',
    description: 'Traditional full-time positions with benefits',
    features: ['40 hours/week', 'Benefits included', 'Career growth']
  },
  {
    name: 'Remote',
    icon: 'fas fa-home',
    description: 'Work from anywhere positions',
    features: ['Work from home', 'Flexible hours', 'Global opportunities']
  },
  {
    name: 'Part-time',
    icon: 'fas fa-clock',
    description: 'Flexible part-time opportunities',
    features: ['20-30 hours/week', 'Work-life balance', 'Flexible schedule']
  },
  {
    name: 'Contract',
    icon: 'fas fa-file-signature',
    description: 'Fixed-term contract positions',
    features: ['Project-based', 'Higher rates', 'Fixed duration']
  },
  {
    name: 'Freelance',
    icon: 'fas fa-laptop-house',
    description: 'Independent freelance work',
    features: ['Choose your projects', 'Set your rates', 'Be your own boss']
  },
  {
    name: 'Internship',
    icon: 'fas fa-graduation-cap',
    description: 'Learning opportunities for students',
    features: ['Learn on the job', 'Career start', 'Mentorship']
  }
];

  const Home = ({flash, error}: Props) => {
  return (
    <>
      <Head title="Home" />
      {flash?.success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {flash.success}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
                {(flash?.error || error) && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {flash?.error || error}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}

      <Nav />

      {/* Job Types Section */}
      <section className="py-12 bg-light">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Find Jobs by Type</h2>
            <p className="text-gray-600">Discover opportunities that match your preferred work style</p>
          </div>

          <div className="row g-4">
            {jobTypes.map((type) => (
              <div key={type.name} className="col-md-6 col-lg-4">
                <Link
                  href={`/jobs?type=${type.name}`}
                  className="card h-100 border-0 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="flex-shrink-0">
                        <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                          <i className={`${type.icon} text-success fa-2x`}></i>
                        </div>
                      </div>
                      <div className="ms-3">
                        <h3 className="h5 mb-1">{type.name}</h3>
                        <p className="text-muted mb-0">{type.description}</p>
                      </div>
                    </div>
                    <div className="small text-muted">
                      {type.features.map((feature, index) => (
                        <span key={feature}>
                          {feature}
                          {index < type.features.length - 1 ? ' • ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/jobs" className="btn btn-success btn-lg">
              <i className="fas fa-search me-2"></i>
              View All Jobs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
