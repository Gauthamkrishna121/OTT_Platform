import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import api from '../api/api';
import './Hero.css';

const Hero = ({ video }) => {
    const navigate = useNavigate();
    if (!video) return <div className="hero-skeleton"></div>;

    const baseUrl = api.defaults.baseURL;
    const imageUrl = video.thumbnail ? `${baseUrl}${video.thumbnail}` : (video.video_file ? `${baseUrl}${video.video_file}` : '');

    return (
        <section className="hero">
            <div className="hero-overlay"></div>
            {imageUrl && <img src={imageUrl} alt="" className="hero-bg" />}

            <div className="hero-content">
                <h1 className="hero-title">{video.title}</h1>
                <p className="hero-metadata">
                    <span>{video.genre || 'Action'}</span> • <span>{video.rating || 'PG-13'}</span> • <span>2024</span>
                </p>
                <p className="hero-description">{video.description}</p>

                <div className="hero-actions">
                    <button className="btn-play" onClick={() => navigate(video.is_movie ? `/watch/${video.id}` : `/series/${video.id}`)}>
                        <Play size={20} fill="currentColor" /> Play Now
                    </button>
                    <button className="btn-info">
                        <Info size={20} /> More Info
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
