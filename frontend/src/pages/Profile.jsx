import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
    User,
    Mail,
    CreditCard,
    Clock,
    ShieldCheck,
    LogOut,
    Edit2,
    Camera,
    History,
    Key,
    Save,
    X,
    Play
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user, isAdmin, selectedProfile, logout } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [name, setName] = useState(selectedProfile || user?.username || 'Guest User');
    const [email, setEmail] = useState(user?.email || 'guest@example.com');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        alert('Profile updated successfully!');
        setIsEditing(false);
    };

    const handleSavePassword = (e) => {
        e.preventDefault();
        alert('Password changed successfully!');
        setIsChangingPassword(false);
    };

    const [watchHistory, setWatchHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/api/history/');
                setWatchHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch watch history:", err);
            } finally {
                setLoadingHistory(false);
            }
        };
        fetchHistory();
    }, []);

    const avatarSeed = name === 'Kids' ? 'KidsProfile' : name === 'Guest' ? 'GuestProfile' : user?.username || 'Felix';

    return (
        <div className="profile-page">
            <Sidebar />
            <main className="profile-content">
                <header className="profile-header">
                    <div className="profile-banner"></div>
                    <div className="profile-meta">
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                                    alt={`${name}'s Avatar`}
                                    style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
                                />
                            </div>
                            <button className="btn-edit-avatar">
                                <Camera size={18} />
                            </button>
                        </div>
                        <div className="profile-info-main">
                            {isEditing ? (
                                <input
                                    className="edit-name-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                            ) : (
                                <h1>{name}</h1>
                            )}
                            <p>{isAdmin ? 'Administrator' : 'Premium Member'}</p>
                        </div>
                        {isEditing ? (
                            <div className="edit-actions">
                                <button className="btn-save-profile" onClick={handleSaveProfile}>
                                    <Save size={18} /> Save
                                </button>
                                <button className="btn-cancel-profile" onClick={() => setIsEditing(false)}>
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                                <Edit2 size={18} /> Edit Profile
                            </button>
                        )}
                    </div>
                </header>

                <div className="profile-grid">
                    <div className="profile-left-col">
                        <section className="profile-card info-card">
                            <div className="card-header">
                                <User size={20} />
                                <h2>Account Information</h2>
                            </div>
                            <div className="info-rows">
                                <div className="info-row">
                                    <span className="label">Full Name</span>
                                    <p>{name}</p>
                                </div>
                                <div className="info-row">
                                    <span className="label">Email Address</span>
                                    <p>{email}</p>
                                </div>
                                <div className="info-row">
                                    <span className="label">Member Status</span>
                                    <p className="status-badge">{isAdmin ? 'Admin' : 'Premium'}</p>
                                </div>
                            </div>
                        </section>

                        <section className="profile-card password-card">
                            <div className="card-header">
                                <Key size={20} />
                                <h2>Security</h2>
                            </div>
                            {isChangingPassword ? (
                                <form className="password-form" onSubmit={handleSavePassword}>
                                    <input type="password" placeholder="Current Password" required />
                                    <input type="password" placeholder="New Password" required />
                                    <input type="password" placeholder="Confirm New Password" required />
                                    <div className="form-actions">
                                        <button type="submit" className="btn-primary">Update Password</button>
                                        <button type="button" className="btn-text" onClick={() => setIsChangingPassword(false)}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="password-display">
                                    <p>••••••••••••</p>
                                    <button className="btn-outline" onClick={() => setIsChangingPassword(true)}>
                                        <ShieldCheck size={16} style={{ marginRight: '8px' }} />
                                        Change Password
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="profile-right-col">
                        <section className="profile-card history-card">
                            <div className="card-header">
                                <History size={20} />
                                <h2>Watch History</h2>
                            </div>
                            <div className="history-list">
                                {loadingHistory ? (
                                    <p className="loading-text">Loading your history...</p>
                                ) : watchHistory.length > 0 ? (
                                    watchHistory.map(item => (
                                        <div key={item.id} className="history-item">
                                            <div className="history-info">
                                                <h3>{item.title}</h3>
                                                <span>Watched on {item.date}</span>
                                            </div>
                                            <div className="history-progress">
                                                <div className="progress-label">{item.progress}</div>
                                                <div className="progress-bar">
                                                    <div className="progress-fill" style={{ width: item.progress }}></div>
                                                </div>
                                            </div>
                                            <button className="btn-mini-play">
                                                <Play size={14} fill="currentColor" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-history">
                                        <History size={40} opacity={0.2} />
                                        <p>No watch history yet</p>
                                    </div>
                                )}
                            </div>
                            <button className="btn-view-all">View Full History</button>
                        </section>
                    </div>
                </div>

                <div className="profile-footer">
                    <button className="btn-switch-profile" onClick={() => navigate('/profiles')}>
                        <User size={20} /> Switch Profile
                    </button>
                    <button className="btn-logout-alt" onClick={handleLogout}>
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Profile;
