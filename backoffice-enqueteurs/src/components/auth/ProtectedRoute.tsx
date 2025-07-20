import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="text-center">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          <p className="mt-3 text-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérification des rôles si spécifiés
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => 
      user.roles.includes(role)
    );
    
    if (!hasRequiredRole) {
      return (
        <div className="flex align-items-center justify-content-center min-h-screen">
          <div className="text-center">
            <i className="pi pi-ban text-6xl text-red-500 mb-3"></i>
            <h2 className="text-2xl font-bold text-900 mb-2">
              Accès non autorisé
            </h2>
            <p className="text-600 mb-4">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <Navigate to="/dashboard" replace />
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;