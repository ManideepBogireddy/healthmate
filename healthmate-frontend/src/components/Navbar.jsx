import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAuthPage = [
    "/login",
    "/signup",
    "/forgot-password",
    "/forgot-username",
  ].includes(location.pathname);

  if (location.pathname === "/complete-profile" || isAuthPage) {
    return null;
  }

  return (
    <nav className={`navbar ${isExpanded ? "expanded" : "collapsed"}`}>
      <div style={{ width: "100%" }}>
        <Link to="/" className="navbar-brand">
          {isExpanded ? "HealthMate" : "HM"}
        </Link>

        {!isAuthPage && currentUser && (
          <div
            style={{
              padding: "0 10px",
              marginBottom: "20px",
              width: "100%",
              textAlign: isExpanded ? "left" : "center",
            }}
          >
            <div style={{
                width: isExpanded ? '40px' : '32px',
                height: isExpanded ? '40px' : '32px',
                borderRadius: '50%',
                overflow: 'hidden',
                margin: isExpanded ? '0 0 10px 0' : '0 auto 10px auto',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.05)'
            }}>
                {currentUser.profilePhoto ? (
                    <img src={currentUser.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <span style={{ fontSize: isExpanded ? '1.2rem' : '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                        {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                    </span>
                )}
            </div>
            {isExpanded && (
                <>
                    <div style={{ color: isDarkMode ? "#94a3b8" : "#64748b", fontSize: "0.8rem", marginBottom: "2px" }}>
                        Hello,
                    </div>
                    <div style={{ color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: "600", wordBreak: "break-word", lineHeight: "1.2" }}>
                        {currentUser.username}
                    </div>
                </>
            )}
          </div>
        )}

        {!isAuthPage && currentUser && (
          <div className="nav-links">
            <Link to="/dashboard" className="nav-item" title="Dashboard">
              <span
                style={{
                  fontSize: "1.2rem",
                  minWidth: "24px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
              </span>
              {isExpanded && (
                <span style={{ marginLeft: "12px" }}>Dashboard</span>
              )}
            </Link>
            <Link
              to="/goal-center"
              className="nav-item"
              title="Goal Center"
            >
              <span
                style={{
                  fontSize: "1.2rem",
                  minWidth: "24px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
              </span>
              {isExpanded && (
                <span style={{ marginLeft: "12px" }}>Goal Center</span>
              )}
            </Link>
            <Link
              to="/workout-tracker"
              className="nav-item"
              title="Workout Tracker"
            >
              <span
                style={{
                  fontSize: "1.2rem",
                  minWidth: "24px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11" /><path d="m21.1 21.1-1.4-1.4" /><path d="m4.3 4.3-1.4-1.4" /><path d="M18 5c.6 0 1 .4 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V6c0-.6.4-1 1-1h1Z" /><path d="M8 15c.6 0 1 .4 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1c0-.6.4-1 1-1h1Z" /><path d="M15 11c.6 0 1 .4 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1c0-.6.4-1 1-1h1Z" /><path d="M11 7c.6 0 1 .4 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V8c0-.6.4-1 1-1h1Z" /></svg>
              </span>
              {isExpanded && (
                <span style={{ marginLeft: "12px" }}>Workouts</span>
              )}
            </Link>
            <Link
              to="/meal-tracker"
              className="nav-item"
              title="Meal Studio"
            >
              <span
                style={{
                  fontSize: "1.2rem",
                  minWidth: "24px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
              </span>
              {isExpanded && (
                <span style={{ marginLeft: "12px" }}>Meal Studio</span>
              )}
            </Link>
            <Link
              to="/health-tracker"
              className="nav-item"
              title="Vitals Hub"
            >
              <span
                style={{
                  fontSize: "1.2rem",
                  minWidth: "24px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /><path d="M5 14H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v2" /></svg>
              </span>
              {isExpanded && (
                <span style={{ marginLeft: "12px" }}>Vitals Hub</span>
              )}
            </Link>
            <Link
              to="/blog-studio"
              className="nav-item"
              title="Blog Studio"
            >
              <span
                style={{
                  fontSize: "1.2rem",
                  minWidth: "24px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              </span>
              {isExpanded && (
                <span style={{ marginLeft: "12px" }}>Blog Studio</span>
              )}
            </Link>
            {(currentUser.roles?.includes('ROLE_ADMIN') || currentUser.roles?.includes('ROLE_TRAINER') || currentUser.username === 'Manideep') && (
              <Link
                to="/moderation-center"
                className="nav-item"
                title="Moderation Center"
              >
                <span
                  style={{
                    fontSize: "1.2rem",
                    minWidth: "24px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
                </span>
                {isExpanded && (
                  <span style={{ marginLeft: "12px" }}>Moderation</span>
                )}
              </Link>
            )}
            <Link
              to="/trainer-match"
              className="nav-item"
              title="Trainer Match"
            >
              <span
                style={{
                  fontSize: "1.2rem",
                  minWidth: "24px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </span>
              {isExpanded && (
                <span style={{ marginLeft: "12px" }}>Find Trainer</span>
              )}
            </Link>
            <Link
              to="/help-center"
              className="nav-item"
              title="Help & Chat"
            >
              <span
                style={{
                  fontSize: "1.2rem",
                  minWidth: "24px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </span>
              {isExpanded && (
                <span style={{ marginLeft: "12px" }}>Help & Support</span>
              )}
            </Link>
            <Link to="/profile" className="nav-item" title="Profile">
              <span
                style={{
                  fontSize: "1.2rem",
                  minWidth: "24px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </span>
              {isExpanded && (
                <span style={{ marginLeft: "12px" }}>Profile</span>
              )}
            </Link>
          </div>
        )}
      </div>

      {!isAuthPage && currentUser ? (
        <div style={{ width: "100%", marginTop: "auto" }}>
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="nav-item"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              width: "100%",
              background: "transparent",
              color: "#94a3b8",
              border: "none",
              justifyContent: isExpanded ? "flex-start" : "center",
              cursor: "pointer",
              marginBottom: "5px",
              fontSize: "1rem",
              fontFamily: "inherit",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "24px",
                marginRight: isExpanded ? "12px" : "0",
              }}
            >
              {isDarkMode ? (
                /* Sun Icon for switching to Light Mode */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </span>
            {isExpanded && (
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            )}
          </button>

          {isExpanded && (
            <button
              onClick={handleLogout}
              className="nav-item logout-btn-hover"
              style={{
                width: "100%",
                background: "transparent",
                color: "#94a3b8",
                border: "none",
                justifyContent: "flex-start",
                cursor: "pointer",
                marginBottom: 0,
                fontSize: "1rem",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ef4444";
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                style={{
                  marginRight: '10px',
                  minWidth: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </span>
              Logout
            </button>
          )}

          {/* Toggle Button */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="nav-item"
            style={{
              justifyContent: isExpanded ? "flex-start" : "center",
              cursor: "pointer",
              marginTop: "10px",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "1.2rem",
                color: "#94a3b8",
                minWidth: "24px",
                textAlign: "center",
              }}
            >
              ☰
            </div>
            {isExpanded && (
              <span style={{ marginLeft: "12px", color: "#94a3b8" }}>
                Settings
              </span>
            )}
          </div>
        </div>
      ) : (
        !isAuthPage && (
          <div className="nav-links">
            <Link to="/login" className="nav-item">
              Login
            </Link>
            <Link to="/signup" className="nav-item">
              Signup
            </Link>
          </div>
        )
      )}
    </nav>
  );
};

export default Navbar;
