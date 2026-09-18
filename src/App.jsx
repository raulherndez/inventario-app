import React, { useState, useEffect } from 'react';
import InventoryForm from './components/InventoryForm';
import InventoryList from './components/InventoryList';
import InventoryStats from './components/InventoryStats';
import CategoryManager from './components/CategoryManager';
import SupplierManager from './components/SupplierManager';
import BrandManager from './components/BrandManager';
import { SignedIn, SignedOut, UserButton, SignIn } from '@clerk/clerk-react';
import { supabase } from './supabaseClient'; 

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [refreshKey, setRefreshKey] = useState(0);

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [editingProduct, setEditingProduct] = useState(null);

  const handleDataChange = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: catData, error: catError } = await supabase.from('categorias').select('*');
        if (!catError && catData) setCategories(catData);

        const { data: supData, error: supError } = await supabase.from('proveedores').select('*');
        if (!supError && supData) setSuppliers(supData);

        const { data: brandData, error: brandError } = await supabase.from('marcas').select('*');
        if (!brandError && brandData) setBrands(brandData);
      } catch (error) {
        console.error('Aviso cargando datos auxiliares:', error.message);
      }
    }

    fetchData();
  }, [refreshKey]);

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('productos')
          .update({
            nombre: productData.nombre,
            categoria_id: productData.categoria,
            proveedor_id: productData.proveedor,
            marca_id: productData.marca,
            cantidad: productData.cantidad,
            precio: productData.precio
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('productos')
          .insert([
            {
              nombre: productData.nombre,
              categoria_id: productData.categoria,
              proveedor_id: productData.proveedor,
              marca_id: productData.marca,
              cantidad: productData.cantidad,
              precio: productData.precio
            }
          ]);

        if (error) throw error;
      }

      handleDataChange();
      setEditingProduct(null);
      alert('¡Producto guardado con éxito!');
    } catch (error) {
      console.error('Error al guardar el producto:', error.message);
      alert('Hubo al guardar el producto: ' + error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás segura de que deseas eliminar este producto?')) return;
    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      handleDataChange();
    } catch (error) {
      console.error('Error al eliminar:', error.message);
      alert('No se pudo eliminar el producto: ' + error.message);
    }
  };

  return (
    <>
      {/* PANTALLA DE INICIO DE SESIÓN CENTRADA MEDIANTE ESTILOS EN LÍNEA */}
      <SignedOut>
        <div style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f3f4f6',
          position: 'fixed',
          top: 0,
          left: 0,
          margin: 0,
          padding: 0,
          zIndex: 9999
        }}>
          <SignIn routing="hash" />
        </div>
      </SignedOut>

      {/* SI YA INICIÓ SESIÓN: Muestra tu aplicación completa de inventario */}
      <SignedIn>
        <div className="app-container">
          <header className="main-header" style={{ position: 'relative' }}>
            <div className="center-badge">
              📦 Sistema de Control de Inventario
            </div>
            
            <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}>
              <UserButton />
            </div>

            <nav className="pill-navigation">
              <button
                onClick={() => setActiveTab('inventory')}
                className={activeTab === 'inventory' ? 'active-pill' : ''}
              >
                📦 Inventario
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={activeTab === 'categories' ? 'active-pill' : ''}
              >
                🏷️ Categorías
              </button>
              <button
                onClick={() => setActiveTab('suppliers')}
                className={activeTab === 'suppliers' ? 'active-pill' : ''}
              >
                🚚 Proveedores
              </button>
              <button
                onClick={() => setActiveTab('brands')}
                className={activeTab === 'brands' ? 'active-pill' : ''}
              >
                🏢 Marcas
              </button>
            </nav>
          </header>

          <main className="content-area">
            {activeTab === 'inventory' && (
              <>
                <InventoryStats refreshKey={refreshKey} />
                
                <div className="main-grid">
                  <div className="form-card">
                    <InventoryForm 
                      onSave={handleSaveProduct}
                      editingProduct={editingProduct}
                      onCancelEdit={() => setEditingProduct(null)}
                      categories={categories}
                      suppliers={suppliers}
                      brands={brands}
                    />
                  </div>
                  
                  <InventoryList 
                    refreshKey={refreshKey} 
                    onEdit={(product) => setEditingProduct(product)}
                    onDelete={handleDeleteProduct}
                  />
                </div>
              </>
            )}

            {activeTab === 'categories' && <CategoryManager onCategoriesChange={handleDataChange} />}
            {activeTab === 'suppliers' && <SupplierManager onSuppliersChange={handleDataChange} />}
            {activeTab === 'brands' && <BrandManager onBrandsChange={handleDataChange} />}
          </main>
        </div>
      </SignedIn>
    </>
  );
}