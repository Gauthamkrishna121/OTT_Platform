import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { Search, Filter, Trash2, Edit2, Play, LayoutGrid, List, Loader2 } from 'lucide-react';
import './AdminContent.css';

const AdminContent = () => {
    const [viewMode, setViewMode] = useState('table');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const [moviesRes, seriesRes] = await Promise.all([
                api.get('/videos/movies/'),
                api.get('/videos/series/')
            ]);

            const movies = moviesRes.data.map(m => ({ ...m, type: 'Movie' }));
            const series = seriesRes.data.map(s => ({ ...s, type: 'Series' }));

            setContent([...movies, ...series]);
        } catch (error) {
            console.error('Failed to fetch content:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleDelete = async (id, type) => {
        if (!window.confirm('Are you sure you want to delete this content?')) return;

        try {
            const endpoint = type === 'Movie' ? `/videos/movies/${id}/` : `/videos/series/${id}/`;
            await api.delete(endpoint);
            setContent(content.filter(item => !(item.id === id && item.type === type)));
            alert('Content deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete content');
        }
    };

    const filteredContent = content.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || item.type.toLowerCase() === filterType;
        return matchesSearch && matchesType;
    });

    if (loading) return (
        <div className="admin-loading">
            <Loader2 className="animate-spin" size={48} />
            <p>Gathering library data...</p>
        </div>
    );

    return (
        <div className="admin-content-view">
            <header className="content-header">
                <div>
                    <h1>Manage Library</h1>
                    <p>Search, edit, and moderate all content in the database</p>
                </div>
                <div className="view-controls">
                    <button
                        className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                    >
                        <List size={20} />
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid size={20} />
                    </button>
                </div>
            </header>

            <div className="filter-bar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-options">
                    <select
                        className="filter-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="movie">Movies</option>
                        <option value="series">Series</option>
                    </select>
                </div>
            </div>

            <div className={`content-display ${viewMode}`}>
                {viewMode === 'table' ? (
                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Content</th>
                                    <th>Type</th>
                                    <th>Genre</th>
                                    <th>Rating</th>
                                    <th>Added Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredContent.map(item => (
                                    <tr key={`${item.type}-${item.id}`}>
                                        <td className="col-title">
                                            <div className="title-preview">
                                                <div className="preview-box">
                                                    {item.thumbnail ? <img src={`${api.defaults.baseURL}${item.thumbnail}`} alt="" /> : <Play size={12} fill="white" />}
                                                </div>
                                                <span>{item.title}</span>
                                            </div>
                                        </td>
                                        <td><span className={`tag ${item.type.toLowerCase()}`}>{item.type}</span></td>
                                        <td>{item.genre || 'N/A'}</td>
                                        <td>{item.rating || 'N/A'}</td>
                                        <td>{item.uploaded_at ? new Date(item.uploaded_at).toLocaleDateString() : 'N/A'}</td>
                                        <td className="col-actions">
                                            <button className="icon-btn delete" onClick={() => handleDelete(item.id, item.type)}><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid-wrapper">
                        {filteredContent.map(item => (
                            <div key={`${item.type}-${item.id}`} className="admin-content-card">
                                <div className="card-thumb">
                                    {item.thumbnail ? <img src={`${api.defaults.baseURL}${item.thumbnail}`} alt="" /> : <Play size={24} fill="white" />}
                                    <div className="card-badge">{item.type}</div>
                                </div>
                                <div className="card-details">
                                    <h3>{item.title}</h3>
                                    <p>{item.genre} • {item.rating}</p>
                                    <div className="card-actions">
                                        <button className="btn-icon delete" onClick={() => handleDelete(item.id, item.type)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminContent;
