import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function InventoryList({ refreshKey, onEdit, onDelete }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        // Consultamos productos trayendo los nombres relacionados de las tablas auxiliares
        const { data, error } = await supabase
          .from('productos')
          .select(`
            id,
            nombre,
            cantidad,
            precio,
            categoria_id,
            proveedor_id,
            marca_id,
            categorias ( nombre ),
            proveedores ( nombre ),
            marcas ( nombre )
          `)
          .order('id', { ascending: false });

        if (error) throw error;

        // Mapeamos los datos para que el componente los lea de forma limpia y directa
        const formattedData = (data || []).map(item => ({
          ...item,
          categoria: item.categorias?.nombre || '-',
          proveedor: item.proveedores?.nombre || '-',
          marca: item.marcas?.nombre || '-'
        }));

        setProducts(formattedData);
      } catch (error) {
        console.error('Error al cargar la lista de inventario:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [refreshKey]);

  const list = Array.isArray(products) ? products : [];

  if (loading) {
    return (
      <div className="table-container">
        <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Lista de Inventario</h3>
        <p style={{ textAlign: 'center', color: '#666' }}>Cargando inventario...</p>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="table-container">
        <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Lista de Inventario</h3>
        <p style={{ textAlign: 'center', color: '#666' }}>No hay productos registrados en el inventario.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Lista de Inventario</h3>
      <table className="inventory-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Marca</th>
            <th>Cantidad</th>
            <th>Precio ($)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map((product, index) => (
            <tr key={product?.id || index}>
              <td>{product?.nombre || '-'}</td>
              <td>{product?.categoria || '-'}</td>
              <td>{product?.proveedor || '-'}</td>
              <td>{product?.marca || '-'}</td>
              <td>{product?.cantidad ?? 0}</td>
              <td>${Number(product?.precio || 0).toFixed(2)}</td>
              <td>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  <button
                    className="btn-action edit"
                    style={{ backgroundColor: '#e67e22', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => onEdit && onEdit(product)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-action delete"
                    style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => onDelete && onDelete(product?.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}