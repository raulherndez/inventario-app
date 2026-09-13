import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function InventoryStats({ refreshKey }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProductsForStats() {
      try {
        const { data, error } = await supabase
          .from('productos')
          .select('id, cantidad, precio');

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error.message);
      }
    }

    fetchProductsForStats();
  }, [refreshKey]);

  // Protección para que no truene si un producto no existe o viene undefined
  const totalItems = (products || []).reduce((acc, p) => {
    if (!p) return acc;
    const qty = Number(p.quantity ?? p.cantidad ?? p.stock ?? 0);
    return acc + (isNaN(qty) ? 0 : qty);
  }, 0);

  const totalValue = (products || []).reduce((acc, p) => {
    if (!p) return acc;
    const qty = Number(p.quantity ?? p.cantidad ?? p.stock ?? 0);
    const price = Number(p.price ?? p.precio ?? 0);
    const validQty = isNaN(qty) ? 0 : qty;
    const validPrice = isNaN(price) ? 0 : price;
    return acc + (validQty * validPrice);
  }, 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>TOTAL DE ARTÍCULOS</span>
        <h2 style={{ fontSize: '32px', color: '#111827', margin: '10px 0 0 0' }}>{totalItems}</h2>
      </div>
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>VALOR TOTAL EN INVENTARIO</span>
        <h2 style={{ fontSize: '32px', color: '#111827', margin: '10px 0 0 0' }}>${totalValue.toFixed(2)}</h2>
      </div>
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>VARIEDAD DE PRODUCTOS</span>
        <h2 style={{ fontSize: '32px', color: '#111827', margin: '10px 0 0 0' }}>{(products || []).length}</h2>
      </div>
    </div>
  );
}