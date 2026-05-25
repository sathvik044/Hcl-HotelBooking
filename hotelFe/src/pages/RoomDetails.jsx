import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { roomService, hotelService } from '../services/api';
import Loader from '../components/Loader';
import { Users, ShieldCheck, ArrowLeft, Heart, Sparkles, Check } from 'lucide-react';

const RoomDetails = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Selected date parameters from search url
  const checkIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  const checkOut = searchParams.get('checkOut') || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const guests = searchParams.get('guests') || '2';

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      try {
        const roomData = await roomService.getById(roomId);
        setRoom(roomData);

        const hotelData = await hotelService.getById(roomData.hotelId);
        setHotel(hotelData);
      } catch (err) {
        console.error('Failed to fetch room details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  if (loading) {
    return <Loader message="Analyzing premium suite details..." />;
  }

  if (!room || !hotel) {
    return (
      <div style={styles.errorContainer} className="container card-glass">
        <ShieldCheck size={48} color="var(--danger)" />
        <h2>Room Details Unresolvable</h2>
        <p>The specific room directory reference could not be verified.</p>
        <Link to="/hotels" className="btn btn-primary">Back to Directory</Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={styles.container}>
      {/* Back button link */}
      <Link to={`/hotels/${hotel.id}`} style={styles.backLink}>
        <ArrowLeft size={16} /> Back to {hotel.name}
      </Link>

      <div style={styles.mainLayout}>
        {/* Left Side: Images and Description */}
        <div style={styles.galleryAndSpecs}>
          <h1 style={styles.title}>{room.name}</h1>
          <p style={styles.hotelSub}>{hotel.name} &bull; {hotel.location}</p>

          <div style={styles.imageWrapper}>
            <img src={room.image} alt={room.name} style={styles.image} />
          </div>

          <h2 style={styles.sectionHeading}>Suite Particulars</h2>
          <p style={styles.desc}>
            Immerse yourself in our {room.type.toLowerCase()} engineered to maximize convenience and visual layout. Enjoy a suite featuring bespoke {room.amenities.join(', ').toLowerCase()} tailored for your peace of mind.
          </p>

          <h3 style={styles.subHeading}>Amenities & Amenities</h3>
          <div style={styles.amenitiesList}>
            {room.amenities.map((item, idx) => (
              <div key={idx} style={styles.amenityItem}>
                <Check size={16} color="var(--success)" />
                <span style={styles.amenityText}>{item}</span>
              </div>
            ))}
            <div style={styles.amenityItem}>
              <Check size={16} color="var(--success)" />
              <span style={styles.amenityText}>Hypoallergenic pillows</span>
            </div>
            <div style={styles.amenityItem}>
              <Check size={16} color="var(--success)" />
              <span style={styles.amenityText}>Smart Temperature Control</span>
            </div>
          </div>
        </div>

        {/* Right Side: Checkout summary */}
        <aside style={styles.summarySidebar} className="card-glass">
          <div style={styles.priceHeader}>
            <div style={styles.priceGroup}>
              <span style={styles.priceAmount}>${room.price}</span>
              <span style={styles.pricePeriod}>/ night</span>
            </div>
            <button style={styles.wishBtn} title="Save to wishlist">
              <Heart size={18} />
            </button>
          </div>

          <div style={styles.divider}></div>

          {/* Details summary list */}
          <div style={styles.detailsList}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Suite Category</span>
              <span style={styles.detailValue}>{room.type}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Capacity</span>
              <span style={styles.detailValue}>Up to {room.capacity} Guests</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Check In</span>
              <span style={styles.detailValue}>{checkIn}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Check Out</span>
              <span style={styles.detailValue}>{checkOut}</span>
            </div>
          </div>

          <div style={styles.divider}></div>

          <Link
            to={`/booking?hotelId=${hotel.id}&roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', height: '48px' }}
          >
            Confirm Reservation
          </Link>

          <div style={styles.policyCard}>
            <Sparkles size={16} color="var(--primary)" />
            <span style={styles.policyText}>
              Free cancellation up to 48 hours prior to check-in. Cancel online seamlessly from user profile.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '20px',
    textAlign: 'left',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: '24px',
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '1.7fr 1fr',
    gap: '40px',
    alignItems: 'start',
  },
  galleryAndSpecs: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: 'var(--text-heading)',
    marginBottom: '4px',
  },
  hotelSub: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    marginBottom: '24px',
  },
  imageWrapper: {
    width: '100%',
    height: '420px',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '32px',
    boxShadow: 'var(--shadow-md)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  sectionHeading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '12px',
  },
  desc: {
    fontSize: '0.975rem',
    color: 'var(--text-main)',
    lineHeight: 1.6,
    marginBottom: '24px',
  },
  subHeading: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '14px',
  },
  amenitiesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '10px',
  },
  amenityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  amenityText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  summarySidebar: {
    padding: '30px',
    borderRadius: '20px',
    boxShadow: 'var(--shadow-lg)',
  },
  priceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceGroup: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  priceAmount: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: 'var(--text-heading)',
    fontFamily: 'var(--font-heading)',
  },
  pricePeriod: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  wishBtn: {
    background: 'none',
    border: '1px solid var(--border-color)',
    color: 'var(--text-muted)',
    padding: '8px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '20px 0',
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  detailValue: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
  },
  policyCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '14px',
    borderRadius: '10px',
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    border: '1px dashed rgba(16, 185, 129, 0.25)',
    marginTop: '20px',
  },
  policyText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    lineHeight: 1.35,
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
};

// Add responsive layout collapsing for room details
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @media (max-width: 900px) {
      div[class*="mainLayout"] {
        grid-template-columns: 1fr !important;
        gap: 30px !important;
      }
      div[class*="imageWrapper"] {
        height: 250px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default RoomDetails;
