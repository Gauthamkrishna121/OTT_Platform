import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Film,
    UploadCloud,
    Search,
    LogOut,
    ArrowLeft
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-logo">
                        <Film size={24} color="var(--accent-color)" />
                        <span>Admin Control</span>
                    </div>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/content" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <Search size={20} />
                        <span>Manage Content</span>
                    </NavLink>
                    <NavLink to="/admin/upload" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <UploadCloud size={20} />
                        <span>Upload Content</span>
                    </NavLink>
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="admin-exit-btn" onClick={() => navigate('/')}>
                        <ArrowLeft size={18} />
                        Exit Admin
                    </button>
                </div>
            </aside>

            <main className="admin-main-view">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
