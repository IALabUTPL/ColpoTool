// src/components/auth/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />; // Redirige al login si no hay token
  }
  return <>{children}</>; // Muestra las rutas hijas si está autenticado
};

export default PrivateRoute;
