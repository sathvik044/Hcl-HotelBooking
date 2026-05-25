import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HotelListing from './pages/HotelListing';
import HotelDetails from './pages/HotelDetails';
import RoomDetails from './pages/RoomDetails';
import Booking from './pages/Booking';
import BookingHistory from './pages/BookingHistory';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Alert from './components/Alert';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Transparent glass header navigation */}
        <Navbar />

        {/* Global Toast Alerts notification system */}
        <Alert />

        {/* Dynamic primary content body */}
        <main style={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/hotels" element={<HotelListing />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/rooms/:roomId" element={<RoomDetails />} />

            {/* Protected User Routes */}
            <Route 
              path="/booking" 
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings/user/:userId" 
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />

            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

        {/* Cohesive luxury brand Footer */}
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

const styles = {
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '65vh',
  },
};

export default App;
