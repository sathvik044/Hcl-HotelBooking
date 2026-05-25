import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import Loader from '../components/Loader';
import { Compass, BookOpen, Clock, CheckCircle } from 'lucide-react';

const BookingHistory = () => {
  const { userId } = useParams();
  const { user, showAlert } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past', 'all'

  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      // Fetch all bookings for history
      const data = await bookingService.getHistoryByUserId(userId || user?.id);
      
      // Sort bookings by creation date descending
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(sorted);
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user || userId) {
      fetchUserBookings();
    }
  }, [userId, user]);

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm('Are you absolutely sure you want to cancel this booking? This action is instant and cannot be undone.');
    if (!confirmCancel) return;

    try {
      await bookingService.cancel(bookingId);
      showAlert('Booking successfully cancelled. Refund has been initiated to your card.', 'success');
      // Re-fetch to update state
      fetchUserBookings();
    } catch (err) {
      showAlert(err.message || 'Cancellation failed.', 'error');
    }
  };

  const getFilteredBookings = () => {
    const today = new Date().toISOString().split('T')[0];

    switch (activeTab) {
      case 'upcoming':
        // Confirmed bookings where check-in date is today or in the future
        return bookings.filter(b => b.status === 'CONFIRMED' && b.checkIn >= today);
      case 'past':
        // Cancelled bookings OR bookings where check-out date is in the past
        return bookings.filter(b => b.status === 'CANCELLED' || b.checkOut < today);
      case 'all':
      default:
        return bookings;
    }
  };

  const filtered = getFilteredBookings();

  if (loading) {
    return <Loader message="Accessing secure reservation ledgers..." />;
  }

  return (
    <div className="container animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>My Bookings</h1>
          <p style={styles.subtitle}>Manage and audit your active and past premium bookings.</p>
        </div>
        <Link to="/hotels" className="btn btn-primary btn-sm">
          Book New Stay
        </Link>
      </div>

      {/* Tabs list */}
      <div style={styles.tabsRow} className="card-glass">
        <button
          onClick={() => setActiveTab('upcoming')}
          style={{
            ...styles.tabBtn,
            color: activeTab === 'upcoming' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'upcoming' ? '2px solid var(--primary)' : '2px solid transparent',
          }}
        >
          <Compass size={16} /> Upcoming Stays
        </button>

        <button
          onClick={() => setActiveTab('past')}
          style={{
            ...styles.tabBtn,
            color: activeTab === 'past' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'past' ? '2px solid var(--primary)' : '2px solid transparent',
          }}
        >
          <Clock size={16} /> Past & Cancelled
        </button>

        <button
          onClick={() => setActiveTab('all')}
          style={{
            ...styles.tabBtn,
            color: activeTab === 'all' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'all' ? '2px solid var(--primary)' : '2px solid transparent',
          }}
        >
          <BookOpen size={16} /> All Bookings ({bookings.length})
        </button>
      </div>

      {/* Bookings List */}
      <div style={styles.bookingsContainer}>
        {filtered.length === 0 ? (
          <div style={styles.emptyCard} className="card-glass animate-slide-up">
            <Compass size={40} color="var(--primary)" />
            <h3 style={styles.emptyTitle}>No Bookings Found</h3>
            <p style={styles.emptyDesc}>
              {activeTab === 'upcoming'
                ? "You don't have any upcoming vacations scheduled. Time to plan your next premium getaway!"
                : "You don't have any past or cancelled bookings recorded."}
            </p>
            <Link to="/hotels" className="btn btn-primary">
              Browse Resort Properties
            </Link>
          </div>
        ) : (
          filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '20px',
    textAlign: 'left',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  headerLeft: {
    textAlign: 'left',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: 'var(--text-heading)',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
  },
  tabsRow: {
    display: 'flex',
    gap: '24px',
    padding: '0 24px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    marginBottom: '32px',
    overflowX: 'auto',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    padding: '16px 8px',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
    transition: 'var(--transition-smooth)',
  },
  bookingsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  emptyCard: {
    padding: '60px 40px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '40px auto',
  },
  emptyTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
  },
  emptyDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    marginBottom: '8px',
  },
};

export default BookingHistory;
