import React, { useState, useEffect } from 'react';
import { adminService, hotelService, roomService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { BarChart3, Users, Hotel, CreditCard, ShieldAlert, Plus, Edit2, Trash2, CheckCircle, Ban, X, Sparkles } from 'lucide-react';

const AdminDashboard = () => {
  const { showAlert } = useAuth();
  
  // Tab controller: 'overview', 'users', 'hotels', 'rooms', 'bookings'
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms Modal Controllers
  const [hotelFormOpen, setHotelFormOpen] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null); // null for Add, hotel object for Edit
  const [hotelName, setHotelName] = useState('');
  const [hotelDesc, setHotelDesc] = useState('');
  const [hotelLoc, setHotelLoc] = useState('');
  const [hotelRating, setHotelRating] = useState('4.8');
  const [hotelImage, setHotelImage] = useState('');
  const [hotelAmenities, setHotelAmenities] = useState('Free WiFi, Pool, Spa, Restaurant');

  const [roomFormOpen, setRoomFormOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null); // null for Add, room object for Edit
  const [roomHotelId, setRoomHotelId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('DELUXE');
  const [roomPrice, setRoomPrice] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('2');
  const [roomImage, setRoomImage] = useState('');
  const [roomAmenities, setRoomAmenities] = useState('Free WiFi, Private Balcony, Bathtub');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsData = await adminService.getDashboardStats();
      setStats(statsData);

      const uList = await adminService.getUsers();
      setUsersList(uList);

      const hList = await hotelService.getAll();
      setHotelsList(hList);

      const bList = await adminService.getBookings();
      // Sort bookings descending by creation date
      setBookingsList(bList.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));

      // Fetch all rooms dynamically from the backend for each hotel
      try {
        const roomsPromises = hList.map(hotel => roomService.getByHotelId(hotel.id));
        const roomsResults = await Promise.all(roomsPromises);
        const combinedRooms = roomsResults.flat();
        setRoomsList(combinedRooms);
      } catch (roomErr) {
        console.warn('Could not fetch active rooms dynamically from backend:', roomErr);
        // Fallback to localStorage mock rooms
        const db = JSON.parse(localStorage.getItem('hcl_booking_db'));
        setRoomsList(db?.rooms || []);
      }
      
      // Default parent hotel selector to first hotel
      if (hList.length > 0) setRoomHotelId(hList[0].id);

    } catch (err) {
      console.error('Failed to retrieve administrator metrics:', err);
      showAlert('Authorization failure or API issue.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // ==========================================
  // USER ACTIONS
  // ==========================================
  const toggleBlockUser = async (userId, blocked) => {
    try {
      if (blocked) {
        await adminService.unblockUser(userId);
        showAlert('User successfully unblocked.', 'success');
      } else {
        await adminService.blockUser(userId);
        showAlert('User account has been blocked.', 'warning');
      }
      fetchAdminData();
    } catch (err) {
      showAlert(err.message || 'Action failed.', 'error');
    }
  };

  // ==========================================
  // HOTEL ACTIONS
  // ==========================================
  const openAddHotel = () => {
    setCurrentHotel(null);
    setHotelName('');
    setHotelDesc('');
    setHotelLoc('');
    setHotelRating('4.8');
    setHotelImage('');
    setHotelAmenities('Free WiFi, Pool, Spa, Restaurant');
    setHotelFormOpen(true);
  };

  const openEditHotel = (hotel) => {
    setCurrentHotel(hotel);
    setHotelName(hotel.name);
    setHotelDesc(hotel.description);
    setHotelLoc(hotel.location);
    setHotelRating(hotel.rating.toString());
    setHotelImage(hotel.image);
    setHotelAmenities(hotel.amenities.join(', '));
    setHotelFormOpen(true);
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    const cleanAmenities = hotelAmenities.split(',').map(a => a.trim()).filter(Boolean);

    try {
      const payload = {
        name: hotelName,
        description: hotelDesc,
        location: hotelLoc,
        rating: parseFloat(hotelRating),
        image: hotelImage,
        amenities: cleanAmenities,
      };

      if (currentHotel) {
        await adminService.updateHotel(currentHotel.id, payload);
        showAlert('Hotel details successfully updated.', 'success');
      } else {
        await adminService.createHotel(payload);
        showAlert('New hotel successfully listed in directory.', 'success');
      }
      setHotelFormOpen(false);
      fetchAdminData();
    } catch (err) {
      showAlert(err.message || 'Hotel submission failed.', 'error');
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this hotel? WARNING: This deletes all rooms associated with this hotel!');
    if (!confirmDelete) return;

    try {
      await adminService.deleteHotel(hotelId);
      showAlert('Hotel successfully deleted.', 'info');
      fetchAdminData();
    } catch (err) {
      showAlert(err.message || 'Hotel deletion failed.', 'error');
    }
  };

  // ==========================================
  // ROOM ACTIONS
  // ==========================================
  const openAddRoom = () => {
    setCurrentRoom(null);
    setRoomName('');
    setRoomType('DELUXE');
    setRoomPrice('');
    setRoomCapacity('2');
    setRoomImage('');
    setRoomAmenities('Free WiFi, Private Balcony, Bathtub');
    setRoomFormOpen(true);
  };

  const openEditRoom = (room) => {
    setCurrentRoom(room);
    setRoomHotelId(room.hotelId);
    setRoomName(room.name);
    setRoomType(room.type);
    setRoomPrice(room.price.toString());
    setRoomCapacity(room.capacity.toString());
    setRoomImage(room.image);
    setRoomAmenities(room.amenities.join(', '));
    setRoomFormOpen(true);
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    const cleanAmenities = roomAmenities.split(',').map(a => a.trim()).filter(Boolean);

    try {
      const payload = {
        hotelId: roomHotelId,
        name: roomName,
        type: roomType,
        price: parseFloat(roomPrice),
        capacity: parseInt(roomCapacity, 10),
        image: roomImage,
        amenities: cleanAmenities,
      };

      if (currentRoom) {
        await adminService.updateRoom(currentRoom.id, payload);
        showAlert('Room details updated.', 'success');
      } else {
        await adminService.createRoom(payload);
        showAlert('New room successfully listed.', 'success');
      }
      setRoomFormOpen(false);
      fetchAdminData();
    } catch (err) {
      showAlert(err.message || 'Room submission failed.', 'error');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this room?');
    if (!confirmDelete) return;

    try {
      await adminService.deleteRoom(roomId);
      showAlert('Room successfully deleted.', 'info');
      fetchAdminData();
    } catch (err) {
      showAlert(err.message || 'Room deletion failed.', 'error');
    }
  };

  // ==========================================
  // BOOKING OVERRIDE ACTIONS
  // ==========================================
  const handleCancelBookingOverride = async (bookingId) => {
    const confirmCancel = window.confirm('ADMIN OVERRIDE: Are you sure you want to cancel this booking?');
    if (!confirmCancel) return;

    try {
      await adminService.cancelBooking(bookingId);
      showAlert('Booking administratively cancelled.', 'success');
      fetchAdminData();
    } catch (err) {
      showAlert(err.message || 'Booking cancellation failed.', 'error');
    }
  };

  if (loading) {
    return <Loader message="Opening secure administration portals..." />;
  }

  return (
    <div className="container animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Panel</h1>
        <p style={styles.subtitle}>Audit properties, rooms, users, and guest reservations.</p>
      </div>

      {/* Main Tabs Navigation */}
      <div style={styles.tabsRow} className="card-glass">
        <button onClick={() => setActiveTab('overview')} style={{ ...styles.tabBtn, color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'overview' ? '2px solid var(--primary)' : '2px solid transparent' }}>
          <BarChart3 size={16} /> Overview
        </button>
        <button onClick={() => setActiveTab('users')} style={{ ...styles.tabBtn, color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'users' ? '2px solid var(--primary)' : '2px solid transparent' }}>
          <Users size={16} /> Guest Accounts
        </button>
        <button onClick={() => setActiveTab('hotels')} style={{ ...styles.tabBtn, color: activeTab === 'hotels' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'hotels' ? '2px solid var(--primary)' : '2px solid transparent' }}>
          <Hotel size={16} /> Hotels Manager
        </button>
        <button onClick={() => setActiveTab('rooms')} style={{ ...styles.tabBtn, color: activeTab === 'rooms' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'rooms' ? '2px solid var(--primary)' : '2px solid transparent' }}>
          <Plus size={16} /> Rooms Manager
        </button>
        <button onClick={() => setActiveTab('bookings')} style={{ ...styles.tabBtn, color: activeTab === 'bookings' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'bookings' ? '2px solid var(--primary)' : '2px solid transparent' }}>
          <CreditCard size={16} /> Reservations Log
        </button>
      </div>

      {/* ==========================================
          TAB 1: OVERVIEW INDEX
          ========================================== */}
      {activeTab === 'overview' && stats && (
        <div style={styles.tabContent} className="animate-slide-up">
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard} className="card-glass">
              <CreditCard size={28} color="var(--primary)" />
              <div style={styles.metricText}>
                <span style={styles.metricLabel}>Total Revenue</span>
                <span style={styles.metricVal}>${stats.totalRevenue.toLocaleString()}</span>
              </div>
            </div>

            <div style={styles.metricCard} className="card-glass">
              <Users size={28} color="var(--success)" />
              <div style={styles.metricText}>
                <span style={styles.metricLabel}>Active Guests</span>
                <span style={styles.metricVal}>{stats.totalUsers}</span>
              </div>
            </div>

            <div style={styles.metricCard} className="card-glass">
              <Hotel size={28} color="var(--info)" />
              <div style={styles.metricText}>
                <span style={styles.metricLabel}>Active Resorts</span>
                <span style={styles.metricVal}>{stats.totalHotels}</span>
              </div>
            </div>

            <div style={styles.metricCard} className="card-glass">
              <Sparkles size={28} color="var(--secondary)" />
              <div style={styles.metricText}>
                <span style={styles.metricLabel}>Total Reservations</span>
                <span style={styles.metricVal}>{stats.totalBookings}</span>
              </div>
            </div>
          </div>

          {/* Styled SVG Revenue Graph representation */}
          <div style={{ ...styles.tableCard, marginTop: '30px', padding: '30px' }} className="card-glass">
            <h3 style={styles.tableTitle}>Recent Booking Volume analytics</h3>
            <div style={styles.graphContainer}>
              {stats.dailyStats.map((day, idx) => (
                <div key={idx} style={styles.graphBarColumn}>
                  <div style={styles.barTooltip}>${day.revenue}</div>
                  <div style={{ ...styles.graphBar, height: `${Math.min(100, (day.revenue / Math.max(1, stats.totalRevenue)) * 200 + 40)}%` }}></div>
                  <span style={styles.graphBarDate}>{day.date.substring(5)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: GUEST ACCOUNTS
          ========================================== */}
      {activeTab === 'users' && (
        <div style={styles.tabContent} className="animate-slide-up">
          <div style={styles.tableCard} className="card-glass">
            <h3 style={styles.tableTitle}>Global Guest Accounts database</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email Address</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Created Date</th>
                    <th style={styles.th}>Account State</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((usr) => (
                    <tr key={usr.id} style={styles.tbRow}>
                      <td style={styles.td}><strong>{usr.name}</strong></td>
                      <td style={styles.td}>{usr.email}</td>
                      <td style={styles.td}>
                        <span className={`badge ${usr.role === 'ADMIN' ? 'badge-danger' : 'badge-info'}`}>
                          {usr.role}
                        </span>
                      </td>
                      <td style={styles.td}>{usr.createdAt || '2026-01-15'}</td>
                      <td style={styles.td}>
                        <span className={`badge ${usr.blocked ? 'badge-danger' : 'badge-success'}`}>
                          {usr.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {usr.role !== 'ADMIN' && (
                          <button
                            onClick={() => toggleBlockUser(usr.id, usr.blocked)}
                            style={{
                              ...styles.actionBtn,
                              color: usr.blocked ? 'var(--success)' : 'var(--danger)',
                            }}
                            title={usr.blocked ? 'Unblock user' : 'Block user'}
                          >
                            {usr.blocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: HOTELS MANAGER
          ========================================== */}
      {activeTab === 'hotels' && (
        <div style={styles.tabContent} className="animate-slide-up">
          <div style={styles.actionHeader}>
            <button onClick={openAddHotel} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add New Resort
            </button>
          </div>

          <div style={styles.tableCard} className="card-glass">
            <h3 style={styles.tableTitle}>Resorts Directory</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Hotel Image</th>
                    <th style={styles.th}>Resort Name</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Rating</th>
                    <th style={styles.th}>Amenities preset</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hotelsList.map((ht) => (
                    <tr key={ht.id} style={styles.tbRow}>
                      <td style={styles.td}>
                        <img src={ht.image} alt={ht.name} style={styles.rowImg} />
                      </td>
                      <td style={styles.td}><strong>{ht.name}</strong></td>
                      <td style={styles.td}>{ht.location}</td>
                      <td style={styles.td}>★ {ht.rating.toFixed(1)}</td>
                      <td style={styles.td}>{ht.amenities.slice(0, 3).join(', ')}...</td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => openEditHotel(ht)} style={{ ...styles.actionBtn, color: 'var(--primary)' }} title="Edit hotel">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleDeleteHotel(ht.id)} style={{ ...styles.actionBtn, color: 'var(--danger)' }} title="Delete hotel">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Form for Add/Edit Hotel */}
          {hotelFormOpen && (
            <div style={styles.modalOverlay} className="animate-fade-in">
              <div style={styles.modalContent} className="card-glass">
                <div style={styles.modalHeader}>
                  <h3>{currentHotel ? 'Edit Hotel Info' : 'List New Resort'}</h3>
                  <button onClick={() => setHotelFormOpen(false)} style={styles.closeModalBtn}>
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleHotelSubmit}>
                  <div style={styles.formGrid}>
                    <div className="form-group">
                      <label className="form-label">Hotel Name</label>
                      <input type="text" value={hotelName} onChange={(e) => setHotelName(e.target.value)} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input type="text" value={hotelLoc} onChange={(e) => setHotelLoc(e.target.value)} className="form-input" placeholder="e.g. Bali, Indonesia" required />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                      <label className="form-label">Resort Image URL</label>
                      <input type="text" value={hotelImage} onChange={(e) => setHotelImage(e.target.value)} className="form-input" placeholder="https://unsplash..." required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Initial Rating</label>
                      <input type="number" step="0.1" min="1" max="5" value={hotelRating} onChange={(e) => setHotelRating(e.target.value)} className="form-input" required />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                      <label className="form-label">Amenities (Comma separated list)</label>
                      <input type="text" value={hotelAmenities} onChange={(e) => setHotelAmenities(e.target.value)} className="form-input" required />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                      <label className="form-label">Detailed Description</label>
                      <textarea value={hotelDesc} onChange={(e) => setHotelDesc(e.target.value)} className="form-input" style={{ minHeight: '100px' }} required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                    {currentHotel ? 'Save Changes' : 'List Resort'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 4: ROOMS MANAGER
          ========================================== */}
      {activeTab === 'rooms' && (
        <div style={styles.tabContent} className="animate-slide-up">
          <div style={styles.actionHeader}>
            <button onClick={openAddRoom} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add New Room Tier
            </button>
          </div>

          <div style={styles.tableCard} className="card-glass">
            <h3 style={styles.tableTitle}>Rooms Inventory</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Room Image</th>
                    <th style={styles.th}>Room Name</th>
                    <th style={styles.th}>Room Type</th>
                    <th style={styles.th}>Nightly price</th>
                    <th style={styles.th}>Capacity</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roomsList.map((rm) => {
                    const parentHotel = hotelsList.find(h => h.id === rm.hotelId);
                    return (
                      <tr key={rm.id} style={styles.tbRow}>
                        <td style={styles.td}>
                          <img src={rm.image} alt={rm.name} style={styles.rowImg} />
                        </td>
                        <td style={styles.td}>
                          <strong>{rm.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>At {parentHotel?.name || 'Unknown Hotel'}</div>
                        </td>
                        <td style={styles.td}>{rm.type}</td>
                        <td style={styles.td}><strong>${rm.price}</strong></td>
                        <td style={styles.td}>{rm.capacity} Guests</td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => openEditRoom(rm)} style={{ ...styles.actionBtn, color: 'var(--primary)' }} title="Edit room">
                              <Edit2 size={15} />
                            </button>
                            <button onClick={() => handleDeleteRoom(rm.id)} style={{ ...styles.actionBtn, color: 'var(--danger)' }} title="Delete room">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Form for Add/Edit Room */}
          {roomFormOpen && (
            <div style={styles.modalOverlay} className="animate-fade-in">
              <div style={styles.modalContent} className="card-glass">
                <div style={styles.modalHeader}>
                  <h3>{currentRoom ? 'Edit Room Info' : 'List New Room Tier'}</h3>
                  <button onClick={() => setRoomFormOpen(false)} style={styles.closeModalBtn}>
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleRoomSubmit}>
                  <div style={styles.formGrid}>
                    <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                      <label className="form-label">Parent Hotel Property</label>
                      <select value={roomHotelId} onChange={(e) => setRoomHotelId(e.target.value)} className="form-input" style={{ cursor: 'pointer' }} required>
                        {hotelsList.map(h => (
                          <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Room/Suite Name</label>
                      <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} className="form-input" placeholder="e.g. Deluxe Sky Suite" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Room Type</label>
                      <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="form-input" style={{ cursor: 'pointer' }} required>
                        <option value="SINGLE">SINGLE</option>
                        <option value="DOUBLE">DOUBLE</option>
                        <option value="SUITE">SUITE</option>
                        <option value="DELUXE">DELUXE</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                      <label className="form-label">Room Image URL</label>
                      <input type="text" value={roomImage} onChange={(e) => setRoomImage(e.target.value)} className="form-input" placeholder="https://unsplash..." required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nightly Rate ($)</label>
                      <input type="number" value={roomPrice} onChange={(e) => setRoomPrice(e.target.value)} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Max Occupancy</label>
                      <input type="number" min="1" max="10" value={roomCapacity} onChange={(e) => setRoomCapacity(e.target.value)} className="form-input" required />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                      <label className="form-label">Amenities (Comma separated list)</label>
                      <input type="text" value={roomAmenities} onChange={(e) => setRoomAmenities(e.target.value)} className="form-input" required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                    {currentRoom ? 'Save Changes' : 'Create Room Tier'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 5: RESERVATIONS LOG
          ========================================== */}
      {activeTab === 'bookings' && (
        <div style={styles.tabContent} className="animate-slide-up">
          <div style={styles.tableCard} className="card-glass">
            <h3 style={styles.tableTitle}>Global Guest Reservations</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Booking ID</th>
                    <th style={styles.th}>Guest Name</th>
                    <th style={styles.th}>Resort & Room</th>
                    <th style={styles.th}>Stay Dates</th>
                    <th style={styles.th}>Balance</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Override</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsList.map((bk) => (
                    <tr key={bk.id} style={styles.tbRow}>
                      <td style={styles.td}>#{bk.id}</td>
                      <td style={styles.td}><strong>{bk.userName}</strong></td>
                      <td style={styles.td}>
                        {bk.hotelName}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bk.roomName}</div>
                      </td>
                      <td style={styles.td}>
                        {bk.checkIn} &bull; {bk.checkOut}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bk.guests} Guests</div>
                      </td>
                      <td style={styles.td}><strong>${bk.totalPrice.toFixed(2)}</strong></td>
                      <td style={styles.td}>
                        <span className={`badge ${bk.status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`}>
                          {bk.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {bk.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleCancelBookingOverride(bk.id)}
                            style={{ ...styles.actionBtn, color: 'var(--danger)' }}
                            title="Administratively cancel reservation"
                          >
                            <Ban size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '20px',
    textAlign: 'left',
  },
  header: {
    marginBottom: '32px',
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
  tabContent: {
    width: '100%',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
  },
  metricCard: {
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: 'var(--shadow-md)',
  },
  metricText: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  metricVal: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: 'var(--text-heading)',
    fontFamily: 'var(--font-heading)',
  },
  graphContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '240px',
    padding: '20px 10px 0',
    borderBottom: '2px solid var(--border-color)',
  },
  graphBarColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  graphBar: {
    width: '60%',
    maxWidth: '45px',
    background: 'linear-gradient(to top, var(--primary) 0%, var(--secondary) 100%)',
    borderRadius: '6px 6px 0 0',
    minHeight: '10px',
    transition: 'all 0.5s ease',
    cursor: 'pointer',
  },
  barTooltip: {
    position: 'absolute',
    top: '-20px',
    fontSize: '0.7rem',
    backgroundColor: 'var(--text-heading)',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 600,
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  graphBarDate: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    marginTop: '8px',
    fontWeight: 500,
  },
  tableCard: {
    borderRadius: '20px',
    border: '1px solid var(--border-color)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-md)',
  },
  tableTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    padding: '24px 24px 16px',
    textAlign: 'left',
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.875rem',
  },
  thRow: {
    borderBottom: '2px solid var(--border-color)',
    backgroundColor: 'rgba(99, 102, 241, 0.02)',
  },
  th: {
    padding: '16px 24px',
    fontWeight: 700,
    color: 'var(--text-heading)',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
  },
  tbRow: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background 0.2s',
  },
  td: {
    padding: '16px 24px',
    color: 'var(--text-main)',
  },
  rowImg: {
    width: '56px',
    height: '44px',
    borderRadius: '6px',
    objectFit: 'cover',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  actionHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '16px',
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(5px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '560px',
    padding: '30px',
    boxShadow: 'var(--shadow-lg)',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: '20px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  closeModalBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    textAlign: 'left',
  },
};

// Add responsive breaks for Graph hover effect
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    div[class*="graphBar"]:hover + span {
      color: var(--primary) !important;
      font-weight: 700 !important;
    }
    div[class*="graphBarColumn"]:hover div[class*="barTooltip"] {
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(styleSheet);
}

export default AdminDashboard;
