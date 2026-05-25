import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader message="Verifying authentication session..." />
      </div>
    );
  }

  if (!isLoggedIn) {
    // Redirect standard users to login, keeping record of location they wanted to hit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'ADMIN') {
    // Redirect unauthorized dashboard access back to the main homepage
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
