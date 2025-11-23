import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            <div className={`navbar ${collapsed ? 'collapsed' : ''} `}>
                <nav className="navbar-menu">
                    <Link
                        to="/"
                        className={`nav - item ${isActive('/') ? 'active' : ''} `}
                    >
                        <span className="nav-icon">🏠</span>
                        {!collapsed && <span className="nav-text">Home</span>}
                    </Link>

                    <Link
                        to="/stock-dashboard"
                        className={`nav - item ${isActive('/stock-dashboard') ? 'active' : ''} `}
                    >
                        <span className="nav-icon">📈</span>
                        {!collapsed && <span className="nav-text">Stocks</span>}
                    </Link>
                </nav>

                <button className="toggle-btn" onClick={toggleNavbar}>
                    {collapsed ? '→' : '←'}
                </button>
            </div>
        </>
    );
};

export default Navbar;
