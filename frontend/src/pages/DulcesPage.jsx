import React, { useEffect, useState } from 'react';

function DulcesPage() {
  const [dulces, setDulces] = useState([]);
  const [newDulce, setNewDulce] = useState({ nombre: '', cantidadDisponible: 0 });

  const loadDulces = () => {
    fetch('http://localhost:5000/api/dulces')
      .then(res => res.json())
      .then(data => setDulces(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadDulces();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/dulces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDulce)
    })
    .then(() => {
      loadDulces();
      setNewDulce({ nombre: '', cantidadDisponible: 0 });
    })
    .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dulces Típicos</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre: </label>
          <input 
            type="text" 
            value={newDulce.nombre} 
            onChange={(e) => setNewDulce({ ...newDulce, nombre: e.target.value })}
          />
        </div>
        <div>
          <label>Cantidad Disponible: </label>
          <input 
            type="number" 
            value={newDulce.cantidadDisponible} 
            onChange={(e) => setNewDulce({ ...newDulce, cantidadDisponible: parseInt(e.target.value) })}
          />
        </div>
        <button type="submit">Agregar Dulce</button>
      </form>

      <h2>Listado de Dulces</h2>
      <ul>
        {dulces.map(d => (
          <li key={d.id}>
            {d.nombre} - Cantidad: {d.cantidadDisponible}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DulcesPage;
