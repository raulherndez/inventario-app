import React, { useState, useEffect } from 'react';
import InventoryForm from './components/InventoryForm';
import InventoryList from './components/InventoryList';
import InventoryStats from './components/InventoryStats';
import CategoryManager from './components/CategoryManager';
import SupplierManager from './components/SupplierManager';
import BrandManager from './components/BrandManager';
import Login from './components/Login';
import { supabase } from './supabaseClient'; 

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [activeTab, setActiveTab] = useState('inventory');
  const [refreshKey, setRefreshKey] = useState(0);

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [editingProduct, setEditingProduct] = useState(null);

  // Control de sesión de Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDataChange = () => setRefreshKey((prev) => prev + 1);

  // Cargar categorías, proveedores y marcas de forma segura desde Supabase
  useEffect(() => {
    if (!session) return;

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
  }, [refreshKey, session]);

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
      alert('Hubo un error al guardar el producto: ' + error.message);
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

  if (loadingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600 font-medium text-sm">Cargando sistema...</p>
      </div>
    );
  }

  // SI NO HAY SESIÓN, AQUÍ SE MUESTRA EL LOGIN NUEVO
  if (!session) {
    return <Login onLoginSuccess={(user) => setSession({ user })} />;
  }

  // Si ya inició sesión, se muestra tu aplicación completa de inventario
  return (
    <div className="app-container">
      <header className="main-header" style={{ position: 'relative' }}>
        <div className="center-badge">
          📦 Sistema de Control de Inventario
        </div>
        
        <button
          onClick={() => supabase.auth.signOut()}
          style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}
          className="px-3 py-1.5 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700 transition font-medium shadow-sm"
        >
          Cerrar Sesión
        </button>

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
  );
}