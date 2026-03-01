import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import './VideoPlayer.css';

const EpisodePlayer = () => {
    const { epId } = useParams();
    const navigate = useNavigate();
    const [episode, setEpisode] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We'll need a specific detail endpoint for episodes or fetch via series
        // For now, let's assume we can fetch episode details directly if we add the endpoint
        api.get(`/videos/episodes/${epId}/`)
            .then(res => {
                setEpisode(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch episode:", err);
                setLoading(false);
            });
    }, [epId]);

    if (loading) return (
        <div className="player-loading">
            <Loader2 className="animate-spin" size={48} />
            <p>Loading Episode...</p>
        </div>
    );

    if (!episode) return <div className="player-error">Episode not found.</div>;

    return (
        <div className="video-player-page">
            <button className="btn-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} /> <span>Back</span>
            </button>

            <div className="player-container">
                <video
                    controls
                    autoPlay
                    className="main-video"
                    src={`${api.defaults.baseURL}${episode.video_file}`}
                >
                    Your browser does not support the video tag.
                </video>

                <div className="video-info-overlay">
                    <h1>{episode.title}</h1>
                    <p>Episode {episode.episode_number}</p>
                </div>
            </div>
        </div>
    );
};

export default EpisodePlayer;
