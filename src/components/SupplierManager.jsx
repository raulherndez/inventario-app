import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function SupplierManager({ onSuppliersChange }) {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingSupplier, setEditingSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const { data, error } = await supabase.from('proveedores').select('*');
    if (error) {
      console.error('Error cargando proveedores:', error);
    } else {
      setSuppliers(data || []);
      if (onSuppliersChange) onSuppliersChange();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      nombre: name,
      telefono: phone
    };

    if (editingSupplier) {
      const { error } = await supabase
        .from('proveedores')
        .update(payload)
        .eq('id', editingSupplier.id);

      if (error) alert('Error al actualizar: ' + error.message);
    } else {
      const { error } = await supabase
        .from('proveedores')
        .insert([payload]);

      if (error) alert('Error al guardar: ' + error.message);
    }

    resetForm();
    await fetchSuppliers();
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setName(supplier.nombre || supplier.name || '');
    setPhone(supplier.telefono || supplier.phone || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este proveedor?')) return;
    const { error } = await supabase.from('proveedores').delete().eq('id', id);
    if (error) alert('Error al eliminar: ' + error.message);
    else await fetchSuppliers();
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setEditingSupplier(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Tarjeta Formulario */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: 'fit-content' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#111827' }}>
          {editingSupplier ? 'Editar Proveedor' : 'Agregar Proveedor'}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="Nombre del proveedor"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: '#374151', color: '#ffffff', fontSize: '15px', boxSizing: 'border-box' }}
          />
          <input
            type="text"
            placeholder="Teléfono (opcional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: '#374151', color: '#ffffff', fontSize: '15px', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
            {editingSupplier ? 'Actualizar' : 'Guardar'}
          </button>
          {editingSupplier && (
            <button type="button" onClick={resetForm} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#f3f4f6', color: '#374151', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* Tarjeta Tabla */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#111827' }}>Proveedores ({suppliers.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', color: '#475569' }}>Proveedor</th>
              <th style={{ padding: '12px 16px', color: '#475569' }}>Teléfono</th>
              <th style={{ padding: '12px 16px', color: '#475569', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#1e293b' }}>
                  {s.nombre || s.name || 'Sin nombre'}
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>
                  {s.telefono || s.phone || 'N/A'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <button onClick={() => handleEdit(s)} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(s.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
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