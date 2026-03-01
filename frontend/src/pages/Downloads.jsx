import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Download, Play, Trash2, HardDrive, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './Downloads.css';

const Downloads = () => {
    const navigate = useNavigate();
    const [downloadedVideos, setDownloadedVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                // Since there isn't a true backend "downloads" table, we simulate it
                // by fetching some actual library content to show offline capabilities
                const [moviesRes, seriesRes] = await Promise.all([
                    api.get('/videos/movies/'),
                    api.get('/videos/series/')
                ]);

                // Combine and map data to match the expected format
                const allContent = [...moviesRes.data, ...seriesRes.data].map(item => ({
                    id: item.id,
                    title: item.title,
                    // Simulate download size
                    size: `${(Math.random() * 2 + 0.5).toFixed(1)} GB`,
                    // Use actual duration if present, else fallback
                    duration: item.duration || '2h 10m',
                    thumbnail: item.thumbnail || `https://api.dicebear.com/7.x/shapes/svg?seed=${item.title}`,
                    isMovie: item.is_movie !== undefined ? item.is_movie : false
                }));

                // Pick the first few items to act as "downloads"
                setDownloadedVideos(allContent.slice(0, 5));
            } catch (error) {
                console.error("Error fetching downloads data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    const removeDownload = (id) => {
        setDownloadedVideos(videos => videos.filter(v => v.id !== id));
    };

    const handlePlay = (video) => {
        if (video.isMovie) {
            navigate(`/watch/${video.id}`);
        } else {
            navigate(`/series/${video.id}`);
        }
    };

    // Calculate simulated storage based on remaining items
    const usedStorage = downloadedVideos.length * 1.5; // roughly 1.5GB per item

    return (
        <div className="downloads-container">
            <Sidebar />
            <main className="downloads-content">
                <header className="downloads-header">
                    <div className="header-info">
                        <h1>My Library (Offline)</h1>
                        <p>Watch your downloaded content without an internet connection</p>
                    </div>
                    <div className="storage-info">
                        <HardDrive size={20} />
                        <span>{usedStorage.toFixed(1)} GB / 50 GB Used</span>
                        <div className="storage-bar">
                            <div className="storage-fill" style={{ width: `${(usedStorage / 50) * 100}%` }}></div>
                        </div>
                    </div>
                </header>

                <div className="downloads-list">
                    {loading ? (
                        <div className="loading-state" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                            <Loader2 className="animate-spin" size={40} color="#00a8e8" />
                        </div>
                    ) : downloadedVideos.length > 0 ? (
                        downloadedVideos.map((video) => (
                            <div key={video.id} className="download-item">
                                <div className="item-thumbnail" onClick={() => handlePlay(video)} style={{ cursor: 'pointer' }}>
                                    <img src={video.thumbnail} alt={video.title} />
                                    <div className="item-play-overlay">
                                        <Play size={24} fill="white" />
                                    </div>
                                </div>
                                <div className="item-details">
                                    <h3>{video.title}</h3>
                                    <p>{video.duration} • {video.size}</p>
                                </div>
                                <div className="item-actions">
                                    <button
                                        className="btn-icon delete"
                                        title="Remove from downloads"
                                        onClick={() => removeDownload(video.id)}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-downloads">
                            <Download size={48} className="empty-icon" />
                            <h2>No downloads yet</h2>
                            <p>Content you download will appear here.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Downloads;
