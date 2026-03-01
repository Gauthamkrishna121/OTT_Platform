import React, { useState, useRef } from 'react';
import api from '../../api/api';
import {
    UploadCloud,
    Film,
    Tv,
    Plus,
    Trash2,
    CheckCircle2,
    Type,
    AlignLeft,
    Link as LinkIcon,
    Layers,
    Image as ImageIcon,
    Loader2,
    Globe,
    Calendar,
    Clock,
    Users,
    User,
    Subtitles
} from 'lucide-react';
import './AdminUpload.css';

const GENRES = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Thriller', 'Romance', 'Animation', 'Documentary', 'Fantasy', 'Crime', 'Adventure', 'Family', 'Mystery'];
const RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'U', 'U/A 7+', 'U/A 13+', 'U/A 16+', 'A'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi', 'Punjabi', 'Spanish', 'French', 'Korean', 'Japanese', 'German', 'Italian', 'Portuguese'];
const SUBTITLE_LANGS = ['English', 'Hindi', 'Tamil', 'Telugu', 'Spanish', 'French', 'Arabic', 'Korean', 'Japanese'];

const AdminUpload = () => {
    const movieFileRef = useRef(null);
    const thumbFileRef = useRef(null);

    const [contentType, setContentType] = useState('movie');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('Action');
    const [rating, setRating] = useState('PG-13');
    const [language, setLanguage] = useState('English');
    const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
    const [duration, setDuration] = useState('');
    const [director, setDirector] = useState('');
    const [cast, setCast] = useState('');
    const [subtitles, setSubtitles] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [movieFile, setMovieFile] = useState(null);
    const [isPublishing, setIsPublishing] = useState(false);

    const [episodes, setEpisodes] = useState([{ id: Date.now(), title: '', videoFile: null }]);

    const toggleSubtitle = (lang) => {
        setSubtitles(prev =>
            prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
        );
    };

    const addEpisode = () => {
        setEpisodes([...episodes, { id: Date.now(), title: '', videoFile: null }]);
    };

    const removeEpisode = (id) => {
        setEpisodes(episodes.filter(ep => ep.id !== id));
    };

    const handleEpisodeFileChange = (id, file) => {
        setEpisodes(episodes.map(ep => ep.id === id ? { ...ep, videoFile: file } : ep));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPublishing(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('genre', genre);
            formData.append('rating', rating);
            formData.append('language', language);
            formData.append('release_year', releaseYear);
            formData.append('duration', duration);
            formData.append('director', director);
            formData.append('cast', cast);
            formData.append('subtitles', subtitles.join(', '));
            if (thumbnail) formData.append('thumbnail', thumbnail);

            if (contentType === 'movie') {
                if (!movieFile) {
                    alert('Please select a movie file');
                    setIsPublishing(false);
                    return;
                }
                formData.append('video_file', movieFile);
                formData.append('is_movie', true);

                await api.post('/videos/movies/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                const response = await api.post('/videos/series/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const seriesId = response.data.id;

                for (let i = 0; i < episodes.length; i++) {
                    const ep = episodes[i];
                    if (ep.videoFile) {
                        const epData = new FormData();
                        epData.append('series', seriesId);
                        epData.append('title', ep.title);
                        epData.append('video_file', ep.videoFile);
                        epData.append('episode_number', i + 1);
                        await api.post('/videos/episodes/', epData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                    }
                }
            }

            alert(`${contentType.toUpperCase()} Published Successfully!`);
            setTitle(''); setDescription(''); setMovieFile(null); setThumbnail(null);
            setDirector(''); setCast(''); setDuration(''); setSubtitles([]);
            setEpisodes([{ id: Date.now(), title: '', videoFile: null }]);
        } catch (error) {
            console.error('Publishing failed:', error);
            const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            alert(`Failed to publish: ${errorMsg}`);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="admin-upload-view">
            <header className="upload-header">
                <h1>Publish New Content</h1>
                <p>Add new titles to your library. Support for single movies and multi-episode series.</p>
            </header>

            <div className="upload-type-selector">
                <button
                    className={`type-btn ${contentType === 'movie' ? 'active' : ''}`}
                    onClick={() => setContentType('movie')}
                >
                    <Film size={20} />
                    <span>Movie</span>
                </button>
                <button
                    className={`type-btn ${contentType === 'series' ? 'active' : ''}`}
                    onClick={() => setContentType('series')}
                >
                    <Tv size={20} />
                    <span>Series</span>
                </button>
            </div>

            <form className="upload-form" onSubmit={handleSubmit}>
                <div className="form-main">
                    {/* ── Basic Information ── */}
                    <section className="form-section">
                        <div className="section-title">
                            <Type size={18} />
                            <h3>Basic Information</h3>
                        </div>
                        <div className="input-group">
                            <label>Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Inception"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Description / Synopsis</label>
                            <textarea
                                placeholder="Describe the content..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                    </section>

                    {/* ── Classification ── */}
                    <section className="form-section">
                        <div className="section-title">
                            <Layers size={18} />
                            <h3>Classification</h3>
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <label>Genre</label>
                                <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                                    {GENRES.map(g => <option key={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Maturity Rating</label>
                                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                                    {RATINGS.map(r => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <label>Language</label>
                                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Release Year</label>
                                <input
                                    type="number"
                                    min="1900"
                                    max={new Date().getFullYear() + 2}
                                    value={releaseYear}
                                    onChange={(e) => setReleaseYear(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Duration</label>
                            <input
                                type="text"
                                placeholder="e.g. 2h 28m"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>
                    </section>

                    {/* ── Credits ── */}
                    <section className="form-section">
                        <div className="section-title">
                            <Users size={18} />
                            <h3>Credits</h3>
                        </div>
                        <div className="input-group">
                            <label>Director</label>
                            <input
                                type="text"
                                placeholder="e.g. Christopher Nolan"
                                value={director}
                                onChange={(e) => setDirector(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Cast <span className="label-hint">(comma-separated)</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Leonardo DiCaprio, Tom Hardy"
                                value={cast}
                                onChange={(e) => setCast(e.target.value)}
                            />
                        </div>
                    </section>

                    {/* ── Media & Subtitles ── */}
                    <section className="form-section">
                        <div className="section-title">
                            <ImageIcon size={18} />
                            <h3>Media & Subtitles</h3>
                        </div>
                        <div className="input-group">
                            <label>Thumbnail Image</label>
                            <div className="file-input-wrapper" onClick={() => thumbFileRef.current.click()}>
                                <ImageIcon size={20} />
                                <span>{thumbnail ? thumbnail.name : "Choose Thumbnail"}</span>
                            </div>
                            <input
                                type="file"
                                hidden
                                ref={thumbFileRef}
                                onChange={(e) => setThumbnail(e.target.files[0])}
                                accept="image/*"
                            />
                        </div>
                        <div className="input-group">
                            <label>Available Subtitles</label>
                            <div className="subtitle-chips">
                                {SUBTITLE_LANGS.map(lang => (
                                    <button
                                        key={lang}
                                        type="button"
                                        className={`subtitle-chip ${subtitles.includes(lang) ? 'active' : ''}`}
                                        onClick={() => toggleSubtitle(lang)}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Movie File / Episodes ── */}
                    {contentType === 'movie' ? (
                        <section className="form-section file-section">
                            <div className="section-title">
                                <LinkIcon size={18} />
                                <h3>Movie File</h3>
                            </div>
                            <div className={`dropzone ${movieFile ? 'has-file' : ''}`} onClick={() => movieFileRef.current.click()}>
                                <UploadCloud size={32} />
                                <p>{movieFile ? movieFile.name : "Click to upload video file"}</p>
                                <span>Support for MP4, MKV, MOV (Max 5GB)</span>
                            </div>
                            <input
                                type="file"
                                hidden
                                ref={movieFileRef}
                                onChange={(e) => setMovieFile(e.target.files[0])}
                                accept="video/*"
                            />
                        </section>
                    ) : (
                        <section className="form-section episodes-section">
                            <div className="section-title">
                                <Plus size={18} />
                                <h3>Manage Episodes</h3>
                            </div>
                            <div className="episodes-list">
                                {episodes.map((ep, index) => (
                                    <div key={ep.id} className="episode-input-card">
                                        <div className="ep-num">#{index + 1}</div>
                                        <div className="ep-fields">
                                            <input
                                                type="text"
                                                placeholder="Episode Title"
                                                value={ep.title}
                                                onChange={(e) => setEpisodes(episodes.map(item => item.id === ep.id ? { ...item, title: e.target.value } : item))}
                                                required
                                            />
                                            <input
                                                type="file"
                                                onChange={(e) => handleEpisodeFileChange(ep.id, e.target.files[0])}
                                                accept="video/*"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-remove"
                                            onClick={() => removeEpisode(ep.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className="btn-add-episode" onClick={addEpisode}>
                                    <Plus size={18} /> Add Episode
                                </button>
                            </div>
                        </section>
                    )}
                </div>

                <div className="upload-sticky-footer">
                    <div className="footer-status">
                        {isPublishing ? (
                            <><Loader2 className="animate-spin" size={18} /> <span>Uploading content...</span></>
                        ) : (
                            <><CheckCircle2 size={18} color="#10b981" /> <span>Ready to publish</span></>
                        )}
                    </div>
                    <div className="footer-actions">
                        <button type="button" className="btn-secondary" disabled={isPublishing}>Save as Draft</button>
                        <button type="submit" className="btn-publish" disabled={isPublishing}>
                            {isPublishing ? 'Publishing...' : 'Publish Content'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminUpload;
