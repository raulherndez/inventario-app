import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function InventoryList({ refreshKey: externalRefreshKey, onEdit, onDelete }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [internalRefreshKey, setInternalRefreshKey] = useState(0);

  const refreshKey = externalRefreshKey || internalRefreshKey;
  const triggerRefresh = () => setInternalRefreshKey(prev => prev + 1);

  // Estados del formulario (para Agregar o Editar)
  const [editingId, setEditingId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [proveedorId, setProveedorId] = useState('');
  const [marcaId, setMarcaId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');

  // Listas para los desplegables
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: prodData, error: prodError } = await supabase
          .from('productos')
          .select(`
            id,
            nombre,
            cantidad,
            precio,
            categoria_id,
            proveedor_id,
            marca_id,
            categorias ( id, nombre ),
            proveedores ( id, nombre ),
            marcas ( id, nombre )
          `)
          .order('id', { ascending: false });

        if (prodError) throw prodError;

        const formattedData = (prodData || []).map(item => ({
          ...item,
          categoria: item.categorias?.nombre || '-',
          proveedor: item.proveedores?.nombre || '-',
          marca: item.marcas?.nombre || '-'
        }));

        setProducts(formattedData);

        const { data: catData } = await supabase.from('categorias').select('*');
        if (catData) setCategorias(catData);

        const { data: provData } = await supabase.from('proveedores').select('*');
        if (provData) setProveedores(provData);

        const { data: marcData } = await supabase.from('marcas').select('*');
        if (marcData) setMarcas(marcData);

      } catch (error) {
        console.error('Error al cargar datos:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [refreshKey]);

  // Manejar Guardar (Insertar nuevo o Actualizar existente)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !cantidad || !precio) return;

    try {
      const productData = {
        nombre,
        cantidad: parseInt(cantidad) || 0,
        precio: parseFloat(precio) || 0,
        categoria_id: categoriaId ? parseInt(categoriaId) : null,
        proveedor_id: proveedorId ? parseInt(proveedorId) : null,
        marca_id: marcaId ? parseInt(marcaId) : null,
      };

      if (editingId) {
        // Actualizar
        const { error } = await supabase.from('productos').update(productData).eq('id', editingId);
        if (error) throw error;
      } else {
        // Insertar
        const { error } = await supabase.from('productos').insert([productData]);
        if (error) throw error;
      }

      // Limpiar formulario
      setEditingId(null);
      setNombre('');
      setCategoriaId('');
      setProveedorId('');
      setMarcaId('');
      setCantidad('');
      setPrecio('');
      triggerRefresh();
    } catch (error) {
      console.error('Error al guardar el producto:', error.message);
      alert('Hubo un error al procesar la solicitud.');
    }
  };

  // Cargar datos en el formulario para editar
  const handleStartEdit = (product) => {
    if (onEdit) {
      onEdit(product);
      return;
    }
    setEditingId(product.id);
    setNombre(product.nombre || '');
    setCategoriaId(product.categoria_id || '');
    setProveedorId(product.proveedor_id || '');
    setMarcaId(product.marca_id || '');
    setCantidad(product.cantidad || '');
    setPrecio(product.precio || '');
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (onDelete) {
      onDelete(id);
      return;
    }
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const { error } = await supabase.from('productos').delete().eq('id', id);
      if (error) throw error;
      triggerRefresh();
    } catch (error) {
      console.error('Error al eliminar:', error.message);
    }
  };

  const totalArticulos = products.reduce((acc, p) => acc + (p.cantidad || 0), 0);
  const valorTotalInventario = products.reduce((acc, p) => acc + ((p.cantidad || 0) * (p.precio || 0)), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Tarjetas de Estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Total de Artículos</p>
          <p style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: 0 }}>{totalArticulos}</p>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Valor Total del Inventario</p>
          <p style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: 0 }}>${valorTotalInventario.toFixed(2)}</p>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Variedad de Productos</p>
          <p style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: 0 }}>{products.length}</p>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Formulario (Agregar o Editar) */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
            {editingId ? 'Editar Producto' : 'Agregar Producto'}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>Nombre del producto</label>
              <input
                type="text"
                placeholder="Ej. Laptop Pro"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>Categoría</label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
              >
                <option value="">-- Seleccionar Categoría --</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>Proveedor</label>
              <select
                value={proveedorId}
                onChange={(e) => setProveedorId(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
              >
                <option value="">-- Seleccionar Proveedor --</option>
                {proveedores.map(prov => (
                  <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>Marca</label>
              <select
                value={marcaId}
                onChange={(e) => setMarcaId(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
              >
                <option value="">-- Seleccionar Marca --</option>
                {marcas.map(mar => (
                  <option key={mar.id} value={mar.id}>{mar.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>Cantidad / Stock</label>
              <input
                type="number"
                placeholder="Ej. 10"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>Precio ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ej. 99.99"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  backgroundColor: editingId ? '#d97706' : '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              >
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setNombre('');
                    setCategoriaId('');
                    setProveedorId('');
                    setMarcaId('');
                    setCantidad('');
                    setPrecio('');
                  }}
                  style={{
                    backgroundColor: '#64748b',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla de Inventario */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
            Lista de Inventario
          </h3>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>Cargando inventario...</p>
          ) : products.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>No hay productos registrados en el inventario.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
                  <th style={{ padding: '12px' }}>Nombre</th>
                  <th style={{ padding: '12px' }}>Categoría</th>
                  <th style={{ padding: '12px' }}>Proveedor</th>
                  <th style={{ padding: '12px' }}>Marca</th>
                  <th style={{ padding: '12px' }}>Cantidad</th>
                  <th style={{ padding: '12px' }}>Precio ($)</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product?.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: '600', color: '#0f172a' }}>{product?.nombre || '-'}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{product?.categoria || '-'}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{product?.proveedor || '-'}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{product?.marca || '-'}</td>
                    <td style={{ padding: '14px 12px', color: '#475569', fontWeight: 'bold' }}>{product?.cantidad ?? 0}</td>
                    <td style={{ padding: '14px 12px', color: '#0f172a', fontWeight: 'bold' }}>${Number(product?.precio || 0).toFixed(2)}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleStartEdit(product)}
                          style={{
                            backgroundColor: '#e67e22',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product?.id)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}