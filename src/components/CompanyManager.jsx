import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function CompanyManager({ onEmpresaChange, empresaId }) {
  const [empresas, setEmpresas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchEmpresas();
  }, []);

  async function fetchEmpresas() {
    try {
      setLoading(true);
      setErrorMsg("");
      const { data, error } = await supabase.from("empresas").select("*").order("id", { ascending: false });
      if (error) throw error;
      setEmpresas(data || []);
    } catch (err) {
      console.error("Error al cargar empresas:", err.message);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim()) return;

    try {
      if (editingId) {
        const { error } = await supabase.from("empresas").update({ nombre, telefono }).eq("id", editingId);
        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase.from("empresas").insert([{ nombre, telefono }]);
        if (error) throw error;
      }

      setNombre("");
      setTelefono("");
      fetchEmpresas();
    } catch (err) {
      console.error("Error al guardar empresa:", err.message);
      alert("Error al guardar: " + err.message);
    }
  }

  function handleEdit(emp) {
    setEditingId(emp.id);
    setNombre(emp.nombre || "");
    setTelefono(emp.telefono || "");
  }

  async function handleDelete(id) {
    if (!confirm("¿Estás seguro de eliminar esta empresa? Se borrarán sus datos asociados.")) return;

    try {
      const { error } = await supabase.from("empresas").delete().eq("id", id);
      if (error) throw error;
      fetchEmpresas();
    } catch (err) {
      console.error("Error al eliminar:", err.message);
      alert("Error al eliminar: " + err.message);
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
      
      {/* Formulario Nueva / Editar Empresa */}
      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', marginTop: 0 }}>
          {editingId ? "✏️ Editar Empresa" : "Nueva Empresa"}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>Nombre de la Empresa</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Distribuidora San Carlos"
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>Teléfono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej. +503 2222-3333"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '11px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
              }}
            >
              {editingId ? "Actualizar Empresa" : "Registrar Empresa"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNombre("");
                  setTelefono("");
                }}
                style={{ backgroundColor: '#e2e8f0', color: '#475569', fontWeight: 'bold', padding: '11px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista / Selección de Empresa Activa */}
      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', minWidth: 0 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', marginTop: 0 }}>
          Seleccionar Empresa Activa
        </h3>

        {loading ? (
          <p style={{ color: '#64748b', fontSize: '14px' }}>Cargando empresas...</p>
        ) : errorMsg ? (
          <p style={{ color: '#ef4444', fontSize: '14px' }}>Error: {errorMsg}</p>
        ) : empresas.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '14px' }}>No hay empresas registradas. Crea una a la izquierda.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {empresas.map((emp) => {
              const isActive = Number(empresaId) === Number(emp.id);
              return (
                <div
                  key={emp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: isActive ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                    backgroundColor: isActive ? '#f8fafc' : '#ffffff',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {emp.nombre}
                      </span>
                      {isActive && (
                        <span style={{ fontSize: '11px', backgroundColor: '#4f46e5', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>
                          Activa
                        </span>
                      )}
                    </div>
                    {emp.telefono && (
                      <span style={{ fontSize: '13px', color: '#475569' }}>
                        📞 {emp.telefono}
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      ID de Empresa: {emp.id}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
                    <button
                      onClick={() => onEmpresaChange(emp.id)}
                      style={{ backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Seleccionar
                    </button>
                    <button
                      onClick={() => handleEdit(emp)}
                      style={{ backgroundColor: '#d97706', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}