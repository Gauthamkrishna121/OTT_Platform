import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import {
    BarChart3,
    Users,
    Film,
    PlayCircle,
    TrendingUp,
    ArrowUpRight,
    Clock,
    Loader2
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([]);
    const [recentUploads, setRecentUploads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [moviesRes, seriesRes] = await Promise.all([
                    api.get('/videos/movies/'),
                    api.get('/videos/series/')
                ]);

                const movies = moviesRes.data.map(m => ({ ...m, type: 'Movie' }));
                const series = seriesRes.data.map(s => ({ ...s, type: 'Series' }));

                // Set Stats
                setStats([
                    { title: 'Movies', value: movies.length.toString(), icon: Film, trend: '+2', color: '#3b82f6' },
                    { title: 'Series', value: series.length.toString(), icon: Film, trend: '+1', color: '#8b5cf6' },
                    { title: 'Active Users', value: '12', icon: Users, trend: '+2', color: '#10b981' },
                    { title: 'Total Views', value: '1.2k', icon: PlayCircle, trend: '+18%', color: '#f59e0b' },
                ]);

                // Set Recent Uploads
                const combined = [...movies, ...series].sort((a, b) => {
                    const dateA = a.uploaded_at ? new Date(a.uploaded_at) : 0;
                    const dateB = b.uploaded_at ? new Date(b.uploaded_at) : 0;
                    return dateB - dateA;
                });
                setRecentUploads(combined.slice(0, 5));

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="admin-loading">
            <Loader2 className="animate-spin" size={48} />
            <p>Loading Dashboard...</p>
        </div>
    );

    return (
        <div className="admin-dash-container">
            <header className="dash-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back! Here's what's happening today.</p>
            </header>

            <div className="stats-grid">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card" style={{ '--accent': stat.color }}>
                        <div className="stat-icon">
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.title}</span>
                            <h2 className="stat-value">{stat.value}</h2>
                            <div className="stat-trend positive">
                                <ArrowUpRight size={14} />
                                <span>{stat.trend} this month</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dash-grid">
                <section className="dash-card">
                    <div className="card-header">
                        <h3><Clock size={20} /> Recent Uploads</h3>
                        <button className="btn-text" onClick={() => navigate('/admin/content')}>View All</button>
                    </div>
                    <div className="uploads-list">
                        {recentUploads.length > 0 ? recentUploads.map((item) => (
                            <div key={`${item.type}-${item.id}`} className="upload-item">
                                <div className="item-main">
                                    <h4>{item.title}</h4>
                                    <span>{item.type} • {item.uploaded_at ? new Date(item.uploaded_at).toLocaleDateString() : 'Just now'}</span>
                                </div>
                                <div className="status-badge published">Published</div>
                            </div>
                        )) : (
                            <p className="no-data">No recent uploads found.</p>
                        )}
                    </div>
                </section>

                <section className="dash-card system-health-card">
                    <div className="card-header">
                        <h3><BarChart3 size={18} /> System Status</h3>
                    </div>
                    <div className="health-metrics">
                        <div className="metric">
                            <span>Server Load</span>
                            <div className="progress-bar"><div className="fill" style={{ width: '42%' }}></div></div>
                        </div>
                        <div className="metric">
                            <span>Storage Used</span>
                            <div className="progress-bar"><div className="fill" style={{ width: '78%' }}></div></div>
                        </div>
                        <div className="metric">
                            <span>Buffering Index</span>
                            <div className="progress-bar"><div className="fill" style={{ width: '12%' }}></div></div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
