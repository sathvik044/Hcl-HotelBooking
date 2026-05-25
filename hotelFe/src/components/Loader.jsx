import React from 'react';

const Loader = ({ message = 'Loading premium experiences...' }) => {
  return (
    <div className="flex-center animate-fade-in" style={styles.loaderContainer}>
      <div style={styles.spinnerWrapper}>
        <div style={styles.outerRing}></div>
        <div style={styles.innerRing}></div>
      </div>
      <p style={styles.text}>{message}</p>
    </div>
  );
};

const styles = {
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '40px',
    width: '100%',
  },
  spinnerWrapper: {
    position: 'relative',
    width: '60px',
    height: '60px',
  },
  outerRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '3px solid transparent',
    borderTopColor: 'var(--primary)',
    borderBottomColor: 'var(--secondary)',
    animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
  },
  innerRing: {
    position: 'absolute',
    top: '6px',
    left: '6px',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '3px solid transparent',
    borderRightColor: 'var(--success)',
    borderLeftColor: 'var(--info)',
    animation: 'spin-reverse 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
    opacity: 0.8,
  },
  text: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 500,
    fontSize: '1rem',
    color: 'var(--text-heading)',
    letterSpacing: '0.01em',
    textAlign: 'center',
  },
};

// Injection of keyframes dynamically via style block in loader context
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes spin-reverse {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Loader;
