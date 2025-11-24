/**
 * BIZUIT Custom Form Template
 *
 * Professional template for creating new custom forms with best practices.
 * Based on recubiz-gestion design and patterns.
 *
 * @author Tycon S.A.
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { version as FORM_VERSION } from '../package.json';
import {
  BizuitCard,
  Button,
  BizuitThemeProvider,
  BizuitDataGrid,
  BizuitCombo,
  type ComboOption,
  type ColumnDef
} from '@tyconsa/bizuit-ui-components';
import { BizuitSDK } from '@tyconsa/bizuit-form-sdk';

// ============================================================================
// SDK CONFIGURATION
// ============================================================================

const SDK_CONFIG = {
  // TODO: Update with your Dashboard API URL
  // Example: 'https://test.bizuit.com/yourTenantBizuitDashboardapi/api/'
  defaultApiUrl: 'https://test.bizuit.com/arielschBizuitDashboardapi/api/',

  // TODO: Update with your process name
  processName: 'YourProcessName'
};

// ============================================================================
// TYPES
// ============================================================================

/**
 * Example data structure from process response
 * TODO: Update with your actual data structure
 */
interface ExampleItem {
  id: number;
  name: string;
  status: string;
  date: string;
  amount: number;
}

/**
 * Dashboard parameters received from runtime
 */
interface DashboardParams {
  userName?: string;
  instanceId?: string;
  apiUrl?: string;
  devUsername?: string;
  devPassword?: string;
  devApiUrl?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function FormTemplate({ dashboardParams }: { dashboardParams?: DashboardParams }) {
  // Get API URL from dashboardParams or use default
  const apiUrl = dashboardParams?.apiUrl ||
                 dashboardParams?.devApiUrl ||
                 SDK_CONFIG.defaultApiUrl;

  // Get credentials for authentication
  const username = dashboardParams?.userName || dashboardParams?.devUsername || '';
  const password = dashboardParams?.devPassword || '';

  // State
  const [sdk] = useState(() => new BizuitSDK({
    timeout: 30000,
    retries: 3
  }));
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ExampleItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize SDK and load data from process
   */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[Form Template] Initializing SDK...');
      console.log('[Form Template] API URL:', apiUrl);
      console.log('[Form Template] Username:', username);

      // 1. Authenticate with Dashboard API
      const token = await sdk.auth.login(username, password, apiUrl);

      console.log('[Form Template] ✅ Authenticated successfully');

      // 2. Call your process
      // TODO: Update with your actual process parameters
      const result = await sdk.process.raiseEvent({
        processName: SDK_CONFIG.processName,
        activityName: 'Start',
        additionalParameters: sdk.process.createParameters([
          { name: 'pUserName', value: username }
        ])
      }, [], token);

      console.log('[Form Template] ✅ Process response:', result);

      // 3. Parse response data
      // TODO: Update with your actual data parsing logic
      const items: ExampleItem[] = result.parameters
        .filter(p => p.name.startsWith('item_'))
        .map((p, index) => ({
          id: index + 1,
          name: p.value?.name || `Item ${index + 1}`,
          status: p.value?.status || 'Active',
          date: p.value?.date || new Date().toISOString().split('T')[0],
          amount: p.value?.amount || Math.floor(Math.random() * 10000)
        }));

      setData(items);

      console.log('[Form Template] ✅ Data loaded:', items.length, 'items');

    } catch (err: any) {
      console.error('[Form Template] ❌ Error loading data:', err);
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    try {
      console.log('[Form Template] Submitting form...');

      // TODO: Implement your submission logic
      // Example: Call another process, update instance, etc.

      alert('¡Formulario enviado exitosamente!');

    } catch (err: any) {
      console.error('[Form Template] ❌ Error submitting:', err);
      alert('Error al enviar formulario: ' + err.message);
    }
  };

  // ============================================================================
  // DATA GRID CONFIGURATION
  // ============================================================================

  const columns: ColumnDef<ExampleItem>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      size: 200,
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      size: 120,
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const color = status === 'Active' ? 'text-green-600' : 'text-slate-600';
        return <span className={`font-medium ${color}`}>{status}</span>;
      }
    },
    {
      accessorKey: 'date',
      header: 'Fecha',
      size: 120,
    },
    {
      accessorKey: 'amount',
      header: 'Monto',
      size: 120,
      cell: ({ getValue }) => {
        const amount = getValue() as number;
        return (
          <span className="font-mono">
            ${amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </span>
        );
      }
    },
  ];

  // ============================================================================
  // COMBO OPTIONS
  // ============================================================================

  const categoryOptions: ComboOption[] = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'category1', label: 'Categoría 1' },
    { value: 'category2', label: 'Categoría 2' },
    { value: 'category3', label: 'Categoría 3' },
  ];

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <BizuitThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Form Template
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Professional form template for BIZUIT BPM
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Version {FORM_VERSION}
                </div>
                {username && (
                  <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Usuario: {username}
                  </div>
                )}
              </div>
            </div>

            {/* User Info Card */}
            {dashboardParams && (
              <BizuitCard className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm">
                    <strong>Dashboard Context:</strong> {dashboardParams.instanceId ? `Instance ${dashboardParams.instanceId}` : 'Development Mode'}
                  </div>
                </div>
              </BizuitCard>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <BizuitCard>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-400">Cargando datos...</p>
                </div>
              </div>
            </BizuitCard>
          )}

          {/* Error State */}
          {error && !loading && (
            <BizuitCard className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                    Error al cargar datos
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  <Button
                    onClick={loadData}
                    variant="outline"
                    className="mt-3 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Reintentar
                  </Button>
                </div>
              </div>
            </BizuitCard>
          )}

          {/* Main Content */}
          {!loading && !error && (
            <div className="space-y-6">

              {/* Filters Section */}
              <BizuitCard>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Filtros
                </h2>
                <div className="grid md:grid-cols-2 gap-4">

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Categoría
                    </label>
                    <BizuitCombo
                      options={categoryOptions}
                      value={selectedCategory}
                      onChange={(value) => setSelectedCategory(value)}
                      placeholder="Seleccionar categoría..."
                      className="w-full"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-end gap-2">
                    <Button
                      onClick={loadData}
                      variant="outline"
                      className="flex-1"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Actualizar
                    </Button>
                    <Button
                      onClick={() => setData([])}
                      variant="ghost"
                    >
                      Limpiar
                    </Button>
                  </div>
                </div>
              </BizuitCard>

              {/* Data Grid Section */}
              <BizuitCard>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Datos ({data.length})
                  </h2>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Total: {data.length} registros
                  </div>
                </div>

                {data.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-slate-600 dark:text-slate-400">
                      No hay datos para mostrar
                    </p>
                    <Button
                      onClick={loadData}
                      variant="outline"
                      className="mt-4"
                    >
                      Cargar datos
                    </Button>
                  </div>
                ) : (
                  <BizuitDataGrid
                    data={data}
                    columns={columns}
                    enableSorting
                    enableFiltering
                    enablePagination
                    pageSize={10}
                  />
                )}
              </BizuitCard>

              {/* Actions Section */}
              <BizuitCard>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Acciones
                </h2>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Enviar
                  </Button>
                  <Button
                    onClick={() => window.history.back()}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                </div>
              </BizuitCard>

              {/* Info Footer */}
              <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                <p>
                  BIZUIT Custom Form Template v{FORM_VERSION}
                </p>
                <p className="mt-1">
                  Powered by <strong>@tyconsa/bizuit-form-sdk</strong> and <strong>@tyconsa/bizuit-ui-components</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </BizuitThemeProvider>
  );
}
