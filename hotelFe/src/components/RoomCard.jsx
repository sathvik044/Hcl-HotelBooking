import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Info, DollarSign, Sparkles } from 'lucide-react';

const RoomCard = ({ room, hotelId, onBookClick }) => {
  const { id, name, type, price, capacity, image, amenities, available } = room;

  return (
    <div style={styles.card} className="card-glass animate-fade-in">
      <div style={styles.imageWrapper}>
        <img src={image} alt={name} style={styles.image} loading="lazy" />
        <div style={styles.typeBadge}>
          <Sparkles size={12} color="white" />
          <span style={styles.typeText}>{type}</span>
        </div>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{name}</h3>
        
        {/* Info panel */}
        <div style={styles.infoRow}>
          <div style={styles.infoItem}>
            <Users size={16} color="var(--text-muted)" />
            <span style={styles.infoText}>Up to {capacity} guests</span>
          </div>
          <div style={styles.infoItem}>
            <Info size={16} color="var(--text-muted)" />
            <span style={styles.infoText}>{available ? 'Available Now' : 'Limited Slot'}</span>
          </div>
        </div>

        {/* Room Specific Amenities */}
        <div style={styles.amenities}>
          {amenities.map((item, idx) => (
            <span key={idx} style={styles.amenityItem}>
              &bull; {item}
            </span>
          ))}
        </div>

        <div style={styles.divider}></div>

        {/* Card Footer actions */}
        <div style={styles.footer}>
          <div style={styles.priceContainer}>
            <span style={styles.priceAmount}>${price}</span>
            <span style={styles.pricePeriod}>/ night</span>
          </div>

          {onBookClick ? (
            <button
              onClick={() => onBookClick(room)}
              style={styles.bookBtn}
              className="btn btn-primary btn-sm"
            >
              Reserve
            </button>
          ) : (
            <Link
              to={`/booking?hotelId=${hotelId}&roomId=${id}`}
              style={styles.bookBtn}
              className="btn btn-primary btn-sm"
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'var(--transition-bounce)',
    padding: 0,
  },
  imageWrapper: {
    position: 'relative',
    height: '210px',
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  typeBadge: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    backdropFilter: 'blur(4px)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  typeText: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '0.75rem',
    color: 'white',
    textTransform: 'uppercase',
  },
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    textAlign: 'left',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '10px',
  },
  infoRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '14px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  infoText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  amenities: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '20px',
  },
  amenityItem: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    marginBottom: '16px',
    marginTop: 'auto',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  priceAmount: {
    fontSize: '1.4rem',
    fontWeight: 800,
    fontFamily: 'var(--font-heading)',
    color: 'var(--text-heading)',
  },
  pricePeriod: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  bookBtn: {
    fontWeight: 700,
  },
};

// Injection of scale hover rules
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    div[class*="RoomCard"]:hover img {
      transform: scale(1.04);
    }
  `;
  document.head.appendChild(styleSheet);
}

export default RoomCard;
