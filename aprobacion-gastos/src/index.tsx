// Bizuit Custom Form: Aprobación de Gastos
// Este form será compilado con esbuild y cargado dinámicamente

import { useState } from 'react';

export default function AprobacionGastosForm() {
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('');
  const [categoria, setCategoria] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { monto, concepto, categoria });
    alert(`Gasto registrado: $${monto} - ${concepto}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Aprobación de Gastos
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Monto */}
          <div>
            <label
              htmlFor="monto"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Monto (USD)
            </label>
            <input
              type="number"
              id="monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
              placeholder="0.00"
              required
            />
          </div>

          {/* Concepto */}
          <div>
            <label
              htmlFor="concepto"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Concepto
            </label>
            <input
              type="text"
              id="concepto"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
              placeholder="Ej: Viáticos, Material de oficina..."
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label
              htmlFor="categoria"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Categoría
            </label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
              required
            >
              <option value="">Seleccione una categoría</option>
              <option value="viaticos">Viáticos</option>
              <option value="material">Material de Oficina</option>
              <option value="tecnologia">Tecnología</option>
              <option value="servicios">Servicios</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Enviar Solicitud
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            ✅ Custom form cargado dinámicamente - React compartido globalmente
          </p>
        </div>
      </div>
    </div>
  );
}
