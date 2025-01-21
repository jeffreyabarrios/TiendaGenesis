import React from 'react';
import '../styles/navbar.css';

function Navbar() {
    const token = localStorage.getItem('jwtToken');
    const PrivateMenu = () => {
        return (
            <>
                <li><a href="/dashboard">Home</a></li>
                <li><a href="/churrascos">Platillos</a></li>
                <li><a href="/combos">Combos</a></li>
                <li><a href="/dulces">Dulcería</a></li>
                <li><a href="/inventario">Inventario</a></li>
            </>
        );
    };

  return (
    <nav className="navbar">
      <div className="logo">Tienda Genesis</div>
      <ul className="nav-links">
        {token ? <PrivateMenu /> : null}
      </ul>
    </nav>
  );
}

export default Navbar;
