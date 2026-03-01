import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import './MovieRow.css';

const MovieRow = ({ title, videos }) => {
    const rowRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkArrows = () => {
        const el = rowRef.current;
        if (!el) return;
        setShowLeftArrow(el.scrollLeft > 10);
        setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };

    useEffect(() => {
        checkArrows();
        const el = rowRef.current;
        if (el) {
            el.addEventListener('scroll', checkArrows);
            return () => el.removeEventListener('scroll', checkArrows);
        }
    }, [videos]);

    const scroll = (direction) => {
        const el = rowRef.current;
        if (!el) return;
        const scrollAmount = el.clientWidth * 0.75;
        el.scrollBy({ left: direction === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
    };

    return (
        <div className="movie-row">
            <h2 className="row-title">{title}</h2>
            <div className="row-slider-wrapper">
                {showLeftArrow && (
                    <button className="slider-arrow slider-arrow-left" onClick={() => scroll('left')}>
                        <ChevronLeft size={28} />
                    </button>
                )}
                <div className="row-items" ref={rowRef}>
                    {videos.map(video => (
                        <MovieCard key={video.id} video={video} />
                    ))}
                    {videos.length < 5 && [1, 2, 3, 4].map(i => (
                        <div key={`dummy-${i}`} className="movie-card-skeleton"></div>
                    ))}
                </div>
                {showRightArrow && (
                    <button className="slider-arrow slider-arrow-right" onClick={() => scroll('right')}>
                        <ChevronRight size={28} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default MovieRow;
