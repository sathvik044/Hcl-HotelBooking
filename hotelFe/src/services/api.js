import axios from 'axios';

// Define base URL for backend APIs (in our case it's /api)
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hcl_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag to force mock mode if backend is not active or for testing
const USE_MOCK_FALLBACK = false;

// Initialize Mock Database in localStorage if it doesn't exist
const initializeMockDB = () => {
  if (localStorage.getItem('hcl_booking_db')) return;

  const mockDB = {
    users: [
      {
        id: 'u-1',
        name: 'Sarah Jenkins',
        email: 'user@hotel.com',
        password: 'password',
        role: 'USER',
        blocked: false,
        createdAt: '2026-01-15',
      },
      {
        id: 'u-2',
        name: 'Alex Rivera (Admin)',
        email: 'admin@hotel.com',
        password: 'password',
        role: 'ADMIN',
        blocked: false,
        createdAt: '2026-01-10',
      },
    ],
    hotels: [
      {
        id: 'h-1',
        name: 'The Ritz-Carlton Bali',
        description: 'Experience a luxurious beachfront resort with private pools and breathtaking Indian Ocean views. Set in Nusa Dua, this cliffside sanctuary blends modern sophistication with legendary Balinese hospitality.',
        location: 'Bali, Indonesia',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
        amenities: ['Free WiFi', 'Infinity Pool', 'Luxury Spa', 'Beach Access', 'Fitness Center', 'Fine Dining'],
      },
      {
        id: 'h-2',
        name: 'Amangiri Canyon Resort',
        description: 'A secluded architectural marvel blended seamlessly into Southern Utahs dramatic desert canyons. Featuring minimalist, glass-fronted pavilion suites overlooking striking mesas and ancient valleys.',
        location: 'Utah, USA',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        amenities: ['Free WiFi', 'Desert Pool', 'Hammam Spa', 'Mesa Views', 'Airport Shuttle', 'Lounge Bar'],
      },
      {
        id: 'h-3',
        name: 'Chalet Riffelalp Peak',
        description: 'A spectacular alpine lodge nestled at 2,222m height directly facing the majestic Matterhorn peak. Enjoy ski-in ski-out access and the highest heated outdoor spa in Europe.',
        location: 'Zermatt, Switzerland',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80',
        amenities: ['Free WiFi', 'Heated Pool', 'Ski Access', 'Matterhorn View', 'Steam Room', 'Stone Fireplace'],
      },
      {
        id: 'h-4',
        name: 'Marrakech Sands Riad',
        description: 'A tranquil oasis in the heart of the bustling Medina featuring hand-carved arches, aromatic citrus trees, and a peaceful mosaic courtyard pool. Unwind on the rooftop overlooking the Atlas mountains.',
        location: 'Marrakech, Morocco',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
        amenities: ['Free WiFi', 'Courtyard Pool', 'Traditional Hammam', 'Rooftop Terrace', 'Breakfast Included'],
      },
    ],
    rooms: [
      // Ritz-Carlton Bali Rooms
      {
        id: 'r-1',
        hotelId: 'h-1',
        name: 'Oceanfront Pavilion Villa',
        type: 'Deluxe Villa',
        price: 450,
        capacity: 2,
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
        amenities: ['Private Plunge Pool', 'Direct Beach Path', 'Marble Bath', '24/7 Butler Service', 'Free WiFi'],
        available: true,
      },
      {
        id: 'r-2',
        hotelId: 'h-1',
        name: 'Premium Lagoon Access Suite',
        type: 'Lagoon Suite',
        price: 320,
        capacity: 3,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
        amenities: ['Swim-up Lagoon Access', 'Private Balcony', 'Deep Soaking Tub', 'Espresso Machine', 'Free WiFi'],
        available: true,
      },
      // Amangiri Canyon Rooms
      {
        id: 'r-3',
        hotelId: 'h-2',
        name: 'Desert View Pool Suite',
        type: 'Mesa Suite',
        price: 850,
        capacity: 2,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        amenities: ['Private Pool', 'Outdoor Sky Terrace', 'Desert View Hearth', 'Sunken Lounge', 'Free WiFi'],
        available: true,
      },
      {
        id: 'r-4',
        hotelId: 'h-2',
        name: 'Mesa Terrace King Suite',
        type: 'Terrace Suite',
        price: 650,
        capacity: 2,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
        amenities: ['Scenic Canyon Deck', 'Outdoor Shower', 'Plush King Bed', 'Mini Bar Included', 'Free WiFi'],
        available: true,
      },
      // Chalet Riffelalp Rooms
      {
        id: 'r-5',
        hotelId: 'h-3',
        name: 'Matterhorn Panorama Suite',
        type: 'Alpine Suite',
        price: 520,
        capacity: 3,
        image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
        amenities: ['Matterhorn Balcony', 'Wood Burning Stove', 'Rain Shower', 'Local Alpine Snacks', 'Free WiFi'],
        available: true,
      },
      {
        id: 'r-6',
        hotelId: 'h-3',
        name: 'Standard Alpine Twin Room',
        type: 'Standard Room',
        price: 290,
        capacity: 2,
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
        amenities: ['Forest View Balcony', 'Ski Storage Locker', 'Fluffy Robes', 'Satellite TV', 'Free WiFi'],
        available: true,
      },
      // Marrakech Sands Riad Rooms
      {
        id: 'r-7',
        hotelId: 'h-4',
        name: 'Royal Moroccan Arch Suite',
        type: 'Royal Suite',
        price: 240,
        capacity: 4,
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
        amenities: ['Hand-painted Ceilings', 'Private Riad Salon', 'Fireplace', 'Free Traditional Breakfast', 'Free WiFi'],
        available: true,
      },
      {
        id: 'r-8',
        hotelId: 'h-4',
        name: 'Comfort Courtyard Queen',
        type: 'Standard Room',
        price: 130,
        capacity: 2,
        image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=80',
        amenities: ['Courtyard Window View', 'Carved Cedar Decor', 'Organic Body Products', 'Plush Queen Bed', 'Free WiFi'],
        available: true,
      },
    ],
    bookings: [
      {
        id: 'bk-1',
        userId: 'u-1',
        userName: 'Sarah Jenkins',
        hotelId: 'h-1',
        hotelName: 'The Ritz-Carlton Bali',
        roomId: 'r-2',
        roomName: 'Premium Lagoon Access Suite',
        checkIn: '2026-06-10',
        checkOut: '2026-06-15',
        guests: 2,
        totalPrice: 1600,
        status: 'CONFIRMED',
        createdAt: '2026-05-01',
      },
      {
        id: 'bk-2',
        userId: 'u-1',
        userName: 'Sarah Jenkins',
        hotelId: 'h-3',
        hotelName: 'Chalet Riffelalp Peak',
        roomId: 'r-6',
        roomName: 'Standard Alpine Twin Room',
        checkIn: '2026-02-14',
        checkOut: '2026-02-18',
        guests: 2,
        totalPrice: 1160,
        status: 'CONFIRMED',
        createdAt: '2026-01-20',
      },
    ],
  };

  localStorage.setItem('hcl_booking_db', JSON.stringify(mockDB));
};

initializeMockDB();

// Read and write helper functions for LocalStorage Mock DB
const getMockData = () => JSON.parse(localStorage.getItem('hcl_booking_db'));
const saveMockData = (data) => localStorage.setItem('hcl_booking_db', JSON.stringify(data));

// Safely convert amenities from string to array and map Room DTO properties centrally
const ensureAmenitiesAsArray = (data) => {
  if (!data) return data;
  
  const parseSingle = (item) => {
    if (item && typeof item === 'object') {
      // 1. Format Amenities if present
      if (item.hasOwnProperty('amenities')) {
        if (typeof item.amenities === 'string') {
          item.amenities = item.amenities.split(',').map(s => s.trim()).filter(Boolean);
        } else if (!item.amenities) {
          item.amenities = [];
        }
      }
      
      // 2. Map Room DTO properties to frontend component expectations
      if (item.hasOwnProperty('roomType') || item.hasOwnProperty('pricePerNight')) {
        if (item.roomType && !item.type) {
          item.type = item.roomType;
        }
        if (!item.name) {
          const rawType = item.roomType || 'DELUXE';
          item.name = rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase() + " Room";
        }
        if (item.pricePerNight !== undefined && item.price === undefined) {
          item.price = item.pricePerNight;
        }
        if (item.availableRooms !== undefined && item.available === undefined) {
          item.available = item.availableRooms > 0;
        }
        if (!item.image) {
          item.image = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
        }
      }

      // 3. Also format rooms nested in hotels if they are returned inside hotels
      if (item.hasOwnProperty('rooms') && Array.isArray(item.rooms)) {
        item.rooms = item.rooms.map(room => {
          if (room && typeof room === 'object') {
            if (typeof room.amenities === 'string') {
              room.amenities = room.amenities.split(',').map(s => s.trim()).filter(Boolean);
            } else if (!room.amenities) {
              room.amenities = [];
            }
            if (room.roomType && !room.type) {
              room.type = room.roomType;
            }
            if (!room.name) {
              const rawType = room.roomType || 'DELUXE';
              room.name = rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase() + " Room";
            }
            if (room.pricePerNight !== undefined && room.price === undefined) {
              room.price = room.pricePerNight;
            }
            if (room.availableRooms !== undefined && room.available === undefined) {
              room.available = room.availableRooms > 0;
            }
            if (!room.image) {
              room.image = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
            }
          }
          return room;
        });
      }
    }
    return item;
  };

  if (Array.isArray(data)) {
    return data.map(parseSingle);
  }
  return parseSingle(data);
};

// State Helper: check if backend is running by attempting to ping, else fallback.
// In actual use, we wrap each service function in a try-catch. If it fails due to network, we perform mock operations.
const handleServiceCall = async (apiCall, mockHandler) => {
  if (USE_MOCK_FALLBACK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(ensureAmenitiesAsArray(mockHandler()));
      }, 350); // Simulate network latency
    });
  }

  try {
    const response = await apiCall();
    return ensureAmenitiesAsArray(response.data);
  } catch (error) {
    // Check if the backend responded with an error (e.g. 400 Bad Request, 401, 404, 500)
    if (error.response && error.response.data) {
      const errMsg = error.response.data.message || error.response.data.error || 'Server error occurred';
      console.error('API responded with error payload:', errMsg);
      const customErr = new Error(errMsg);
      customErr.errorCode = error.response.data.errorCode;
      customErr.status = error.response.data.status;
      throw customErr;
    }
    
    // Only fall back to local mock storage in case of real network connection errors
    console.warn('API call failed due to network, falling back to LocalStorage Mock DB:', error);
    return ensureAmenitiesAsArray(mockHandler());
  }
};

// ==========================================
// 1. AUTH API SERVICES
// ==========================================

export const authService = {
  register: async (userData) => {
    const backendData = {
      username: userData.name,
      email: userData.email,
      password: userData.password
    };

    const performRealApi = async () => {
      const authRes = await api.post('/auth/register', backendData);
      const token = authRes.data.token;
      localStorage.setItem('hcl_auth_token', token);
      
      // Fetch user profile immediately using the newly acquired token
      const userRes = await api.get('/users/me');
      localStorage.setItem('hcl_current_user', JSON.stringify(userRes.data));
      
      return { data: { token, user: userRes.data } };
    };

    return handleServiceCall(
      performRealApi,
      () => {
        const db = getMockData();
        const emailExists = db.users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
        if (emailExists) {
          throw new Error('An account with this email already exists.');
        }

        const newUser = {
          id: 'u-' + (db.users.length + 1),
          name: userData.name,
          email: userData.email,
          password: userData.password, // In-memory mock only, plain string
          role: userData.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER',
          blocked: false,
          createdAt: new Date().toISOString().split('T')[0],
        };

        db.users.push(newUser);
        saveMockData(db);

        // Generate mock token
        const mockToken = `mock-jwt-token-for-${newUser.id}`;
        localStorage.setItem('hcl_auth_token', mockToken);
        localStorage.setItem('hcl_current_user', JSON.stringify(newUser));

        return { token: mockToken, user: newUser };
      }
    );
  },

  login: async (credentials) => {
    const backendData = {
      username: credentials.email,
      password: credentials.password
    };

    const performRealApi = async () => {
      const authRes = await api.post('/auth/login', backendData);
      const token = authRes.data.token;
      localStorage.setItem('hcl_auth_token', token);
      
      // Fetch user profile immediately using the newly acquired token
      const userRes = await api.get('/users/me');
      localStorage.setItem('hcl_current_user', JSON.stringify(userRes.data));
      
      return { data: { token, user: userRes.data } };
    };

    return handleServiceCall(
      performRealApi,
      () => {
        const db = getMockData();
        const user = db.users.find(
          u => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
        );

        if (!user) {
          throw new Error('Invalid email or password.');
        }

        if (user.blocked) {
          throw new Error('Your account has been blocked. Please contact support.');
        }

        const mockToken = `mock-jwt-token-for-${user.id}`;
        localStorage.setItem('hcl_auth_token', mockToken);
        localStorage.setItem('hcl_current_user', JSON.stringify(user));

        return { token: mockToken, user };
      }
    );
  },

  logout: async () => {
    // Attempt backend call but clear tokens regardless
    try {
      if (!USE_MOCK_FALLBACK) await api.post('/auth/logout');
    } catch (e) {
      console.warn('Backend logout failed/unavailable.');
    }
    localStorage.removeItem('hcl_auth_token');
    localStorage.removeItem('hcl_current_user');
    return { success: true };
  },
};

// ==========================================
// 2. USER API SERVICES
// ==========================================

export const userService = {
  getMe: async () => {
    return handleServiceCall(
      () => api.get('/users/me'),
      () => {
        const currentUser = JSON.parse(localStorage.getItem('hcl_current_user'));
        if (!currentUser) throw new Error('Unauthorized');
        
        // Re-fetch from mock database to get fresh state (e.g. blocked or edit status)
        const db = getMockData();
        const user = db.users.find(u => u.id === currentUser.id);
        if (!user) throw new Error('User not found');
        if (user.blocked) throw new Error('User blocked');

        return user;
      }
    );
  },

  updateProfile: async (id, profileData) => {
    return handleServiceCall(
      () => api.put(`/users/${id}`, profileData),
      () => {
        const db = getMockData();
        const index = db.users.findIndex(u => u.id === id);
        if (index === -1) throw new Error('User not found');

        // Check if email changed and is taken
        if (profileData.email && profileData.email.toLowerCase() !== db.users[index].email.toLowerCase()) {
          const emailExists = db.users.some(u => u.id !== id && u.email.toLowerCase() === profileData.email.toLowerCase());
          if (emailExists) throw new Error('Email is already taken by another account');
        }

        // Update fields
        db.users[index] = {
          ...db.users[index],
          ...profileData,
        };

        saveMockData(db);

        // Update localStorage session if it is the current user
        const currentUser = JSON.parse(localStorage.getItem('hcl_current_user'));
        if (currentUser && currentUser.id === id) {
          localStorage.setItem('hcl_current_user', JSON.stringify(db.users[index]));
        }

        return db.users[index];
      }
    );
  },
};

// ==========================================
// 3. HOTELS API SERVICES
// ==========================================

export const hotelService = {
  getAll: async () => {
    return handleServiceCall(
      () => api.get('/hotels'),
      () => {
        const db = getMockData();
        return db.hotels;
      }
    );
  },

  getById: async (id) => {
    return handleServiceCall(
      () => api.get(`/hotels/${id}`),
      () => {
        const db = getMockData();
        const hotel = db.hotels.find(h => h.id === id);
        if (!hotel) throw new Error('Hotel not found');
        return hotel;
      }
    );
  },

  searchHotels: async (filters) => {
    return handleServiceCall(
      () => api.get('/hotels/search', { params: filters }),
      () => {
        const db = getMockData();
        let results = [...db.hotels];

        // Search by location or hotel name
        if (filters.query || filters.location) {
          const q = (filters.query || filters.location).toLowerCase();
          results = results.filter(
            h => h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q)
          );
        }

        // Search based on guest count capacity in rooms
        if (filters.guests) {
          const guestCount = parseInt(filters.guests, 10);
          const hotelIdsWithCapacity = db.rooms
            .filter(r => r.capacity >= guestCount)
            .map(r => r.hotelId);
          results = results.filter(h => hotelIdsWithCapacity.includes(h.id));
        }

        return results;
      }
    );
  },
};

// ==========================================
// 4. ROOMS API SERVICES
// ==========================================

export const roomService = {
  getByHotelId: async (hotelId) => {
    return handleServiceCall(
      () => api.get(`/rooms/hotel/${hotelId}`),
      () => {
        const db = getMockData();
        return db.rooms.filter(r => r.hotelId === hotelId);
      }
    );
  },

  getById: async (roomId) => {
    return handleServiceCall(
      () => api.get(`/rooms/${roomId}`),
      () => {
        const db = getMockData();
        const room = db.rooms.find(r => r.id === roomId);
        if (!room) throw new Error('Room not found');
        return room;
      }
    );
  },
};

// ==========================================
// 5. BOOKINGS API SERVICES
// ==========================================

export const bookingService = {
  create: async (bookingData) => {
    const backendData = {
      userId: bookingData.userId,
      roomId: bookingData.roomId,
      hotelId: bookingData.hotelId,
      checkInDate: bookingData.checkIn,
      checkOutDate: bookingData.checkOut,
      numberOfRooms: bookingData.numberOfRooms || 1,
      numberOfGuests: bookingData.guests || 1,
      specialRequests: bookingData.specialRequests || ""
    };
    return handleServiceCall(
      () => api.post('/bookings', backendData),
      () => {
        const db = getMockData();
        
        // Validation: verify hotel and room exists
        const hotel = db.hotels.find(h => h.id === bookingData.hotelId);
        const room = db.rooms.find(r => r.id === bookingData.roomId);

        if (!hotel || !room) throw new Error('Invalid hotel or room reference');

        const newBooking = {
          id: 'bk-' + (db.bookings.length + 100),
          userId: bookingData.userId,
          userName: bookingData.userName || 'Anonymous',
          hotelId: bookingData.hotelId,
          hotelName: hotel.name,
          roomId: bookingData.roomId,
          roomName: room.name,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: parseInt(bookingData.guests, 10),
          totalPrice: parseFloat(bookingData.totalPrice),
          status: 'CONFIRMED',
          createdAt: new Date().toISOString().split('T')[0],
        };

        db.bookings.push(newBooking);
        saveMockData(db);
        return newBooking;
      }
    );
  },

  getByUserId: async (userId) => {
    return handleServiceCall(
      () => api.get(`/bookings/user/${userId}`),
      () => {
        const db = getMockData();
        // Fetch active bookings
        return db.bookings.filter(b => b.userId === userId && b.status === 'CONFIRMED');
      }
    );
  },

  getHistoryByUserId: async (userId) => {
    return handleServiceCall(
      () => api.get(`/bookings/history/${userId}`),
      () => {
        const db = getMockData();
        // Return all bookings (confirmed and cancelled) for history
        return db.bookings.filter(b => b.userId === userId);
      }
    );
  },

  cancel: async (id) => {
    return handleServiceCall(
      () => api.put(`/bookings/cancel/${id}`),
      () => {
        const db = getMockData();
        const index = db.bookings.findIndex(b => b.id === id);
        if (index === -1) throw new Error('Booking not found');

        db.bookings[index].status = 'CANCELLED';
        saveMockData(db);
        return db.bookings[index];
      }
    );
  },
};

// ==========================================
// 6. ADMIN API SERVICES
// ==========================================

export const adminService = {
  // GET /api/admin/dashboard
  getDashboardStats: async () => {
    return handleServiceCall(
      () => api.get('/admin/dashboard'),
      () => {
        const db = getMockData();
        const totalRevenue = db.bookings
          .filter(b => b.status === 'CONFIRMED')
          .reduce((sum, b) => sum + b.totalPrice, 0);

        const totalUsers = db.users.filter(u => u.role === 'USER').length;
        const totalHotels = db.hotels.length;
        const totalBookings = db.bookings.length;

        // Group revenue by day for visual graph helper
        const revenueByDay = {};
        db.bookings.filter(b => b.status === 'CONFIRMED').forEach(b => {
          revenueByDay[b.createdAt] = (revenueByDay[b.createdAt] || 0) + b.totalPrice;
        });

        const dailyStats = Object.keys(revenueByDay).map(date => ({
          date,
          revenue: revenueByDay[date],
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        return {
          totalRevenue,
          totalUsers,
          totalHotels,
          totalBookings,
          activeRoomsCount: db.rooms.filter(r => r.available).length,
          blockedUsersCount: db.users.filter(u => u.blocked).length,
          dailyStats: dailyStats.slice(-7), // Last 7 metrics
        };
      }
    );
  },

  // GET /api/admin/users
  getUsers: async () => {
    return handleServiceCall(
      () => api.get('/admin/users'),
      () => {
        const db = getMockData();
        return db.users;
      }
    );
  },

  // GET /api/admin/users/{id}
  getUserById: async (id) => {
    return handleServiceCall(
      () => api.get(`/admin/users/${id}`),
      () => {
        const db = getMockData();
        const user = db.users.find(u => u.id === id);
        if (!user) throw new Error('User not found');
        return user;
      }
    );
  },

  // PUT /api/admin/users/block/{id}
  blockUser: async (id) => {
    return handleServiceCall(
      () => api.put(`/admin/users/block/${id}`),
      () => {
        const db = getMockData();
        const index = db.users.findIndex(u => u.id === id);
        if (index === -1) throw new Error('User not found');
        if (db.users[index].role === 'ADMIN') throw new Error('Cannot block an administrator account');

        db.users[index].blocked = true;
        saveMockData(db);
        return db.users[index];
      }
    );
  },

  // PUT /api/admin/users/unblock/{id}
  unblockUser: async (id) => {
    return handleServiceCall(
      () => api.put(`/admin/users/unblock/${id}`),
      () => {
        const db = getMockData();
        const index = db.users.findIndex(u => u.id === id);
        if (index === -1) throw new Error('User not found');

        db.users[index].blocked = false;
        saveMockData(db);
        return db.users[index];
      }
    );
  },

  // POST /api/admin/hotels
  createHotel: async (hotelData) => {
    const backendData = {
      name: hotelData.name,
      description: hotelData.description,
      location: hotelData.location,
      address: hotelData.address || hotelData.location || "Default Address",
      city: hotelData.city || (hotelData.location ? hotelData.location.split(',')[0] : "Default City"),
      amenities: Array.isArray(hotelData.amenities) ? hotelData.amenities.join(', ') : hotelData.amenities || "",
      rating: parseFloat(hotelData.rating || 5.0),
      image: hotelData.image || undefined
    };
    return handleServiceCall(
      () => api.post('/admin/hotels', backendData),
      () => {
        const db = getMockData();
        const newHotel = {
          id: 'h-' + (db.hotels.length + 1),
          name: hotelData.name,
          description: hotelData.description,
          location: hotelData.location,
          rating: parseFloat(hotelData.rating || 5.0),
          image: hotelData.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          amenities: hotelData.amenities || ['Free WiFi'],
        };

        db.hotels.push(newHotel);
        saveMockData(db);
        return newHotel;
      }
    );
  },

  // PUT /api/admin/hotels/{id}
  updateHotel: async (id, hotelData) => {
    const backendData = {
      name: hotelData.name,
      description: hotelData.description,
      location: hotelData.location,
      address: hotelData.address || (hotelData.location ? hotelData.location : undefined),
      city: hotelData.city || (hotelData.location ? hotelData.location.split(',')[0] : undefined),
      amenities: Array.isArray(hotelData.amenities) ? hotelData.amenities.join(', ') : hotelData.amenities,
      rating: hotelData.rating ? parseFloat(hotelData.rating) : undefined,
      image: hotelData.image || undefined
    };
    return handleServiceCall(
      () => api.put(`/admin/hotels/${id}`, backendData),
      () => {
        const db = getMockData();
        const index = db.hotels.findIndex(h => h.id === id);
        if (index === -1) throw new Error('Hotel not found');

        db.hotels[index] = {
          ...db.hotels[index],
          ...hotelData,
        };

        saveMockData(db);
        return db.hotels[index];
      }
    );
  },

  // DELETE /api/admin/hotels/{id}
  deleteHotel: async (id) => {
    return handleServiceCall(
      () => api.delete(`/admin/hotels/${id}`),
      () => {
        const db = getMockData();
        db.hotels = db.hotels.filter(h => h.id !== id);
        // Also remove rooms associated with this hotel
        db.rooms = db.rooms.filter(r => r.hotelId !== id);
        saveMockData(db);
        return { success: true };
      }
    );
  },

  // POST /api/admin/rooms
  createRoom: async (roomData) => {
    const backendData = {
      hotelId: roomData.hotelId,
      roomType: (roomData.type || roomData.name || "DELUXE").toUpperCase(),
      capacity: parseInt(roomData.capacity, 10) || 2,
      pricePerNight: parseFloat(roomData.price),
      description: roomData.description || roomData.name || "",
      amenities: Array.isArray(roomData.amenities) ? roomData.amenities.join(', ') : roomData.amenities || "",
      totalRooms: parseInt(roomData.totalRooms, 10) || 10
    };
    return handleServiceCall(
      () => api.post('/admin/rooms', backendData),
      () => {
        const db = getMockData();
        const newRoom = {
          id: 'r-' + (db.rooms.length + 100),
          hotelId: roomData.hotelId,
          name: roomData.name,
          type: roomData.type,
          price: parseFloat(roomData.price),
          capacity: parseInt(roomData.capacity, 10),
          image: roomData.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
          amenities: roomData.amenities || ['Free WiFi'],
          available: true,
        };

        db.rooms.push(newRoom);
        saveMockData(db);
        return newRoom;
      }
    );
  },

  // PUT /api/admin/rooms/{id}
  updateRoom: async (id, roomData) => {
    const backendData = {
      roomType: roomData.type || roomData.name ? (roomData.type || roomData.name).toUpperCase() : undefined,
      capacity: roomData.capacity ? parseInt(roomData.capacity, 10) : undefined,
      pricePerNight: roomData.price ? parseFloat(roomData.price) : undefined,
      description: roomData.description,
      amenities: Array.isArray(roomData.amenities) ? roomData.amenities.join(', ') : roomData.amenities,
      totalRooms: roomData.totalRooms ? parseInt(roomData.totalRooms, 10) : undefined,
      availableRooms: roomData.availableRooms ? parseInt(roomData.availableRooms, 10) : undefined,
      isActive: roomData.isActive !== undefined ? roomData.isActive : undefined
    };
    return handleServiceCall(
      () => api.put(`/admin/rooms/${id}`, backendData),
      () => {
        const db = getMockData();
        const index = db.rooms.findIndex(r => r.id === id);
        if (index === -1) throw new Error('Room not found');

        db.rooms[index] = {
          ...db.rooms[index],
          ...roomData,
        };

        saveMockData(db);
        return db.rooms[index];
      }
    );
  },

  // DELETE /api/admin/rooms/{id}
  deleteRoom: async (id) => {
    return handleServiceCall(
      () => api.delete(`/admin/rooms/${id}`),
      () => {
        const db = getMockData();
        db.rooms = db.rooms.filter(r => r.id !== id);
        saveMockData(db);
        return { success: true };
      }
    );
  },

  // GET /api/admin/bookings
  getBookings: async () => {
    return handleServiceCall(
      () => api.get('/admin/bookings'),
      () => {
        const db = getMockData();
        return db.bookings;
      }
    );
  },

  // GET /api/admin/bookings/{id}
  getBookingById: async (id) => {
    return handleServiceCall(
      () => api.get(`/admin/bookings/${id}`),
      () => {
        const db = getMockData();
        const booking = db.bookings.find(b => b.id === id);
        if (!booking) throw new Error('Booking not found');
        return booking;
      }
    );
  },

  // PUT /api/admin/bookings/cancel/{id}
  cancelBooking: async (id) => {
    return handleServiceCall(
      () => api.put(`/admin/bookings/cancel/${id}`),
      () => {
        const db = getMockData();
        const index = db.bookings.findIndex(b => b.id === id);
        if (index === -1) throw new Error('Booking not found');

        db.bookings[index].status = 'CANCELLED';
        saveMockData(db);
        return db.bookings[index];
      }
    );
  },
};
