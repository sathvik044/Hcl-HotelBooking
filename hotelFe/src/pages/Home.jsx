import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import Loader from '../components/Loader';
import { Star, ShieldCheck, Award, Smile, ArrowRight } from 'lucide-react';

const Home = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showAlert } = useAuth();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const hotels = await hotelService.getAll();
        setFeaturedHotels(hotels.slice(0, 3)); // Display top 3 hotels
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
        showAlert(err.message || 'Failed to load featured hotels. Please refresh.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleSearchSubmit = (searchParams) => {
    // Navigate to listing page with query params
    const query = new URLSearchParams(searchParams).toString();
    navigate(`/hotels?${query}`);
  };

  const testimonials = [
    {
      name: 'Eleanor Vance',
      location: 'London, UK',
      comment: 'The booking process was seamless, and our stay at The Ritz Bali was absolutely breathtaking. The Butler service was legendary! 10/10.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Marcus Brody',
      location: 'New York, USA',
      comment: 'Amangiri was an architectural dream. HCLStay made the checkout experience fluid and easy. Will definitely book through them again!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Sophia Loren',
      location: 'Rome, Italy',
      comment: 'Finding a family suite in Switzerland in winter used to be a hassle. The filters on HCLStay helped us locate Chalet Riffelalp instantly.',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    },
  ];

  return (
    <div style={styles.container}>
      {/* 1. Hero Banner */}
      <section style={styles.heroSection} className="animate-fade-in">
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Luxury Redefined. <br />Rest Perfectly.</h1>
          <p style={styles.heroSubtitle}>
            Immerse yourself in spectacular landscapes, elite hospitality, and uncompromised comfort.
          </p>
          
          {/* Main search bar floating in Hero */}
          <div style={styles.searchWrapper}>
            <SearchBar onSearch={handleSearchSubmit} />
          </div>
        </div>
      </section>

      {/* 2. Stats Showcase */}
      <section style={styles.statsSection} className="container animate-slide-up">
        <div style={styles.statsGrid}>
          <div style={styles.statCard} className="card-glass">
            <Award size={36} color="var(--primary)" />
            <h3 style={styles.statNumber}>120+</h3>
            <p style={styles.statLabel}>Luxury Properties</p>
          </div>
          <div style={styles.statCard} className="card-glass">
            <ShieldCheck size={36} color="var(--success)" />
            <h3 style={styles.statNumber}>50k+</h3>
            <p style={styles.statLabel}>Happy Guests</p>
          </div>
          <div style={styles.statCard} className="card-glass">
            <Smile size={36} color="var(--secondary)" />
            <h3 style={styles.statNumber}>99.9%</h3>
            <p style={styles.statLabel}>Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Destinations */}
      <section style={styles.featuredSection} className="container">
        <div style={styles.sectionHeader}>
          <div style={styles.headerLeft}>
            <span style={styles.sectionTag}>Curated Picks</span>
            <h2 style={styles.sectionTitle}>Featured Stays</h2>
          </div>
          <button onClick={() => navigate('/hotels')} style={styles.exploreAllBtn}>
            Explore All <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <Loader message="Fetching featured luxury destinations..." />
        ) : (
          <div className="grid-hotels">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Testimonials */}
      <section style={styles.testimonialSection}>
        <div className="container">
          <div style={styles.centerHeader}>
            <span style={styles.sectionTag}>Guest Stories</span>
            <h2 style={styles.sectionTitle}>Tested & Loved</h2>
          </div>

          <div style={styles.testimonialGrid}>
            {testimonials.map((t, idx) => (
              <div key={idx} style={styles.testimonialCard} className="card-glass">
                <div style={styles.ratingStars}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      color={i < Math.floor(t.rating) ? '#f59e0b' : 'var(--border-color)'}
                      fill={i < Math.floor(t.rating) ? '#f59e0b' : 'none'}
                    />
                  ))}
                  <span style={styles.ratingVal}>{t.rating.toFixed(1)}</span>
                </div>
                <p style={styles.comment}>"{t.comment}"</p>
                <div style={styles.author}>
                  <img src={t.avatar} alt={t.name} style={styles.avatar} />
                  <div style={styles.authorMeta}>
                    <h4 style={styles.authorName}>{t.name}</h4>
                    <span style={styles.authorLoc}>{t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  heroSection: {
    position: 'relative',
    minHeight: '600px',
    backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    boxSizing: 'border-box',
    borderRadius: '0 0 30px 30px',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)', // Sleek darkened overlay
    backdropFilter: 'blur(3px)',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1000px',
    width: '100%',
    textAlign: 'center',
    color: 'white',
  },
  heroTitle: {
    fontSize: '4rem',
    fontWeight: 800,
    color: 'white',
    letterSpacing: '-0.02em',
    marginBottom: '20px',
    lineHeight: 1.15,
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: 'rgba(255, 255, 255, 0.9)',
    maxWidth: '650px',
    margin: '0 auto 48px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
  },
  searchWrapper: {
    width: '100%',
  },
  statsSection: {
    marginTop: '-50px',
    position: 'relative',
    zIndex: 3,
    padding: '0 20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-lg)',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: 'var(--text-heading)',
    margin: '12px 0 4px',
    fontFamily: 'var(--font-heading)',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  featuredSection: {
    padding: '60px 20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '32px',
  },
  headerLeft: {
    textAlign: 'left',
  },
  sectionTag: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    display: 'block',
    marginBottom: '6px',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    margin: 0,
  },
  exploreAllBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '0.95rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'var(--transition-smooth)',
  },
  centerHeader: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  testimonialSection: {
    padding: '80px 20px',
    backgroundColor: 'rgba(99, 102, 241, 0.02)',
    borderTop: '1px solid var(--border-color)',
    borderBottom: '1px solid var(--border-color)',
  },
  testimonialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
  },
  testimonialCard: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '30px',
  },
  ratingStars: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '16px',
  },
  ratingVal: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginLeft: '6px',
  },
  comment: {
    fontSize: '0.95rem',
    fontStyle: 'italic',
    color: 'var(--text-main)',
    lineHeight: 1.5,
    marginBottom: '24px',
  },
  author: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  authorMeta: {
    display: 'flex',
    flexDirection: 'column',
  },
  authorName: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
  },
  authorLoc: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
};

// Injection of responsive adjustments
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @media (max-width: 900px) {
      section[class*="heroSection"] h1 {
        font-size: 2.5rem !important;
      }
      div[class*="statsGrid"], div[class*="testimonialGrid"] {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
      }
      div[class*="statsSection"] {
        margin-top: -20px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Home;
