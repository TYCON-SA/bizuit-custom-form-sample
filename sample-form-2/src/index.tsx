/**
 * Sample Form 2 - Material Design Style
 *
 * Formulario de ejemplo con estilo Material Design de Google:
 * - Colores Material: Indigo primary, pink accent
 * - Cards con elevaciones
 * - Ripple effects en botones
 * - Tipografía Roboto
 * - FAB (Floating Action Button)
 * @version 2.0
 */

import { useState } from 'react';
import { version as FORM_VERSION } from '../package.json';

interface DashboardParameters {
  instanceId?: string;
  userName?: string;
  eventName?: string;
  activityName?: string;
  token?: string;
  tokenId?: string;
  operation?: number;
  requesterAddress?: string;
  expirationDate?: string;
}

interface FormProps {
  dashboardParams?: DashboardParameters | null;
}

// Version is now managed in package.json
const FORM_NAME = "Material Design Sample - Teal Edition";
const LAST_UPDATED = "2025-11-21";  // Dynamic versioning from package.json

export default function SampleForm2({ dashboardParams }: FormProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Formulario enviado! (Demo only)');
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    }}>
      {/* App Bar */}
      <div style={{
        background: '#009688',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        padding: '16px 24px',
        color: 'white'
      }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg style={{ width: '32px', height: '32px' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '500', margin: 0 }}>
                {FORM_NAME}
              </h1>
              <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>
                v{FORM_VERSION}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            INFO
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Card 1: Información */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)'}
          >
            <div style={{
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              padding: '16px',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '500', margin: 0 }}>
                📋 Información del Formulario
              </h2>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#757575', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Nombre
                </div>
                <div style={{ color: '#212121', fontSize: '16px', fontWeight: '500' }}>
                  {FORM_NAME}
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#757575', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Última Actualización
                </div>
                <div style={{ color: '#212121', fontSize: '16px', fontWeight: '500' }}>
                  {LAST_UPDATED} {/* Test: multiple forms update */}
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#757575', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Versión
                </div>
                <div style={{ color: '#212121', fontSize: '16px', fontWeight: '500' }}>
                  v{FORM_VERSION}
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#757575', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Tipo
                </div>
                <div style={{ color: '#212121', fontSize: '16px', fontWeight: '500' }}>
                  Formulario de Demostración
                </div>
              </div>
              <div>
                <div style={{ color: '#757575', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Estado
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#4caf50',
                    marginRight: '8px'
                  }}></div>
                  <span style={{ color: '#4caf50', fontSize: '14px', fontWeight: '500' }}>
                    Activo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Dashboard Params */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)'}
          >
            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              padding: '16px',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '500', margin: 0 }}>
                🔗 Parámetros del Dashboard
              </h2>
            </div>
            <div style={{ padding: '24px' }}>
              {dashboardParams && Object.keys(dashboardParams).length > 0 ? (
                <div style={{ fontSize: '14px', color: '#424242' }}>
                  {dashboardParams.userName && (
                    <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                      <strong style={{ color: '#757575', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Usuario:</strong>
                      <div style={{ marginTop: '4px', fontSize: '16px', color: '#212121' }}>{dashboardParams.userName}</div>
                    </div>
                  )}
                  {dashboardParams.eventName && (
                    <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                      <strong style={{ color: '#757575', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Evento:</strong>
                      <div style={{ marginTop: '4px', fontSize: '16px', color: '#212121' }}>{dashboardParams.eventName}</div>
                    </div>
                  )}
                  {dashboardParams.instanceId && (
                    <div>
                      <strong style={{ color: '#757575', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Instancia:</strong>
                      <div style={{ marginTop: '4px', fontSize: '16px', color: '#212121' }}>{dashboardParams.instanceId}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#9e9e9e' }}>
                  <svg style={{ width: '48px', height: '48px', margin: '0 auto 16px' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <p style={{ margin: 0, fontSize: '14px' }}>No hay parámetros del dashboard</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Formulario de Ejemplo */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            padding: '16px',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '500', margin: 0 }}>
              ✉️ Formulario de Contacto ARIEL (Demo)
            </h2>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {/* Campo Nombre */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#757575',
                fontSize: '12px',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Nombre completo
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3f51b5'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                placeholder="Juan Pérez"
              />
            </div>

            {/* Campo Email */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#757575',
                fontSize: '12px',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3f51b5'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                placeholder="juan@example.com"
              />
            </div>

            {/* Campo Mensaje */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#757575',
                fontSize: '12px',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Mensaje
              </label>
              <textarea
                value={formData.mensaje}
                onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3f51b5'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                style={{
                  padding: '10px 24px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  background: 'white',
                  color: '#757575',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  border: 'none',
                  borderRadius: '4px',
                  background: '#3f51b5',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.3s, box-shadow 0.3s',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#303f9f';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#3f51b5';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                }}
              >
                Enviar
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '32px', color: 'white', opacity: 0.9 }}>
          <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>
            BIZUIT Custom Forms © {new Date().getFullYear()} - Material Design by Google ✨💎
          </p>
          <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: 0.8 }}>
            Last Updated: {new Date().toLocaleDateString('es-ES')} • Powered by React 18 🚀
          </p>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#ff4081',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        }}
        title="Información"
      >
        <svg style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </button>

      {/* Modal de Versión */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 1000
        }}
        onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
              maxWidth: '500px',
              width: '100%',
              animation: 'modalFadeIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              padding: '24px',
              color: 'white',
              borderRadius: '8px 8px 0 0'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '500', margin: 0, marginBottom: '8px' }}>
                Información de Versión
              </h2>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
                {FORM_NAME}
              </p>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{
                textAlign: 'center',
                padding: '32px',
                background: 'linear-gradient(135deg, #11998e20 0%, #38ef7d20 100%)',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '48px', fontWeight: '700', color: '#3f51b5', marginBottom: '8px' }}>
                  v{FORM_VERSION}
                </div>
                <div style={{ fontSize: '14px', color: '#757575', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Versión Actual
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#4caf50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#212121', fontWeight: '500' }}>Estado</div>
                    <div style={{ fontSize: '12px', color: '#757575' }}>Activo y funcionando</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#2196f3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#212121', fontWeight: '500' }}>Fecha</div>
                    <div style={{ fontSize: '12px', color: '#757575' }}>{new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#ff4081',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#212121', fontWeight: '500' }}>Estilo</div>
                    <div style={{ fontSize: '12px', color: '#757575' }}>Material Design de Google</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '4px',
                  background: '#3f51b5',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#303f9f'}
                onMouseOut={(e) => e.currentTarget.style.background = '#3f51b5'}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}} />
    </div>
  );
}
