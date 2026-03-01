import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Play } from 'lucide-react';
import api from '../api/api';
import './Signup.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/api/signup/', { username, email, password });
            alert('Account created! Please login.');
            navigate('/login');
        } catch (err) {
            console.error('Signup failed:', err.response?.data);
            setError(err.response?.data?.error || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-bg-overlay"></div>
            <div className="signup-container">
                <div className="signup-card">
                    <div className="signup-header">
                        <div className="signup-logo">
                            <Play size={40} fill="var(--accent-color)" color="var(--accent-color)" />
                            <span>OTT PLATFORM</span>
                        </div>
                        <h1>Create Account</h1>
                        <p>Join us to start streaming your favorite content</p>
                    </div>

                    <form onSubmit={handleSubmit} className="signup-form">
                        {error && <div className="auth-error">{error}</div>}
                        <div className="input-group">
                            <User size={20} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <Mail size={20} className="input-icon" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <Lock size={20} className="input-icon" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="signup-submit">
                            Sign Up <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="signup-footer">
                        <p>Already have an account? <span className="link" onClick={() => navigate('/login')}>Login</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
