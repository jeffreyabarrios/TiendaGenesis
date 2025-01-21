import React, { useEffect, useState } from 'react';
import '../styles/inventario.css';

function InventarioPage() {
  const [items, setItems] = useState([]);

  const [editItemId, setEditItemId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [editUnidad, setEditUnidad] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/inventario');
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error(error);
      alert('Error al cargar inventario');
    }
  };

  const getItemsByCategory = (cat) => {
    return items.filter(i => i.categoria === cat);
  };

  const handleEditClick = (item) => {
    setEditItemId(item.id);
    setEditQuantity(item.cantidad);
    setEditUnidad(item.unidadMedida);
  };

  const handleCancel = () => {
    setEditItemId(null);
    setEditQuantity(0);
    setEditUnidad('');
  };

  const handleSave = async (itemId) => {
    const body = {
      id: itemId, // no es obligatorio, solo si lo usas en PUT
      cantidad: editQuantity,
      unidadMedida: editUnidad
    };

    try {
      const res = await fetch(`http://localhost:5000/api/inventario/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        // Se guardó con éxito.. recargar la lista
        await loadInventory();
        // Salir de  edición
        handleCancel();
      } else {
        const errMsg = await res.text();
        alert('Error al actualizar inventario: ' + errMsg);
      }
    } catch (err) {
      console.error(err);
      alert('Error al actualizar inventario');
    }
  };

  const renderCategoryRows = (category) => {
    const catItems = getItemsByCategory(category);

    if (catItems.length === 0) {
      return <p className="inventory-empty">No hay ítems en esta categoría.</p>;
    }

    return catItems.map(item => {
      const isEditing = (editItemId === item.id);

      return (
        <div key={item.id} className="inventory-item-row">
          <span className="inventory-item-name">{item.nombre}</span>

          {isEditing ? (
            <>
              <input
                type="number"
                className="inventory-input"
                value={editQuantity}
                onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
              />
              <input
                type="text"
                className="inventory-input"
                value={editUnidad}
                onChange={(e) => setEditUnidad(e.target.value)}
              />
              <button 
                className="inventory-save-button"
                onClick={() => handleSave(item.id)}
              >
                Guardar
              </button>
              <button 
                className="inventory-cancel-button"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <span className="inventory-quantity">{item.cantidad}</span>
              <span className="inventory-unit">{item.unidadMedida}</span>
              <button 
                className="inventory-edit-button"
                onClick={() => handleEditClick(item)}
              >
                Editar
              </button>
            </>
          )}
        </div>
      );
    });
  };

  return (
    <div className="inventory-container">
      <h1 className="inventory-title">Inventario</h1>

      <div className="inventory-category-section">
        <h2 className="inventory-subtitle">Carnes</h2>
        {renderCategoryRows("Carne")}
      </div>

      <div className="inventory-category-section">
        <h2 className="inventory-subtitle">Guarniciones</h2>
        {renderCategoryRows("Guarnicion")}
      </div>

      <div className="inventory-category-section">
        <h2 className="inventory-subtitle">Dulces</h2>
        {renderCategoryRows("Dulce")}
      </div>

      <div className="inventory-category-section">
        <h2 className="inventory-subtitle">Cajas y Empaques</h2>
        {renderCategoryRows("Empaque")}
      </div>

      <div className="inventory-category-section">
        <h2 className="inventory-subtitle">Carbón y leña</h2>
        {renderCategoryRows("Combustible")}
      </div>
    </div>
  );
}

export default InventarioPage;
