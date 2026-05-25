import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { hotelService, roomService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { ShieldCheck, Calendar, Users, ShieldAlert, CreditCard, Sparkles, CheckCircle } from 'lucide-react';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const { user, showAlert } = useAuth();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newBookingId, setNewBookingId] = useState('');

  // Extract stay parameters
  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  const checkOut = searchParams.get('checkOut') || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const guests = parseInt(searchParams.get('guests') || '2', 10);

  // Form Fields
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('');
  
  // Payment Credit Card States
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!hotelId || !roomId) {
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const hotelData = await hotelService.getById(hotelId);
        setHotel(hotelData);

        const roomData = await roomService.getById(roomId);
        setRoom(roomData);
      } catch (err) {
        console.error('Failed to load booking assets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [hotelId, roomId]);

  // Calculate nights
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  };

  const nights = calculateNights();
  const subtotal = room ? room.price * nights : 0;
  const taxFee = subtotal * 0.12; // 12% luxury resort fee & tax
  const grandTotal = subtotal + taxFee;

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCardExpiry(val);
  };

  const validateForm = () => {
    const errors = {};
    if (!guestName.trim()) errors.name = 'Full name is required';
    if (!guestPhone.trim()) errors.phone = 'Phone number is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setPayLoading(true);
    try {
      const bookingData = {
        userId: user.id,
        userName: guestName,
        hotelId: hotel.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guests,
        totalPrice: grandTotal,
      };

      const result = await bookingService.create(bookingData);
      setNewBookingId(result.id);
      setIsSuccess(true);
      showAlert('Stay successfully booked and confirmed!', 'success');
    } catch (err) {
      showAlert(err.message || 'Payment processing failed.', 'error');
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Setting up interactive checkout register..." />;
  }

  if (!hotel || !room) {
    return (
      <div style={styles.errorContainer} className="container card-glass">
        <ShieldAlert size={48} color="var(--danger)" />
        <h2>Invalid Booking Portal</h2>
        <p>No valid hotel and room parameters were supplied to initialize checkout.</p>
        <Link to="/hotels" className="btn btn-primary">Return to Explore</Link>
      </div>
    );
  }

  // ----------------------------------------------------
  // SUCCESS SCREEN
  // ----------------------------------------------------
  if (isSuccess) {
    return (
      <div className="container" style={styles.successWrapper}>
        <div style={styles.successCard} className="card-glass animate-slide-up">
          <div style={styles.successIconWrapper}>
            <CheckCircle size={64} color="var(--success)" />
          </div>
          <h1 style={styles.successTitle}>Reservation Confirmed!</h1>
          <p style={styles.successDesc}>
            Your luxury getaway to <strong>{hotel.name}</strong> has been secured.
          </p>

          <div style={styles.bookingDetailsBox}>
            <p><strong>Booking Ref:</strong> #{newBookingId}</p>
            <p><strong>Suite Tier:</strong> {room.name}</p>
            <p><strong>Check In:</strong> {checkIn} &bull; <strong>Check Out:</strong> {checkOut}</p>
            <p><strong>Stay duration:</strong> {nights} Nights &bull; <strong>Total Charged:</strong> ${grandTotal.toFixed(2)}</p>
          </div>

          <div style={styles.successActions}>
            <Link to={`/bookings/user/${user.id}`} className="btn btn-primary">
              View My Bookings
            </Link>
            <Link to="/" style={styles.backHomeBtn}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>Confirm Your Getaway</h1>

      <div style={styles.mainLayout}>
        {/* Left Column: Guest info and payment form */}
        <div style={styles.formCol}>
          <form onSubmit={handlePaySubmit}>
            {/* 1. Guest info card */}
            <div style={styles.cardBlock} className="card-glass">
              <h3 style={styles.blockTitle}>1. Guest Particulars</h3>
              <div style={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter guest name"
                    className="form-input"
                    style={{ borderColor: formErrors.name ? 'var(--danger)' : 'var(--border-color)' }}
                    required
                  />
                  {formErrors.name && <span className="form-error">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="form-input"
                    disabled
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                  <label className="form-label">Contact Phone Number</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="form-input"
                    style={{ borderColor: formErrors.phone ? 'var(--danger)' : 'var(--border-color)' }}
                    required
                  />
                  {formErrors.phone && <span className="form-error">{formErrors.phone}</span>}
                </div>
              </div>
            </div>

            {/* 2. Direct Booking Confirmation (Payment Disabled) */}
            <div style={styles.cardBlock} className="card-glass" style={{ ...styles.cardBlock, marginTop: '30px' }}>
              <h3 style={styles.blockTitle}>2. Finalize Reservation</h3>
              
              <div style={styles.guaranteeCard} style={{ ...styles.guaranteeCard, marginTop: 0, marginBottom: '24px', borderStyle: 'solid' }}>
                <ShieldCheck size={20} color="var(--success)" />
                <span style={{ ...styles.guaranteeText, color: 'var(--text-heading)', fontWeight: 600 }}>
                  Direct Booking Active: Online card authorization has been bypassed. You can secure this reservation instantly!
                </span>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>
                By finalizing this reservation, you agree to the check-in policies and house rules of the resort. A booking confirmation email will be dispatched to your account immediately.
              </p>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', height: '48px' }}
                disabled={payLoading}
              >
                {payLoading ? 'Processing your reservation...' : 'Confirm & Secure Booking'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Cost summary block */}
        <aside style={styles.summaryCol} className="card-glass">
          <h3 style={styles.summaryTitle}>Stay Itinerary</h3>
          
          <div style={styles.itineraryHotel}>
            <h4 style={styles.itineraryHotelName}>{hotel.name}</h4>
            <p style={styles.itineraryRoomName}>{room.name} ({room.type})</p>
          </div>

          <div style={styles.divider}></div>

          {/* Details */}
          <div style={styles.itineraryDetails}>
            <div style={styles.itineraryItem}>
              <Calendar size={15} color="var(--text-muted)" />
              <span style={styles.itineraryText}><strong>Check In:</strong> {checkIn}</span>
            </div>
            <div style={styles.itineraryItem}>
              <Calendar size={15} color="var(--text-muted)" />
              <span style={styles.itineraryText}><strong>Check Out:</strong> {checkOut}</span>
            </div>
            <div style={styles.itineraryItem}>
              <Users size={15} color="var(--text-muted)" />
              <span style={styles.itineraryText}><strong>Stay duration:</strong> {nights} {nights === 1 ? 'Night' : 'Nights'} &bull; {guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
            </div>
          </div>

          <div style={styles.divider}></div>

          {/* Math calculations */}
          <h3 style={styles.summaryTitle}>Charge Breakdown</h3>
          <div style={styles.pricingLines}>
            <div style={styles.priceRow}>
              <span>Room cost ({nights} nights &times; ${room.price})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.priceRow}>
              <span>Luxury Resort taxes & fees (12%)</span>
              <span>${taxFee.toFixed(2)}</span>
            </div>
            <div style={styles.divider}></div>
            <div style={styles.priceRowTotal}>
              <span>Aggregate Balance</span>
              <span style={styles.grandPrice}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div style={styles.guaranteeCard}>
            <Sparkles size={16} color="var(--primary)" />
            <span style={styles.guaranteeText}>
              Your stay is protected by HCL Stay's 100% satisfaction promise.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
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
    gridTemplateColumns: '1.5fr 1fr',
    gap: '30px',
    alignItems: 'start',
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
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '20px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  ccMockup: {
    width: '100%',
    height: '200px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: 'white',
    boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)',
    marginBottom: '24px',
  },
  ccHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ccBrand: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
  },
  ccNumber: {
    fontSize: '1.4rem',
    fontWeight: 600,
    fontFamily: 'var(--font-heading)',
    letterSpacing: '0.08em',
    textAlign: 'left',
    margin: '20px 0',
  },
  ccFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    textAlign: 'left',
  },
  ccHolderGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  ccExpiryGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  ccLabel: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 500,
    marginBottom: '2px',
  },
  ccVal: {
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
  ccFormGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '20px 0',
  },
  summaryCol: {
    padding: '30px',
    borderRadius: '20px',
    boxShadow: 'var(--shadow-lg)',
    position: 'sticky',
    top: '110px',
  },
  summaryTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '16px',
    textAlign: 'left',
  },
  itineraryHotel: {
    textAlign: 'left',
  },
  itineraryHotelName: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '4px',
  },
  itineraryRoomName: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  itineraryDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  itineraryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  itineraryText: {
    fontSize: '0.85rem',
    color: 'var(--text-main)',
  },
  pricingLines: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  priceRowTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    fontWeight: 700,
    color: 'var(--text-heading)',
  },
  grandPrice: {
    fontSize: '1.6rem',
    fontWeight: 800,
    fontFamily: 'var(--font-heading)',
    color: 'var(--primary)',
  },
  guaranteeCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '12px',
    borderRadius: '10px',
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
    border: '1px dashed var(--primary-glow)',
    marginTop: '20px',
  },
  guaranteeText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    lineHeight: 1.35,
    textAlign: 'left',
  },
  errorContainer: {
    padding: '80px 40px',
    textAlign: 'center',
    maxWidth: '550px',
    margin: '60px auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  successWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '40px 20px',
  },
  successCard: {
    width: '100%',
    maxWidth: '580px',
    padding: '50px 40px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-lg)',
  },
  successIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  successTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'var(--text-heading)',
    marginBottom: '8px',
  },
  successDesc: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    marginBottom: '30px',
  },
  bookingDetailsBox: {
    textAlign: 'left',
    padding: '20px 24px',
    backgroundColor: 'var(--bg-body)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  successActions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  backHomeBtn: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
  },
};

// Add responsive layout collapses for Booking checkout grids
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @media (max-width: 900px) {
      div[class*="mainLayout"] {
        grid-template-columns: 1fr !important;
        gap: 30px !important;
      }
      aside[class*="summaryCol"] {
        position: static !important;
      }
      div[class*="formGrid"], div[class*="ccFormGrid"] {
        grid-template-columns: 1fr !important;
      }
      div[class*="formGrid"] div[class*="form-group"], div[class*="ccFormGrid"] div[class*="form-group"] {
        grid-column: span 1 !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Booking;
