import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';

function Dashboard() {
  const [churrascosCount, setChurrascosCount] = useState(0);
  const [dulcesCount, setDulcesCount] = useState(0);
  const [combosCount, setCombosCount] = useState(0);
  const [inventarioCount, setInventarioCount] = useState(0);

  useEffect(() => {
    // Cargar conteo de churrascos
    fetch('http://localhost:5000/api/churrascos')
      .then(res => res.json())
      .then(data => setChurrascosCount(data.length))
      .catch(err => console.log(err));

    // Cargar conteo de dulces
    fetch('http://localhost:5000/api/dulces')
      .then(res => res.json())
      .then(data => setDulcesCount(data.length))
      .catch(err => console.log(err));

    // Cargar conteo de combos
    fetch('http://localhost:5000/api/combos')
      .then(res => res.json())
      .then(data => setCombosCount(data.length))
      .catch(err => console.log(err));

    // Cargar conteo de inventario
    fetch('http://localhost:5000/api/inventario')
      .then(res => res.json())
      .then(data => setInventarioCount(data.length))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard - Tienda Genesis</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>Churrascos</h2>
          <p>{churrascosCount}</p>
        </div>
        <div className="stat-card">
          <h2>Dulces</h2>
          <p>{dulcesCount}</p>
        </div>
        <div className="stat-card">
          <h2>Combos</h2>
          <p>{combosCount}</p>
        </div>
        <div className="stat-card">
          <h2>Inventario</h2>
          <p>{inventarioCount}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
