import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const Alert = () => {
  const { alert, hideAlert } = useAuth();

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        hideAlert();
      }, 4000); // Dissolve toast after 4s
      return () => clearTimeout(timer);
    }
  }, [alert]);

  if (!alert) return null;

  const { message, type } = alert;

  const getStyleAndIcon = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'rgba(16, 185, 129, 0.95)',
          borderColor: 'var(--success)',
          icon: <CheckCircle2 size={20} color="white" />,
        };
      case 'error':
        return {
          bgColor: 'rgba(239, 68, 68, 0.95)',
          borderColor: 'var(--danger)',
          icon: <XCircle size={20} color="white" />,
        };
      case 'warning':
        return {
          bgColor: 'rgba(245, 158, 11, 0.95)',
          borderColor: 'var(--warning)',
          icon: <AlertTriangle size={20} color="white" />,
        };
      case 'info':
      default:
        return {
          bgColor: 'rgba(14, 165, 233, 0.95)',
          borderColor: 'var(--info)',
          icon: <Info size={20} color="white" />,
        };
    }
  };

  const { bgColor, borderColor, icon } = getStyleAndIcon();

  return (
    <div style={{ ...styles.alertToast, backgroundColor: bgColor, borderLeft: `5px solid ${borderColor}` }} className="animate-slide-up">
      <div style={styles.alertContent}>
        <div style={styles.iconWrapper}>{icon}</div>
        <p style={styles.message}>{message}</p>
        <button onClick={hideAlert} style={styles.closeBtn} aria-label="Close notification">
          <X size={16} color="white" />
        </button>
      </div>
    </div>
  );
};

const styles = {
  alertToast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    padding: '16px 20px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
    color: 'white',
    maxWidth: '400px',
    minWidth: '280px',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s ease',
  },
  alertContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  message: {
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: '0.9rem',
    margin: 0,
    paddingRight: '20px',
    color: 'white',
    lineHeight: 1.4,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'absolute',
    right: '-4px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '40%',
    transition: 'background 0.2s',
  },
};

export default Alert;
