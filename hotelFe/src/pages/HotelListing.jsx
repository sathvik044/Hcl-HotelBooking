import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hotelService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import Loader from '../components/Loader';
import { SlidersHorizontal, ArrowUpDown, RefreshCw, Star, HelpCircle } from 'lucide-react';

const HotelListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAuth();

  // Filter States
  const [priceRange, setPriceRange] = useState(1000); // Max budget
  const [selectedRating, setSelectedRating] = useState(0); // Minimum star rating (0, 3, 4, 4.5)
  const [selectedAmenities, setSelectedAmenities] = useState([]); // List of checked amenities
  const [sortBy, setSortBy] = useState('rating-high'); // sorting flag

  // Query options extracted from URL
  const query = searchParams.get('query') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '';

  // Amenities checklist preset
  const amenitiesList = ['Free WiFi', 'Pool', 'Spa', 'Beach Access', 'Gym', 'Restaurant', 'Desert Views', 'Mountain Views', 'Breakfast Included'];

  useEffect(() => {
    const fetchSearchedHotels = async () => {
      setLoading(true);
      try {
        const params = {
          query,
          location: query,
          checkIn,
          checkOut,
          guests,
        };
        const results = await hotelService.searchHotels(params);
        setHotels(results);
      } catch (err) {
        console.error('Failed to search hotels:', err);
        showAlert(err.message || 'Failed to search hotels. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchedHotels();
  }, [searchParams]);

  const handleSearchSubmit = (newParams) => {
    // Update URL Search Params to trigger new API fetch
    const cleanParams = {};
    Object.keys(newParams).forEach(k => {
      if (newParams[k]) cleanParams[k] = newParams[k];
    });
    setSearchParams(cleanParams);
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };

  const clearFilters = () => {
    setPriceRange(1000);
    setSelectedRating(0);
    setSelectedAmenities([]);
    setSortBy('rating-high');
  };

  // ----------------------------------------------------
  // CLIENT FILTERING & SORTING LOGIC
  // ----------------------------------------------------
  const filteredHotels = hotels
    .filter(h => {
      // 1. Price budget filter (mock price threshold: Ritz is premium, riad is budget)
      // Ritz = 450/night, Amangiri = 650/night, Riffelalp = 290/night, Marrakech = 130/night
      let basePrice = 130;
      if (h.id === 'h-1') basePrice = 320;
      if (h.id === 'h-2') basePrice = 650;
      if (h.id === 'h-3') basePrice = 290;
      
      if (basePrice > priceRange) return false;

      // 2. Star rating filter
      if (h.rating < selectedRating) return false;

      // 3. Checked amenities filter
      if (selectedAmenities.length > 0) {
        const matchesAll = selectedAmenities.every(amenityName => {
          // Case insensitive check
          return h.amenities.some(ha => ha.toLowerCase().includes(amenityName.toLowerCase()));
        });
        if (!matchesAll) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Get base prices for sort
      const getBasePrice = (hotel) => {
        if (hotel.id === 'h-1') return 320;
        if (hotel.id === 'h-2') return 650;
        if (hotel.id === 'h-3') return 290;
        return 130;
      };

      if (sortBy === 'price-low') {
        return getBasePrice(a) - getBasePrice(b);
      }
      if (sortBy === 'price-high') {
        return getBasePrice(b) - getBasePrice(a);
      }
      if (sortBy === 'rating-high') {
        return b.rating - a.rating;
      }
      return 0;
    });

  return (
    <div style={styles.pageContainer} className="container">
      {/* Search Header Panel */}
      <section style={styles.searchSection}>
        <SearchBar
          onSearch={handleSearchSubmit}
          initialValues={{ query, location: query, checkIn, checkOut, guests }}
        />
      </section>

      {/* Main listing layout */}
      <div style={styles.mainLayout}>
        {/* Left column (Filters) */}
        <aside style={styles.filtersColumn} className="card-glass">
          <div style={styles.filterHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={18} color="var(--primary)" />
              <h3 style={styles.filterTitle}>Filter Options</h3>
            </div>
            <button onClick={clearFilters} style={styles.clearBtn}>Reset</button>
          </div>

          <div style={styles.divider}></div>

          {/* Budget Filter */}
          <div style={styles.filterBlock}>
            <label style={styles.filterLabel}>Max Nightly Budget: <strong>${priceRange}</strong></label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value, 10))}
              style={styles.slider}
            />
            <div style={styles.sliderLimits}>
              <span>$100</span>
              <span>$1000</span>
            </div>
          </div>

          <div style={styles.divider}></div>

          {/* Rating Filter */}
          <div style={styles.filterBlock}>
            <label style={styles.filterLabel}>Minimum Star Rating</label>
            <div style={styles.ratingRow}>
              {[0, 3, 4, 4.5].map((ratingVal) => (
                <button
                  key={ratingVal}
                  type="button"
                  onClick={() => setSelectedRating(ratingVal)}
                  style={{
                    ...styles.ratingBtn,
                    backgroundColor: selectedRating === ratingVal ? 'var(--primary)' : 'var(--bg-body)',
                    color: selectedRating === ratingVal ? 'white' : 'var(--text-heading)',
                    borderColor: selectedRating === ratingVal ? 'var(--primary)' : 'var(--border-color)',
                  }}
                >
                  {ratingVal === 0 ? 'All' : `${ratingVal}★+`}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.divider}></div>

          {/* Amenities filter checkboxes */}
          <div style={styles.filterBlock}>
            <label style={styles.filterLabel}>Resort Amenities</label>
            <div style={styles.amenitiesChecklist}>
              {amenitiesList.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <label key={amenity} style={styles.checkLabel}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleAmenityChange(amenity)}
                      style={styles.checkboxInput}
                    />
                    <span style={checked ? styles.checkTextActive : styles.checkText}>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right column (Listing & sorting) */}
        <main style={styles.listingColumn}>
          {/* Top Sort Header */}
          <div style={styles.sortHeader} className="card-glass">
            <span style={styles.resultCount}>
              Showing <strong>{filteredHotels.length}</strong> {filteredHotels.length === 1 ? 'property' : 'properties'}
              {query && ` matching "${query}"`}
            </span>

            <div style={styles.sortControls}>
              <ArrowUpDown size={15} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={styles.sortSelect}
              >
                <option value="rating-high">Top Star Rating</option>
                <option value="price-low">Price: Budget First</option>
                <option value="price-high">Price: Luxury First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <Loader message="Scanning properties for availability..." />
          ) : filteredHotels.length === 0 ? (
            <div style={styles.noResultsCard} className="card-glass animate-slide-up">
              <HelpCircle size={48} color="var(--primary)" />
              <h3 style={styles.noResultsTitle}>No Resorts Found</h3>
              <p style={styles.noResultsDesc}>
                We couldn't find any properties matching your current filter settings. Try adjusting the budget or removing some amenities.
              </p>
              <button onClick={clearFilters} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid-hotels">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    paddingTop: '20px',
  },
  searchSection: {
    marginBottom: '32px',
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '30px',
    alignItems: 'start',
  },
  filtersColumn: {
    padding: '24px',
    position: 'sticky',
    top: '110px',
    borderRadius: '16px',
    textAlign: 'left',
  },
  filterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontWeight: 700,
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '16px 0',
  },
  filterBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  filterLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-heading)',
  },
  slider: {
    width: '100%',
    cursor: 'pointer',
    accentColor: 'var(--primary)',
  },
  sliderLimits: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '-4px',
  },
  ratingRow: {
    display: 'flex',
    gap: '8px',
  },
  ratingBtn: {
    flex: 1,
    padding: '6px',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  amenitiesChecklist: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkboxInput: {
    accentColor: 'var(--primary)',
    cursor: 'pointer',
  },
  checkText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  checkTextActive: {
    fontSize: '0.8rem',
    color: 'var(--text-heading)',
    fontWeight: 600,
  },
  listingColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sortHeader: {
    padding: '16px 24px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  resultCount: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    textAlign: 'left',
  },
  sortControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sortSelect: {
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-body)',
    color: 'var(--text-heading)',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    outline: 'none',
    cursor: 'pointer',
  },
  noResultsCard: {
    padding: '60px 40px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    textAlign: 'center',
    maxWidth: '550px',
    margin: '40px auto',
  },
  noResultsTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
  },
  noResultsDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    marginBottom: '8px',
  },
};

// Add responsiveness to collapse filters panel on mobile screens
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @media (max-width: 900px) {
      div[class*="mainLayout"] {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
      }
      aside[class*="filtersColumn"] {
        position: static !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default HotelListing;
