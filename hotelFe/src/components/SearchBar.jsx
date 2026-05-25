import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SearchBar = ({ onSearch, initialValues = {} }) => {
  const { showAlert } = useAuth();
  
  // Set default dates (today and tomorrow)
  const getTodayString = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  const [location, setLocation] = useState(initialValues.location || initialValues.query || '');
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || getTodayString(0));
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || getTodayString(1));
  const [guests, setGuests] = useState(initialValues.guests || '2');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Date Validations
    const today = getTodayString(0);
    if (checkIn < today) {
      showAlert('Check-in date cannot be in the past.', 'warning');
      return;
    }

    if (checkOut <= checkIn) {
      showAlert('Check-out date must be at least one day after check-in.', 'warning');
      return;
    }

    if (parseInt(guests, 10) < 1) {
      showAlert('Guest count must be at least 1.', 'warning');
      return;
    }

    // Call search callback
    if (onSearch) {
      onSearch({
        location,
        query: location,
        checkIn,
        checkOut,
        guests,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.searchBarForm} className="card-glass animate-slide-up">
      <div style={styles.gridContainer}>
        {/* Destination Location */}
        <div style={styles.inputGroup}>
          <div style={styles.labelWrapper}>
            <MapPin size={16} color="var(--primary)" />
            <label style={styles.label}>Where to?</label>
          </div>
          <input
            type="text"
            placeholder="Search city, country, or hotel..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={styles.textInput}
          />
        </div>

        {/* Check In Date */}
        <div style={styles.inputGroup}>
          <div style={styles.labelWrapper}>
            <Calendar size={16} color="var(--primary)" />
            <label style={styles.label}>Check In</label>
          </div>
          <input
            type="date"
            min={getTodayString(0)}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            style={styles.dateInput}
            required
          />
        </div>

        {/* Check Out Date */}
        <div style={styles.inputGroup}>
          <div style={styles.labelWrapper}>
            <Calendar size={16} color="var(--primary)" />
            <label style={styles.label}>Check Out</label>
          </div>
          <input
            type="date"
            min={checkIn || getTodayString(0)}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            style={styles.dateInput}
            required
          />
        </div>

        {/* Guest capacity */}
        <div style={styles.inputGroup}>
          <div style={styles.labelWrapper}>
            <Users size={16} color="var(--primary)" />
            <label style={styles.label}>Guests</label>
          </div>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            style={styles.selectInput}
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="6">6 Guests</option>
            <option value="8">8 Guests</option>
            <option value="10">10 Guests</option>
          </select>
        </div>

        {/* Search submit button */}
        <div style={styles.btnWrapper}>
          <button type="submit" className="btn btn-primary" style={styles.searchBtn}>
            <Search size={18} />
            <span style={styles.btnText}>Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};

const styles = {
  searchBarForm: {
    padding: '24px 30px',
    borderRadius: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%',
    position: 'relative',
    boxShadow: 'var(--shadow-lg)',
  },
  gridContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  inputGroup: {
    flex: 1,
    minWidth: '180px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    textAlign: 'left',
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  label: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    fontSize: '0.85rem',
    color: 'var(--text-heading)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  textInput: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-body)',
    color: 'var(--text-heading)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'var(--transition-smooth)',
  },
  dateInput: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-body)',
    color: 'var(--text-heading)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  selectInput: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-body)',
    color: 'var(--text-heading)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  btnWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '100%',
    paddingTop: '20px',
  },
  searchBtn: {
    padding: '12px 28px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '46px',
    whiteSpace: 'nowrap',
  },
  btnText: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
  },
};

// Add responsive overrides for grid collapsing on mobile devices
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @media (max-width: 900px) {
      form[class*="searchBarForm"] div[class*="gridContainer"] {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 15px !important;
      }
      form[class*="searchBarForm"] div[class*="inputGroup"] {
        width: 100% !important;
      }
      form[class*="searchBarForm"] div[class*="btnWrapper"] {
        padding-top: 10px !important;
      }
      form[class*="searchBarForm"] button[class*="searchBtn"] {
        width: 100% !important;
        justify-content: center !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default SearchBar;
