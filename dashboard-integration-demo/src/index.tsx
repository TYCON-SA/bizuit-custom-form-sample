/**
 * Dashboard Integration Demo Form
 *
 * Este formulario demuestra la integración completa con Bizuit Dashboard:
 * 1. Recibe parámetros del Dashboard via props (dashboardParams)
 * 2. Los muestra en pantalla para verificación
 * 3. Permite iniciar el proceso 'samplewebpages' usando esos parámetros
 */

import { useState, useEffect } from 'react';

interface DashboardParameters {
  // From Dashboard query string
  instanceId?: string;
  userName?: string;
  eventName?: string;
  activityName?: string;
  token?: string;

  // From SecurityTokens table (after validation)
  tokenId?: string;
  operation?: number;
  requesterAddress?: string;
  expirationDate?: string;
}

interface FormProps {
  dashboardParams?: DashboardParameters | null;
}

export default function DashboardIntegrationDemoForm({ dashboardParams }: FormProps) {
  const [processStarted, setProcessStarted] = useState(false);
  const [processResult, setProcessResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Log dashboard params on mount
  useEffect(() => {
    console.log('[Dashboard Integration Demo] Form mounted with params:', dashboardParams);
  }, [dashboardParams]);

  const handleStartProcess = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[Dashboard Integration Demo] Starting samplewebpages process with params:', dashboardParams);

      // TODO: Aquí invocaremos el proceso samplewebpages usando el SDK
      // Por ahora simulamos la respuesta
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockResult = {
        processId: 'sample-' + Date.now(),
        instanceId: dashboardParams?.instanceId || 'new-instance',
        status: 'started',
        timestamp: new Date().toISOString(),
        parameters: dashboardParams
      };

      setProcessResult(mockResult);
      setProcessStarted(true);

      console.log('[Dashboard Integration Demo] Process started successfully:', mockResult);

    } catch (err: any) {
      console.error('[Dashboard Integration Demo] Error starting process:', err);
      setError(err.message || 'Error starting process');
    } finally {
      setLoading(false);
    }
  };

  const hasParams = dashboardParams && Object.keys(dashboardParams).length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Dashboard Integration Demo
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            🔗 Formulario de demostración - Integración con Bizuit Dashboard
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            Versión 1.0.0 - Inicia proceso 'samplewebpages' con parámetros del Dashboard
          </p>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          {hasParams ? (
            <div className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <span className="text-green-600 dark:text-green-400 font-semibold">
                ✅ Cargado desde Dashboard
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                ⚠️ Acceso directo (sin parámetros del Dashboard)
              </span>
            </div>
          )}
        </div>

        {/* Dashboard Parameters Display */}
        {hasParams && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              📋 Parámetros Recibidos del Dashboard
            </h2>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
              {/* Query String Parameters */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  De Query String:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ParamItem label="Instance ID" value={dashboardParams?.instanceId} />
                  <ParamItem label="User Name" value={dashboardParams?.userName} />
                  <ParamItem label="Event Name" value={dashboardParams?.eventName} />
                  <ParamItem label="Activity Name" value={dashboardParams?.activityName} />
                  <ParamItem label="Auth Token" value={dashboardParams?.token} sensitive />
                </div>
              </div>

              {/* SecurityTokens Parameters */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  De SecurityTokens (validado):
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ParamItem label="Token ID" value={dashboardParams?.tokenId} />
                  <ParamItem label="Operation" value={dashboardParams?.operation?.toString()} />
                  <ParamItem label="Requester Address" value={dashboardParams?.requesterAddress} />
                  <ParamItem label="Expiration Date" value={dashboardParams?.expirationDate} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            🚀 Iniciar Proceso
          </h2>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              Este formulario iniciará el proceso <strong>'samplewebpages'</strong> usando los parámetros
              recibidos del Dashboard.
            </p>

            {!processStarted ? (
              <button
                onClick={handleStartProcess}
                disabled={loading || !hasParams}
                className={`
                  px-6 py-3 rounded-lg font-semibold transition-colors
                  ${hasParams && !loading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                {loading ? '⏳ Iniciando proceso...' : '🚀 Iniciar Proceso samplewebpages'}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <span className="text-2xl mr-2">✅</span>
                  <span className="font-semibold">Proceso iniciado exitosamente</span>
                </div>
                <button
                  onClick={() => {
                    setProcessStarted(false);
                    setProcessResult(null);
                  }}
                  className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Reiniciar
                </button>
              </div>
            )}

            {!hasParams && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                ℹ️ Para iniciar el proceso, carga este formulario desde el Dashboard con los parámetros necesarios.
              </p>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              ❌ Error: {error}
            </p>
          </div>
        )}

        {/* Process Result Display */}
        {processResult && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              📊 Resultado del Proceso
            </h2>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <pre className="text-sm text-green-800 dark:text-green-200 overflow-x-auto">
                {JSON.stringify(processResult, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <strong>🔍 Debug Info:</strong>
          </p>
          <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
            <li>• Form cargado dinámicamente desde BD</li>
            <li>• React compartido globalmente (window.React)</li>
            <li>• dashboardParams: {hasParams ? '✅ Presentes' : '❌ No presentes'}</li>
            <li>• SDK: @tyconsa/bizuit-form-sdk (disponible globalmente)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Helper component for displaying parameters
function ParamItem({ label, value, sensitive = false }: { label: string; value?: string; sensitive?: boolean }) {
  const displayValue = value
    ? (sensitive ? maskSensitiveValue(value) : value)
    : <span className="text-slate-400 dark:text-slate-500 italic">no proporcionado</span>;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </div>
      <div className="text-sm font-mono text-slate-900 dark:text-white break-all">
        {displayValue}
      </div>
    </div>
  );
}

function maskSensitiveValue(value: string): string {
  if (value.length <= 10) {
    return '***' + value.slice(-4);
  }
  return value.slice(0, 10) + '...' + value.slice(-4);
}
