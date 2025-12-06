import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Don't show navbar on login page
    if (location.pathname === '/login') {
        return null;
    }

    return (
        <nav className="bg-white border-b border-[rgba(55,53,47,0.09)] sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link to="/consultant" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="text-xl">🌾</span>
                        <span className="font-semibold text-notion-default">AgriGPT</span>
                    </Link>

                    {/* Center Navigation Links */}
                    {isAuthenticated && (
                        <div className="flex items-center gap-1">
                            <Link
                                to="/consultant"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/consultant')
                                    ? 'bg-notion-bg-hover text-notion-default'
                                    : 'text-notion-secondary hover:bg-notion-bg-gray'
                                    }`}
                            >
                                💬 Consultant
                            </Link>
                            <Link
                                to="/admin"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/admin')
                                    ? 'bg-notion-bg-hover text-notion-default'
                                    : 'text-notion-secondary hover:bg-notion-bg-gray'
                                    }`}
                            >
                                ⚙️ Admin
                            </Link>
                        </div>
                    )}

                    {/* User Profile & Logout */}
                    {isAuthenticated && user && (
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-notion-default font-medium truncate max-w-[150px]">
                                    {user.email}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn-notion btn-notion-default text-sm px-3 py-1.5 flex items-center gap-2"
                            >
                                <span className="hidden sm:inline">Logout</span>
                                <span className="sm:hidden">↪️</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

