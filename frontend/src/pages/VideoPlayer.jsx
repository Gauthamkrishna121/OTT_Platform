import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { ArrowLeft, Send } from 'lucide-react';
import MovieRow from '../components/MovieRow';
import './VideoPlayer.css';

const VideoPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Fetch extended video details
        api.get(`/videos/movies/${id}/`)
            .then(res => {
                setVideo(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch movie:", err);
                setLoading(false);
            });
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            const res = await api.post(`/videos/movies/${id}/comments/`, { text: newComment });
            // Add to local state
            setVideo(prev => ({
                ...prev,
                comments: [res.data, ...(prev.comments || [])] // Prepend new comment
            }));
            setNewComment("");
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="player-loading">Loading Player...</div>;
    if (!video) return <div className="player-error">Video not found.</div>;

    return (
        <div className="video-player-page">
            <button className="btn-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} /> <span>Back</span>
            </button>

            <div className="player-wrapper">
                <div className="player-container">
                    <video
                        controls
                        autoPlay
                        className="main-video"
                        src={`${api.defaults.baseURL}${video.video_file}`}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="video-content-layout">
                    <div className="video-main-info">
                        <h1 className="video-title-large">{video.title}</h1>
                        <div className="video-metadata">
                            {video.release_year && <span className="meta-item">{video.release_year}</span>}
                            {video.rating && <span className="meta-badge">{video.rating}</span>}
                            {video.duration && <span className="meta-item">{video.duration}</span>}
                            {video.genre && <span className="meta-item">{video.genre}</span>}
                        </div>
                        <p className="video-description-large">{video.description}</p>

                        {/* Comments Section */}
                        <div className="comments-section">
                            <h3>Comments</h3>
                            <form className="comment-form" onSubmit={handleCommentSubmit}>
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    disabled={submitting}
                                />
                                <button type="submit" disabled={!newComment.trim() || submitting}>
                                    <Send size={18} />
                                </button>
                            </form>

                            <div className="comments-list">
                                {video.comments?.length > 0 ? (
                                    video.comments.map(comment => (
                                        <div key={comment.id} className="comment-item">
                                            <div className="comment-avatar">
                                                {comment.user ? comment.user.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="comment-body">
                                                <div className="comment-header">
                                                    <span className="comment-user">{comment.user || 'Unknown User'}</span>
                                                    <span className="comment-date">
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="comment-text">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="video-sidebar">
                        {video.recommendations?.length > 0 && (
                            <div className="recommendations-container">
                                <MovieRow title="More Like This" videos={video.recommendations} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
