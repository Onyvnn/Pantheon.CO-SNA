import React from 'react';
import { Shield, Smartphone, FileCheck, History, Info, BarChart3 } from 'lucide-react';

interface HeaderProps {
  currentView: 'form' | 'history' | 'info' | 'inspector' | 'admin';
  onViewChange: (view: 'form' | 'history' | 'info' | 'inspector' | 'admin') => void;
  hasHistory: boolean;
}

export default function Header({ currentView, onViewChange, hasHistory }: HeaderProps) {
  return (
    <header id="app-header" className="w-full bg-sag-dark text-white shadow-md relative overflow-hidden">
      {/* Chilean Flag Accent Bar at top */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-sag-blue"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-sag-red"></div>
      </div>

      <div className="px-3 py-2.5 max-w-md mx-auto flex flex-col gap-2.5">
        {/* Top row: Flag/Shield & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-white p-1 rounded-sm shadow-sm flex items-center justify-center">
              {/* Simple CSS Chilean Flag / Shield Representation */}
              <div className="w-6 h-6 flex flex-col relative overflow-hidden border border-gray-200">
                <div className="h-1/2 flex w-full">
                  <div className="w-1/2 bg-sag-blue flex items-center justify-center">
                    <span className="text-[6px] text-white font-bold">★</span>
                  </div>
                  <div className="w-1/2 bg-white"></div>
                </div>
                <div className="h-1/2 bg-sag-red w-full"></div>
              </div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider font-semibold text-gray-300 leading-none">
                Gobierno de Chile
              </div>
              <h1 className="text-xs font-bold tracking-tight text-white flex items-center gap-1 mt-0.5">
                SAG <span className="font-normal text-[10.5px] text-emerald-400">| Declaración Digital</span>
              </h1>
            </div>
          </div>
          
          <div className="bg-slate-900/80 px-2 py-0.5 rounded text-[8px] font-black uppercase text-emerald-400 tracking-wider border border-slate-700">
            Frontera Terrestre
          </div>
        </div>

        {/* Bottom row: Navigation tabs adjusted for 5 options */}
        <nav className="grid grid-cols-5 gap-0.5 bg-white/5 p-0.5 rounded-lg border border-white/10" id="main-nav">
          <button
            id="nav-btn-form"
            onClick={() => onViewChange('form')}
            className={`py-1 rounded text-[8.5px] sm:text-[9.5px] font-black tracking-tighter sm:tracking-normal transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 relative ${
              currentView === 'form'
                ? 'bg-white text-sag-dark shadow-xs'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Declarar</span>
          </button>

          <button
            id="nav-btn-history"
            onClick={() => onViewChange('history')}
            className={`py-1 rounded text-[8.5px] sm:text-[9.5px] font-black tracking-tighter sm:tracking-normal transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 relative ${
              currentView === 'history'
                ? 'bg-white text-sag-dark shadow-xs'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historial</span>
            {hasHistory && (
              <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-sag-red rounded-full ring-1 ring-sag-dark"></span>
            )}
          </button>

          <button
            id="nav-btn-info"
            onClick={() => onViewChange('info')}
            className={`py-1 rounded text-[8.5px] sm:text-[9.5px] font-black tracking-tighter sm:tracking-normal transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 relative ${
              currentView === 'info'
                ? 'bg-white text-sag-dark shadow-xs'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Guía</span>
          </button>

          <button
            id="nav-btn-inspector"
            onClick={() => onViewChange('inspector')}
            className={`py-1 rounded text-[8.5px] sm:text-[9.5px] font-black tracking-tighter sm:tracking-normal transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 relative ${
              currentView === 'inspector'
                ? 'bg-gradient-to-r from-red-600 to-sag-blue text-white shadow-xs'
                : 'text-amber-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Inspector</span>
          </button>

          <button
            id="nav-btn-admin"
            onClick={() => onViewChange('admin')}
            className={`py-1 rounded text-[8.5px] sm:text-[9.5px] font-black tracking-tighter sm:tracking-normal transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 relative ${
              currentView === 'admin'
                ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-xs'
                : 'text-emerald-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Reportes</span>
          </button>
        </nav>
      </div>

      {/* Sub-Header Mobile Signal / Offline Banner (useful for land border concept) */}
      <div className="bg-emerald-900/60 border-t border-emerald-800/40 text-[11px] text-emerald-300 px-4 py-1 text-center font-medium flex items-center justify-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Listo para uso Offline en Controles Fronterizos Terrestres
      </div>
    </header>
  );
}
