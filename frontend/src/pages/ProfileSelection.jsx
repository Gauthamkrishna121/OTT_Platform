import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfileSelection.css';

// Assign a vibrant background color per profile index
const PROFILE_COLORS = ['#7c3aed', '#06b6d4', '#16a34a', '#dc2626', '#2563eb'];

const ProfileSelection = () => {
    const navigate = useNavigate();
    const { user, selectProfile } = useAuth();

    const mainProfileName = user?.username || 'User';
    const mainAvatarSeed = user?.username || 'Avatar1';

    const profiles = [
        { id: 1, name: mainProfileName, seed: mainAvatarSeed },
        { id: 2, name: 'Kids', seed: 'KidsProfile' },
        { id: 3, name: 'Guest', seed: 'GuestProfile' },
    ];

    const handleSelect = (name) => {
        selectProfile(name);
        navigate('/browse');
    };

    return (
        <div className="ps-page">
            <div className="ps-container">
                <h1 className="ps-title">Who's watching?</h1>

                <div className="ps-grid">
                    {profiles.map((profile, index) => (
                        <div
                            key={profile.id}
                            className="ps-item"
                            onClick={() => handleSelect(profile.name)}
                        >
                            <div
                                className="ps-avatar"
                                style={{ backgroundColor: PROFILE_COLORS[index % PROFILE_COLORS.length] }}
                            >
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.seed}&backgroundColor=transparent`}
                                    alt={profile.name}
                                />
                            </div>
                            <span className="ps-name">{profile.name}</span>
                        </div>
                    ))}
                </div>

                <button className="ps-manage-btn" onClick={() => navigate('/browse')}>
                    Manage Profiles
                </button>
            </div>
        </div>
    );
};

export default ProfileSelection;
