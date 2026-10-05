import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function InventoryList({ empresaId, refreshKey, onEmpresaChange }) {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [marcas, setMarcas] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [marcaId, setMarcaId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [empresaId, refreshKey]);

  async function fetchData() {
    try {
      setLoading(true);
      setErrorMsg("");

      const [invRes, catRes, provRes, marcRes] = await Promise.all([
        supabase.from("productos").select("*").eq("empresa_id", empresaId).order("id", { ascending: false }),
        supabase.from("categorias").select("*").eq("empresa_id", empresaId),
        supabase.from("proveedores").select("*").eq("empresa_id", empresaId),
        supabase.from("marcas").select("*").eq("empresa_id", empresaId)
      ]);

      if (invRes.error) throw invRes.error;

      setItems(invRes.data || []);
      setCategorias(catRes.data || []);
      setProveedores(provRes.data || []);
      setMarcas(marcRes.data || []);
    } catch (err) {
      console.error("Error al cargar datos:", err.message);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim()) return;

    try {
      const payload = {
        empresa_id: empresaId,
        nombre,
        categoria_id: categoriaId ? Number(categoriaId) : null,
        proveedor_id: proveedorId ? Number(proveedorId) : null,
        marca_id: marcaId ? Number(marcaId) : null,
        cantidad: parseInt(cantidad) || 0,
        precio: parseFloat(precio) || 0,
      };

      if (editingId) {
        const { error } = await supabase.from("productos").update(payload).eq("id", editingId);
        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase.from("productos").insert([payload]);
        if (error) throw error;
      }

      setNombre("");
      setCategoriaId("");
      setProveedorId("");
      setMarcaId("");
      setCantidad("");
      setPrecio("");

      fetchData();
    } catch (err) {
      console.error("Error al guardar producto:", err.message);
      alert("Error al guardar: " + err.message);
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setNombre(item.nombre || "");
    setCategoriaId(item.categoria_id || "");
    setProveedorId(item.proveedor_id || "");
    setMarcaId(item.marca_id || "");
    setCantidad(item.cantidad || "");
    setPrecio(item.precio || "");
  }

  async function handleDelete(id) {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error("Error al eliminar:", err.message);
      alert("Error al eliminar: " + err.message);
    }
  }

  const totalArticulos = items.reduce((acc, curr) => acc + (Number(curr.cantidad) || 0), 0);
  const valorTotalInventario = items.reduce((acc, curr) => acc + ((Number(curr.cantidad) || 0) * (Number(curr.precio) || 0)), 0);
  const variedadProductos = items.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Métricas Superiores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', margin: '0 0 8px 0', letterSpacing: '0.05em' }}>Total de Artículos</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{totalArticulos}</p>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', margin: '0 0 8px 0', letterSpacing: '0.05em' }}>Valor Total del Inventario</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>${valorTotalInventario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', margin: '0 0 8px 0', letterSpacing: '0.05em' }}>Variedad de Productos</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{variedadProductos}</p>
        </div>
      </div>

      {/* Grid Principal */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* Formulario */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', marginTop: 0 }}>
            {editingId ? "✏️ Editar Producto" : "➕ Agregar Producto"}
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>Nombre del producto</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Laptop Pro"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>Categoría</label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box', cursor: 'pointer' }}
              >
                <option value="">-- Seleccionar Categoría --</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>Proveedor</label>
              <select
                value={proveedorId}
                onChange={(e) => setProveedorId(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box', cursor: 'pointer' }}
              >
                <option value="">-- Seleccionar Proveedor --</option>
                {proveedores.map(prov => (
                  <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>Marca</label>
              <select
                value={marcaId}
                onChange={(e) => setMarcaId(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box', cursor: 'pointer' }}
              >
                <option value="">-- Seleccionar Marca --</option>
                {marcas.map(marc => (
                  <option key={marc.id} value={marc.id}>{marc.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>Cantidad / Stock</label>
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder="Ej. 10"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>Precio ($)</label>
              <input
                type="number"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej. 299.99"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                type="submit"
                style={{ flex: 1, backgroundColor: '#4f46e5', color: '#ffffff', fontWeight: 'bold', padding: '11px', borderRadius: '10px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}
              >
                {editingId ? "Actualizar" : "Guardar"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setNombre("");
                    setCategoriaId("");
                    setProveedorId("");
                    setMarcaId("");
                    setCantidad("");
                    setPrecio("");
                  }}
                  style={{ backgroundColor: '#e2e8f0', color: '#475569', fontWeight: 'bold', padding: '11px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla Lista de Inventario */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', minWidth: 0 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', marginTop: 0 }}>
            Lista de Inventario
          </h3>

          {loading ? (
            <p style={{ color: '#64748b', fontSize: '14px' }}>Cargando inventario...</p>
          ) : errorMsg ? (
            <p style={{ color: '#ef4444', fontSize: '14px' }}>Error: {errorMsg}</p>
          ) : items.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '14px' }}>No hay productos registrados para esta empresa.</p>
          ) : (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '12px 10px' }}>Nombre</th>
                    <th style={{ padding: '12px 10px' }}>Categoría</th>
                    <th style={{ padding: '12px 10px' }}>Proveedor</th>
                    <th style={{ padding: '12px 10px' }}>Marca</th>
                    <th style={{ padding: '12px 10px' }}>Cantidad</th>
                    <th style={{ padding: '12px 10px' }}>Precio ($)</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const catNombre = categorias.find(c => c.id === item.categoria_id)?.nombre || '-';
                    const provNombre = proveedores.find(p => p.id === item.proveedor_id)?.nombre || '-';
                    const marcNombre = marcas.find(m => m.id === item.marca_id)?.nombre || '-';

                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                        <td style={{ padding: '14px 10px', fontWeight: 'bold' }}>{item.nombre}</td>
                        <td style={{ padding: '14px 10px', color: '#64748b' }}>{catNombre}</td>
                        <td style={{ padding: '14px 10px', color: '#64748b' }}>{provNombre}</td>
                        <td style={{ padding: '14px 10px', color: '#64748b' }}>{marcNombre}</td>
                        <td style={{ padding: '14px 10px' }}>{item.cantidad}</td>
                        <td style={{ padding: '14px 10px', fontWeight: 'bold' }}>${Number(item.precio || 0).toFixed(2)}</td>
                        <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleEdit(item)}
                            style={{ backgroundColor: '#d97706', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', marginRight: '6px' }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}