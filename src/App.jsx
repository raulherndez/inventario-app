import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react';
import { supabase } from './supabaseClient';
import InventoryList from './components/InventoryList';
import CategoryManager from './components/CategoryManager';
import ProviderManager from './components/ProviderManager';
import BrandManager from './components/BrandManager';
import CompanyManager from './components/CompanyManager';
import SaasPricing from './components/SaasPricing';

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Estado para la empresa activa y lista de empresas para el selector rápido
  const [empresas, setEmpresas] = useState([]);
  const [empresaIdActual, setEmpresaIdActual] = useState(1);

  // Cargar lista de empresas al iniciar para el selector global
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const { data, error } = await supabase.from('empresas').select('*').order('id', { ascending: true });
        if (!error && data && data.length > 0) {
          setEmpresas(data);
          // Si el ID actual no está en la lista, seleccionamos la primera
          if (!data.some(e => e.id === empresaIdActual)) {
            setEmpresaIdActual(data[0].id);
          }
        }
      } catch (err) {
        console.error('Error al cargar empresas en App:', err.message);
      }
    }
    fetchEmpresas();
  }, [refreshKey]);

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  const empresaActualNombre = empresas.find(e => e.id === empresaIdActual)?.nombre || `Empresa #${empresaIdActual}`;

  return (
    <>
      <SignedOut>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '24px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            
            {/* Cabecera / Navbar con Selector de Empresa Global */}
            <header style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '20px 24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: '#4f46e5', padding: '12px', borderRadius: '14px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  🏢
                </div>
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Control de Inventario SaaS</h1>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Panel Multiempresa</p>
                </div>
              </div>

              {/* Selector Rápido de Empresa Activa */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f1f5f9', padding: '8px 14px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Empresa Activa:</span>
                <select
                  value={empresaIdActual}
                  onChange={(e) => {
                    setEmpresaIdActual(Number(e.target.value));
                    handleDataChange();
                  }}
                  style={{ background: 'transparent', border: 'none', fontWeight: 'bold', color: '#0f172a', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
                >
                  {empresas.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.nombre} (ID: {emp.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <UserButton afterSignOutUrl="/" />
              </div>

            </header>

            {/* Barra de Navegación por Pestañas */}
            <nav style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                { id: 'inventory', label: '📦 Inventario' },
                { id: 'companies', label: '🏢 Gestionar Empresas' },
                { id: 'categories', label: '🏷️ Categorías' },
                { id: 'providers', label: '🚚 Proveedores' },
                { id: 'brands', label: '🏷️ Marcas' },
                { id: 'saas', label: '⭐ Planes SaaS' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    backgroundColor: activeTab === tab.id ? '#4f46e5' : '#ffffff',
                    color: activeTab === tab.id ? '#ffffff' : '#64748b',
                    boxShadow: activeTab === tab.id ? '0 4px 6px -1px rgba(79, 70, 229, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                    border: activeTab === tab.id ? 'none' : '1px solid #e2e8f0',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Banner indicador de la empresa actual */}
            <div style={{ backgroundColor: '#eef2ff', border: '1px solid #c7d2fe', padding: '12px 20px', borderRadius: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#312e81', fontWeight: '500' }}>
                Estás administrando los datos de: <strong>{empresaActualNombre}</strong>
              </span>
              <button 
                onClick={() => setActiveTab('companies')} 
                style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}
              >
                Cambiar o registrar otra empresa &rarr;
              </button>
            </div>

            {/* Contenido Dinámico */}
            <main>
              {activeTab === 'inventory' && <InventoryList empresaId={empresaIdActual} refreshKey={refreshKey} />}
              {activeTab === 'companies' && <CompanyManager empresaId={empresaIdActual} onSelectEmpresa={(id) => { setEmpresaIdActual(id); handleDataChange(); }} />}
              {activeTab === 'categories' && <CategoryManager empresaId={empresaIdActual} onCategoriesChange={handleDataChange} />}
              {activeTab === 'providers' && <ProviderManager empresaId={empresaIdActual} onProvidersChange={handleDataChange} />}
              {activeTab === 'brands' && <BrandManager empresaId={empresaIdActual} onBrandsChange={handleDataChange} />}
              {activeTab === 'saas' && <SaasPricing />}
            </main>

          </div>
        </div>
      </SignedIn>
    </>
  );
}