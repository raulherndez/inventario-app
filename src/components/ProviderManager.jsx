import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ProviderManager({ onProvidersChange }) {
  const [providers, setProviders] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [editingProvider, setEditingProvider] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    const { data, error } = await supabase.from('proveedores').select('*');
    if (error) {
      console.error('Error cargando proveedores:', error);
    } else {
      setProviders(data || []);
      if (onProvidersChange) onProvidersChange();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProvider) {
      const { error } = await supabase
        .from('proveedores')
        .update({ nombre: name, telefono: phone, correo: email })
        .eq('id', editingProvider.id);

      if (error) alert('Error al actualizar: ' + error.message);
    } else {
      const { error } = await supabase
        .from('proveedores')
        .insert([{ nombre: name, telefono: phone, correo: email }]);

      if (error) alert('Error al guardar: ' + error.message);
    }

    resetForm();
    await fetchProviders();
  };

  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setName(provider.nombre || provider.name || '');
    setPhone(provider.telefono || provider.phone || '');
    setEmail(provider.correo || provider.email || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este proveedor?')) return;
    const { error } = await supabase.from('proveedores').delete().eq('id', id);
    if (error) alert('Error al eliminar: ' + error.message);
    else await fetchProviders();
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setEditingProvider(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Tarjeta Formulario */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: 'fit-content' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#111827' }}>
          {editingProvider ? 'Editar Proveedor' : 'Agregar Proveedor'}
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
            placeholder="Teléfono opcional"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: '#374151', color: '#ffffff', fontSize: '15px', boxSizing: 'border-box' }}
          />
          <input
            type="email"
            placeholder="Correo electrónico opcional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: '#374151', color: '#ffffff', fontSize: '15px', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
            {editingProvider ? 'Actualizar' : 'Guardar'}
          </button>
          {editingProvider && (
            <button type="button" onClick={resetForm} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#f3f4f6', color: '#374151', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* Tarjeta Tabla */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#111827' }}>Proveedores ({providers.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', color: '#475569' }}>Proveedor</th>
              <th style={{ padding: '12px 16px', color: '#475569' }}>Contacto</th>
              <th style={{ padding: '12px 16px', color: '#475569', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#1e293b' }}>{p.nombre || p.name}</td>
                <td style={{ padding: '12px 16px', color: '#475569' }}>
                  {p.telefono || p.phone || '-'} / {p.correo || p.email || '-'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <button onClick={() => handleEdit(p)} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
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