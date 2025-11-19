/**
 * Dashboard Integration Demo Form
 *
 * Este formulario demuestra la integración completa con Bizuit Dashboard:
 * 1. Recibe parámetros del Dashboard via props (dashboardParams)
 * 2. Obtiene parámetros del proceso 'samplewebpages' dinámicamente
 * 3. Renderiza campos usando DynamicFormField
 * 4. Inicia el proceso usando el SDK con los parámetros del Dashboard
 */

import { useState, useEffect } from 'react';

// Obtener referencias globales del SDK y componentes
const { BizuitSDK, formDataToParameters } = window.BizuitFormSDK || {};
const { DynamicFormField } = window.BizuitUIComponents || {};

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
  // Crear instancia del SDK directamente (sin hook)
  const [sdk] = useState(() => {
    if (!BizuitSDK) return null;

    // Usar el proxy /api/bizuit para todas las llamadas a Bizuit API
    // El proxy se encarga de rutear a la URL correcta según el endpoint
    return new BizuitSDK({
      formsApiUrl: '/api/bizuit',
      dashboardApiUrl: '/api/bizuit',
      timeout: 120000
    });
  });

  const [parameters, setParameters] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loadingParams, setLoadingParams] = useState(true);
  const [processStarted, setProcessStarted] = useState(false);
  const [processResult, setProcessResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasParams = dashboardParams && Object.keys(dashboardParams).length > 0;
  const processName = dashboardParams?.eventName || 'samplewebpages';
  const authToken = dashboardParams?.token ? `Bearer ${dashboardParams.token}` : undefined;

  // Log dashboard params on mount
  useEffect(() => {
    console.log('[Dashboard Integration Demo] Form mounted with params:', dashboardParams);
    console.log('[Dashboard Integration Demo] SDK available:', !!sdk);
    console.log('[Dashboard Integration Demo] DynamicFormField available:', !!DynamicFormField);
  }, [dashboardParams]);

  // Load process parameters from API
  useEffect(() => {
    async function loadParameters() {
      if (!sdk || !hasParams) {
        setLoadingParams(false);
        return;
      }

      try {
        setLoadingParams(true);
        console.log(`[Dashboard Integration Demo] Loading parameters for process: ${processName}`);

        // Obtener parámetros del proceso
        const params = await sdk.process.getParameters(processName, '', authToken);

        console.log('[Dashboard Integration Demo] Raw parameters from API:', params);

        // Filtrar solo parámetros de entrada (no variables del sistema)
        // parameterDirection: 1 = In, 2 = Out, 3 = InOut
        // Excluir variables (isVariable: true) que son de salida
        const inputParams = params.filter((p: any) =>
          !p.isSystemParameter &&
          !p.isVariable &&
          (p.parameterDirection === 1 || p.parameterDirection === 3)
        );

        console.log('[Dashboard Integration Demo] Loaded parameters:', inputParams, { length: inputParams.length });
        setParameters(inputParams);

        // Inicializar formData con valores por defecto
        const initialData: Record<string, any> = {};
        inputParams.forEach((param: any) => {
          if (param.value !== null && param.value !== undefined) {
            initialData[param.name] = param.value;
          }
        });
        setFormData(initialData);

      } catch (err: any) {
        console.error('[Dashboard Integration Demo] Error loading parameters:', err);
        setError(`Error cargando parámetros: ${err.message}`);
      } finally {
        setLoadingParams(false);
      }
    }

    loadParameters();
  }, [sdk, hasParams, processName, authToken]);

  const handleStartProcess = async () => {
    if (!sdk) {
      setError('SDK no está disponible');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('[Dashboard Integration Demo] Starting process with form data:', formData);

      // Filtrar solo los parámetros que deben enviarse (IN e InOut/Opcionales, no variables)
      const paramsToSend = parameters.filter((p: any) =>
        !p.isVariable && (p.parameterDirection === 1 || p.parameterDirection === 3)
      );

      // Crear formData solo con los parámetros que vamos a enviar
      const filteredFormData: Record<string, any> = {};
      paramsToSend.forEach((param: any) => {
        if (formData[param.name] !== undefined) {
          filteredFormData[param.name] = formData[param.name];
        }
      });

      // Convertir formData filtrado a parámetros de Bizuit
      const processParameters = formDataToParameters(filteredFormData);

      console.log('[Dashboard Integration Demo] Process parameters to send:', processParameters);

      // Iniciar el proceso usando el SDK
      const result = await sdk.process.start({
        processName: processName,
        parameters: processParameters,
        instanceId: dashboardParams?.instanceId // Si existe, continuar instancia
      }, undefined, authToken);

      setProcessResult(result);
      setProcessStarted(true);

      console.log('[Dashboard Integration Demo] Process started successfully:', result);

    } catch (err: any) {
      console.error('[Dashboard Integration Demo] Error starting process:', err);
      setError(err.message || 'Error starting process');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (paramName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  // Si no hay SDK o componentes disponibles, mostrar error
  if (!sdk || !DynamicFormField) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
            ❌ Error: SDK o componentes UI no disponibles
          </p>
          <p className="text-sm text-red-700 dark:text-red-300">
            SDK: {sdk ? '✅' : '❌'} | DynamicFormField: {DynamicFormField ? '✅' : '❌'}
          </p>
        </div>
      </div>
    );
  }

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
            Versión 1.0.0 - Inicia proceso '{processName}' con parámetros dinámicos del Dashboard
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
          <details className="mb-8">
            <summary className="cursor-pointer text-lg font-semibold text-slate-900 dark:text-white mb-4 hover:text-blue-600">
              📋 Ver Parámetros del Dashboard (click para expandir)
            </summary>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 space-y-4 mt-2">
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
          </details>
        )}

        {/* Dynamic Form Fields */}
        {hasParams && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              📝 Completar Formulario
            </h2>

            {loadingParams ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Cargando parámetros del proceso...
                </p>
              </div>
            ) : parameters.length > 0 ? (
              <form className="space-y-4">
                {parameters.map((param, index) => (
                  <DynamicFormField
                    key={param.name || `param-${index}`}
                    parameter={param}
                    value={formData[param.name]}
                    onChange={(value) => handleFieldChange(param.name, value)}
                  />
                ))}
              </form>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  ℹ️ El proceso '{processName}' no tiene parámetros de entrada configurados.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              ❌ Error: {error}
            </p>
          </div>
        )}

        {/* Action Section */}
        {!processStarted && hasParams && (
          <div className="mb-8">
            <button
              onClick={handleStartProcess}
              disabled={loading || loadingParams}
              className={`
                w-full px-6 py-4 rounded-lg font-semibold text-lg transition-colors
                ${!loading && !loadingParams
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-lg hover:shadow-xl'
                  : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                }
              `}
            >
              {loading ? '⏳ Iniciando proceso...' : `🚀 Iniciar Proceso '${processName}'`}
            </button>
          </div>
        )}

        {/* Success Display */}
        {processStarted && (
          <div className="mb-8">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">✅</span>
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    Proceso iniciado exitosamente
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Instance ID: {processResult?.instanceId || 'N/A'}
                  </p>
                </div>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-semibold text-green-700 dark:text-green-300 hover:text-green-600">
                  Ver resultado completo
                </summary>
                <pre className="mt-2 text-xs text-green-800 dark:text-green-200 overflow-x-auto bg-white dark:bg-slate-800 p-4 rounded">
                  {JSON.stringify(processResult, null, 2)}
                </pre>
              </details>

              <button
                onClick={() => {
                  setProcessStarted(false);
                  setProcessResult(null);
                }}
                className="mt-4 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Reiniciar Formulario
              </button>
            </div>
          </div>
        )}

        {/* No Dashboard Params Message */}
        {!hasParams && (
          <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <p className="text-yellow-800 dark:text-yellow-200 mb-2">
              ⚠️ Este formulario debe ser cargado desde el Dashboard de Bizuit.
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Para probarlo, accede desde un proceso en el Dashboard que use este formulario.
            </p>
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
            <li>• SDK disponible: {sdk ? '✅' : '❌'}</li>
            <li>• DynamicFormField disponible: {DynamicFormField ? '✅' : '❌'}</li>
            <li>• Proceso: {processName}</li>
            <li>• Parámetros cargados: {parameters.length}</li>
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
