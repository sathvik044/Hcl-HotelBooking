import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { hotelService, roomService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RoomCard from '../components/RoomCard';
import Loader from '../components/Loader';
import { Star, MapPin, Coffee, ShieldAlert, Sparkles, Map } from 'lucide-react';

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showAlert } = useAuth();

  // Selected booking dates helper (prepopulate with tomorrow / day-after)
  const getTodayString = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState(getTodayString(1));
  const [checkOut, setCheckOut] = useState(getTodayString(2));
  const [guests, setGuests] = useState('2');

  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true);
      try {
        const hotelData = await hotelService.getById(id);
        setHotel(hotelData);

        const roomData = await roomService.getByHotelId(id);
        setRooms(roomData);
      } catch (err) {
        console.error('Failed to fetch hotel details:', err);
        showAlert(err.message || 'Failed to load hotel details. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchHotelDetails();
  }, [id]);

  const handleRoomBook = (room) => {
    navigate(`/booking?hotelId=${id}&roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  if (loading) {
    return <Loader message="Opening resort portals and rooms listing..." />;
  }

  if (!hotel) {
    return (
      <div style={styles.errorContainer} className="container card-glass">
        <ShieldAlert size={48} color="var(--danger)" />
        <h2>Resort Not Found</h2>
        <p>The hotel directory reference you requested could not be verified.</p>
        <Link to="/hotels" className="btn btn-primary">Back to Hotels</Link>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer} className="animate-fade-in">
      {/* 1. Large Hero Cover Image */}
      <section style={{ ...styles.heroSection, backgroundImage: `url(${hotel.image})` }}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent} className="container">
          <div style={styles.locationTag}>
            <MapPin size={16} />
            <span>{hotel.location}</span>
          </div>
          <h1 style={styles.title}>{hotel.name}</h1>
          <div style={styles.starsWrapper}>
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                size={16}
                color={idx < Math.floor(hotel.rating) ? '#f59e0b' : 'rgba(255,255,255,0.3)'}
                fill={idx < Math.floor(hotel.rating) ? '#f59e0b' : 'none'}
              />
            ))}
            <span style={styles.ratingVal}>{hotel.rating.toFixed(1)} Rating</span>
          </div>
        </div>
      </section>

      {/* 2. Content Info section */}
      <section className="container" style={styles.infoLayout}>
        {/* Left Side: Text description & amenities list */}
        <div style={styles.descriptionBlock}>
          <h2 style={styles.sectionHeading}>About the Resort</h2>
          <p style={styles.descriptionText}>{hotel.description}</p>

          <h3 style={styles.subHeading}>Elite Resort Amenities</h3>
          <div style={styles.amenitiesGrid}>
            {hotel.amenities.map((item, idx) => (
              <div key={idx} style={styles.amenityItem} className="card-glass">
                <Sparkles size={14} color="var(--primary)" />
                <span style={styles.amenityText}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Map & quick pricing indicators */}
        <div style={styles.sidebarBlock} className="card-glass">
          <h3 style={styles.sidebarTitle}>Resort Location</h3>
          <p style={styles.sidebarText}>{hotel.location}</p>
          
          {/* Mock premium map placeholder card */}
          <div style={styles.mapPlaceholder}>
            <Map size={36} color="var(--text-muted)" />
            <span style={styles.mapLabel}>Open Interactive Map</span>
            <div style={styles.mapDetails}>
              {hotel.name} Cliffside, {hotel.location.split(',')[0]}
            </div>
          </div>

          <div style={styles.sidebarCard}>
            <Coffee size={18} color="var(--primary)" />
            <span style={styles.sidebarTip}>Free Welcome Drink & Buffet Breakfast included in all suite tiers!</span>
          </div>
        </div>
      </section>

      {/* 3. Availability and Dates Bar */}
      <section style={styles.datesBarSection}>
        <div className="container">
          <div style={styles.datesBar} className="card-glass">
            <h3 style={styles.datesBarTitle}>Plan Your Stay</h3>
            <div style={styles.datesBarGrid}>
              <div className="form-group">
                <label className="form-label">Check In</label>
                <input
                  type="date"
                  min={getTodayString(0)}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 12px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Check Out</label>
                <input
                  type="date"
                  min={checkIn}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 12px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 12px', cursor: 'pointer' }}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Available Rooms list */}
      <section className="container" style={styles.roomsSection}>
        <h2 style={styles.sectionHeading}>Available Room Options</h2>
        <p style={styles.sectionSubtitle}>Please select a room tier to reserve checkout details.</p>

        <div className="grid-rooms">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              hotelId={id}
              onBookClick={handleRoomBook}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  pageContainer: {
    width: '100%',
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
  heroSection: {
    position: 'relative',
    height: '420px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'flex-end',
    paddingBottom: '40px',
    borderRadius: '0 0 24px 24px',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    color: 'white',
    textAlign: 'left',
  },
  locationTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--primary)',
    color: 'white',
    padding: '6px 14px',
    borderRadius: '100px',
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '16px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 800,
    color: 'white',
    letterSpacing: '-0.02em',
    marginBottom: '12px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  starsWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  ratingVal: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'white',
    marginLeft: '6px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  },
  infoLayout: {
    display: 'grid',
    gridTemplateColumns: '1.7fr 1fr',
    gap: '40px',
    padding: '40px 0',
  },
  descriptionBlock: {
    textAlign: 'left',
  },
  sectionHeading: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '16px',
  },
  sectionSubtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    textAlign: 'left',
    marginTop: '-8px',
    marginBottom: '20px',
  },
  descriptionText: {
    fontSize: '1rem',
    color: 'var(--text-main)',
    lineHeight: 1.6,
    marginBottom: '32px',
  },
  subHeading: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '16px',
  },
  amenitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px',
  },
  amenityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '10px',
    boxShadow: 'var(--shadow-sm)',
  },
  amenityText: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-heading)',
  },
  sidebarBlock: {
    padding: '24px',
    borderRadius: '16px',
    textAlign: 'left',
    height: 'fit-content',
  },
  sidebarTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '6px',
  },
  sidebarText: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    marginBottom: '20px',
  },
  mapPlaceholder: {
    width: '100%',
    height: '180px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-body)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    marginBottom: '20px',
  },
  mapLabel: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
  },
  mapDetails: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  sidebarCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '14px',
    borderRadius: '10px',
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
    border: '1px dashed var(--primary-glow)',
  },
  sidebarTip: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
  },
  datesBarSection: {
    backgroundColor: 'rgba(99, 102, 241, 0.01)',
    borderTop: '1px solid var(--border-color)',
    borderBottom: '1px solid var(--border-color)',
    padding: '24px 20px',
  },
  datesBar: {
    padding: '20px 30px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  datesBarTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    margin: 0,
    textAlign: 'left',
  },
  datesBarGrid: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  roomsSection: {
    padding: '60px 20px',
  },
};

// Add responsive adjustments for details pages
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @media (max-width: 900px) {
      section[class*="infoLayout"] {
        grid-template-columns: 1fr !important;
        gap: 30px !important;
      }
      div[class*="heroSection"] h1 {
        font-size: 2.2rem !important;
      }
      div[class*="datesBar"] {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 15px !important;
      }
      div[class*="datesBarGrid"] {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 10px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default HotelDetails;
