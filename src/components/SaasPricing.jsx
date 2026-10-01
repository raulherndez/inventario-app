import React from 'react';

export default function SaasPricing() {
  const planes = [
    {
      nombre: "Plan Emprendedor",
      precio: "$9",
      periodo: "mes",
      descripcion: "La solución perfecta para pequeños negocios y comercios locales que empiezan.",
      caracteristicas: [
        "Control de inventario en tiempo real",
        "Hasta 3 usuarios administradores",
        "Gestión de categorías, marcas y proveedores",
        "Soporte estándar por correo electrónico"
      ],
      destacado: false
    },
    {
      nombre: "Plan Profesional Pro",
      precio: "$29",
      periodo: "mes",
      descripcion: "Potencia máxima para empresas en crecimiento con operaciones avanzadas y multi-usuario.",
      caracteristicas: [
        "Inventario y productos ilimitados",
        "Usuarios y sucursales sin restricciones",
        "Reportes avanzados de stock y ganancias",
        "Soporte prioritario 24/7 y atención VIP"
      ],
      destacado: true,
      badge: "Más Popular"
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          SaaS Abierto • Sin Restricciones
        </span>
        <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#111827', marginTop: '16px', marginBottom: '12px' }}>
          Planes diseñados para escalar <span style={{ color: '#4f46e5' }}>tu negocio</span>
        </h2>
        <p style={{ fontSize: '16px', color: '#4b5563', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
          Acceso inmediato al sistema sin filtros de elegibilidad. Elige tu plan y comienza a gestionar tu inventario como un profesional hoy mismo.
        </p>
      </div>

      {/* Contenedor de Tarjetas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
        {planes.map((plan, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '40px 30px',
              boxShadow: plan.destacado ? '0 20px 25px -5px rgba(79, 70, 229, 0.15), 0 10px 10px -5px rgba(79, 70, 229, 0.1)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: plan.destacado ? '2px solid #4f46e5' : '1px solid #e5e7eb',
              transform: plan.destacado ? 'scale(1.03)' : 'scale(1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {plan.badge && (
              <div style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                padding: '6px 16px',
                borderRadius: '20px',
                boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)'
              }}>
                {plan.badge}
              </div>
            )}

            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: '0 0 10px 0' }}>{plan.nombre}</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', minHeight: '40px' }}>{plan.descripcion}</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '16px', margin: '24px 0', border: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '48px', fontWeight: '900', color: '#111827', lineHeight: '1' }}>{plan.precio}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>/{plan.periodo}</span>
              </div>

              <div>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                  Características incluidas:
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {plan.caracteristicas.map((carac, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', fontSize: '14px', color: '#374151', gap: '10px' }}>
                      <span style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0, marginTop: '2px' }}>✓</span>
                      <span style={{ fontWeight: '500' }}>{carac}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '32px', borderTop: '1px solid #f3f4f6', paddingTop: '24px' }}>
              <button
                onClick={() => alert(`¡Excelente elección! Redirigiendo al proceso de suscripción para el ${plan.nombre}...`)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '14px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: plan.destacado ? '#4f46e5' : '#111827',
                  color: '#ffffff',
                  boxShadow: plan.destacado ? '0 10px 15px -3px rgba(79, 70, 229, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                Suscribirme a {plan.nombre}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}