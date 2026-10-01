import React, { useState } from 'react';
import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react';
import InventoryList from './components/InventoryList';
import CategoryManager from './components/CategoryManager';
import ProviderManager from './components/ProviderManager';
import BrandManager from './components/BrandManager';
import SaasPricing from './components/SaasPricing';

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      {/* Muestra directamente el login de Clerk cuando no ha iniciado sesión */}
      <SignedOut>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <SignIn />
        </div>
      </SignedOut>

      {/* Si ya inició sesión, muestra tu aplicación completa exactamente como la tenías */}
      <SignedIn>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '24px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            
            {/* Cabecera / Navbar */}
            <header style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '20px 24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: '#4f46e5', padding: '12px', borderRadius: '14px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  📦
                </div>
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Sistema de Control de Inventario & SaaS</h1>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Plataforma corporativa optimizada</p>
                </div>
              </div>

              <div>
                <UserButton afterSignOutUrl="/" />
              </div>

            </header>

            {/* Barra de Navegación por pestañas */}
            <nav style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
              <button
                onClick={() => setActiveTab('inventory')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'inventory' ? '#4f46e5' : '#ffffff',
                  color: activeTab === 'inventory' ? '#ffffff' : '#64748b',
                  boxShadow: activeTab === 'inventory' ? '0 4px 6px -1px rgba(79, 70, 229, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                  border: activeTab === 'inventory' ? 'none' : '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📦 Inventario
              </button>
              
              <button
                onClick={() => setActiveTab('categories')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'categories' ? '#4f46e5' : '#ffffff',
                  color: activeTab === 'categories' ? '#ffffff' : '#64748b',
                  boxShadow: activeTab === 'categories' ? '0 4px 6px -1px rgba(79, 70, 229, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                  border: activeTab === 'categories' ? 'none' : '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🏷️ Categorías
              </button>

              <button
                onClick={() => setActiveTab('providers')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'providers' ? '#4f46e5' : '#ffffff',
                  color: activeTab === 'providers' ? '#ffffff' : '#64748b',
                  boxShadow: activeTab === 'providers' ? '0 4px 6px -1px rgba(79, 70, 229, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                  border: activeTab === 'providers' ? 'none' : '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🚚 Proveedores
              </button>

              <button
                onClick={() => setActiveTab('brands')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'brands' ? '#4f46e5' : '#ffffff',
                  color: activeTab === 'brands' ? '#ffffff' : '#64748b',
                  boxShadow: activeTab === 'brands' ? '0 4px 6px -1px rgba(79, 70, 229, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                  border: activeTab === 'brands' ? 'none' : '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🏢 Marcas
              </button>

              <button
                onClick={() => setActiveTab('saas')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'saas' ? '#4f46e5' : '#ffffff',
                  color: activeTab === 'saas' ? '#ffffff' : '#64748b',
                  boxShadow: activeTab === 'saas' ? '0 4px 6px -1px rgba(79, 70, 229, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                  border: activeTab === 'saas' ? 'none' : '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ⭐ Planes SaaS
              </button>
            </nav>

            {/* Contenido Dinámico según la pestaña activa */}
            <main>
              {activeTab === 'inventory' && <InventoryList refreshKey={refreshKey} />}
              {activeTab === 'categories' && <CategoryManager onCategoriesChange={handleDataChange} />}
              {activeTab === 'providers' && <ProviderManager onProvidersChange={handleDataChange} />}
              {activeTab === 'brands' && <BrandManager onBrandsChange={handleDataChange} />}
              {activeTab === 'saas' && <SaasPricing />}
            </main>

          </div>
        </div>
      </SignedIn>
    </>
  );
}