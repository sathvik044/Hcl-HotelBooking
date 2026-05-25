import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  const { id, name, description, location, rating, image, amenities } = hotel;

  // Shorten description for card grid
  const truncatedDesc = description.length > 95 ? description.substring(0, 95) + '...' : description;

  return (
    <article style={styles.card} className="card-glass animate-fade-in">
      <div style={styles.imageWrapper}>
        <img src={image} alt={name} style={styles.image} loading="lazy" />
        <div style={styles.overlayRating}>
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <span style={styles.ratingText}>{rating.toFixed(1)}</span>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.locationWrapper}>
          <MapPin size={14} color="var(--primary)" />
          <span style={styles.locationText}>{location}</span>
        </div>

        <h3 style={styles.title}>{name}</h3>
        <p style={styles.description}>{truncatedDesc}</p>

        {/* List key amenities as tags */}
        <div style={styles.amenitiesTags}>
          {amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} style={styles.tag}>{amenity}</span>
          ))}
          {amenities.length > 3 && <span style={styles.tag}>+{amenities.length - 3} more</span>}
        </div>

        <div style={styles.divider}></div>

        <div style={styles.footer}>
          <div style={styles.priceSection}>
            <span style={styles.priceLabel}>Starting from</span>
            <span style={styles.priceAmount}>$130<span style={styles.pricePeriod}>/night</span></span>
          </div>

          <Link to={`/hotels/${id}`} className="btn btn-primary btn-sm" style={styles.actionBtn}>
            Details
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: 0,
    borderRadius: '20px',
    height: '100%',
    transition: 'var(--transition-bounce)',
    border: '1px solid var(--border-color)',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  overlayRating: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(4px)',
    padding: '4px 10px',
    borderRadius: '100px',
    zIndex: 2,
  },
  ratingText: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '0.8rem',
    color: 'white',
  },
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  locationWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
  },
  locationText: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '8px',
    lineHeight: 1.3,
  },
  description: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  amenitiesTags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginBottom: '20px',
    marginTop: 'auto',
  },
  tag: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'var(--text-main)',
    backgroundColor: 'var(--border-color)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    marginBottom: '16px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  priceLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  priceAmount: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: 'var(--text-heading)',
    fontFamily: 'var(--font-heading)',
  },
  pricePeriod: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 600,
  },
};

// Add mouse-hover slide scale CSS
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    article[class*="card"]:hover img {
      transform: scale(1.06);
    }
    article[class*="card"]:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
    }
  `;
  document.head.appendChild(styleSheet);
}

export default HotelCard;
