import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-church-600" size={40} />
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated users to login, preserving their intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !(user.role === 'Pastor' || user.role === 'Leader')) {
    // Redirect authenticated but unauthorized users
    return <Navigate to="/portal" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
