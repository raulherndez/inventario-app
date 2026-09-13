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
    precio: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        nombre: editingProduct.nombre || editingProduct.name || '',
        categoria: editingProduct.categoria_id || editingProduct.categoria || editingProduct.category || '',
        proveedor: editingProduct.proveedor_id || editingProduct.proveedor || editingProduct.supplier || '',
        marca: editingProduct.marca_id || editingProduct.marca || editingProduct.brand || '',
        cantidad: editingProduct.cantidad ?? editingProduct.stock ?? '',
        precio: editingProduct.precio || editingProduct.price || ''
      });
    } else {
      setFormData({
        nombre: '',
        categoria: '',
        proveedor: '',
        marca: '',
        cantidad: '',
        precio: ''
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
      // Aseguramos que viajen como números si existen, o null/vacío si no
      categoria: formData.categoria ? parseInt(formData.categoria, 10) : null,
      proveedor: formData.proveedor ? parseInt(formData.proveedor, 10) : null,
      marca: formData.marca ? parseInt(formData.marca, 10) : null
    });

    setFormData({
      nombre: '',
      categoria: '',
      proveedor: '',
      marca: '',
      cantidad: '',
      precio: ''
    });
  };

  const extractName = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.nombre || item.name || item.categoria || item.title || '';
  };

  return (
    <form className="inventory-form" onSubmit={handleSubmit}>
      <h2>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
      <div className="form-group">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        
        {/* Select de Categorías */}
        <select name="categoria" value={formData.categoria} onChange={handleChange}>
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
        <select name="proveedor" value={formData.proveedor} onChange={handleChange}>
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
        <select name="marca" value={formData.marca} onChange={handleChange}>
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

        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad / Stock"
          value={formData.cantidad}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="precio"
          placeholder="Precio ($)"
          value={formData.precio}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingProduct ? 'Actualizar' : 'Guardar'}
        </button>
        {editingProduct && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}