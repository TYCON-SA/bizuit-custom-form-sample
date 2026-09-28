/**
 * BIZUIT Custom Form Template
 *
 * Professional template for creating new custom forms with best practices.
 * Layout, stats dashboard, modals and table follow the conventions used across
 * BIZUIT custom forms.
 * Includes stats dashboard, modals, and professional table.
 * Version auto-increments on every change.
 *
 * @author Tyconsa
 * @version 1.0.5
 */

// Sentry/GlitchTip must be imported first to intercept console.* in production
import './utils/sentry';

import { useState, useEffect, useMemo } from 'react';
import { version as FORM_VERSION } from '../package.json';
import {
  Button,
  BizuitThemeProvider
} from '@tyconsa/bizuit-ui-components';
import { BizuitSDK } from '@tyconsa/bizuit-form-sdk';

// ============================================================================
// SDK CONFIGURATION
// ============================================================================

const SDK_CONFIG = {
  // TODO: Update with your Dashboard API URL (WITHOUT trailing slash)
  // Example: 'https://your-bizuit-host/yourTenantBizuitDashboardapi/api'
  defaultApiUrl: '',

  // TODO: Update with your process name
  processName: 'YourProcessName'
};

// ============================================================================
// TYPES
// ============================================================================

/**
 * Example data structure
 * TODO: Update with your actual data structure
 */
interface ExampleItem {
  id: number;
  name: string;
  status: string;
  date: string;
  amount: number;
}

interface DashboardParameters {
  instanceId?: string;
  userName?: string;
  eventName?: string;
  activityName?: string;
  token?: string;
  apiUrl?: string;
  devUsername?: string;
  devPassword?: string;
  devApiUrl?: string;
  [key: string]: any;
}

interface FormProps {
  dashboardParams?: DashboardParameters | null;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function FormTemplate({ dashboardParams }: FormProps) {
  // Initialize SDK with apiUrl
  // Priority: 1) apiUrl (from FormLoader), 2) devApiUrl (dev override), 3) default
  const apiUrl = dashboardParams?.apiUrl ||
                 dashboardParams?.devApiUrl ||
                 SDK_CONFIG.defaultApiUrl;

  const sdk = useMemo(() => new BizuitSDK({ apiUrl }), [apiUrl]);

  // State
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ExampleItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Get user info
  const userName = dashboardParams?.userName || 'Developer';
  const instanceId = dashboardParams?.instanceId || 'dev-instance-001';

  /**
   * Initialize and load data
   */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      console.log('[Form Template] Loading data...');

      // ========================================================================
      // EXAMPLE: Authentication and Process Call (COMMENTED OUT)
      // ========================================================================
      // Uncomment this section when you have a real process to call
      //
      // // 1. Authenticate (if using dev credentials)
      // if (dashboardParams?.devUsername && dashboardParams?.devPassword) {
      //   const loginResult = await sdk.auth.login({
      //     username: dashboardParams.devUsername,
      //     password: dashboardParams.devPassword
      //   });
      //   var token = loginResult.Token;
      //   console.log('[Form Template] ✅ Authenticated');
      // }
      //
      // // 2. Call your process
      // const result = await sdk.forms.startProcess({
      //   processName: SDK_CONFIG.processName,
      //   additionalParameters: sdk.forms.createParameters([
      //     { name: 'pUserName', value: userName }
      //   ]),
      //   token
      // });
      //
      // // 3. Parse response
      // const items: ExampleItem[] = result.parameters
      //   .filter(p => p.name.startsWith('item_'))
      //   .map((p, index) => ({
      //     id: p.value?.id || index + 1,
      //     name: p.value?.name || `Item ${index + 1}`,
      //     status: p.value?.status || 'Active',
      //     date: p.value?.date || new Date().toISOString().split('T')[0],
      //     amount: p.value?.amount || 0
      //   }));
      //
      // setData(items);
      // ========================================================================

      // FOR DEMO: Load mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      const mockItems: ExampleItem[] = [
        { id: 1, name: 'Example Item 1', status: 'Active', date: '2025-11-23', amount: 1500.50 },
        { id: 2, name: 'Example Item 2', status: 'Active', date: '2025-11-22', amount: 2300.75 },
        { id: 3, name: 'Example Item 3', status: 'Inactive', date: '2025-11-21', amount: 890.00 },
        { id: 4, name: 'Example Item 4', status: 'Active', date: '2025-11-20', amount: 4250.00 },
        { id: 5, name: 'Example Item 5', status: 'Active', date: '2025-11-19', amount: 750.25 },
      ];

      setData(mockItems);
      console.log('[Form Template] ✅ Mock data loaded:', mockItems.length, 'items');

    } catch (err: any) {
      console.error('[Form Template] ❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <BizuitThemeProvider>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf9f7' }}>
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-lg font-medium text-gray-700">Loading Form Template...</p>
            <p className="text-sm text-gray-500 mt-2">Version {FORM_VERSION}</p>
          </div>
        </div>
      </BizuitThemeProvider>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <BizuitThemeProvider>
      <div className="min-h-screen" style={{ backgroundColor: '#faf9f7' }}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Form Template</h1>
                    <p className="text-sm text-gray-600 mt-1">Professional form template for BIZUIT BPM</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">
                  Version <span className="font-semibold text-orange-600">{FORM_VERSION}</span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  Usuario: <span className="text-orange-600">{userName}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Instance: {instanceId}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">Vista general de datos y acciones disponibles</p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Items */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900">{data.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <svg className="w-4 h-4 inline text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-xs text-gray-600 ml-1">Total registros</span>
              </div>
            </div>

            {/* Active Items */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-500 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Items</p>
                  <p className="text-3xl font-bold text-gray-900">{data.filter(item => item.status === 'Active').length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <svg className="w-4 h-4 inline text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-600 ml-1">Estado activo</span>
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-gray-900">$ {(data.reduce((sum, item) => sum + item.amount, 0) / 1000).toFixed(1)}K</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-600">{data.length} items procesados</span>
              </div>
            </div>

            {/* Details - Clickeable */}
            <div
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-emerald-500 p-6 cursor-pointer"
              onClick={() => setShowInfoModal(true)}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Details</p>
                  <p className="text-lg font-bold text-gray-900">View Info</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfoModal(true);
                  }}
                  className="w-full"
                >
                  Ver detalles
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  <p className="text-sm text-gray-600 mt-1">Configurar filtros de búsqueda</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  >
                    <option value="">All Categories</option>
                    <option value="category1">Category 1</option>
                    <option value="category2">Category 2</option>
                    <option value="category3">Category 3</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="md:col-span-2 flex items-end gap-3">
                  <Button
                    onClick={loadData}
                    className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Data
                  </Button>
                  <Button
                    onClick={() => setData([])}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Data Table</h3>
                  <p className="text-sm text-gray-600 mt-1">{data.length} registros disponibles</p>
                </div>
              </div>
            </div>

            {data.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-orange-50">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No hay datos para mostrar
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Haga clic en "Refresh Data" para cargar datos de ejemplo
                </p>
                <Button
                  onClick={loadData}
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-md"
                >
                  Load Data
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.map((item, index) => (
                      <tr key={item.id} className={`hover:bg-orange-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{item.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono font-semibold text-gray-900">
                            ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Actions</h3>
                  <p className="text-sm text-gray-600 mt-1">Acciones disponibles para este formulario</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowSubmitModal(true)}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit
                </Button>
                <Button
                  onClick={() => console.log('Cancel clicked')}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowInfoModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Data Information</h3>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    Resumen de estadísticas actuales del formulario
                  </p>

                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Items:</span>
                        <span className="font-semibold text-gray-900">{data.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active:</span>
                        <span className="font-semibold text-green-600">{data.filter(i => i.status === 'Active').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-semibold text-orange-600">
                          ${data.reduce((sum, item) => sum + item.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setShowInfoModal(false)}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowSubmitModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Confirm Submission</h3>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700">
                    ¿Está seguro de que desea enviar este formulario con <strong className="text-orange-600">{data.length} items</strong>?
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Records:</span>
                        <span className="font-semibold text-gray-900">{data.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-semibold text-gray-900">
                          ${data.reduce((sum, item) => sum + item.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Items:</span>
                        <span className="font-semibold text-green-600">
                          {data.filter(item => item.status === 'Active').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => {
                      setShowSubmitModal(false);
                      alert('✅ Form submitted successfully! (This is a demo)');
                    }}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() => setShowSubmitModal(false)}
                    variant="outline"
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              BIZUIT Custom Form Template <span className="font-semibold text-orange-600">v{FORM_VERSION}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Powered by <strong className="text-gray-600">@tyconsa/bizuit-form-sdk</strong> and <strong className="text-gray-600">@tyconsa/bizuit-ui-components</strong>
            </p>
          </div>
        </div>
      </div>
    </BizuitThemeProvider>
  );
}
