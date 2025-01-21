import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      if (response.ok) {
        alert('Usuario registrado con éxito, por favor inicia sesión.');
        // Redirigir a la página de login
        navigate('/');
      } else {
        const errorMsg = await response.text();
        alert(`Error: ${errorMsg}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error al registrar usuario');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Crea tu cuenta</h1>
        <p className="auth-subtitle">
          ¡Regístrate y comienza a gestionar Tienda Genesis!
        </p>

        <form onSubmit={handleRegister} className="auth-form">
          <label className="auth-label">Usuario</label>
          <input
            type="text"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu usuario"
          />

          <label className="auth-label">Correo</label>
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo"
          />

          <label className="auth-label">Contraseña</label>
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crea una contraseña"
          />

          <button type="submit" className="auth-button">Registrarse</button>
        </form>

        <div className="auth-footer">
          <span>¿Ya tienes cuenta?</span>
          <Link to="/" className="auth-link">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
