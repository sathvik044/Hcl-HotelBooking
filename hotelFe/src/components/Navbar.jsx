import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Hotel, User, LogOut, Menu, X, ShieldAlert, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('hcl_theme') || 'light');
  const navigate = useNavigate();

  // Apply theme to body
  useEffect(() => {
    const root = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }
    localStorage.setItem('hcl_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogoutClick = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.navContainer} className="card-glass">
        {/* Brand Logo */}
        <Link to="/" style={styles.logo} onClick={() => setMobileMenuOpen(false)}>
          <Hotel size={24} color="var(--primary)" />
          <span style={styles.logoText}>HCL<span style={{ color: 'var(--primary)' }}>Stay</span></span>
        </Link>

        {/* Desktop Links */}
        <nav style={styles.desktopNav} className="desktop-nav">
          <NavLink to="/" style={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)}>Home</NavLink>
          <NavLink to="/hotels" style={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)}>Explore Hotels</NavLink>
          
          {isLoggedIn && !isAdmin && (
            <NavLink to={`/bookings/user/${user.id}`} style={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)}>
              My Bookings
            </NavLink>
          )}

          {isLoggedIn && isAdmin && (
            <NavLink to="/admin" style={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldAlert size={16} /> Admin Panel
              </span>
            </NavLink>
          )}
        </nav>

        {/* Right Actions */}
        <div style={styles.actions}>
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle visual theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {isLoggedIn ? (
            <div style={styles.userSection}>
              <Link to="/profile" style={styles.profileLink} title="Edit profile">
                <User size={18} />
                <span style={styles.profileText} className="profile-text">{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogoutClick} style={styles.logoutBtn} title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={styles.authBtnGroup}>
              <Link to="/login" style={styles.loginBtn}>Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <button onClick={() => setMobileMenuOpen(prev => !prev)} style={styles.mobileMenuBtn} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer} className="animate-fade-in card-glass">
          <div style={styles.mobileDrawerContent}>
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>Home</NavLink>
            <NavLink to="/hotels" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>Explore Hotels</NavLink>
            
            {isLoggedIn && !isAdmin && (
              <NavLink to={`/bookings/user/${user.id}`} onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>
                My Bookings
              </NavLink>
            )}

            {isLoggedIn && isAdmin && (
              <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>
                Admin Dashboard
              </NavLink>
            )}

            {isLoggedIn && (
              <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>
                My Profile
              </NavLink>
            )}

            <div style={styles.mobileDrawerFooter}>
              {isLoggedIn ? (
                <button onClick={handleLogoutClick} style={styles.mobileLogoutBtn}>
                  <LogOut size={18} /> Logout
                </button>
              ) : (
                <div style={styles.mobileAuthBtnGroup}>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLoginBtn}>Sign In</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 999,
    padding: '16px 20px',
    width: '100%',
    boxSizing: 'border-box',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    borderRadius: '16px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoText: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.35rem',
    fontWeight: 800,
    color: 'var(--text-heading)',
    letterSpacing: '-0.02em',
  },
  desktopNav: {
    display: 'flex',
    gap: '24px',
  },
  navLink: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 500,
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    transition: 'var(--transition-smooth)',
  },
  activeNavLink: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: 'var(--primary)',
    position: 'relative',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  mobileMenuBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-heading)',
    cursor: 'pointer',
    display: 'none',
    padding: '4px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  profileLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '100px',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    color: 'var(--primary)',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  profileText: {
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid var(--border-color)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)',
  },
  authBtnGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  loginBtn: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--text-heading)',
  },
  mobileDrawer: {
    position: 'absolute',
    top: '80px',
    left: '20px',
    right: '20px',
    padding: '24px',
    borderRadius: '16px',
    display: 'none',
  },
  mobileDrawerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  mobileLink: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1rem',
    fontWeight: 500,
    color: 'var(--text-heading)',
    padding: '8px 0',
    borderBottom: '1px solid var(--border-color)',
  },
  mobileDrawerFooter: {
    marginTop: '16px',
    paddingTop: '16px',
  },
  mobileAuthBtnGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mobileLoginBtn: {
    textAlign: 'center',
    padding: '10px',
    fontWeight: 600,
    color: 'var(--text-heading)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
  },
  mobileLogoutBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: 'none',
    color: 'var(--danger)',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

// Add raw CSS overrides for responsive media queries for Navbar links display
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @media (max-width: 768px) {
      header nav.desktop-nav {
        display: none !important;
      }
      header button[aria-label="Toggle menu"] {
        display: flex !important;
      }
      header div[class*="mobileDrawer"] {
        display: block !important;
      }
      header div[class*="authBtnGroup"] {
        display: none !important;
      }
      header div[class*="userSection"] {
        display: none !important;
      }
    }
    @media (max-width: 480px) {
      header span.profile-text {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Navbar;
