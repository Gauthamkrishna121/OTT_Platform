import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Play, ChevronRight, Film, Tv, Shield, Globe } from 'lucide-react';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                const res = await api.get('/videos/movies/');
                if (res.data.length > 0) {
                    setPreview(res.data[0]);
                }
            } catch (error) {
                console.error('Failed to fetch preview:', error);
            }
        };
        fetchPreview();
    }, []);

    const baseUrl = api.defaults.baseURL;

    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="landing-logo">
                    <Film size={32} color="var(--accent-color)" />
                    <span>OTT PLATFORM</span>
                </div>
                <button className="btn-signin" onClick={() => navigate('/login')}>Sign In</button>
            </nav>

            <header className="landing-hero">
                <div className="hero-bg">
                    {preview?.thumbnail ? (
                        <img src={`${baseUrl}${preview.thumbnail}`} alt="Hero Preview" />
                    ) : (
                        <div className="hero-placeholder"></div>
                    )}
                    <div className="hero-overlay"></div>
                </div>

                <div className="hero-content">
                    <div className="badge-exclusive">EXCLUSIVE PREVIEW</div>
                    <h1>Unlimited movies, TV shows, and more.</h1>
                    <p>Watch anywhere. Cancel anytime. Ready to watch? Enter your email to create or restart your membership.</p>

                    <div className="hero-cta">
                        <button className="btn-get-started" onClick={() => navigate('/signup')}>
                            Get Started <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <section className="landing-features">
                <div className="feature-card">
                    <Tv size={48} />
                    <h3>Enjoy on your TV</h3>
                    <p>Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
                </div>
                <div className="feature-card">
                    <Shield size={48} />
                    <h3>Watch everywhere</h3>
                    <p>Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.</p>
                </div>
                <div className="feature-card">
                    <Globe size={48} />
                    <h3>Create profiles for kids</h3>
                    <p>Send kids on adventures with their favorite characters in a space made just for them—free with your membership.</p>
                </div>
            </section>

            <footer className="landing-footer">
                <p>Questions? Call 000-800-919-1694</p>
                <div className="footer-links">
                    <span>FAQ</span>
                    <span>Help Centre</span>
                    <span>Terms of Use</span>
                    <span>Privacy</span>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
