import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import InventoryList from './components/InventoryList';
import SaasPricing from './components/SaasPricing';

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <>
      {/* Si no ha iniciado sesión, muestra únicamente la pantalla de bienvenida / login de Clerk */}
      <SignedOut>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
            <div style={{ backgroundColor: '#4f46e5', width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px' }}>
              📦
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Control de Inventario</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Inicia sesión para acceder a la plataforma</p>
            <SignInButton mode="modal">
              <button style={{ backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', width: '100%', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}>
                Iniciar Sesión
              </button>
            </SignInButton>
          </div>
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
              {activeTab === 'inventory' && <InventoryList />}
              {activeTab === 'categories' && (
                <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                  <h2>Módulo de Categorías en desarrollo</h2>
                </div>
              )}
              {activeTab === 'providers' && (
                <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                  <h2>Módulo de Proveedores en desarrollo</h2>
                </div>
              )}
              {activeTab === 'brands' && (
                <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                  <h2>Módulo de Marcas en desarrollo</h2>
                </div>
              )}
              {activeTab === 'saas' && <SaasPricing />}
            </main>

          </div>
        </div>
      </SignedIn>
    </>
  );
}