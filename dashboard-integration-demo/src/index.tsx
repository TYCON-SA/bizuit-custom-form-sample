/**
 * Dashboard Integration Demo Form - Simple Version
 *
 * Versión simplificada con:
 * - Información básica del formulario
 * - Botón para mostrar modal con versión
 * - Fondo color naranja
 * - Generación automática de ZIP en dist/
 * - Test: multiple forms update for workflow
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

const FORM_NAME = "Dashboard Integration Demo - Enhanced v3";
const LAST_UPDATED = new Date().toISOString().replace('T', ' ').slice(0, 19);

export default function DashboardIntegrationDemoForm({ dashboardParams }: FormProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-cyan-600 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-cyan-100 rounded-full mb-4">
              <svg className="w-16 h-16 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {FORM_NAME}
            </h1>

            <p className="text-lg text-gray-600 mb-2">
              Formulario de demostración para BIZUIT Custom Forms - Enhanced Edition 🎯
            </p>

            <div className="inline-block px-4 py-2 bg-cyan-50 border-2 border-cyan-200 rounded-full">
              <span className="text-sm font-semibold text-cyan-700">
                Versión {FORM_VERSION} - Actualizado: {LAST_UPDATED}
              </span>
            </div>
          </div>

          {/* Información del Formulario */}
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl p-6 border-l-4 border-cyan-500">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <svg className="w-6 h-6 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información del Formulario
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  <div>
                    <strong>Nombre:</strong> {FORM_NAME}
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  <div>
                    <strong>Versión:</strong> {FORM_VERSION}
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  <div>
                    <strong>Tipo:</strong> Formulario de Demostración
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  <div>
                    <strong>Estado:</strong> Activo
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Dashboard Params si existen */}
            {dashboardParams && Object.keys(dashboardParams).length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-500">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cargado desde Dashboard
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  {dashboardParams.userName && (
                    <div><strong>Usuario:</strong> {dashboardParams.userName}</div>
                  )}
                  {dashboardParams.eventName && (
                    <div><strong>Evento:</strong> {dashboardParams.eventName}</div>
                  )}
                  {dashboardParams.instanceId && (
                    <div><strong>Instancia:</strong> {dashboardParams.instanceId}</div>
                  )}
                </div>
              </div>
            )}

            {/* Características */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                📋 Características Principales
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Integración con BIZUIT Dashboard
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Carga dinámica desde base de datos
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Control de versiones integrado
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  React 18 + TypeScript
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-cyan-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Despliegue automático con versionado semántico
                </li>
              </ul>
            </div>
          </div>

          {/* Botón para Mostrar Versión */}
          <div className="text-center">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ver Información de Versión
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white">
          <p className="text-sm opacity-90">
            BIZUIT Custom Forms © {new Date().getFullYear()} - Tycon S.A.
          </p>
        </div>
      </div>

      {/* Modal de Versión */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
            {/* Botón Cerrar */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Contenido del Modal */}
            <div className="text-center">
              <div className="inline-block p-4 bg-cyan-100 rounded-full mb-4">
                <svg className="w-12 h-12 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Información de Versión
              </h2>

              <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl p-6 mb-6">
                <div className="text-6xl font-bold text-cyan-600 mb-2">
                  v{FORM_VERSION}
                </div>
                <p className="text-gray-700 font-semibold">
                  {FORM_NAME}
                </p>
              </div>

              <div className="text-left space-y-3 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-cyan-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong className="text-gray-900">Estado:</strong>
                    <span className="text-gray-700 ml-2">Activo</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-cyan-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong className="text-gray-900">Fecha:</strong>
                    <span className="text-gray-700 ml-2">{new Date().toLocaleDateString('es-ES')}</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-cyan-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong className="text-gray-900">Tipo:</strong>
                    <span className="text-gray-700 ml-2">Demostración</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}} />
    </div>
  );
}
