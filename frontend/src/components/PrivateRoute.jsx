import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('jwtToken');
  // Si NO existe token, redirige a /unauthorized
  if (!token) {
    return <Navigate to="/unauthorized" />;
  }

  // Si existe token, renderiza la ruta protegida
  return children;
}

export default PrivateRoute;
