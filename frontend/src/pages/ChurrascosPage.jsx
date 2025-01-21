import React, { useEffect, useState } from 'react';
import '../styles/churrascos.css';

function ChurrascosPage() {
  const [churrascos, setChurrascos] = useState([]);

  const [modalidad, setModalidad] = useState("Individual"); 
  const [numPorciones, setNumPorciones] = useState(1);
  const [nombrePlato, setNombrePlato] = useState("");

  // cada porción = { tipoCarne, terminoCoccion, guarniciones: [] }
  const [porciones, setPorciones] = useState([]);

  // Loading states
  const [isLoadingChurrascos, setIsLoadingChurrascos] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Guarniciones definidas:
  const GUARNICIONES_OPCIONES = [
    "frijoles",
    "chile de árbol",
    "cebollín",
    "tortillas",
    "chirmol"
  ];

  useEffect(() => {
    setupPorciones(1);
    loadChurrascos();
  }, []);

  function setupPorciones(count) {
    // Si porciones < count ... agregamos
    setPorciones((prev) => {
      const copy = [...prev];
      if (copy.length < count) {
        const toAdd = count - copy.length;
        for (let i = 0; i < toAdd; i++) {
          copy.push({
            tipoCarne: "Puyazo",
            terminoCoccion: "Término medio",
            guarniciones: [] // array
          });
        }
        return copy;
      } else if (copy.length > count) {
        return copy.slice(0, count);
      }
      return copy; 
    });
  }

  async function loadChurrascos() {
    setIsLoadingChurrascos(true);
    try {
      const res = await fetch("http://localhost:5000/api/churrascos");
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setChurrascos(data);
    } catch (err) {
      alert(`Error cargando churrascos: ${err}`);
    } finally {
      setIsLoadingChurrascos(false);
    }
  }

  function handleModalidadChange(val) {
    setModalidad(val);
    if (val === "Individual") {
      setNumPorciones(1);
      setupPorciones(1);
    } else {
      setNumPorciones(3);
      setupPorciones(3);
    }
  }

  function handleNumPorcionesChange(val) {
    setNumPorciones(val);
    setupPorciones(val);
  }

  function handlePorcionChange(index, field, value) {
    setPorciones((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value
      };
      return copy;
    });
  }

  // Añadir guarnición a la porción
  function addGuarnicion(index, guarnicion) {
    setPorciones((prev) => {
      const copy = [...prev];
      const por = copy[index];
      if (!por.guarniciones.includes(guarnicion)) {
        por.guarniciones.push(guarnicion);
      }
      return copy;
    });
  }

  // Quitar guarnición
  function removeGuarnicion(index, guarn) {
    setPorciones((prev) => {
      const copy = [...prev];
      const por = copy[index];
      por.guarniciones = por.guarniciones.filter(g => g !== guarn);
      return copy;
    });
  }

  async function handleCreateChurrasco() {
    setIsCreating(true);
    const token = localStorage.getItem('jwtToken');

    try {
      const body = {
        modalidad,
        numeroPorciones: numPorciones,
        nombrePlato,
        porciones: porciones.map(p => ({
          tipoCarne: p.tipoCarne,
          terminoCoccion: p.terminoCoccion,
          guarniciones: p.guarniciones // array
        }))
      };

      const res = await fetch("http://localhost:5000/api/churrascos", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error create: ${res.status} - ${text}`);
      }
      alert("Churrasco creado con éxito.");
      loadChurrascos();

      // Reset
      setModalidad("Individual");
      setNumPorciones(1);
      setNombrePlato("");
      setPorciones([]);
      setupPorciones(1);
    } catch (err) {
      alert(`Error al crear churrasco: ${err}`);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Churrascos</h1>
      <div className="create-churrasco-card" style={cardStyle}>
        <h2>Crear nuevo Churrasco</h2>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>Modalidad: </label>
          <select
            value={modalidad}
            onChange={(e) => handleModalidadChange(e.target.value)}
          >
            <option value="Individual">Individual</option>
            <option value="Familiar">Familiar</option>
          </select>
        </div>

        {modalidad === "Familiar" && (
          <div style={{ marginBottom: "0.5rem" }}>
            <label>N° Porciones: </label>
            <select
              value={numPorciones}
              onChange={(e) =>
                handleNumPorcionesChange(parseInt(e.target.value))
              }
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
            </select>
          </div>
        )}

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Nombre del Plato: </label>
          <input
            type="text"
            value={nombrePlato}
            onChange={(e) => setNombrePlato(e.target.value)}
          />
        </div>

        <h3>Porciones</h3>
        {porciones.map((por, idx) => (
          <div key={idx} style={porcionCardStyle}>
            <p><strong>Porción #{idx + 1}</strong></p>
            <div style={{ marginBottom: "0.5rem" }}>
              <label>Tipo de Carne: </label>
              <input
                type="text"
                value={por.tipoCarne}
                onChange={(e) =>
                  handlePorcionChange(idx, "tipoCarne", e.target.value)
                }
              />
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <label>Término de Cocción: </label>
              <input
                type="text"
                value={por.terminoCoccion}
                onChange={(e) =>
                  handlePorcionChange(idx, "terminoCoccion", e.target.value)
                }
              />
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <label>Guarniciones: </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <select id={`guarn-${idx}`} >
                  {GUARNICIONES_OPCIONES.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const sel = document.getElementById(`guarn-${idx}`);
                    if (sel) {
                      addGuarnicion(idx, sel.value);
                    }
                  }}
                  style={{ backgroundColor: "#ff385c", color: "#fff", border: "none", padding: "0.3rem 0.6rem", borderRadius: "4px" }}
                >
                  Agregar
                </button>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                {por.guarniciones.map((garn) => (
                  <span key={garn} style={tagStyle}>
                    {garn}
                    <button
                      style={tagRemoveBtnStyle}
                      onClick={() => removeGuarnicion(idx, garn)}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {isCreating ? (
          <p>Cargando...</p>
        ) : (
          <button
            type="button"
            onClick={handleCreateChurrasco}
            style={createBtnStyle}
          >
            Crear Churrasco
          </button>
        )}
      </div>

      <h2>Listado de Churrascos</h2>
      {isLoadingChurrascos ? (
        <p>Cargando...</p>
      ) : (
        <div>
          {churrascos.length === 0 ? (
            <p>No hay churrascos creados.</p>
          ) : (
            churrascos.map((ch) => {
              const nombre = ch.nombrePlato || "Sin nombre";
              const mod = ch.modalidad || "";
              const por = ch.numeroPorciones || 1;
              const porArr = ch.porciones || [];
              return (
                <div key={ch.id} style={listItemStyle}>
                  <h4>{nombre}</h4>
                  <p>Modalidad: {mod}</p>
                  <p>Porciones: {por}</p>
                  {porArr.length > 0 && (
                    <>
                      <p><strong>Detalle de porciones:</strong></p>
                      {porArr.map((pp, i2) => {
                        const tc = pp.tipoCarne || "";
                        const term = pp.terminoCoccion || "";
                        // Si en la API devuelves array guarniciones o string
                        // Suponiendo array:
                        const guarnArr = pp.guarniciones || [];
                        return (
                          <p key={i2}>
                            - {tc} ({term}) |{" "}
                            {Array.isArray(guarnArr) ? guarnArr.join(", ") : guarnArr}
                          </p>
                        );
                      })}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#fff",
  padding: "1rem",
  marginBottom: "1rem",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const porcionCardStyle = {
  backgroundColor: "#f9f9f9",
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "0.5rem",
  marginBottom: "0.5rem",
};

const createBtnStyle = {
  backgroundColor: "#ff385c",
  color: "#fff",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const listItemStyle = {
  backgroundColor: "#fff",
  padding: "1rem",
  marginBottom: "0.5rem",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
};

const tagStyle = {
  display: "inline-block",
  backgroundColor: "#eee",
  borderRadius: "16px",
  padding: "0.2rem 0.6rem",
  marginRight: "0.3rem",
  marginBottom: "0.3rem",
};

const tagRemoveBtnStyle = {
  marginLeft: "6px",
  background: "none",
  border: "none",
  color: "#333",
  cursor: "pointer",
};

export default ChurrascosPage;
