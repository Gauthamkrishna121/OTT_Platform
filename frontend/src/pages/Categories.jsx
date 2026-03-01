import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/api';
import {
    Flame,
    Sword,
    Ghost,
    Laugh,
    Heart,
    Zap,
    Telescope,
    Drama,
    ChevronRight,
    Loader2
} from 'lucide-react';
import './Categories.css';

const Categories = () => {
    const [categoryCounts, setCategoryCounts] = useState({});
    const [loading, setLoading] = useState(true);

    const categories = [
        { name: 'Action', icon: Sword, color: '#3b82f6' },
        { name: 'Sci-Fi', icon: Telescope, color: '#8b5cf6' },
        { name: 'Horror', icon: Ghost, color: '#10b981' },
        { name: 'Comedy', icon: Laugh, color: '#f59e0b' },
        { name: 'Romance', icon: Heart, color: '#ec4899' },
        { name: 'Documentary', icon: Zap, color: '#06b6d4' },
        { name: 'Drama', icon: Drama, color: '#f43f5e' },
        { name: 'Thriller', icon: Flame, color: '#ef4444' }, // Added Thriller as Flame mapping
    ];

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [moviesRes, seriesRes] = await Promise.all([
                    api.get('/videos/movies/'),
                    api.get('/videos/series/')
                ]);

                const allContent = [...moviesRes.data, ...seriesRes.data];

                // Count occurrences of each genre
                const counts = {};
                allContent.forEach(item => {
                    const genre = item.genre || 'Other';
                    counts[genre] = (counts[genre] || 0) + 1;
                });

                setCategoryCounts(counts);
            } catch (error) {
                console.error("Error fetching categories data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    return (
        <div className="categories-container">
            <Sidebar />
            <main className="categories-content">
                <header className="categories-header">
                    <h1>Explore Categories</h1>
                    <p>Find your next favorite movie or show by genre</p>
                </header>

                {loading ? (
                    <div className="loading-state" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                        <Loader2 className="animate-spin" size={40} color="#00a8e8" />
                    </div>
                ) : (
                    <div className="categories-grid">
                        {categories.map((cat, index) => {
                            // Find the count dynamically, default to 0
                            const count = categoryCounts[cat.name] || 0;
                            return (
                                <div key={index} className="category-card" style={{ '--accent': cat.color }}>
                                    <div className="category-card-bg"></div>
                                    <div className="category-card-content">
                                        <div className="category-icon-wrapper">
                                            <cat.icon size={32} />
                                        </div>
                                        <div className="category-info">
                                            <h3>{cat.name}</h3>
                                            <span>{count} {count === 1 ? 'Video' : 'Videos'}</span>
                                        </div>
                                        <div className="category-arrow">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Categories;
