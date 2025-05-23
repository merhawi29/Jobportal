import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@inertiajs/core';

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    sent_at: string;
    sender: {
        id: number;
        name: string;
        profile_picture: string | null;
        role: string;
    };
}

interface Conversation {
    user_id: number;
    name: string;
    profile_picture: string | null;
    role: string;
    last_message: string;
    last_message_time: string;
    unread_count: number;
}

const MessagesIndex = () => {
    const { auth, conversations: initialConversations } = usePage<PageProps>().props as unknown as {
        auth: { user: { id: number; name: string; email: string; profile_picture?: string | null; role: string; }; };
        conversations: Conversation[];
    };
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations || []);
    const [activeConversation, setActiveConversation] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageListRef = useRef<HTMLDivElement>(null);
    
    // Add a new state variable and function to handle new conversation modal
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [newMessageText, setNewMessageText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    // Fetch conversations on component mount
    useEffect(() => {
        fetchConversations();
    }, []);
    
    // Fetch messages when active conversation changes
    useEffect(() => {
        if (activeConversation) {
            fetchMessages(activeConversation);
        }
    }, [activeConversation]);
    
    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const fetchConversations = async () => {
        try {
            const response = await axios.get('/api/messages/conversations');
            setConversations(response.data.conversations);
            
            // If there are conversations and none is active, set the first one as active
            if (response.data.conversations.length > 0 && !activeConversation) {
                setActiveConversation(response.data.conversations[0].user_id);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };
    
    const fetchMessages = async (userId: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/messages/${userId}`);
            setMessages(response.data.messages);
            
            // Mark messages as read
            await axios.post(`/api/messages/${userId}/read`);
            
            // Update unread count in conversations
            setConversations(prevConversations => 
                prevConversations.map(conv => 
                    conv.user_id === userId ? { ...conv, unread_count: 0 } : conv
                )
            );
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setLoading(false);
        }
    };
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newMessage.trim() || !activeConversation) return;
        
        try {
            const response = await axios.post('/api/messages/send', {
                receiver_id: activeConversation,
                message: newMessage
            });
            
            // Add the new message to the list
            setMessages(prev => [...prev, response.data.message]);
            
            // Update conversation list to show the latest message
            updateConversationWithNewMessage(
                activeConversation,
                newMessage,
                new Date().toISOString()
            );
            
            // Clear the input
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    
    const updateConversationWithNewMessage = (
        userId: number,
        message: string,
        timestamp: string
    ) => {
        setConversations(prevConversations => {
            const updatedConversations = prevConversations.map(conv => 
                conv.user_id === userId 
                    ? {
                        ...conv,
                        last_message: message,
                        last_message_time: timestamp
                      }
                    : conv
            );
            
            // Sort conversations to put the most recent on top
            return updatedConversations.sort((a, b) => 
                new Date(b.last_message_time).getTime() - 
                new Date(a.last_message_time).getTime()
            );
        });
    };
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };
    
    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === now.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).format(date);
        }
    };
    
    // Add a function to handle user search
    const handleUserSearch = async () => {
        if (!searchTerm.trim()) return;
        
        setIsSearching(true);
        try {
            const response = await axios.get(`/api/users/search?q=${encodeURIComponent(searchTerm)}`);
            setSearchResults(response.data.users || []);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsSearching(false);
        }
    };
    
    // Add a function to handle sending a new message to start a conversation
    const sendNewMessage = async () => {
        if (!selectedUser || !newMessageText.trim()) return;
        
        try {
            await axios.post('/api/messages/send', {
                receiver_id: selectedUser,
                message: newMessageText
            });
            
            // Close the modal and refresh conversations
            setShowNewMessageModal(false);
            setSelectedUser(null);
            setNewMessageText('');
            setSearchTerm('');
            setSearchResults([]);
            
            // Refresh conversations list
            await fetchConversations();
        } catch (error) {
            console.error('Error sending new message:', error);
        }
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Messages</h2>}
        >
            <Head title="Messages" />
            
            <div className="container py-5">
                <div className="row">
                    <div className="col-12">
                        <h2 className="mb-4">Messages</h2>
                        
                        <div className="card shadow-sm">
                            <div className="card-body p-0">
                                <div className="row g-0">
                                    {/* Conversations List */}
                                    <div className="col-md-4 border-end">
                                        <div className="contacts-list">
                                            <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
                                                <h5 className="mb-0">Conversations</h5>
                                                <button 
                                                    className="btn btn-sm btn-primary" 
                                                    onClick={() => setShowNewMessageModal(true)}
                                                    title="New Message"
                                                >
                                                    <i className="fas fa-plus"></i>
                                                </button>
                                            </div>
                                            
                                            {conversations.length === 0 ? (
                                                <div className="p-4 text-center text-muted">
                                                    <i className="fas fa-comments fa-2x mb-2"></i>
                                                    <p>No conversations yet</p>
                                                    <button 
                                                        className="btn btn-primary" 
                                                        onClick={() => setShowNewMessageModal(true)}
                                                    >
                                                        Start a New Conversation
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="contacts-list-body">
                                                    {conversations.map((conversation) => (
                                                        <div 
                                                            key={conversation.user_id}
                                                            className={`contact-item d-flex align-items-center px-4 py-3 ${activeConversation === conversation.user_id ? 'bg-light' : ''}`}
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => setActiveConversation(conversation.user_id)}
                                                        >
                                                            <div className="flex-shrink-0 me-3">
                                                                <div className="position-relative">
                                                                    <img 
                                                                        src={conversation.profile_picture || '/assets/img/logo/testimonial.png'} 
                                                                        className="rounded-circle" 
                                                                        alt={conversation.name}
                                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.onerror = null;
                                                                            target.src = '/assets/img/logo/testimonial.png';
                                                                        }}
                                                                    />
                                                                    {conversation.unread_count > 0 && (
                                                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                                            {conversation.unread_count}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                                    <h6 className="mb-0">{conversation.name}</h6>
                                                                    <small className="text-muted">
                                                                        {formatDate(conversation.last_message_time)}
                                                                    </small>
                                                                </div>
                                                                <p className="text-muted small mb-0 text-truncate">
                                                                    {conversation.last_message}
                                                                </p>
                                                                <small className={`${conversation.role === 'employer' ? 'text-primary' : 'text-success'}`}>
                                                                    {conversation.role === 'employer' ? 'Employer' : 'Job Seeker'}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Messages Area */}
                                    <div className="col-md-8">
                                        <div className="chat-container d-flex flex-column" style={{ height: '600px' }}>
                                            {activeConversation ? (
                                                <>
                                                    {/* Chat Header */}
                                                    <div className="chat-header px-4 py-3 border-bottom">
                                                        {conversations.find(c => c.user_id === activeConversation) && (
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-shrink-0 me-3">
                                                                    <img 
                                                                        src={conversations.find(c => c.user_id === activeConversation)?.profile_picture || '/assets/img/logo/testimonial.png'} 
                                                                        className="rounded-circle" 
                                                                        alt="User Avatar"
                                                                        style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.onerror = null;
                                                                            target.src = '/assets/img/logo/testimonial.png';
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex-grow-1">
                                                                    <h6 className="mb-0">
                                                                        {conversations.find(c => c.user_id === activeConversation)?.name}
                                                                    </h6>
                                                                    <small className={`${conversations.find(c => c.user_id === activeConversation)?.role === 'employer' ? 'text-primary' : 'text-success'}`}>
                                                                        {conversations.find(c => c.user_id === activeConversation)?.role === 'employer' ? 'Employer' : 'Job Seeker'}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Chat Messages */}
                                                    <div 
                                                        className="chat-body flex-grow-1 p-4" 
                                                        style={{ overflowY: 'auto' }}
                                                        ref={messageListRef}
                                                    >
                                                        {loading ? (
                                                            <div className="text-center p-4">
                                                                <div className="spinner-border text-primary" role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                            </div>
                                                        ) : messages.length === 0 ? (
                                                            <div className="text-center text-muted p-4">
                                                                <i className="fas fa-comments fa-3x mb-3"></i>
                                                                <p>No messages yet. Start the conversation!</p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {messages.map((message, index) => (
                                                                    <div 
                                                                        key={message.id} 
                                                                        className={`message-item d-flex mb-3 ${message.sender_id === auth.user.id ? 'justify-content-end' : 'justify-content-start'}`}
                                                                    >
                                                                        {message.sender_id !== auth.user.id && (
                                                                            <div className="avatar me-3">
                                                                                <img 
                                                                                    src={message.sender.profile_picture || '/assets/img/logo/testimonial.png'} 
                                                                                    className="rounded-circle" 
                                                                                    alt={message.sender.name}
                                                                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                                    onError={(e) => {
                                                                                        const target = e.target as HTMLImageElement;
                                                                                        target.onerror = null;
                                                                                        target.src = '/assets/img/logo/testimonial.png';
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        
                                                                        <div 
                                                                            className={`message-content p-3 rounded ${message.sender_id === auth.user.id ? 'bg-primary text-white' : 'bg-light'}`}
                                                                            style={{ maxWidth: '75%' }}
                                                                        >
                                                                            <div className="message-text">{message.message}</div>
                                                                            <div className={`message-time small ${message.sender_id === auth.user.id ? 'text-white-50' : 'text-muted'} mt-1`}>
                                                                                {formatTime(message.sent_at)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <div ref={messagesEndRef} />
                                                            </>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Chat Input */}
                                                    <div className="chat-footer p-3 border-top">
                                                        <form onSubmit={handleSendMessage}>
                                                            <div className="input-group">
                                                                <input 
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Type your message..."
                                                                    value={newMessage}
                                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                                />
                                                                <button 
                                                                    type="submit" 
                                                                    className="btn btn-primary"
                                                                    disabled={!newMessage.trim()}
                                                                >
                                                                    <i className="fas fa-paper-plane"></i>
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center text-muted p-4">
                                                    <i className="fas fa-comments fa-4x mb-3"></i>
                                                    <h5>Select a conversation</h5>
                                                    <p>Choose a conversation from the list to start messaging</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* New Message Modal */}
            {showNewMessageModal && (
                <div 
                    className="modal fade show d-block" 
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowNewMessageModal(false);
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">New Message</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowNewMessageModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* User Search */}
                                <div className="mb-3">
                                    <label className="form-label">Search for user</label>
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            placeholder="Search by name or email"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <button 
                                            className="btn btn-primary" 
                                            type="button"
                                            onClick={handleUserSearch}
                                            disabled={isSearching || !searchTerm.trim()}
                                        >
                                            {isSearching ? (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            ) : (
                                                <i className="fas fa-search"></i>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Search Results */}
                                {searchResults.length > 0 && (
                                    <div className="mb-3">
                                        <label className="form-label">Select a user</label>
                                        <div className="list-group">
                                            {searchResults.map(user => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    className={`list-group-item list-group-item-action d-flex align-items-center ${selectedUser === user.id ? 'active' : ''}`}
                                                    onClick={() => setSelectedUser(user.id)}
                                                >
                                                    <img 
                                                        src={user.profile_picture || '/assets/img/logo/testimonial.png'} 
                                                        className="rounded-circle me-2" 
                                                        alt={user.name}
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                    />
                                                    <div>
                                                        <div className="fw-bold">{user.name}</div>
                                                        <small>{user.role === 'employer' ? 'Employer' : 'Job Seeker'}</small>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* No Results Message */}
                                {searchResults.length === 0 && searchTerm && !isSearching && (
                                    <div className="alert alert-info">
                                        No users found matching your search.
                                    </div>
                                )}
                                
                                {/* Message Input */}
                                {selectedUser && (
                                    <div className="mb-3">
                                        <label className="form-label">Message</label>
                                        <textarea 
                                            className="form-control" 
                                            rows={3}
                                            placeholder="Type your message..."
                                            value={newMessageText}
                                            onChange={(e) => setNewMessageText(e.target.value)}
                                        ></textarea>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowNewMessageModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    disabled={!selectedUser || !newMessageText.trim()}
                                    onClick={sendNewMessage}
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default MessagesIndex; 