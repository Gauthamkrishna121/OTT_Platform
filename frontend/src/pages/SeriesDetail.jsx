import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Sidebar from '../components/Sidebar';
import { Play, ArrowLeft, Clock, Info } from 'lucide-react';
import './SeriesDetail.css';

const SeriesDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [series, setSeries] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const res = await api.get(`/videos/series/${id}/`);
                setSeries(res.data);
            } catch (error) {
                console.error('Failed to fetch series:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSeries();
    }, [id]);

    if (loading) return <div className="series-detail-loading">Loading Series...</div>;
    if (!series) return <div className="series-detail-error">Series not found.</div>;

    const baseUrl = api.defaults.baseURL;
    const bannerUrl = series.thumbnail ? `${baseUrl}${series.thumbnail}` : '';

    return (
        <div className="series-detail-page">
            <Sidebar />
            <main className="series-content">
                <header className="series-hero">
                    <div className="series-hero-overlay"></div>
                    {bannerUrl && <img src={bannerUrl} alt="" className="series-hero-bg" />}

                    <button className="btn-back-home" onClick={() => navigate('/')}>
                        <ArrowLeft size={20} /> Back to Home
                    </button>

                    <div className="series-hero-info">
                        <h1 className="series-title">{series.title}</h1>
                        <div className="series-meta">
                            <span className="badge-series">Series</span>
                            <span>{series.genre}</span>
                            <span>{series.rating}</span>
                            <span>{series.episodes?.length || 0} Episodes</span>
                        </div>
                        <p className="series-desc">{series.description}</p>
                    </div>
                </header>

                <section className="episodes-section">
                    <h2>Episodes</h2>
                    <div className="episodes-grid">
                        {series.episodes && series.episodes.length > 0 ? (
                            series.episodes.map((ep) => (
                                <div key={ep.id} className="episode-card" onClick={() => navigate(`/watch-episode/${ep.id}`)}>
                                    <div className="ep-thumb">
                                        <div className="ep-play-overlay">
                                            <Play size={24} fill="white" />
                                        </div>
                                        <div className="ep-number">EP {ep.episode_number}</div>
                                    </div>
                                    <div className="ep-details">
                                        <h4>{ep.title}</h4>
                                        <p>Episode {ep.episode_number}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-episodes">No episodes available yet.</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SeriesDetail;
