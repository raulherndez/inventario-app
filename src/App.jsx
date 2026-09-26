import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import SaasPricing from './components/SaasPricing';
import InventoryList from './components/InventoryList';
import CategoryManager from './components/CategoryManager';
import SupplierManager from './components/SupplierManager';
import BrandManager from './components/BrandManager';

export default function App() {
  const [activeTab, setActiveTab] = useState('inventario');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', color: '#1e293b', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Cabecera Superior Corporativa */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Logo y Título */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ padding: '10px', backgroundColor: '#4f46e5', color: '#ffffff', borderRadius: '12px', fontSize: '18px', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}>
              📦
            </span>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                Sistema de Control de Inventario & SaaS
              </h1>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Plataforma corporativa optimizada</p>
            </div>
          </div>

          {/* Autenticación Clerk (Perfil de Usuario o Botón de Ingreso) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button style={{ backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                  Iniciar Sesión
                </button>
              </SignInButton>
            </SignedOut>
          </div>

        </div>

        {/* Barra de Navegación por Pestañas */}
        <div style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '0 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', overflowX: 'auto', padding: '10px 0' }}>
            {[
              { id: 'inventario', label: 'Inventario', icon: '📦' },
              { id: 'categorias', label: 'Categorías', icon: '🏷️' },
              { id: 'proveedores', label: 'Proveedores', icon: '🚚' },
              { id: 'marcas', label: 'Marcas', icon: '🏢' },
              { id: 'saas', label: 'Planes SaaS', icon: '⭐' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  backgroundColor: activeTab === tab.id ? '#4f46e5' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : '#475569',
                  boxShadow: activeTab === tab.id ? '0 4px 6px -1px rgba(79, 70, 229, 0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Contenido Dinámico según la Pestaña Activa */}
      <main style={{ padding: '32px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {activeTab === 'inventario' && <InventoryList />}
          {activeTab === 'categorias' && <CategoryManager />}
          {activeTab === 'proveedores' && <SupplierManager />}
          {activeTab === 'marcas' && <BrandManager />}
          {activeTab === 'saas' && <SaasPricing />}
        </div>
      </main>
    </div>
  );
}