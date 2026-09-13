import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function BrandManager({ onBrandsChange }) {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState('');
  const [editingBrand, setEditingBrand] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const { data, error } = await supabase.from('marcas').select('*');
    if (error) {
      console.error('Error cargando marcas:', error);
    } else {
      setBrands(data || []);
      // Notifica a App.jsx para que el select de Inventario se actualice inmediatamente
      if (onBrandsChange) onBrandsChange();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingBrand) {
      const { error } = await supabase
        .from('marcas')
        .update({ nombre: name })
        .eq('id', editingBrand.id);

      if (error) alert('Error al actualizar: ' + error.message);
    } else {
      const { error } = await supabase
        .from('marcas')
        .insert([{ nombre: name }]);

      if (error) alert('Error al guardar: ' + error.message);
    }

    resetForm();
    await fetchBrands();
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setName(brand.nombre || brand.name || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta marca?')) return;
    const { error } = await supabase.from('marcas').delete().eq('id', id);
    if (error) alert('Error al eliminar: ' + error.message);
    else await fetchBrands();
  };

  const resetForm = () => {
    setName('');
    setEditingBrand(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Tarjeta Formulario */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: 'fit-content' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#111827' }}>
          {editingBrand ? 'Editar Marca' : 'Agregar Marca'}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="Nombre de la marca"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: '#374151', color: '#ffffff', fontSize: '15px', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
            {editingBrand ? 'Actualizar' : 'Guardar'}
          </button>
          {editingBrand && (
            <button type="button" onClick={resetForm} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#f3f4f6', color: '#374151', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* Tarjeta Tabla */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#111827' }}>Marcas ({brands.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', color: '#475569' }}>Marca</th>
              <th style={{ padding: '12px 16px', color: '#475569', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#1e293b' }}>{b.nombre || b.name}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <button onClick={() => handleEdit(b)} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(b.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}