/**
 * Recubiz - Sistema de Gestión de Cobranzas
 * Professional debt collection management system
 */

import { useState } from 'react';
import { version as FORM_VERSION } from '../package.json';
import {
  BizuitCard,
  Button,
  BizuitThemeProvider,
  BizuitCombo,
  type ComboOption
} from '@tyconsa/bizuit-ui-components';

// ============================================================================
// TYPES
// ============================================================================

interface DashboardParameters {
  instanceId?: string;
  userName?: string;
  eventName?: string;
  activityName?: string;
  token?: string;
  [key: string]: any;
}

interface FormProps {
  dashboardParams?: DashboardParameters | null;
}

// Estructura basada en el XSD real del sistema
interface DatosPersonales {
  id: number;
  nombre: string;
  cuit?: string;
  idTipoDocumento?: number;
  numeroDocumento?: string;
  fechaNacimiento?: string;
  sexo?: string;
  active?: boolean;
}

interface Contacto {
  id: string | number;
  idTipoContacto?: number;
  tipoContacto?: string;
  tipo?: string;  // Para compatibilidad con UI
  fecha?: string;
  contacto?: string;
  valor?: string;  // Para compatibilidad con UI
  estado?: number | string;
  piso?: string;
  depto?: string;
  cp?: string;
  localidad?: string;
  provincia?: string;
  active?: boolean;
}

interface DetalleDeuda {
  id: number;
  fecha: string;
  importeOriginal: number;
  importe: number;
  producto?: string;
  acreedorOriginal?: string;
  active?: boolean;
  descripcion?: string;
  grupo?: string;
  deudaReal?: number;
}

interface DeudaItem {
  id: number;
  nombre: string;
  descripcion?: string;
  fecha: string;
  active?: boolean;
  detalles: DetalleDeuda[];
}

// Para gestión - estructura simplificada para UI
interface Deuda {
  id: string;
  deudor: string;
  numeroDocumento: string;
  cuit: string;
  fechaNacimiento: string;
  fechaAlta: string;
  estado: 'nueva' | 'gestionando' | 'finalizada';
  detalles: DetalleDeuda[];
}

interface Accion {
  id: string;
  fecha: string;
  hora: string;
  tipo: string;
  contacto: string;
  observaciones: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_DEUDAS_NUEVAS: Deuda[] = [
  {
    id: 'D-2024-001',
    deudor: 'CABRERA OMAR',
    numeroDocumento: '28190044',
    cuit: '20281900448',
    fechaNacimiento: '1981-03-18',
    fechaAlta: '2024-01-15',
    estado: 'nueva',
    detalles: [
      {
        id: 1,
        fecha: '2018-06-01',
        importeOriginal: 40000.00,
        importe: 179600.00,
        producto: '1040754305',
        descripcion: 'A3 F011143DEPPHILIPS HP-6574 SAINT PERF744739NOKIA 100 MOVISTAR PRE'
      }
    ]
  }
];

const MOCK_DEUDAS_HISTORIAL: Deuda[] = [
  {
    id: 'D-2023-089',
    deudor: 'María González',
    numeroDocumento: '27-45678902-3',
    cuit: '27456789023',
    fechaNacimiento: '1985-07-20',
    fechaAlta: '2023-12-10',
    estado: 'gestionando',
    detalles: [
      {
        id: 1,
        fecha: '2023-10-15',
        importeOriginal: 50000.00,
        importe: 55000.00,
        producto: '1040754306',
        descripcion: 'Notebook Samsung Galaxy Book'
      },
      {
        id: 2,
        fecha: '2023-11-20',
        importeOriginal: 30000.00,
        importe: 30000.00,
        producto: '1040754307',
        descripcion: 'Mouse Logitech MX Master 3'
      }
    ]
  },
  {
    id: 'D-2023-045',
    deudor: 'Pedro Martínez',
    numeroDocumento: '23-12345678-9',
    cuit: '23123456789',
    fechaNacimiento: '1978-05-10',
    fechaAlta: '2023-08-20',
    estado: 'gestionando',
    detalles: [
      {
        id: 1,
        fecha: '2023-07-05',
        importeOriginal: 95000.00,
        importe: 95000.00,
        producto: '1040754308',
        descripcion: 'Smart TV 55" Samsung QLED'
      }
    ]
  }
];

const MOCK_CONTACTOS: Contacto[] = [
  { id: 'C1', tipo: 'Teléfono Móvil', valor: '351 663 9967', estado: 'INICIAL' },
  { id: 'C2', tipo: 'Teléfono Laboral', valor: '351 445 5566', estado: 'INICIAL' },
  { id: 'C3', tipo: 'Email Personal', valor: 'deudor@email.com', estado: 'INICIAL' }
];

// Acciones previas (readonly - ya registradas en gestiones anteriores)
const MOCK_ACCIONES_PREVIAS: Accion[] = [
  {
    id: 'A001',
    fecha: '15/01/2024',
    hora: '10:30',
    tipo: 'Gestión',
    contacto: 'Teléfono Móvil: 351 663 9967',
    observaciones: 'Primera llamada telefónica. No contesta. Se deja mensaje.'
  },
  {
    id: 'A002',
    fecha: '16/01/2024',
    hora: '14:15',
    tipo: 'Gestión',
    contacto: 'Email Personal: deudor@email.com',
    observaciones: 'Envío de email con detalle de deuda y opciones de pago.'
  },
  {
    id: 'A003',
    fecha: '18/01/2024',
    hora: '11:00',
    tipo: 'Gestión',
    contacto: 'Teléfono Móvil: 351 663 9967',
    observaciones: 'Contacto telefónico exitoso. Promete pago parcial en 48hs.'
  }
];

const TIPOS_ACCION: ComboOption[] = [
  { label: 'Llamada Telefónica', value: 'llamada' },
  { label: 'Mensaje WhatsApp', value: 'whatsapp' },
  { label: 'Envío de Email', value: 'email' },
  { label: 'Mensaje SMS', value: 'sms' },
  { label: 'Visita Presencial', value: 'visita' },
  { label: 'Carta Documento', value: 'carta' }
];

const MOTIVOS_RECHAZO: ComboOption[] = [
  { label: 'Deuda inexistente', value: 'inexistente' },
  { label: 'Deuda ya cancelada', value: 'cancelada' },
  { label: 'Monto incorrecto', value: 'monto_incorrecto' },
  { label: 'Datos del deudor incorrectos', value: 'datos_incorrectos' },
  { label: 'Fuera de jurisdicción', value: 'jurisdiccion' },
  { label: 'Otro motivo', value: 'otro' }
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function DeudaRow({ deuda, onClick, index }: {
  deuda: Deuda;
  onClick: () => void;
  index: number;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  const totalDeuda = deuda.detalles.reduce((sum, d) => sum + d.importe, 0);

  return (
    <tr
      onClick={onClick}
      className={`hover:bg-orange-50 cursor-pointer transition-colors ${
        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900">{deuda.id}</span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{deuda.deudor}</div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600">{deuda.numeroDocumento}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-semibold text-gray-900">{formatCurrency(totalDeuda)}</span>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {deuda.estado}
        </span>
      </td>
    </tr>
  );
}

function ContactoRow({ contacto, isSelected, onClick, index }: {
  contacto: Contacto;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const tipoText = contacto.tipo;
  const valorText = contacto.valor;
  const estadoText = contacto.estado;

  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer transition-colors ${
        isSelected ? 'bg-orange-50 border-l-4 border-orange-500' : index % 2 === 0 ? 'bg-gray-50 hover:bg-orange-50 border-l-4 border-transparent' : 'bg-white hover:bg-orange-50 border-l-4 border-transparent'
      }`}
    >
      <td className="px-2 py-4 w-12">
        {isSelected && (
          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-medium text-gray-900">{tipoText}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{valorText}</span>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {estadoText}
        </span>
      </td>
    </tr>
  );
}

function AccionRow({ accion, index, onClick }: { accion: Accion; index: number; onClick: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer hover:bg-orange-50 transition-colors ${
        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{accion.fecha}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{accion.hora}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{accion.tipo}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{accion.contacto}</td>
      <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">{accion.observaciones}</td>
    </tr>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function RecubizGestionFormInner({ dashboardParams }: FormProps) {
  const [screen, setScreen] = useState<'dashboard' | 'detail' | 'management'>('dashboard');
  const [deudaActual, setDeudaActual] = useState<Deuda | null>(null);
  const [contactoSeleccionado, setContactoSeleccionado] = useState<Contacto | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [accionesHistorial, setAccionesHistorial] = useState<Accion[]>(MOCK_ACCIONES_PREVIAS);
  const [mostrarRechazo, setMostrarRechazo] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [descripcionRechazo, setDescripcionRechazo] = useState('');
  const [mostrarConfirmacionFinalizar, setMostrarConfirmacionFinalizar] = useState(false);
  const [mostrarConfirmacionSolicitar, setMostrarConfirmacionSolicitar] = useState(false);
  const [accionSeleccionada, setAccionSeleccionada] = useState<Accion | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSeleccionarDeuda = (deuda: Deuda) => {
    setDeudaActual(deuda);
    setScreen(deuda.estado === 'nueva' ? 'detail' : 'management');
  };

  const handleSolicitarNuevaDeuda = () => {
    setMostrarConfirmacionSolicitar(true);
  };

  const handleConfirmarSolicitud = () => {
    setMostrarConfirmacionSolicitar(false);
    setDeudaActual(MOCK_DEUDAS_NUEVAS[0]);
    setScreen('detail');
  };

  const handleAceptarDeuda = () => {
    alert(`Deuda ${deudaActual?.id} aceptada para gestión`);
    setScreen('management');
  };

  const handleRechazarDeuda = () => {
    setMostrarRechazo(true);
  };

  const handleConfirmarRechazo = () => {
    if (!motivoRechazo || !descripcionRechazo.trim()) {
      alert('Complete todos los campos obligatorios');
      return;
    }
    alert(`Deuda ${deudaActual?.id} rechazada\nMotivo: ${motivoRechazo}\n${descripcionRechazo}`);
    setMostrarRechazo(false);
    setMotivoRechazo('');
    setDescripcionRechazo('');
    setDeudaActual(null);
    setScreen('dashboard');
  };

  const handleAgregarAccion = () => {
    if (!contactoSeleccionado) {
      alert('Seleccione un contacto de la tabla');
      return;
    }
    if (!observaciones.trim()) {
      alert('Complete las observaciones');
      return;
    }

    const ahora = new Date();
    const nuevaAccion: Accion = {
      id: `A${Date.now()}`,
      fecha: ahora.toLocaleDateString('es-AR'),
      hora: ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      tipo: 'Gestión',
      contacto: `${contactoSeleccionado.tipo}: ${contactoSeleccionado.valor}`,
      observaciones: observaciones
    };

    setAccionesHistorial([...accionesHistorial, nuevaAccion]);
    setObservaciones('');
    alert('Acción registrada exitosamente');
  };

  const handleFinalizarGestion = () => {
    const totalAcciones = accionesHistorial.length;
    if (totalAcciones === 0) {
      alert('Registre al menos una acción antes de finalizar');
      return;
    }
    setMostrarConfirmacionFinalizar(true);
  };

  const handleConfirmarFinalizar = () => {
    const totalAcciones = accionesHistorial.length;
    alert(`Gestión de deuda ${deudaActual?.id} finalizada\nTotal de acciones: ${totalAcciones}`);
    setMostrarConfirmacionFinalizar(false);
    setDeudaActual(null);
    setAccionesHistorial(MOCK_ACCIONES_PREVIAS);
    setContactoSeleccionado(null);
    setScreen('dashboard');
  };

  const handleVolverDashboard = () => {
    setDeudaActual(null);
    setAccionesHistorial(MOCK_ACCIONES_PREVIAS);
    setContactoSeleccionado(null);
    setScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">R</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Recubiz
                  </h1>
                  <p className="text-sm text-gray-500">
                    Sistema de Gestión de Cobranzas
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {screen !== 'dashboard' && (
                <Button variant="default" onClick={handleVolverDashboard}>
                  ← Dashboard
                </Button>
              )}
              <div className="text-right">
                <p className="text-sm text-gray-600">{dashboardParams?.userName || 'Gestor'}</p>
                <p className="text-xs text-gray-400">v{FORM_VERSION}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* ============================================================ */}
        {/* SCREEN 1: DASHBOARD */}
        {/* ============================================================ */}
        {screen === 'dashboard' && (
          <div className="space-y-6">
            {/* Page Title */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">Vista general del sistema de gestión de cobranzas</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Nueva Gestión */}
              <div
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-emerald-500 p-6 cursor-pointer"
                onClick={handleSolicitarNuevaDeuda}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nueva Gestión</p>
                    <p className="text-lg font-bold text-gray-900">Solicitar deuda</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSolicitarNuevaDeuda();
                    }}
                    className="w-full"
                  >
                    + Solicitar
                  </Button>
                </div>
              </div>

              {/* Total Gestiones */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-500 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Gestiones Activas</p>
                    <p className="text-3xl font-bold text-gray-900">{MOCK_DEUDAS_HISTORIAL.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <svg className="w-4 h-4 inline text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-xs text-gray-600 ml-1">En proceso</span>
                </div>
              </div>

              {/* Acciones Totales */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Acciones (7d)</p>
                    <p className="text-3xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <svg className="w-4 h-4 inline text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-600 ml-1">Últimos 7 días</span>
                </div>
              </div>

              {/* Monto Total */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monto en Gestión</p>
                    <p className="text-3xl font-bold text-gray-900">$ 180K</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-gray-600">2 deudas activas</span>
                </div>
              </div>
            </div>

            {/* Mis Gestiones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Mis Gestiones</h3>
                    <p className="text-sm text-gray-600 mt-1">{MOCK_DEUDAS_HISTORIAL.length} gestiones en proceso</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deudor</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Documento</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deuda Actual</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {MOCK_DEUDAS_HISTORIAL.map((d, index) => (
                      <DeudaRow
                        key={d.id}
                        deuda={d}
                        onClick={() => handleSeleccionarDeuda(d)}
                        index={index}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 2: DETAIL (Accept/Reject) */}
        {/* ============================================================ */}
        {screen === 'detail' && deudaActual && (
          <div className="space-y-6">
            {/* Page Title */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Detalle de Deuda</h2>
              <p className="text-gray-600">{deudaActual.id}</p>
            </div>

            {/* Datos del Deudor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Datos del Deudor</h3>
                    <p className="text-sm text-gray-600">Información personal</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Nombre
                    </label>
                    <p className="text-base font-semibold text-gray-900">{deudaActual.deudor}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Número Documento
                    </label>
                    <p className="text-base font-semibold text-gray-900">{deudaActual.numeroDocumento}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      CUIT
                    </label>
                    <p className="text-base font-semibold text-gray-900">{deudaActual.cuit}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Fecha Nacimiento
                    </label>
                    <p className="text-base text-gray-900">{formatDate(deudaActual.fechaNacimiento)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Datos de la Deuda */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Datos de la Deuda</h3>
                    <p className="text-sm text-gray-600">{deudaActual.detalles.length} {deudaActual.detalles.length === 1 ? 'registro' : 'registros'}</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Importe Original</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Importe Actual</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Descripción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {deudaActual.detalles.map((detalle, index) => {
                      console.log('Detalle:', detalle);
                      return (
                        <tr key={detalle.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(detalle.fecha)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(detalle.importeOriginal)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-600">{formatCurrency(detalle.importe)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{detalle.producto || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{detalle.descripcion || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                    <tr>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900" colSpan={2}>TOTAL</td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-red-600">
                        {formatCurrency(deudaActual.detalles.reduce((sum, d) => sum + d.importe, 0))}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-3 justify-end">
              <Button variant="destructive" size="lg" onClick={handleRechazarDeuda}>
                Rechazar
              </Button>
              <Button variant="default" size="lg" onClick={handleAceptarDeuda}>
                Aceptar y Gestionar
              </Button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 3: MANAGEMENT */}
        {/* ============================================================ */}
        {screen === 'management' && deudaActual && (
          <div className="space-y-6">
            {/* Page Title */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestión Activa</h2>
              <p className="text-gray-600">{deudaActual.id} - {deudaActual.deudor}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border-l-4 border-orange-500 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Deudor</p>
                    <p className="text-lg font-bold text-gray-900">{deudaActual.deudor}</p>
                    <p className="text-xs text-gray-500">{deudaActual.numeroDocumento}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border-l-4 border-blue-500 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Productos</p>
                    <p className="text-2xl font-bold text-gray-900">{deudaActual.detalles.length}</p>
                    <p className="text-xs text-gray-500">{deudaActual.detalles.length === 1 ? 'producto' : 'productos'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Deuda Total</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(deudaActual.detalles.reduce((sum, d) => sum + d.importe, 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Historial de Acciones */}
            {accionesHistorial.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Historial de Acciones</h3>
                      <p className="text-sm text-gray-600 mt-1">{accionesHistorial.length} acciones registradas</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hora</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contacto</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {accionesHistorial.map((a, index) => (
                        <AccionRow
                          key={a.id}
                          accion={a}
                          index={index}
                          onClick={() => setAccionSeleccionada(a)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Contactos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Contactos del Deudor</h3>
                    <p className="text-sm text-gray-600 mt-1">Seleccione un contacto para registrar acciones</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12"></th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo de Contacto</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contacto</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {MOCK_CONTACTOS.map((c, index) => (
                      <ContactoRow
                        key={c.id}
                        contacto={c}
                        isSelected={contactoSeleccionado?.id === c.id}
                        onClick={() => setContactoSeleccionado(contactoSeleccionado?.id === c.id ? null : c)}
                        index={index}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              {contactoSeleccionado && (
                <div className="px-6 py-3 bg-orange-50 border-t border-orange-200">
                  <p className="text-sm font-medium text-orange-900">
                    <span className="font-bold">Seleccionado:</span> {contactoSeleccionado.tipo} - {contactoSeleccionado.valor}
                  </p>
                </div>
              )}
            </div>

            {/* Registrar Acción */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Registrar Nueva Acción</h3>
                  <p className="text-sm text-gray-600">Complete los datos de la acción realizada</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observaciones *
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Describa la acción realizada..."
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleAgregarAccion} disabled={!contactoSeleccionado} size="lg">
                  + Agregar Acción
                </Button>
              </div>
            </div>


            {/* Finalizar */}
            <div className="flex justify-center pt-4">
              <Button size="lg" onClick={handleFinalizarGestion}>
                ✓ Finalizar Gestión
              </Button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL CONFIRMACION SOLICITAR */}
        {/* ============================================================ */}
        {mostrarConfirmacionSolicitar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Solicitar Nueva Deuda
                  </h2>
                  <p className="text-sm text-gray-600">
                    Confirmar solicitud
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm text-gray-700">
                  ¿Está seguro que desea solicitar una nueva deuda para gestionar?
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Se le asignará la próxima deuda disponible en el sistema.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setMostrarConfirmacionSolicitar(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button variant="default" onClick={handleConfirmarSolicitud} className="flex-1">
                  Confirmar Solicitud
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL CONFIRMACION FINALIZAR */}
        {/* ============================================================ */}
        {mostrarConfirmacionFinalizar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Finalizar Gestión
                  </h2>
                  <p className="text-sm text-gray-600">
                    {deudaActual?.id}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm text-gray-700">
                  ¿Está seguro que desea finalizar la gestión de esta deuda?
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Se han registrado <span className="font-bold">{accionesHistorial.length} acciones</span> en total.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setMostrarConfirmacionFinalizar(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button variant="default" onClick={handleConfirmarFinalizar} className="flex-1">
                  Confirmar Finalización
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL RECHAZO */}
        {/* ============================================================ */}
        {mostrarRechazo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Rechazar Deuda
                  </h2>
                  <p className="text-sm text-gray-600">
                    {deudaActual?.id}
                  </p>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Motivo de Rechazo *
                  </label>
                  <select
                    value={motivoRechazo}
                    onChange={(e) => setMotivoRechazo(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-300 transition-colors"
                  >
                    <option value="">Seleccione un motivo...</option>
                    {MOTIVOS_RECHAZO.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={descripcionRechazo}
                    onChange={(e) => setDescripcionRechazo(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Ingrese una descripción detallada del rechazo..."
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMostrarRechazo(false);
                    setMotivoRechazo('');
                    setDescripcionRechazo('');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleConfirmarRechazo} className="flex-1">
                  Confirmar Rechazo
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL DETALLE DE ACCION */}
        {/* ============================================================ */}
        {accionSeleccionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Detalle de Acción
                  </h2>
                  <p className="text-sm text-gray-600">
                    {accionSeleccionada.tipo} - {accionSeleccionada.fecha} {accionSeleccionada.hora}
                  </p>
                </div>
                <button
                  onClick={() => setAccionSeleccionada(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Información de la acción */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Fecha y Hora
                    </label>
                    <p className="text-base text-gray-900">{accionSeleccionada.fecha} - {accionSeleccionada.hora}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Tipo de Acción
                    </label>
                    <p className="text-base font-medium text-gray-900">{accionSeleccionada.tipo}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Contacto Utilizado
                  </label>
                  <p className="text-base text-gray-900">{accionSeleccionada.contacto}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Observaciones
                  </label>
                  <textarea
                    value={accionSeleccionada.observaciones}
                    readOnly
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setAccionSeleccionada(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecubizGestionForm(props: FormProps) {
  return (
    <BizuitThemeProvider defaultTheme="light" defaultColorTheme="orange">
      <RecubizGestionFormInner {...props} />
    </BizuitThemeProvider>
  );
}
