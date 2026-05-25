import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import { User, Mail, Shield, Award, Calendar, KeyRound, Sparkles } from 'lucide-react';

const UserProfile = () => {
  const { user, updateProfile, showAlert } = useAuth();

  // General profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [loading, setLoading] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Statistics
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.phone) setPhone(user.phone);

      // Async fetch booking count for premium statistics
      const fetchCount = async () => {
        try {
          const bks = await bookingService.getHistoryByUserId(user.id);
          setTotalBookings(bks.length);
        } catch (e) {
          console.warn('Could not fetch user booking count:', e);
        }
      };
      fetchCount();
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showAlert('Name and Email cannot be blank.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ name, email, phone });
    } catch (err) {
      console.error('Profile update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      showAlert('All password fields are required.', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      showAlert('New password must be at least 6 characters.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('New passwords do not match.', 'warning');
      return;
    }

    setPassLoading(true);
    try {
      // Simulate password change API call
      await new Promise(resolve => setTimeout(resolve, 400));
      showAlert('Password updated successfully.', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showAlert('Failed to update password.', 'error');
    } finally {
      setPassLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container animate-fade-in" style={styles.container}>
      <h1 style={styles.pageTitle}>Profile Settings</h1>

      <div style={styles.mainLayout}>
        {/* Left Side: Avatar card & stats */}
        <aside style={styles.sidebarCard} className="card-glass">
          <div style={styles.avatarWrapper}>
            <div style={styles.avatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={styles.userName}>{user.name}</h2>
            <span className={`badge ${user.role === 'ADMIN' ? 'badge-danger' : 'badge-info'}`} style={styles.roleBadge}>
              {user.role === 'ADMIN' ? 'Administrator' : 'Premium Member'}
            </span>
          </div>

          <div style={styles.divider}></div>

          {/* Stats details */}
          <div style={styles.statsList}>
            <div style={styles.statItem}>
              <Award size={18} color="var(--primary)" />
              <div style={styles.statText}>
                <span style={styles.statLabel}>Membership Tier</span>
                <span style={styles.statVal}>VIP Platinum</span>
              </div>
            </div>

            <div style={styles.statItem}>
              <Calendar size={18} color="var(--success)" />
              <div style={styles.statText}>
                <span style={styles.statLabel}>Member Since</span>
                <span style={styles.statVal}>{user.createdAt || '2026-01-15'}</span>
              </div>
            </div>

            <div style={styles.statItem}>
              <Shield size={18} color="var(--info)" />
              <div style={styles.statText}>
                <span style={styles.statLabel}>Booked Vacations</span>
                <span style={styles.statVal}>{totalBookings} Total stays</span>
              </div>
            </div>
          </div>

          <div style={styles.vipCard}>
            <Sparkles size={16} color="var(--primary)" />
            <span style={styles.vipText}>
              You have unlocked elite resort rates. 10% discount auto-applied on all checkouts!
            </span>
          </div>
        </aside>

        {/* Right Side: Account Forms */}
        <main style={styles.formCol}>
          {/* Form 1: General Info */}
          <div style={styles.cardBlock} className="card-glass">
            <h3 style={styles.blockTitle}>Personal Account Particulars</h3>
            <form onSubmit={handleProfileSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={styles.inputWrapper}>
                    <User size={18} style={styles.inputIcon} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                      style={styles.inputField}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={styles.inputWrapper}>
                    <Mail size={18} style={styles.inputIcon} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      style={styles.inputField}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                  <label className="form-label">Contact Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: '10px' }}
                disabled={loading}
              >
                {loading ? 'Saving Changes...' : 'Save Profile details'}
              </button>
            </form>
          </div>

          {/* Form 2: Password Update */}
          <div style={styles.cardBlock} className="card-glass" style={{ ...styles.cardBlock, marginTop: '30px' }}>
            <h3 style={styles.blockTitle}>Change Secure Password</h3>
            <form onSubmit={handlePasswordSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                  <label className="form-label">Current Password</label>
                  <div style={styles.inputWrapper}>
                    <KeyRound size={18} style={styles.inputIcon} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="form-input"
                      style={styles.inputField}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Match new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: '10px' }}
                disabled={passLoading}
              >
                {passLoading ? 'Updating credentials...' : 'Update Password'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '20px',
    textAlign: 'left',
  },
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: 'var(--text-heading)',
    marginBottom: '32px',
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '40px',
    alignItems: 'start',
  },
  sidebarCard: {
    padding: '32px 24px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-md)',
  },
  avatarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-glow)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: 800,
    border: '3px solid var(--primary)',
    boxShadow: 'var(--shadow-sm)',
  },
  userName: {
    fontSize: '1.35rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
  },
  roleBadge: {
    fontWeight: 700,
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '24px 0',
  },
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    textAlign: 'left',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statText: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  statVal: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
  },
  vipCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '12px',
    borderRadius: '10px',
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
    border: '1px dashed var(--primary-glow)',
    marginTop: '24px',
  },
  vipText: {
    fontSize: '0.725rem',
    color: 'var(--text-muted)',
    lineHeight: 1.35,
    textAlign: 'left',
  },
  formCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardBlock: {
    padding: '30px',
    borderRadius: '20px',
    boxShadow: 'var(--shadow-md)',
  },
  blockTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '20px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '16px',
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
};

// Add responsive breaks for user profiles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @media (max-width: 900px) {
      div[class*="mainLayout"] {
        grid-template-columns: 1fr !important;
        gap: 30px !important;
      }
      aside[class*="sidebarCard"] {
        width: 100% !important;
      }
      div[class*="formGrid"] {
        grid-template-columns: 1fr !important;
      }
      div[class*="formGrid"] div[class*="form-group"] {
        grid-column: span 1 !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default UserProfile;
