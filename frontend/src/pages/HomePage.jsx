import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

function HomePage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        // Guardar token en localStorage
        localStorage.setItem('jwtToken', token);

        alert('Login exitoso!');
        // Redirigir, por ejemplo, al dashboard
        navigate('/dashboard');
      } else {
        alert('Usuario o contraseña inválidos');
      }
    } catch (err) {
      console.error(err);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Bienvenido a Tienda Génesis</h1>
        <p className="auth-subtitle">
          Por favor, inicia sesión para acceder a la plataforma.
        </p>

        <form onSubmit={handleLogin} className="auth-form">
          <label className="auth-label">Usuario</label>
          <input 
            type="text"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu usuario"
          />

          <label className="auth-label">Contraseña</label>
          <input 
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
          />

          <button type="submit" className="auth-button">Iniciar Sesión</button>
        </form>

        <div className="auth-footer">
          <span>¿No tienes cuenta?</span>
          <Link to="/register" className="auth-link">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
