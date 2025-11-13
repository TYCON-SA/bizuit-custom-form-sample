// Bizuit Custom Form: Solicitud de Soporte Técnico
// Este form será compilado con esbuild y cargado dinámicamente

import { useState } from 'react';

type PrioridadType = 'baja' | 'media' | 'alta' | 'critica';
type CategoriaType = 'hardware' | 'software' | 'red' | 'acceso' | 'otro';

export default function SolicitudSoporteForm() {
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState<CategoriaType>('software');
  const [prioridad, setPrioridad] = useState<PrioridadType>('media');
  const [ubicacion, setUbicacion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [equipoAfectado, setEquipoAfectado] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const solicitud = {
      asunto,
      descripcion,
      categoria,
      prioridad,
      ubicacion,
      telefono,
      equipoAfectado,
      fechaSolicitud: new Date().toISOString(),
    };

    console.log('Solicitud de soporte:', solicitud);
    alert(`Ticket creado: ${asunto}\nPrioridad: ${prioridad.toUpperCase()}\nCategoría: ${categoria}`);
  };

  const getPrioridadColor = (p: PrioridadType) => {
    const colors = {
      baja: 'bg-green-100 text-green-800 border-green-300',
      media: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      alta: 'bg-orange-100 text-orange-800 border-orange-300',
      critica: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[p];
  };

  const getCategoriaIcon = (c: CategoriaType) => {
    const icons = {
      hardware: '🖥️',
      software: '💻',
      red: '🌐',
      acceso: '🔐',
      otro: '📋',
    };
    return icons[c];
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="text-4xl mr-4">🎫</div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Solicitud de Soporte Técnico
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Complete el formulario para crear un ticket de soporte
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asunto */}
          <div>
            <label
              htmlFor="asunto"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Asunto *
            </label>
            <input
              type="text"
              id="asunto"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
              placeholder="Ej: No puedo acceder al sistema"
              required
            />
          </div>

          {/* Categoría y Prioridad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="categoria"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Categoría *
              </label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaType)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                required
              >
                <option value="software">💻 Software</option>
                <option value="hardware">🖥️ Hardware</option>
                <option value="red">🌐 Red/Conectividad</option>
                <option value="acceso">🔐 Acceso/Permisos</option>
                <option value="otro">📋 Otro</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="prioridad"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Prioridad *
              </label>
              <select
                id="prioridad"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value as PrioridadType)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                required
              >
                <option value="baja">🟢 Baja</option>
                <option value="media">🟡 Media</option>
                <option value="alta">🟠 Alta</option>
                <option value="critica">🔴 Crítica</option>
              </select>
            </div>
          </div>

          {/* Preview de prioridad */}
          <div className={`p-4 rounded-lg border-2 ${getPrioridadColor(prioridad)}`}>
            <div className="flex items-center">
              <span className="text-2xl mr-3">{getCategoriaIcon(categoria)}</span>
              <div>
                <p className="font-semibold">
                  Prioridad: {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
                </p>
                <p className="text-sm">
                  Categoría: {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Descripción del problema *
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
              placeholder="Describa detalladamente el problema que está experimentando..."
              required
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {descripcion.length} caracteres
            </p>
          </div>

          {/* Información adicional */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Información Adicional
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ubicacion"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Ubicación/Área
                </label>
                <input
                  type="text"
                  id="ubicacion"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Ej: Oficina 302, Piso 3"
                />
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="+54 11 1234-5678"
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="equipoAfectado"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Equipo Afectado (opcional)
              </label>
              <input
                type="text"
                id="equipoAfectado"
                value={equipoAfectado}
                onChange={(e) => setEquipoAfectado(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                placeholder="Ej: PC-001, Laptop-HR-05"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <span className="mr-2">🎫</span>
              Crear Ticket de Soporte
            </button>
            <button
              type="button"
              onClick={() => {
                setAsunto('');
                setDescripcion('');
                setCategoria('software');
                setPrioridad('media');
                setUbicacion('');
                setTelefono('');
                setEquipoAfectado('');
              }}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            ✅ Custom form cargado dinámicamente - React compartido globalmente
          </p>
        </div>
      </div>
    </div>
  );
}
