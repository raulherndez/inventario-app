import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getUserSubscription, updateUserSubscription } from './services/subscriptionService';

export default function SaasPricing() {
  const { user, isLoaded } = useUser();
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(false);

  // Cargar el plan actual del usuario al iniciar
  useEffect(() => {
    async function fetchPlan() {
      if (user?.id) {
        const subscription = await getUserSubscription(user.id);
        if (subscription) {
          setCurrentPlan(subscription.plan_type);
        }
      }
    }
    if (isLoaded) {
      fetchPlan();
    }
  }, [user, isLoaded]);

  // Manejar el cambio de plan
  const handleSelectPlan = async (planType) => {
    if (!user) {
      alert('Debes iniciar sesión para seleccionar un plan.');
      return;
    }

    setLoading(true);
    const result = await updateUserSubscription(user.id, planType);
    setLoading(false);

    if (result.success) {
      setCurrentPlan(planType);
      alert(`¡Listo! Tu plan se ha actualizado a: ${planType.toUpperCase()}`);
    } else {
      alert('Hubo un error al actualizar el plan. Inténtalo de nuevo.');
    }
  };

  if (!isLoaded) return <div style={{ padding: '20px' }}>Cargando información...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Planes y Suscripciones</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        Tu plan actual es: <strong style={{ color: '#2563eb' }}>{currentPlan.toUpperCase()}</strong>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Plan Free */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center', background: '#fff' }}>
          <h3>Free</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '15px 0' }}>$0 / mes</p>
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, color: '#444', lineHeight: '1.6' }}>
            <li>✅ Hasta 100 productos</li>
            <li>✅ 1 usuario</li>
            <li>❌ Reportes avanzados</li>
          </ul>
          <button 
            onClick={() => handleSelectPlan('free')}
            disabled={loading || currentPlan === 'free'}
            style={{ marginTop: '20px', width: '100%', padding: '10px', background: currentPlan === 'free' ? '#ccc' : '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: currentPlan === 'free' ? 'default' : 'pointer' }}
          >
            {currentPlan === 'free' ? 'Plan Actual' : 'Elegir Free'}
          </button>
        </div>

        {/* Plan Pro */}
        <div style={{ border: '2px solid #2563eb', borderRadius: '8px', padding: '20px', textAlign: 'center', background: '#f8fafc' }}>
          <h3>Pro</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '15px 0', color: '#2563eb' }}>$19 / mes</p>
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, color: '#444', lineHeight: '1.6' }}>
            <li>✅ Productos ilimitados</li>
            <li>✅ Hasta 5 usuarios</li>
            <li>✅ Alertas de stock bajo</li>
          </ul>
          <button 
            onClick={() => handleSelectPlan('pro')}
            disabled={loading || currentPlan === 'pro'}
            style={{ marginTop: '20px', width: '100%', padding: '10px', background: currentPlan === 'pro' ? '#10b981' : '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: currentPlan === 'pro' ? 'default' : 'pointer' }}
          >
            {currentPlan === 'pro' ? 'Plan Actual' : 'Elegir Pro'}
          </button>
        </div>

        {/* Plan Enterprise */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center', background: '#fff' }}>
          <h3>Enterprise</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '15px 0' }}>$49 / mes</p>
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, color: '#444', lineHeight: '1.6' }}>
            <li>✅ Todo ilimitado</li>
            <li>✅ Múltiples sucursales</li>
            <li>✅ Soporte prioritario</li>
          </ul>
          <button 
            onClick={() => handleSelectPlan('enterprise')}
            disabled={loading || currentPlan === 'enterprise'}
            style={{ marginTop: '20px', width: '100%', padding: '10px', background: currentPlan === 'enterprise' ? '#10b981' : '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: currentPlan === 'enterprise' ? 'default' : 'pointer' }}
          >
            {currentPlan === 'enterprise' ? 'Plan Actual' : 'Elegir Enterprise'}
          </button>
        </div>

      </div>
    </div>
  );
}