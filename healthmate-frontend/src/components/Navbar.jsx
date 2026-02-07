import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    React.useEffect(() => {
        if (isDarkMode) {
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
        }
    }, [isDarkMode]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isAuthPage = ["/login", "/signup", "/forgot-password", "/forgot-username"].includes(location.pathname);

    if (location.pathname === "/complete-profile" || isAuthPage) {
        return null;
    }

    return (
        <nav className={`navbar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div style={{ width: '100%' }}>
                <Link to="/" className="navbar-brand">
                    {isExpanded ? "HealthMate" : "HM"}
                </Link>

                {!isAuthPage && currentUser && (
                    <div style={{ padding: '0 10px', marginBottom: '20px', width: '100%', textAlign: isExpanded ? 'left' : 'center' }}>
                        <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '0.8rem', marginBottom: '2px' }}>{isExpanded ? "Hello," : ""}</div>
                        <div style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: '600', whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.2' }}>
                            {isExpanded ? currentUser.username : (currentUser.username ? currentUser.username.charAt(0).toUpperCase() : "U")}
                        </div>
                    </div>
                )}

                {!isAuthPage && currentUser && (
                    <div className="nav-links">
                        <Link to="/dashboard" className="nav-item" title="Dashboard">
                            <span style={{ fontSize: '1.2rem', minWidth: '24px', textAlign: 'center' }}>📊</span>
                            {isExpanded && <span style={{ marginLeft: '12px' }}>Dashboard</span>}
                        </Link>
                        <Link to="/profile" className="nav-item" title="Profile">
                            <span style={{ fontSize: '1.2rem', minWidth: '24px', textAlign: 'center' }}>👤</span>
                            {isExpanded && <span style={{ marginLeft: '12px' }}>Profile</span>}
                        </Link>
                    </div>
                )}
            </div>


            {
                !isAuthPage && currentUser ? (
                    <div style={{ width: '100%', marginTop: 'auto' }}>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="nav-item"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                color: '#94a3b8',
                                border: 'none',
                                justifyContent: isExpanded ? 'flex-start' : 'center',
                                cursor: 'pointer',
                                marginBottom: '5px',
                                fontSize: '1rem',
                                fontFamily: 'inherit'
                            }}
                        >
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '24px',
                                marginRight: isExpanded ? '12px' : '0'
                            }}>
                                {isDarkMode ? (
                                    /* Sun Icon for switching to Light Mode */
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="5"></circle>
                                        <line x1="12" y1="1" x2="12" y2="3"></line>
                                        <line x1="12" y1="21" x2="12" y2="23"></line>
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                        <line x1="1" y1="12" x2="3" y2="12"></line>
                                        <line x1="21" y1="12" x2="23" y2="12"></line>
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                    </svg>
                                ) : (
                                    /* Moon Icon for switching to Dark Mode */
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                    </svg>
                                )}
                            </span>
                            {isExpanded && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                        </button>

                        {isExpanded && (
                            <button
                                onClick={handleLogout}
                                className="nav-item logout-btn-hover"
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    color: '#94a3b8',
                                    border: 'none',
                                    justifyContent: 'flex-start',
                                    cursor: 'pointer',
                                    marginBottom: 0,
                                    fontSize: '1rem',
                                    fontFamily: 'inherit'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#ef4444';
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#94a3b8';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <span style={{ marginRight: '10px', minWidth: '24px', textAlign: 'center' }}>🚪</span>
                                Logout
                            </button>
                        )}

                        {/* Toggle Button */}
                        <div
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="nav-item"
                            style={{
                                justifyContent: isExpanded ? 'flex-start' : 'center',
                                cursor: 'pointer',
                                marginTop: '10px',
                                background: 'rgba(255,255,255,0.05)'
                            }}
                        >
                            <div style={{ fontSize: '1.2rem', color: '#94a3b8', minWidth: '24px', textAlign: 'center' }}>
                                ☰
                            </div>
                            {isExpanded && (
                                <span style={{ marginLeft: '12px', color: '#94a3b8' }}>Settings</span>
                            )}
                        </div>
                    </div>
                ) : !isAuthPage && (
                    <div className="nav-links">
                        <Link to="/login" className="nav-item">Login</Link>
                        <Link to="/signup" className="nav-item">Signup</Link>
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
