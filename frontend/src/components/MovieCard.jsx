import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import api from '../api/api';
import './MovieCard.css';

const MovieCard = ({ video }) => {
    const navigate = useNavigate();
    const baseUrl = api.defaults.baseURL;

    // Fallback: use thumbnail if it exists, otherwise use video_file as background (placeholder)
    const imageUrl = video.thumbnail ? `${baseUrl}${video.thumbnail}` : (video.video_file ? `${baseUrl}${video.video_file}` : '');

    return (
        <div className="movie-card" onClick={() => navigate(video.is_movie ? `/watch/${video.id}` : `/series/${video.id}`)}>
            <div className="card-image-container">
                {imageUrl && <img src={imageUrl} alt={video.title} className="card-image" />}
                <div className="card-overlay">
                    <div className="card-play-btn">
                        <Play size={20} fill="currentColor" />
                    </div>
                </div>
            </div>
            <div className="card-info">
                <h4 className="card-title">{video.title}</h4>
                {video.genre && <span className="card-genre">{video.genre}</span>}
            </div>
        </div>
    );
};

export default MovieCard;
