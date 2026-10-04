import React, { useState, useEffect } from 'react';

export default function InventoryForm({ 
  onSave, 
  editingProduct, 
  onCancelEdit,
  categories = [],
  suppliers = [],
  brands = []
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    proveedor: '',
    marca: '',
    cantidad: '',
    precio: '',
    forma_pago: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        nombre: editingProduct.nombre || editingProduct.name || '',
        categoria: editingProduct.categoria_id || editingProduct.categoria || editingProduct.category || '',
        proveedor: editingProduct.proveedor_id || editingProduct.proveedor || editingProduct.supplier || '',
        marca: editingProduct.marca_id || editingProduct.marca || editingProduct.brand || '',
        cantidad: editingProduct.cantidad ?? editingProduct.stock ?? '',
        precio: editingProduct.precio || editingProduct.price || '',
        forma_pago: editingProduct.forma_pago || editingProduct.payment_method || ''
      });
    } else {
      setFormData({
        nombre: '',
        categoria: '',
        proveedor: '',
        marca: '',
        cantidad: '',
        precio: '',
        forma_pago: ''
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.precio) return;

    onSave({
      ...formData,
      id: editingProduct ? editingProduct.id : Date.now(),
      precio: parseFloat(formData.precio),
      cantidad: parseInt(formData.cantidad, 10) || 0,
      categoria: formData.categoria ? parseInt(formData.categoria, 10) : null,
      proveedor: formData.proveedor ? parseInt(formData.proveedor, 10) : null,
      marca: formData.marca ? parseInt(formData.marca, 10) : null,
      forma_pago: formData.forma_pago || null
    });

    setFormData({
      nombre: '',
      categoria: '',
      proveedor: '',
      marca: '',
      cantidad: '',
      precio: '',
      forma_pago: ''
    });
  };

  const extractName = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.nombre || item.name || item.categoria || item.title || '';
  };

  return (
    <form className="w-full bg-white p-6 rounded-2xl shadow-md flex flex-col gap-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
      </h2>
      
      <div className="flex flex-col gap-3">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
        />
        
        {/* Select de Categorías */}
        <select 
          name="categoria" 
          value={formData.categoria} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
        >
          <option value="">-- Seleccionar Categoría --</option>
          {categories.length > 0 ? (
            categories.map((cat, index) => {
              const nameValue = extractName(cat);
              const catId = cat.id || index;
              return (
                <option key={catId} value={cat.id || ''}>
                  {nameValue}
                </option>
              );
            })
          ) : (
            <option disabled value="">(Sin categorías registradas)</option>
          )}
        </select>

        {/* Select de Proveedores */}
        <select 
          name="proveedor" 
          value={formData.proveedor} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
        >
          <option value="">-- Seleccionar Proveedor --</option>
          {suppliers.map((sup, index) => {
            const nameValue = extractName(sup);
            const supId = sup.id || index;
            return (
              <option key={supId} value={sup.id || ''}>
                {nameValue}
              </option>
            );
          })}
        </select>

        {/* Select de Marcas */}
        <select 
          name="marca" 
          value={formData.marca} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
        >
          <option value="">-- Seleccionar Marca --</option>
          {brands.map((b, index) => {
            const nameValue = extractName(b);
            const brandId = b.id || index;
            return (
              <option key={brandId} value={b.id || ''}>
                {nameValue}
              </option>
            );
          })}
        </select>

        {/* Select de Formas de Pago */}
        <select 
          name="forma_pago" 
          value={formData.forma_pago} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
        >
          <option value="">-- Seleccionar Forma de Pago --</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Bitcoin">Bitcoin (BTC)</option>
          <option value="Ethereum">Ethereum (ETH)</option>
        </select>

        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad / Stock"
          value={formData.cantidad}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
        />
        <input
          type="number"
          step="0.01"
          name="precio"
          placeholder="Precio ($)"
          value={formData.precio}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button type="submit" className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow">
          {editingProduct ? 'Actualizar' : 'Guardar'}
        </button>
        {editingProduct && (
          <button type="button" className="w-full py-2.5 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}