import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';

const StaffProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useStaffAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '2px solid rgba(201,168,76,0.2)', borderTopColor: '#c9a84c' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default StaffProtectedRoute;
