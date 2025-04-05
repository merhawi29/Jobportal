import React from 'react';

interface ApplicationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    jobTitle: string;
    formData: {
        cover_letter: string;
        resume: File | null;
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        cover_letter: string;
        resume: File | null;
    }>>;
}

export default function ApplicationFormModal({
    isOpen,
    onClose,
    onSubmit,
    jobTitle,
    formData,
    setFormData
}: ApplicationFormModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Apply for {jobTitle}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Cover Letter</label>
                                <textarea
                                    className="form-control"
                                    rows={6}
                                    value={formData.cover_letter}
                                    onChange={e => setFormData(prev => ({
                                        ...prev,
                                        cover_letter: e.target.value
                                    }))}
                                    required
                                    minLength={100}
                                    placeholder="Write a compelling cover letter explaining why you're the perfect candidate for this position..."
                                ></textarea>
                                {formData.cover_letter.length < 100 && (
                                    <div className="invalid-feedback">
                                        Cover letter must be at least 100 characters long. Current count: {formData.cover_letter.length}
                                    </div>
                                )}
                                <small className="text-muted">
                                    Minimum 100 characters. Be sure to highlight your relevant experience and skills.
                                </small>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Resume</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".pdf,.doc,.docx"
                                    onChange={e => setFormData(prev => ({
                                        ...prev,
                                        resume: e.target.files ? e.target.files[0] : null
                                    }))}
                                    required
                                />
                                <small className="text-muted">
                                    Upload your resume (PDF, DOC, or DOCX format, max 2MB)
                                </small>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-outline-success">
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 