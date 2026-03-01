import React, { useState } from 'react';
import { X, Upload, Film, FileText } from 'lucide-react';
import api from '../api/api';
import './AddVideoModal.css';

const AddVideoModal = ({ isOpen, onClose, onVideoAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('video_file', videoFile);

        try {
            // In a real app, we'd need a specific POST /videos/ endpoint
            // Assuming a standard Django model viewset setup
            await api.post('/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onVideoAdded();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to upload video. Ensure backend supports POST at the root or correctly mapped URL.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <header className="modal-header">
                    <h2>Add New Content</h2>
                    <button onClick={onClose} className="btn-close">
                        <X size={24} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label><Film size={18} /> Title</label>
                        <input
                            type="text"
                            placeholder="Movie or Episode title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><FileText size={18} /> Description</label>
                        <textarea
                            placeholder="Tell us what it's about..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label><Upload size={18} /> Video File</label>
                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setVideoFile(e.target.files[0])}
                                required
                            />
                            <div className="file-custom-ui">
                                {videoFile ? videoFile.name : 'Click to browse videos...'}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-upload" disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Save Content'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddVideoModal;
