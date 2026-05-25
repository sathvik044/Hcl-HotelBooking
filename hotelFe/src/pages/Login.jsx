import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, isLoggedIn, user, showAlert } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect away
  useEffect(() => {
    if (isLoggedIn && user) {
      const from = location.state?.from?.pathname || (user.role === 'ADMIN' ? '/admin' : '/');
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, user, navigate, location]);

  const validateForm = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 4) {
      tempErrors.password = 'Password must be at least 4 characters long';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(email, password);
      // Redirect happens in useEffect above upon auth state change
    } catch (err) {
      console.error('Login submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper} className="animate-fade-in">
      <div style={styles.card} className="card-glass">
        {/* Header Title */}
        <div style={styles.header}>
          <ShieldCheck size={40} color="var(--primary)" />
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Enter credentials to access your premium HCL account.</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email field */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...styles.inputField, borderColor: errors.email ? 'var(--danger)' : 'var(--border-color)' }}
                className="form-input"
              />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password field */}
          <div className="form-group">
            <div style={styles.passwordLabelRow}>
              <label className="form-label">Password</label>
              <a href="#" style={styles.forgotLink} onClick={(e) => { e.preventDefault(); showAlert('Demo mode: please use password "password"', 'info'); }}>
                Forgot?
              </a>
            </div>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.inputField, borderColor: errors.password ? 'var(--danger)' : 'var(--border-color)' }}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={styles.eyeBtn}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={styles.divider}></div>

        {/* Footer info */}
        <p style={styles.footerText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.registerLink}>
            Create one free
          </Link>
        </p>

        {/* Quick Demo Assist */}
        <div style={styles.demoBox}>
          <h4 style={styles.demoTitle}>Quick Access accounts:</h4>
          <p style={styles.demoText}><strong>User:</strong> user@hotel.com &bull; <strong>Pass:</strong> password</p>
          <p style={styles.demoText}><strong>Admin:</strong> admin@hotel.com &bull; <strong>Pass:</strong> password</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '40px 20px',
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    boxShadow: 'var(--shadow-lg)',
    padding: '40px',
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    margin: 0,
    lineHeight: 1.4,
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    zIndex: 2,
  },
  inputField: {
    paddingLeft: '44px',
  },
  passwordLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--primary)',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    zIndex: 2,
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '24px 0',
  },
  footerText: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
  },
  registerLink: {
    fontWeight: 700,
    color: 'var(--primary)',
  },
  demoBox: {
    marginTop: '24px',
    padding: '12px 16px',
    borderRadius: '10px',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    border: '1px dashed var(--primary-glow)',
    textAlign: 'left',
  },
  demoTitle: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '4px',
  },
  demoText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    margin: '2px 0',
  },
};

export default Login;
