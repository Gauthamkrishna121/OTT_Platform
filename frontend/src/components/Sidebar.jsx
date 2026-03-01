import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LayoutGrid, Download, User, Play, Settings, ShieldAlert } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const navItems = [
    { icon: Home, path: '/browse', title: 'Home' },
    { icon: LayoutGrid, path: '/categories', title: 'Categories' },
    { icon: Download, path: '/downloads', title: 'Downloads' },
  ];

  if (isAdmin) {
    navItems.push({ icon: ShieldAlert, path: '/admin', title: 'Admin Panel' });
  } else {
    navItems.push({ icon: Settings, path: '/settings', title: 'Settings' });
  }

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <aside className="sidebar">
      <div className="logo-container" onClick={() => navigate('/browse')} style={{ cursor: 'pointer' }}>
        <div className="logo-placeholder">
          <Play size={32} fill="var(--accent-color)" color="var(--accent-color)" />
        </div>
      </div>
      <nav className="nav-menu">
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            title={item.title}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="nav-icon" />
          </div>
        ))}
      </nav>
      <div
        className={`profile-container ${location.pathname === '/profile' ? 'active' : ''}`}
        onClick={handleProfileClick}
      >
        <User size={20} />
      </div>
    </aside>
  );
};

export default Sidebar;
