import React from 'react';
import Sidebar from '../components/Sidebar';
import {
    Settings as SettingsIcon,
    Monitor,
    Languages,
    ShieldCheck,
    User,
    Bell,
    ChevronRight
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const sections = [
        {
            title: 'Playback',
            icon: Monitor,
            options: [
                { label: 'Video Quality', value: 'Auto (Recommended)' },
                { label: 'Data Saver', value: 'Off' }
            ]
        },
        {
            title: 'App Language',
            icon: Languages,
            options: [
                { label: 'Primary Language', value: 'English (US)' },
                { label: 'Subtitles', value: 'English' }
            ]
        },
        {
            title: 'Privacy & Security',
            icon: ShieldCheck,
            options: [
                { label: 'Cookie Preferences', value: 'Adjust Preferences' },
                { label: 'Watch History', value: 'On' }
            ]
        },
        {
            title: 'Account',
            icon: User,
            options: [
                { label: 'Subscription Plan', value: 'Premium Ultra HD' },
                { label: 'Email Notifications', value: 'Enabled' }
            ]
        }
    ];

    return (
        <div className="settings-page">
            <Sidebar />
            <main className="settings-content">
                <header className="settings-header">
                    <h1>Settings</h1>
                    <p>Manage your account preferences and app experience</p>
                </header>

                <div className="settings-grid">
                    {sections.map((section, idx) => (
                        <section key={idx} className="settings-section">
                            <div className="section-title">
                                <section.icon size={20} />
                                <h2>{section.title}</h2>
                            </div>
                            <div className="options-list">
                                {section.options.map((opt, i) => (
                                    <div key={i} className="option-item">
                                        <div className="option-info">
                                            <span className="option-label">{opt.label}</span>
                                            <span className="option-value">{opt.value}</span>
                                        </div>
                                        <ChevronRight size={18} className="option-arrow" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="settings-footer">
                    <button className="btn-logout">Sign Out of All Devices</button>
                </div>
            </main>
        </div>
    );
};

export default Settings;
