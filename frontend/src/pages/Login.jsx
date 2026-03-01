import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, Play } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(username, password);

        if (result.success) {
            // Determine redirect based on isAdmin returned from context (which gets it from backend)
            // Hardcoded redirect for demo based on input, but actual context state handles security
            if (username.toLowerCase() === 'admin') {
                navigate('/admin');
            } else {
                navigate('/profiles');
            }
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-bg-overlay"></div>
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-logo">
                            <Play size={40} fill="var(--accent-color)" color="var(--accent-color)" />
                            <span>OTT PLATFORM</span>
                        </div>
                        <h1>Welcome Back</h1>
                        <p>Please enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
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
                            <Lock size={20} className="input-icon" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="login-submit">
                            Sign In <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Don't have an account? <span className="link" onClick={() => navigate('/signup')}>Sign up now</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
