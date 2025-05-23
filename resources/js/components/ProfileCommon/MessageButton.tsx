import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';

interface MessageButtonProps {
    userId: number;
    userName: string;
    jobTitle?: string;
    jobId?: number;
    buttonText?: string;
    buttonClass?: string;
    iconOnly?: boolean;
}

const MessageButton: React.FC<MessageButtonProps> = ({
    userId,
    userName,
    jobTitle,
    jobId,
    buttonText = "Message",
    buttonClass = "btn btn-outline-primary btn-sm",
    iconOnly = false
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // First, create a message in the database
            await axios.post('/api/messages/send', {
                receiver_id: userId,
                message: message
            });
            
            // Then redirect to the messages page
            setSuccess('Message sent successfully! Redirecting to conversations...');
            
            // Reset form
            setMessage('');
            
            // Close modal after a delay
            setTimeout(() => {
                setIsModalOpen(false);
                window.location.href = '/messages';
            }, 1500);
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Button to open modal */}
            <button 
                onClick={() => setIsModalOpen(true)} 
                className={buttonClass}
                title={iconOnly ? "Send Message" : ""}
            >
                <i className="fas fa-envelope"></i>
                {!iconOnly && <span className="ms-1">{buttonText}</span>}
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Message to {userName}
                                    {jobTitle && <small className="d-block text-muted">Re: {jobTitle}</small>}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}
                                    {success && (
                                        <div className="alert alert-success" role="alert">
                                            {success}
                                        </div>
                                    )}
                                    <div className="form-group mb-3">
                                        <label htmlFor="message" className="form-label">Your Message</label>
                                        <textarea 
                                            id="message"
                                            className="form-control"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={5}
                                            required
                                            placeholder="Type your message here..."
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading || !message.trim()}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Sending...
                                            </>
                                        ) : 'Send Message'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MessageButton; 