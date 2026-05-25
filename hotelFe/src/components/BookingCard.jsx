import React from 'react';
import { Calendar, User, CreditCard, Hotel, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

const BookingCard = ({ booking, onCancel }) => {
  const { id, hotelName, roomName, checkIn, checkOut, guests, totalPrice, status, createdAt } = booking;

  const isConfirmed = status === 'CONFIRMED';
  const isCancelled = status === 'CANCELLED';

  // Calculate duration of stay in days
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  };

  const nights = calculateNights();

  // Check if booking is cancelable (check-in is in the future)
  const isCancelable = () => {
    if (!isConfirmed) return false;
    const today = new Date().toISOString().split('T')[0];
    return checkIn > today;
  };

  return (
    <div style={styles.card} className="card-glass animate-slide-up">
      {/* Decorative vertical status bar */}
      <div style={{
        ...styles.statusBar,
        backgroundColor: isConfirmed ? 'var(--success)' : 'var(--danger)'
      }}></div>

      <div style={styles.container}>
        {/* Header containing Hotel and Status */}
        <div style={styles.header}>
          <div style={styles.hotelInfo}>
            <Hotel size={18} color="var(--primary)" />
            <h3 style={styles.hotelName}>{hotelName}</h3>
          </div>
          <span className={`badge ${isConfirmed ? 'badge-success' : 'badge-danger'}`} style={styles.statusBadge}>
            {isConfirmed ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={12} /> Confirmed</span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={12} /> Cancelled</span>
            )}
          </span>
        </div>

        {/* Room selection details */}
        <p style={styles.roomName}>{roomName}</p>

        {/* Date block */}
        <div style={styles.detailsGrid}>
          <div style={styles.gridItem}>
            <Calendar size={15} color="var(--text-muted)" />
            <div style={styles.dateBlock}>
              <span style={styles.gridLabel}>Check In</span>
              <span style={styles.gridValue}>{checkIn}</span>
            </div>
          </div>

          <div style={styles.gridItem}>
            <Calendar size={15} color="var(--text-muted)" />
            <div style={styles.dateBlock}>
              <span style={styles.gridLabel}>Check Out</span>
              <span style={styles.gridValue}>{checkOut}</span>
            </div>
          </div>

          <div style={styles.gridItem}>
            <User size={15} color="var(--text-muted)" />
            <div style={styles.dateBlock}>
              <span style={styles.gridLabel}>Guests & Stay</span>
              <span style={styles.gridValue}>{guests} Guests &bull; {nights} {nights === 1 ? 'Night' : 'Nights'}</span>
            </div>
          </div>

          <div style={styles.gridItem}>
            <CreditCard size={15} color="var(--text-muted)" />
            <div style={styles.dateBlock}>
              <span style={styles.gridLabel}>Total Paid</span>
              <span style={styles.priceValue}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer / actions */}
        <div style={styles.footer}>
          <span style={styles.createdAt}>Booked on {createdAt} &bull; Ref: #{id}</span>
          
          {isCancelable() && onCancel && (
            <button
              onClick={() => onCancel(id)}
              className="btn btn-danger btn-sm"
              style={styles.cancelBtn}
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    padding: 0,
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  statusBar: {
    width: '6px',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    padding: '24px 24px 20px 30px',
    width: '100%',
    textAlign: 'left',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  hotelInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  hotelName: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
  },
  statusBadge: {
    fontWeight: 700,
  },
  roomName: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    marginBottom: '20px',
    paddingLeft: '26px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  gridItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  dateBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: '0.02em',
    marginBottom: '2px',
  },
  gridValue: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--text-heading)',
  },
  priceValue: {
    fontSize: '0.95rem',
    fontWeight: 800,
    color: 'var(--text-heading)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
  },
  createdAt: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  cancelBtn: {
    padding: '8px 16px',
    fontWeight: 700,
  },
};

export default BookingCard;
