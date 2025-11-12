// Bizuit Custom Form: Solicitud de Vacaciones
// Este form será compilado con esbuild y cargado dinámicamente

import { useState } from 'react';

export default function SolicitudVacacionesForm() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [diasSolicitados, setDiasSolicitados] = useState(0);
  const [motivo, setMotivo] = useState('');
  const [contactoEmergencia, setContactoEmergencia] = useState('');
  const [telefonoEmergencia, setTelefonoEmergencia] = useState('');

  const calcularDias = (inicio: string, fin: string) => {
    if (!inicio || !fin) return 0;
    const fechaIni = new Date(inicio);
    const fechaFinal = new Date(fin);
    const diffTime = Math.abs(fechaFinal.getTime() - fechaIni.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleFechaChange = (inicio: string, fin: string) => {
    setFechaInicio(inicio);
    setFechaFin(fin);
    setDiasSolicitados(calcularDias(inicio, fin));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const solicitud = {
      fechaInicio,
      fechaFin,
      diasSolicitados,
      motivo,
      contactoEmergencia,
      telefonoEmergencia,
      fechaSolicitud: new Date().toISOString(),
    };

    console.log('Solicitud de vacaciones:', solicitud);
    alert(`Solicitud enviada: ${diasSolicitados} días desde ${fechaInicio} hasta ${fechaFin}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Solicitud de Vacaciones
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          📅 Complete el formulario para solicitar sus días de vacaciones
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
          Versión 1.1.0 - Solicitud de vacaciones mejorada
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fechaInicio" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Fecha de Inicio
              </label>
              <input
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => handleFechaChange(e.target.value, fechaFin)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="fechaFin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Fecha de Fin
              </label>
              <input
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => handleFechaChange(fechaInicio, e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                required
              />
            </div>
          </div>

          {diasSolicitados > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                📅 Total de días solicitados: <span className="font-bold text-lg">{diasSolicitados}</span> {diasSolicitados === 1 ? 'día' : 'días'}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="motivo" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Motivo (opcional)
            </label>
            <textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
              placeholder="Ej: Viaje familiar, descanso personal..."
            />
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Contacto de Emergencia
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactoEmergencia" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="contactoEmergencia"
                  value={contactoEmergencia}
                  onChange={(e) => setContactoEmergencia(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Nombre del contacto"
                  required
                />
              </div>

              <div>
                <label htmlFor="telefonoEmergencia" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefonoEmergencia"
                  value={telefonoEmergencia}
                  onChange={(e) => setTelefonoEmergencia(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="+54 11 1234-5678"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Enviar Solicitud
            </button>
            <button
              type="button"
              onClick={() => {
                setFechaInicio('');
                setFechaFin('');
                setDiasSolicitados(0);
                setMotivo('');
                setContactoEmergencia('');
                setTelefonoEmergencia('');
              }}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✅ Custom form cargado dinámicamente - React compartido globalmente
          </p>
        </div>
      </div>
    </div>
  );
}
