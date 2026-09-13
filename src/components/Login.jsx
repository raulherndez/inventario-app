import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('Correo o contraseña incorrectos.');
    } else {
      onLoginSuccess(data.user);
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0c3fc 0%, #b6fbff 50%, #a8ede0 100%)',
      fontFamily: 'sans-serif',
      zIndex: 9999,
      margin: 0
    }}>
      {/* Caja centralizadora invisible que mantiene todo ordenado y con un ancho perfecto */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        padding: '20px',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        
        {/* Avatar superior */}
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 15px auto',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          color: '#ffffff'
        }}>
          👤
        </div>

        {/* Título */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: '300',
          letterSpacing: '2px',
          color: '#ffffff',
          marginBottom: '35px',
          marginTop: 0,
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          User Login
        </h2>

        {errorMsg && (
          <div style={{
            marginBottom: '20px',
            padding: '10px',
            fontSize: '13px',
            color: '#fff',
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderRadius: '6px'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          
          {/* Input Email */}
          <div style={{
            position: 'relative',
            borderBottom: '1px solid rgba(255, 255, 255, 0.7)',
            marginBottom: '25px',
            paddingBottom: '8px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '12px', fontSize: '16px' }}>✉️</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email ID"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}
            />
          </div>

          {/* Input Password */}
          <div style={{
            position: 'relative',
            borderBottom: '1px solid rgba(255, 255, 255, 0.7)',
            marginBottom: '20px',
            paddingBottom: '8px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '12px', fontSize: '16px' }}>🔒</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}
            />
          </div>

          {/* Opciones (Remember me / Forgot password) */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '30px'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" style={{ marginRight: '6px' }} />
              Remember me
            </label>
            <span style={{ cursor: 'pointer' }}>Forgot Password?</span>
          </div>

          {/* Botón LOGIN */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '12px',
              letterSpacing: '2.5px',
              color: '#ffffff',
              backgroundColor: '#3b5998',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'Verificando...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}