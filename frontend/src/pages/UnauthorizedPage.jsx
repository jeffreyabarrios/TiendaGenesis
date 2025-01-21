import React from 'react';
import '../styles/unauthorized.css'; // hoja de estilos

function UnauthorizedPage() {
  return (
    <div className="unauth-container">
      <div className="unauth-card">
        <h1 className="unauth-title">401 - Acceso no autorizado</h1>
        <p className="unauth-message">
          No tienes permiso para acceder a esta página o el token de sesión es inválido.
        </p>
        <a href="/" className="unauth-button">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
