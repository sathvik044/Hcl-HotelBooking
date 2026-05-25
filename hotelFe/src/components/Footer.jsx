import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Globe, Share2, Compass, Heart, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { showAlert } = useAuth();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showAlert(`Thank you! ${email} has been registered to our newsletter.`, 'success');
    setEmail('');
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Brand Info */}
          <div style={styles.brandCol}>
            <div style={styles.brandLogo}>
              <Hotel size={22} color="var(--primary)" />
              <span style={styles.logoText}>HCL<span style={{ color: 'var(--primary)' }}>Stay</span></span>
            </div>
            <p style={styles.brandDesc}>
              Curating premium, high-luxury lodging experiences around the world. Rest beautifully, live adventurously.
            </p>
            <div style={styles.socials}>
              <a href="#" style={styles.socialLink} aria-label="Facebook"><Globe size={18} /></a>
              <a href="#" style={styles.socialLink} aria-label="Twitter"><Share2 size={18} /></a>
              <a href="#" style={styles.socialLink} aria-label="Instagram"><Heart size={18} /></a>
              <a href="#" style={styles.socialLink} aria-label="LinkedIn"><Compass size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>Quick Nav</h4>
            <div style={styles.linksGrid}>
              <Link to="/" style={styles.link}>Home</Link>
              <Link to="/hotels" style={styles.link}>Explore Hotels</Link>
              <Link to="/profile" style={styles.link}>User Account</Link>
              <a href="#" style={styles.link}>Special Deals</a>
              <a href="#" style={styles.link}>Help Center</a>
              <a href="#" style={styles.link}>Privacy Policy</a>
            </div>
          </div>

          {/* Newsletter signup */}
          <div style={styles.newsletterCol}>
            <h4 style={styles.colTitle}>Stay Inspired</h4>
            <p style={styles.newsletterDesc}>Subscribe to unlock secret prices, premium travel guides, and luxury deal alerts.</p>
            <form onSubmit={handleSubscribe} style={styles.form}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.submitBtn} aria-label="Subscribe">
                <Send size={16} color="white" />
              </button>
            </form>
          </div>
        </div>

        <div style={styles.divider}></div>

        {/* Bottom copyright */}
        <div style={styles.bottom}>
          <p style={styles.copyright}>&copy; {new Date().getFullYear()} HCLStay Resorts Ltd. All rights reserved.</p>
          <p style={styles.copyright}>Handcrafted for absolute luxury & comfort.</p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'var(--bg-card)',
    borderTop: '1px solid var(--border-color)',
    padding: '60px 20px 30px',
    marginTop: 'auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr 1fr',
    gap: '40px',
    marginBottom: '40px',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  brandLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoText: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--text-heading)',
  },
  brandDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
  },
  socials: {
    display: 'flex',
    gap: '12px',
    marginTop: '6px',
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid var(--border-color)',
    color: 'var(--text-muted)',
    transition: 'var(--transition-smooth)',
  },
  linksCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  colTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
  },
  linksGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  link: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    transition: 'var(--transition-smooth)',
  },
  newsletterCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  newsletterDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    position: 'relative',
    width: '100%',
  },
  input: {
    flex: 1,
    padding: '12px 50px 12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-body)',
    color: 'var(--text-heading)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    outline: 'none',
  },
  submitBtn: {
    position: 'absolute',
    right: '6px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'var(--primary)',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '30px 0',
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
  },
  copyright: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
};

// Add responsive raw styles for footer column collapse
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @media (max-width: 768px) {
      footer div[class*="grid"] {
        grid-template-columns: 1fr !important;
        gap: 30px !important;
      }
      footer div[class*="bottom"] {
        flex-direction: column !important;
        align-items: center !important;
        gap: 8px !important;
        text-align: center !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Footer;
