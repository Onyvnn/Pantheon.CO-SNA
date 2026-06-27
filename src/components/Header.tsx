import React from 'react';
import { Shield, Smartphone, FileCheck, History, Info } from 'lucide-react';

interface HeaderProps {
  currentView: 'form' | 'history' | 'info';
  onViewChange: (view: 'form' | 'history' | 'info') => void;
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

      <div className="px-4 py-3 max-w-md mx-auto flex items-center justify-between">
        {/* Left: Chilean Government Shield Style */}
        <div className="flex items-center space-x-2.5">
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
            <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-300 leading-none">
              Gobierno de Chile
            </div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
              SAG <span className="font-normal text-xs text-emerald-400">| Declaración Digital</span>
            </h1>
          </div>
        </div>

        {/* Right: Quick Navigation Tabs for Mobile App Feel */}
        <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10" id="main-nav">
          <button
            id="nav-btn-form"
            onClick={() => onViewChange('form')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 relative ${
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
            className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 relative ${
              currentView === 'history'
                ? 'bg-white text-sag-dark shadow-xs'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historial</span>
            {hasHistory && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-sag-red rounded-full ring-2 ring-sag-dark"></span>
            )}
          </button>

          <button
            id="nav-btn-info"
            onClick={() => onViewChange('info')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 relative ${
              currentView === 'info'
                ? 'bg-white text-sag-dark shadow-xs'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Guía</span>
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
