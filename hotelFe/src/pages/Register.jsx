import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, CheckSquare, Square, ShieldAlert } from 'lucide-react';

const Register = () => {
  const { register, isLoggedIn, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/');
    }
  }, [isLoggedIn, user, navigate]);

  const validateForm = () => {
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters long';
    }

    if (!email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters for safety';
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      tempErrors.terms = 'You must accept the terms & conditions';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper} className="animate-fade-in">
      <div style={styles.card} className="card-glass">
        {/* Header */}
        <div style={styles.header}>
          <User size={40} color="var(--primary)" />
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Sign up to search and secure spectacular resort stays.</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Full Name field */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.inputIcon} />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ ...styles.inputField, borderColor: errors.name ? 'var(--danger)' : 'var(--border-color)' }}
                className="form-input"
              />
            </div>
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Email field */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="john@example.com"
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
            <label className="form-label">Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.inputField, borderColor: errors.password ? 'var(--danger)' : 'var(--border-color)' }}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={styles.eyeBtn}
                aria-label="Toggle password view"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* Confirm Password field */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Match password above"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ ...styles.inputField, borderColor: errors.confirmPassword ? 'var(--danger)' : 'var(--border-color)' }}
                className="form-input"
              />
            </div>
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          {/* Terms checkbox */}
          <div style={styles.termsWrapper}>
            <button
              type="button"
              onClick={() => setAcceptTerms(prev => !prev)}
              style={styles.checkBtn}
            >
              {acceptTerms ? (
                <CheckSquare size={20} color="var(--primary)" />
              ) : (
                <Square size={20} color={errors.terms ? 'var(--danger)' : 'var(--text-muted)'} />
              )}
            </button>
            <span style={styles.termsLabel}>
              I accept HCL Hotels' <a href="#" onClick={(e) => e.preventDefault()} style={styles.termsLink}>Terms of Service</a> & <a href="#" onClick={(e) => e.preventDefault()} style={styles.termsLink}>Privacy Policy</a>
            </span>
          </div>
          {errors.terms && <div style={{ textAlign: 'left', marginBottom: '14px' }} className="form-error">{errors.terms}</div>}

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register Now'}
          </button>
        </form>

        <div style={styles.divider}></div>

        {/* Action Link */}
        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.loginLink}>
            Sign In here
          </Link>
        </p>

        {/* Admin Register Help */}
        <div style={styles.adminTip}>
          <ShieldAlert size={14} color="var(--primary)" />
          <span style={styles.tipText}>
            Want an administrator account? Put the word <strong>admin</strong> anywhere inside your email.
          </span>
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
    maxWidth: '480px',
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
  termsWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    margin: '20px 0 10px',
    textAlign: 'left',
  },
  checkBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  termsLabel: {
    fontSize: '0.825rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
  },
  termsLink: {
    fontWeight: 600,
    color: 'var(--primary)',
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
  loginLink: {
    fontWeight: 700,
    color: 'var(--primary)',
  },
  adminTip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    border: '1px dashed var(--primary-glow)',
    borderRadius: '8px',
    padding: '10px 14px',
    marginTop: '20px',
    textAlign: 'left',
  },
  tipText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    lineHeight: 1.35,
  },
};

export default Register;
