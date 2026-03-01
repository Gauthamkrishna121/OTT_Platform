import React, { useEffect, useState } from 'react';
import api from '../api/api';
import {
    Users,
    Film,
    Eye,
    Plus,
    MoreVertical,
    Search,
    ArrowUpRight,
    TrendingUp,
    Trash2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AddVideoModal from '../components/AddVideoModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchVideos = () => {
        setLoading(true);
        api.get('/')
            .then(res => {
                setVideos(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this content?')) {
            try {
                // Assuming the backend has a DELETE endpoint at the root or correctly mapped
                // In Django default router, it would likely be /videos/id/
                // Adjusting to a likely standard:
                await api.delete(`/${id}/`);
                fetchVideos();
            } catch (err) {
                console.error(err);
                alert('Failed to delete video. Check backend URL structure.');
            }
        }
    };

    const stats = [
        { label: 'Total Content', value: videos.length, icon: Film, trend: '+12%', color: '#00a8e8' },
        { label: 'Total Users', value: '1,284', icon: Users, trend: '+5.4%', color: '#10b981' },
        { label: 'Total Views', value: '14.2K', icon: Eye, trend: '+28%', color: '#f59e0b' },
    ];

    return (
        <div className="admin-container">
            <Sidebar />
            <main className="admin-content">
                <header className="admin-header">
                    <div className="header-left">
                        <h1>Admin Dashboard</h1>
                        <p>Welcome back, Administrator</p>
                    </div>
                    <div className="header-right">
                        <div className="search-bar">
                            <Search size={18} />
                            <input type="text" placeholder="Search content..." />
                        </div>
                        <button className="btn-add" onClick={() => setIsModalOpen(true)}>
                            <Plus size={18} /> Add New
                        </button>
                    </div>
                </header>

                <section className="stats-grid">
                    {stats.map((stat, i) => (
                        <div key={i} className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                <stat.icon size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>{stat.label}</h3>
                                <div className="stat-value-row">
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-trend">
                                        <TrendingUp size={14} /> {stat.trend}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="content-management">
                    <div className="section-header">
                        <h2>Recent Content</h2>
                        <button className="btn-text">View All <ArrowUpRight size={16} /></button>
                    </div>

                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Content</th>
                                    <th>Category</th>
                                    <th>Views</th>
                                    <th>Date Uploaded</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {videos.map(video => (
                                    <tr key={video.id}>
                                        <td>
                                            <div className="table-content-info">
                                                <img
                                                    src={video.thumbnail ? `http://127.0.0.1:8000${video.thumbnail}` : `http://127.0.0.1:8000${video.video_file}`}
                                                    alt=""
                                                />
                                                <span>{video.title}</span>
                                            </div>
                                        </td>
                                        <td>Sci-Fi</td>
                                        <td>1,432</td>
                                        <td>{new Date(video.uploaded_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className="badge-active">Published</span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-icon delete" onClick={() => handleDelete(video.id)}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            <AddVideoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onVideoAdded={fetchVideos}
            />
        </div>
    );
};

export default AdminDashboard;
