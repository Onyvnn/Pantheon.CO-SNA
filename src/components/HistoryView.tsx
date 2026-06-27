import React from 'react';
import { FileText, MapPin, Calendar, ArrowRight, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Declaration } from '../types';

interface HistoryViewProps {
  declarations: Declaration[];
  onSelectDeclaration: (declaration: Declaration) => void;
  onDeleteDeclaration: (id: string) => void;
  onStartNew: () => void;
}

export default function HistoryView({
  declarations,
  onSelectDeclaration,
  onDeleteDeclaration,
  onStartNew
}: HistoryViewProps) {
  return (
    <div className="w-full max-w-md mx-auto p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-sag-dark font-display">Historial de Declaraciones</h2>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-full">
          {declarations.length} {declarations.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>

      <p className="text-[11px] text-slate-500 leading-normal">
        Estas declaraciones están almacenadas localmente en su dispositivo y están listas para ser presentadas sin conexión a internet en los complejos aduaneros.
      </p>

      {declarations.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center space-y-3 shadow-2xs">
          <div className="bg-slate-50 p-3 rounded-full inline-block text-slate-400 border border-slate-100">
            <FileText className="w-8 h-8 mx-auto" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-slate-800">No hay declaraciones previas</h3>
            <p className="text-[10.5px] text-slate-400 max-w-xs mx-auto">
              Aún no ha enviado ningún formulario. Complete una declaración para guardarla en este dispositivo.
            </p>
          </div>
          <button
            onClick={onStartNew}
            className="px-3 py-1.5 bg-sag-blue hover:bg-sag-dark text-white font-bold text-xs rounded transition-all shadow-2xs cursor-pointer"
          >
            Nueva Declaración Móvil
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {declarations.map((dec) => (
            <div
              key={dec.id}
              className="bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-sag-blue/40 transition-all flex flex-col p-3 relative group"
            >
              {/* Header inside history item */}
              <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-1.5 mb-1.5">
                <div>
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase font-mono block">FOLIO</span>
                  <span className="text-xs font-black font-mono text-sag-dark">{dec.id}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-1.5 py-0.1 rounded text-[8px] font-extrabold border ${
                    dec.hasProductsToDeclare
                      ? 'bg-rose-50 border-rose-200 text-sag-red'
                      : 'bg-emerald-50 border-emerald-200 text-sag-green'
                  }`}>
                    {dec.hasProductsToDeclare ? 'Trae Productos' : 'Sin Productos'}
                  </span>
                </div>
              </div>

              {/* Body info inside history item */}
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-1 text-[10.5px] text-slate-600 mb-2">
                <div>
                  <span className="text-[8px] text-slate-400 uppercase font-extrabold block leading-none">Declarante</span>
                  <span className="font-bold text-slate-800 line-clamp-1">{dec.fullName}</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 uppercase font-extrabold block leading-none">Paso Fronterizo</span>
                  <span className="font-bold text-slate-700 flex items-center gap-0.5 truncate">
                    <MapPin className="w-3 h-3 text-sag-blue shrink-0" />
                    {dec.borderCrossing}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 uppercase font-extrabold block leading-none">Fecha de Emisión</span>
                  <span className="font-mono flex items-center gap-0.5 text-slate-500">
                    <Calendar className="w-3 h-3 text-sag-blue shrink-0" />
                    {new Date(dec.createdAt).toLocaleDateString('es-CL')}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 uppercase font-extrabold block leading-none">Documento</span>
                  <span className="font-mono font-bold uppercase truncate block">{dec.documentType}: {dec.documentNumber}</span>
                </div>
              </div>

              {/* Footer controls inside history item */}
              <div className="flex gap-1.5 border-t border-slate-100 pt-2">
                <button
                  onClick={() => onSelectDeclaration(dec)}
                  className="flex-1 py-1 px-2.5 bg-slate-50 hover:bg-sag-blue hover:text-white text-sag-dark font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1 border border-slate-200 hover:border-sag-blue cursor-pointer"
                >
                  Ver Código QR / Recibo
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Está seguro de que desea eliminar esta declaración del historial?')) {
                      onDeleteDeclaration(dec.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-sag-red hover:bg-rose-50 rounded transition-colors border border-transparent hover:border-rose-100 cursor-pointer"
                  title="Eliminar registro"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Warning banner at bottom of history */}
      <div className="bg-slate-100 border border-slate-200 p-2.5 rounded text-slate-700 text-[10px] leading-normal flex gap-1.5">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p>
          <strong>Importante:</strong> Las declaraciones se almacenan localmente. Borrar el historial de navegación o cookies las eliminará de forma permanente de este dispositivo.
        </p>
      </div>
    </div>
  );
}
