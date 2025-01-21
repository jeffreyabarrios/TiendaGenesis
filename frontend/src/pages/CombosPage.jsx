import React, { useState, useEffect } from 'react';
import '../styles/combos.css';

function CombosPage() {
  // Lista de churrascos familiares
  const [familiares, setFamiliares] = useState([]);

  // Lista de combos existentes
  const [combos, setCombos] = useState([]);

  const [categoria, setCategoria] = useState('familiar'); // 'familiar', 'eventos', 'personalizado'
  const [nombreCombo, setNombreCombo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cajasDulces, setCajasDulces] = useState(1);

  // IDs de churrascos seleccionados
  const [selectedChurrascos, setSelectedChurrascos] = useState([]);
  const [dropdownChurrasco, setDropdownChurrasco] = useState('');

  useEffect(() => {
    loadFamiliares();
    loadCombos();
  }, []);

  const loadFamiliares = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/churrascos');
      const data = await res.json();
      // Filtrar solo los familiares.. NumeroPorciones >= 3
      const fam = data.filter(ch => ch.numeroPorciones >= 3);
      setFamiliares(fam);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCombos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/combos');
      const data = await res.json();
      setCombos(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Manejar cambio de categoría
  const handleCategoriaChange = (value) => {
    setCategoria(value);

    if (value === 'familiar') {
      // 1 churrasco, 1 caja
      setCajasDulces(1);
      setSelectedChurrascos([]);
      setNombreCombo('Combo Familiar');
      setDescripcion('1 plato familiar + 1 caja de dulces');
    } else if (value === 'eventos') {
      // 3 churrascos, 2 cajas
      setCajasDulces(2);
      setSelectedChurrascos([]);
      setNombreCombo('Combo para Eventos');
      setDescripcion('3 platos familiares + 2 cajas de dulces');
    } else {
      // personalizado
      setCajasDulces(1);
      setSelectedChurrascos([]);
      setNombreCombo('');
      setDescripcion('');
    }
    setDropdownChurrasco('');
  };

  const handleSelectChurrasco = (e) => {
    setDropdownChurrasco(e.target.value);
  };

  const handleAddChurrasco = () => {
    if (!dropdownChurrasco) {
      alert('Selecciona un churrasco del dropdown.');
      return;
    }
    const churrascoId = parseInt(dropdownChurrasco);

    // Verificar si ya está agregado
    if (selectedChurrascos.includes(churrascoId)) {
      alert('Este churrasco ya está agregado.');
      return;
    }

    // Reglas para "familiar" o "eventos"
    if (categoria === 'familiar') {
      // Solo 1 churrasco
      if (selectedChurrascos.length >= 1) {
        alert('Solo puedes agregar 1 churrasco familiar para un Combo Familiar.');
        return;
      }
    }
    else if (categoria === 'eventos') {
      // 3 churrascos
      if (selectedChurrascos.length >= 3) {
        alert('Solo puedes agregar 3 churrascos familiares para un Combo para Eventos.');
        return;
      }
    }

    setSelectedChurrascos([...selectedChurrascos, churrascoId]);
  };

  // Quitar un churrasco de la lista
  const handleRemoveChurrasco = (id) => {
    setSelectedChurrascos(selectedChurrascos.filter(x => x !== id));
  };

  // Crear combo
  const handleCreateCombo = async (e) => {
    e.preventDefault();

    if (categoria === 'familiar') {
      if (selectedChurrascos.length !== 1) {
        alert('Debes tener exactamente 1 churrasco en Combo Familiar.');
        return;
      }
      if (cajasDulces !== 1) {
        alert('Debes tener 1 caja de dulces en Combo Familiar.');
        return;
      }
    } else if (categoria === 'eventos') {
      if (selectedChurrascos.length !== 3) {
        alert('Debes tener exactamente 3 churrascos en Combo para Eventos.');
        return;
      }
      if (cajasDulces !== 2) {
        alert('Debes tener 2 cajas de dulces en Combo para Eventos.');
        return;
      }
    }

    const body = {
      nombre: nombreCombo || 'Combo sin nombre',
      descripcion: descripcion || '',
      cajasDulces,
      churrascosFamiliaresIds: selectedChurrascos
    };

    try {
      const res = await fetch('http://localhost:5000/api/combos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert('Combo creado con éxito');
        // Reset
        setCategoria('familiar');
        setNombreCombo('Combo Familiar');
        setDescripcion('1 plato familiar + 1 caja de dulces');
        setCajasDulces(1);
        setSelectedChurrascos([]);
        setDropdownChurrasco('');
        loadCombos();
      } else {
        const errMsg = await res.text();
        alert('Error al crear combo: ' + errMsg);
      }
    } catch (err) {
      console.error(err);
      alert('Error al crear combo');
    }
  };

  // Obtener nombre del churrasco para mostrar la etiqueta
  const getChurrascoName = (id) => {
    const c = familiares.find(f => f.id === id);
    return c ? c.nombrePlato : `Churrasco #${id}`;
  };

  const handleDeleteCombo = async (comboId) => {
    const confirmed = window.confirm('¿Seguro que deseas eliminar este combo?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/combos/${comboId}`, {
        method: 'DELETE'
      });
      if (response.ok || response.status === 204) {
        setCombos(combos.filter(c => c.id !== comboId));
      } else {
        const errorMsg = await response.text();
        alert('Error al eliminar combo: ' + errorMsg);
      }
    } catch (error) {
      console.error(error);
      alert('Error al eliminar combo');
    }
  };

  return (
    <div className="combos-container">
      <h1 className="combos-title">Gestión de Combos</h1>

      <div className="combos-form-section">
        <h2 className="combos-subtitle">Crear nuevo Combo</h2>

        <form onSubmit={handleCreateCombo} className="combos-form">
          <label className="combos-label">Categoría:</label>
          <div className="combos-radios">
            <label>
              <input 
                type="radio"
                value="familiar"
                checked={categoria === 'familiar'}
                onChange={(e) => handleCategoriaChange(e.target.value)}
              />
              Combo Familiar
            </label>
            <label>
              <input 
                type="radio"
                value="eventos"
                checked={categoria === 'eventos'}
                onChange={(e) => handleCategoriaChange(e.target.value)}
              />
              Combo para Eventos
            </label>
            <label>
              <input 
                type="radio"
                value="personalizado"
                checked={categoria === 'personalizado'}
                onChange={(e) => handleCategoriaChange(e.target.value)}
              />
              Combo Personalizado
            </label>
          </div>

          <label className="combos-label">Nombre del combo:</label>
          <input 
            type="text"
            className="combos-input"
            value={nombreCombo}
            onChange={(e) => setNombreCombo(e.target.value)}
          />

          <label className="combos-label">Descripción:</label>
          <input 
            type="text"
            className="combos-input"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <label className="combos-label">Cajas de dulces:</label>
          <input 
            type="number"
            className="combos-input"
            value={cajasDulces}
            onChange={(e) => setCajasDulces(parseInt(e.target.value) || 1)}
            disabled={categoria !== 'personalizado'}
          />

          <label className="combos-label">Seleccionar churrasco familiar:</label>
          <div className="add-churrasco-row">
            <select
              className="combos-input combos-dropdown"
              value={dropdownChurrasco}
              onChange={handleSelectChurrasco}
            >
              <option value="">-- Selecciona --</option>
              {familiares.map(ch => (
                <option key={ch.id} value={ch.id}>
                  {ch.nombrePlato} (Porciones: {ch.numeroPorciones})
                </option>
              ))}
            </select>
            <button 
              type="button" 
              className="combos-add-button"
              onClick={handleAddChurrasco}
            >
              Agregar
            </button>
          </div>

          <div className="selected-churrascos-list">
            {selectedChurrascos.map(id => (
              <div key={id} className="churrasco-tag">
                <span>{getChurrascoName(id)}</span>
                <button 
                  type="button"
                  className="remove-tag-button"
                  onClick={() => handleRemoveChurrasco(id)}
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="combos-button">
            Crear Combo
          </button>
        </form>
      </div>

      <hr className="combos-divider" />

      <h2 className="combos-subtitle">Listado de Combos</h2>
      <div className="combos-list">
        {combos.map(combo => (
          <div key={combo.id} className="combo-card">
            <h3 className="combo-card-title">{combo.nombre}</h3>
            <p>{combo.descripcion}</p>
            <p>Cajas de dulces: {combo.cajasDulces}</p>
            {combo.churrascosEnCombo && combo.churrascosEnCombo.map(cc => (
              <div key={cc.id} className="combo-churrasco-info">
                <p>Churrasco: {cc.churrasco?.nombrePlato} 
                  (Porciones: {cc.churrasco?.numeroPorciones})
                </p>
              </div>
            ))}

            {/* Botón de eliminar combo */}
            <button 
              className="churrasco-delete-button"
              onClick={() => handleDeleteCombo(combo.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CombosPage;
