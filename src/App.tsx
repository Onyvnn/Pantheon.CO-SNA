import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, History, Info, HelpCircle, Heart, Smartphone, RefreshCw, Layers } from 'lucide-react';
import { Declaration } from './types';
import Header from './components/Header';
import DeclarationFormWizard from './components/DeclarationFormWizard';
import ReceiptView from './components/ReceiptView';
import HistoryView from './components/HistoryView';
import InfoView from './components/InfoView';

export default function App() {
  const [currentView, setCurrentView] = useState<'form' | 'history' | 'info'>('form');
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [selectedDeclaration, setSelectedDeclaration] = useState<Declaration | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sag_declarations');
      if (stored) {
        setDeclarations(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading local storage declarations:', e);
    }
  }, []);

  // Save to local storage on changes
  const saveDeclarations = (newDecs: Declaration[]) => {
    setDeclarations(newDecs);
    try {
      localStorage.setItem('sag_declarations', JSON.stringify(newDecs));
    } catch (e) {
      console.error('Error saving declarations to local storage:', e);
    }
  };

  // Submit handler
  const handleFormSubmit = (newDeclaration: Declaration) => {
    const updated = [newDeclaration, ...declarations];
    saveDeclarations(updated);
    setSelectedDeclaration(newDeclaration);
    // Smooth transition to receipt screen
  };

  // Delete handler
  const handleDeleteDeclaration = (id: string) => {
    const updated = declarations.filter(d => d.id !== id);
    saveDeclarations(updated);
    if (selectedDeclaration?.id === id) {
      setSelectedDeclaration(null);
    }
  };

  // Quick fill mock data for demonstration
  const handleQuickDemoFill = () => {
    const mockDec: Declaration = {
      id: `SAG-2026-773918`,
      fullName: 'Carolina Andrea Silva Muñoz',
      documentType: 'rut',
      documentNumber: '18.945.321-K',
      email: 'carolina.silva@ejemplo.cl',
      nationality: 'Chilena',
      borderCrossing: 'Paso Los Libertadores (Portillo)',
      transportType: 'car',
      vehiclePlate: 'KH-RT-45',
      hasProductsToDeclare: true,
      declaredItems: [
        { id: 'm1', name: 'Manzanas o frutas frescas', category: 'vegetal', riskLevel: 'prohibited' },
        { id: 'm2', name: 'Quesos frescos o artesanales', category: 'animal', riskLevel: 'prohibited' },
        { id: 'm3', name: 'Yerba Mate procesada y envasada', category: 'vegetal', riskLevel: 'allowed' }
      ],
      createdAt: new Date().toISOString(),
      status: 'submitted'
    };
    const updated = [mockDec, ...declarations];
    saveDeclarations(updated);
    setSelectedDeclaration(mockDec);
    setCurrentView('form');
  };

  const handleStartNew = () => {
    setSelectedDeclaration(null);
    setCurrentView('form');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start py-4 px-2 sm:py-8 sm:px-4 font-sans selection:bg-sag-blue/20 selection:text-sag-blue">
      {/* Background Decorative Gradient/Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

      {/* Main Responsive Mobile Frame Container */}
      <div className="w-full max-w-md bg-slate-50 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 flex flex-col relative min-h-[760px] max-h-[900px] overflow-y-auto">
        
        {/* Mobile Status Bar Simulation */}
        <div className="bg-slate-950 text-[10px] text-gray-400 px-5 py-1 flex justify-between items-center font-semibold select-none">
          <span className="font-mono">11:08 AM</span>
          <div className="flex items-center gap-1.5">
            <span>🔋 98%</span>
            <span>📶 SAG-Net</span>
          </div>
        </div>

        {/* Application Header */}
        <Header
          currentView={selectedDeclaration ? 'form' : currentView}
          onViewChange={(view) => {
            setSelectedDeclaration(null);
            setCurrentView(view);
          }}
          hasHistory={declarations.length > 0}
        />

        {/* Dynamic Screen View Space with Animations */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative pb-12" id="app-viewport">
          <AnimatePresence mode="wait">
            {selectedDeclaration ? (
              // Receipt digital passport view
              <motion.div
                key="receipt"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <ReceiptView
                  declaration={selectedDeclaration}
                  onBackToForm={handleStartNew}
                />
              </motion.div>
            ) : currentView === 'form' ? (
              // Declaration Form Wizard View
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Introduction Banner with helpful alert */}
                <div className="px-3 pt-3">
                  <div className="bg-gradient-to-r from-sag-blue to-sag-dark text-white p-3 rounded-xl shadow-2xs relative overflow-hidden">
                    <div className="absolute right-[-10px] top-[-10px] opacity-10">
                      <ShieldCheck className="w-20 h-20" />
                    </div>
                    <span className="text-[8px] uppercase font-black tracking-widest text-emerald-400 block mb-0.5">
                      Declaración Obligatoria
                    </span>
                    <h3 className="text-xs font-black tracking-tight font-display">Formulario Digital SAG</h3>
                    <p className="text-[10px] text-slate-200 mt-0.5 leading-normal">
                      Evite filas en la frontera. Complete su declaración jurada digital de forma segura en su celular.
                    </p>
                  </div>
                </div>

                {/* Form Wizard Component */}
                <DeclarationFormWizard onSubmit={handleFormSubmit} />

                {/* Quick Demo Helper Button inside form space */}
                <div className="px-4 pb-4 text-center">
                  <button
                    onClick={handleQuickDemoFill}
                    className="text-[9px] text-slate-500 hover:text-sag-blue font-bold inline-flex items-center gap-1 bg-white hover:bg-slate-100 px-2.5 py-1 rounded border border-slate-200 transition-all shadow-3xs cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    Cargar Demostración Rápida (Ejemplo Completo)
                  </button>
                </div>
              </motion.div>
            ) : currentView === 'history' ? (
              // Declarations History List View
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <HistoryView
                  declarations={declarations}
                  onSelectDeclaration={(dec) => setSelectedDeclaration(dec)}
                  onDeleteDeclaration={handleDeleteDeclaration}
                  onStartNew={handleStartNew}
                />
              </motion.div>
            ) : (
              // Rules Info Help View
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <InfoView />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Institutional Government Footer inside Simulator */}
        <footer className="bg-slate-900 text-[10px] text-slate-400 py-3 text-center border-t border-slate-800 select-none px-4">
          <div className="flex items-center justify-center gap-1.5 font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Ministerio de Agricultura - SAG de Chile
          </div>
          <p className="font-light leading-normal">
            Sistema de Declaración Jurada Digital para Equipajes Terrestres. Todos los derechos reservados.
          </p>
        </footer>
      </div>

      {/* Outer Instructions for Desktop Viewers */}
      <div className="mt-6 text-slate-400 text-xs text-center max-w-sm space-y-2 hidden md:block">
        <p className="flex items-center justify-center gap-1 font-semibold">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          Simulador Móvil Oficial
        </p>
        <p className="leading-relaxed opacity-85">
          Esta aplicación está diseñada para visualizarse con proporciones de pantalla de celular, emulando la app móvil progresiva que los turistas cargan en la aduana terrestre.
        </p>
      </div>
    </div>
  );
}
