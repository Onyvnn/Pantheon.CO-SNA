import React, { useState, useRef } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  FileText, 
  Camera, 
  User, 
  MapPin, 
  Clock, 
  UploadCloud, 
  Check, 
  FileImage, 
  AlertTriangle,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Search,
  CheckSquare,
  ShieldCheck
} from 'lucide-react';
import { Declaration, Pet } from '../types';
import { getRiskBadgeColor, getRiskIconColor } from '../data';

interface InspectorViewProps {
  declarations: Declaration[];
  onUpdateDeclaration: (updated: Declaration) => void;
}

export default function InspectorView({ declarations, onUpdateDeclaration }: InspectorViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'inspected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Report abuse form state
  const [showAbuseForm, setShowAbuseForm] = useState(false);
  const [abuseDescription, setAbuseDescription] = useState('');
  const [abuseEvidenceName, setAbuseEvidenceName] = useState('');
  const [abuseEvidenceUrl, setAbuseEvidenceUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Inspector notes
  const [inspectorNotes, setInspectorNotes] = useState('');

  // Helper to determine single declaration overall risk level
  const getRiskLevel = (dec: Declaration): 'high' | 'medium' | 'low' => {
    if (dec.hasProductsToDeclare && dec.declaredItems.some(i => i.riskLevel === 'prohibited')) {
      return 'high'; // Red
    }
    if (dec.hasPets || (dec.hasProductsToDeclare && dec.declaredItems.some(i => i.riskLevel === 'restricted'))) {
      return 'medium'; // Yellow
    }
    return 'low'; // Green
  };

  // Helper to sort and filter declarations
  const getProcessedDeclarations = () => {
    // Filter
    let filtered = declarations.filter((dec) => {
      const risk = getRiskLevel(dec);
      
      const matchesRisk = filterRisk === 'all' || risk === filterRisk;
      
      const isInspected = dec.status === 'inspected';
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'pending' && !isInspected) || 
        (filterStatus === 'inspected' && isInspected);

      const matchesSearch = 
        dec.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        dec.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        dec.documentNumber.includes(searchQuery);

      return matchesRisk && matchesStatus && matchesSearch;
    });

    // Sort: Pending first, then by Risk Level (High -> Medium -> Low), then newest first
    return filtered.sort((a, b) => {
      // 1. Pending vs Inspected (if filterStatus is "all")
      if (a.status !== b.status) {
        return a.status === 'submitted' ? -1 : 1;
      }

      // 2. Risk Level (High > Medium > Low)
      const riskOrder = { high: 0, medium: 1, low: 2 };
      const riskA = riskOrder[getRiskLevel(a)];
      const riskB = riskOrder[getRiskLevel(b)];
      if (riskA !== riskB) {
        return riskA - riskB;
      }

      // 3. Newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const processedDecs = getProcessedDeclarations();
  const activeDeclaration = declarations.find(d => d.id === selectedId) || null;

  // Handle upload of evidence
  const handleEvidenceUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(15);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 100);

    const reader = new FileReader();
    reader.onloadend = () => {
      setTimeout(() => {
        setAbuseEvidenceName(file.name);
        setAbuseEvidenceUrl(reader.result as string);
        setIsUploading(false);
      }, 600);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleEvidenceUpload(e.dataTransfer.files[0]);
    }
  };

  // Actions
  const handleApprove = (dec: Declaration) => {
    const updated: Declaration = {
      ...dec,
      status: 'inspected',
      inspectionOutcome: 'approved',
      inspectionNotes: inspectorNotes.trim() || 'Equipaje y documentación aprobada sin observaciones.',
      inspectionDate: new Date().toISOString()
    };
    onUpdateDeclaration(updated);
    setInspectorNotes('');
    setSelectedId(null);
  };

  const handleRetain = (dec: Declaration) => {
    const updated: Declaration = {
      ...dec,
      status: 'inspected',
      inspectionOutcome: 'retained',
      inspectionNotes: inspectorNotes.trim() || 'Retención preventiva aplicada debido a productos no autorizados o falta de documentación.',
      inspectionDate: new Date().toISOString()
    };
    onUpdateDeclaration(updated);
    setInspectorNotes('');
    setSelectedId(null);
  };

  const handleAbuseSubmit = (dec: Declaration) => {
    if (!abuseDescription.trim()) {
      alert('Por favor, ingrese una descripción detallada de la situación de maltrato.');
      return;
    }

    const updated: Declaration = {
      ...dec,
      status: 'inspected',
      inspectionOutcome: 'reported_abuse',
      inspectionNotes: `MALTRATO ANIMAL REPORTADO: ${abuseDescription}`,
      inspectionDate: new Date().toISOString(),
      abuseReport: {
        description: abuseDescription,
        evidenceName: abuseEvidenceName || 'evidencia_fotografica.jpg',
        evidenceUrl: abuseEvidenceUrl || 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=200',
        createdAt: new Date().toISOString()
      }
    };

    onUpdateDeclaration(updated);
    
    // Reset form
    setAbuseDescription('');
    setAbuseEvidenceName('');
    setAbuseEvidenceUrl('');
    setShowAbuseForm(false);
    setSelectedId(null);
  };

  return (
    <div className="space-y-4 p-3 animate-in fade-in duration-200" id="inspector-panel">
      {/* View Header */}
      <div className="bg-gradient-to-r from-sag-dark to-slate-800 text-white p-3.5 rounded-xl border border-slate-700/50 shadow-xs relative overflow-hidden">
        <div className="absolute right-[-10px] top-[-10px] opacity-10">
          <Shield className="w-24 h-24 text-red-500" />
        </div>
        <span className="text-[8px] uppercase font-black tracking-wider text-emerald-400 block mb-0.5">
          Uso Exclusivo Funcionarios SAG
        </span>
        <h3 className="text-xs font-black tracking-tight font-display flex items-center gap-1.5">
          🛡️ Control de Fronteras e Inspección Sanitaria
        </h3>
        <p className="text-[10px] text-slate-300 mt-1 leading-normal">
          Revise declaraciones juradas juramentadas de viajeros, valide certificados veterinarios y proceda con autorizaciones sanitarias.
        </p>
      </div>

      {/* Main split-screen or single view container */}
      {!activeDeclaration ? (
        <div className="space-y-3">
          {/* Filters & Search */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-3xs space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por Nombre, RUT o Folio..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sag-blue bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Filtrar Riesgo</label>
                <select
                  value={filterRisk}
                  onChange={(e: any) => setFilterRisk(e.target.value)}
                  className="w-full p-1.5 rounded border border-slate-200 bg-white font-semibold text-slate-700"
                >
                  <option value="all">⚠️ Todos los Riesgos</option>
                  <option value="high">🔴 Alto Riesgo (Prohibido)</option>
                  <option value="medium">🟡 Riesgo Medio (Mascotas/Restringido)</option>
                  <option value="low">🟢 Bajo Riesgo (Permitido)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Filtrar Estado</label>
                <select
                  value={filterStatus}
                  onChange={(e: any) => setFilterStatus(e.target.value)}
                  className="w-full p-1.5 rounded border border-slate-200 bg-white font-semibold text-slate-700"
                >
                  <option value="pending">⌛ Pendientes</option>
                  <option value="inspected">✅ Inspeccionados</option>
                  <option value="all">🔎 Todos</option>
                </select>
              </div>
            </div>
          </div>

          {/* List of Declarations */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Declaraciones en Cola ({processedDecs.length})
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                Ordenado por criticidad de riesgo
              </span>
            </div>

            {processedDecs.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-slate-400 space-y-1.5 shadow-3xs">
                <p className="text-sm">📭</p>
                <p className="text-[11px] font-semibold">No se encontraron declaraciones pendientes</p>
                <p className="text-[9px] text-slate-400">Pruebe cargando la simulación rápida o completando un formulario.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {processedDecs.map((dec) => {
                  const risk = getRiskLevel(dec);
                  const isPending = dec.status === 'submitted';

                  return (
                    <button
                      key={dec.id}
                      onClick={() => {
                        setSelectedId(dec.id);
                        setInspectorNotes('');
                        setShowAbuseForm(false);
                      }}
                      className="w-full text-left bg-white border border-slate-200 rounded-xl p-3 hover:border-sag-blue hover:shadow-xs transition-all flex justify-between items-center gap-3 relative cursor-pointer"
                    >
                      {/* Left: Risk indicator strip */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${
                        risk === 'high' ? 'bg-red-500' : risk === 'medium' ? 'bg-amber-400' : 'bg-emerald-500'
                      }`} />

                      <div className="space-y-1 pl-1 text-[11px] flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 truncate max-w-[150px]">
                            {dec.fullName}
                          </span>
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 rounded-full ${
                            risk === 'high' 
                              ? 'bg-red-50 text-red-600 border border-red-200' 
                              : risk === 'medium' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {risk === 'high' ? 'Alto' : risk === 'medium' ? 'Medio' : 'Bajo'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[9.5px] text-slate-400 font-semibold font-mono">
                          <span>{dec.id}</span>
                          <span>•</span>
                          <span>{dec.documentNumber}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[9.5px] text-slate-500 leading-none">
                          <MapPin className="w-2.5 h-2.5 text-slate-400" />
                          <span className="truncate max-w-[180px]">{dec.borderCrossing}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[9px] pt-1">
                          {dec.hasProductsToDeclare ? (
                            <span className="inline-flex items-center gap-0.5 text-red-600 font-bold">
                              📦 Declara Productos ({dec.declaredItems.length})
                            </span>
                          ) : (
                            <span className="text-slate-400">Sin productos</span>
                          )}
                          <span>•</span>
                          {dec.hasPets ? (
                            <span className="inline-flex items-center gap-0.5 text-blue-600 font-bold">
                              🐾 {dec.pets.length} {dec.pets.length === 1 ? 'Mascota' : 'Mascotas'}
                            </span>
                          ) : (
                            <span className="text-slate-400">Sin mascotas</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        {isPending ? (
                          <span className="bg-amber-100 text-amber-800 text-[8.5px] font-black uppercase px-2 py-0.5 rounded border border-amber-200">
                            Pendiente
                          </span>
                        ) : (
                          <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded border ${
                            dec.inspectionOutcome === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : dec.inspectionOutcome === 'retained'
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {dec.inspectionOutcome === 'approved' ? 'Aprobado' : dec.inspectionOutcome === 'retained' ? 'Retenido' : 'Maltrato'}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Detailed View of Single Selected Declaration */
        <div className="space-y-3 animate-in slide-in-from-right duration-200 bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          {/* Back button and title */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <button
              onClick={() => {
                setSelectedId(null);
                setInspectorNotes('');
                setShowAbuseForm(false);
              }}
              className="text-xs text-slate-500 hover:text-sag-blue font-bold flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded cursor-pointer"
            >
              ← Volver a la Lista
            </button>
            <span className="text-[10px] font-black font-mono text-slate-400">
              FOLIO: {activeDeclaration.id}
            </span>
          </div>

          {/* Traveler Details */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Datos del Declarante
            </h4>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Nombre Completo:</span>
                <span className="font-bold text-slate-800 text-right">{activeDeclaration.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Documento ({activeDeclaration.documentType.toUpperCase()}):</span>
                <span className="font-bold font-mono text-slate-700">{activeDeclaration.documentNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Nacionalidad:</span>
                <span className="font-bold text-slate-700">{activeDeclaration.nationality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Frontera / Control:</span>
                <span className="font-bold text-slate-700 text-right max-w-[200px] truncate">{activeDeclaration.borderCrossing}</span>
              </div>
              {activeDeclaration.vehiclePlate && (
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Vehículo / Patente:</span>
                  <span className="font-bold font-mono text-slate-700 uppercase bg-slate-200 px-1.5 py-0.2 rounded">
                    {activeDeclaration.vehiclePlate}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Declared Items Section */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Equipaje y Productos Declarados
            </h4>
            {activeDeclaration.hasProductsToDeclare && activeDeclaration.declaredItems.length > 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                {activeDeclaration.declaredItems.map((item) => (
                  <div key={item.id} className="p-2 flex justify-between items-start text-[10.5px]">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">
                        Categoría: {item.category === 'vegetal' ? '🌱 Vegetal' : item.category === 'animal' ? '🥩 Animal' : '⚗️ Químico'}
                      </p>
                    </div>
                    <span className={`text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                      item.riskLevel === 'prohibited'
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : item.riskLevel === 'restricted'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {item.riskLevel === 'prohibited' ? '🔴 Prohibido' : item.riskLevel === 'restricted' ? '🟡 Restringido' : '🟢 Permitido'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-emerald-50/40 border border-emerald-150 p-2.5 rounded-lg text-center text-[10.5px] text-emerald-800 font-semibold flex items-center justify-center gap-1.5">
                <span>🟢</span> No declara productos agrícolas ni pecuarios de riesgo.
              </div>
            )}
          </div>

          {/* Registered Pets Details */}
          {activeDeclaration.hasPets && activeDeclaration.pets && activeDeclaration.pets.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Mascotas en Tránsito
              </h4>
              <div className="space-y-2">
                {activeDeclaration.pets.map((pet) => (
                  <div key={pet.id} className="bg-blue-50/30 border border-blue-200 rounded-lg p-2.5 text-[10.5px] space-y-1.5">
                    <div className="flex justify-between items-center border-b border-blue-100 pb-1">
                      <span className="font-bold text-slate-800 text-xs">🐾 {pet.name}</span>
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase">
                        {pet.species === 'dog' ? '🐶 Perro' : pet.species === 'cat' ? '🐱 Gato' : `Otro (${pet.otherSpecies || 'Desconocido'})`}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-500 font-semibold leading-tight">
                        <strong className="text-slate-600 font-extrabold">Vacunas declaradas:</strong> {pet.vaccines}
                      </p>
                      {pet.vetDocName && (
                        <p className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                          <span>📎 Archivo:</span>
                          <span className="underline truncate max-w-[150px]">{pet.vetDocName}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* THE DOCUMENT PHOTO (Foto del Documento) REQUIRED BY PROMPT */}
          <div className="space-y-1.5 pt-1">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              📷 Foto del Documento Sanitario / Certificado Digital
            </h4>
            
            {/* Displaying uploaded vet document image, PDF placeholder, or Traveler Identification Passport */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 flex flex-col items-center justify-center p-3 relative min-h-[160px]">
              
              {/* If pet documents exist, show them */}
              {activeDeclaration.hasPets && activeDeclaration.pets && activeDeclaration.pets[0]?.vetDocUrl ? (
                <div className="w-full flex flex-col items-center space-y-2">
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider">
                    Certificado de {activeDeclaration.pets[0].name}
                  </div>
                  
                  {activeDeclaration.pets[0].vetDocName?.endsWith('.pdf') ? (
                    <div className="flex flex-col items-center text-center p-4 space-y-2">
                      <FileText className="w-12 h-12 text-rose-500" />
                      <div>
                        <p className="text-white text-xs font-bold truncate max-w-[200px]">
                          {activeDeclaration.pets[0].vetDocName}
                        </p>
                        <p className="text-slate-400 text-[9px]">
                          Formato PDF Digital Certificado - Firma Electrónica Validada
                        </p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={activeDeclaration.pets[0].vetDocUrl}
                      alt="Certificado Sanitario Mascota"
                      className="max-h-[180px] rounded border border-slate-700 object-contain bg-white p-1"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              ) : (
                /* FALLBACK HIGH-FIDELITY CUSTOMS DOCUMENT PHOTO SIMULATOR FOR PASSPORT / ID LUGGAGE */
                <div className="w-full text-white space-y-2">
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                    SISTEMA DE CONTROL DE ADUANAS SAG CHILE
                  </div>
                  
                  <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 space-y-2 text-left font-mono">
                    <div className="flex justify-between items-start border-b border-slate-700 pb-1.5">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">PASAPORTE / DOCUMENTO DE IDENTIDAD</p>
                        <p className="text-[12px] font-black text-white">{activeDeclaration.fullName.toUpperCase()}</p>
                      </div>
                      <div className="w-8 h-10 border border-slate-600 bg-slate-700 rounded flex items-center justify-center text-xs text-slate-500 select-none">
                        👤
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-300">
                      <div>
                        <span className="text-slate-500 font-bold uppercase block leading-none">Nº DOCUMENTO</span>
                        <span className="font-bold font-mono text-white text-[10.5px]">{activeDeclaration.documentNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold uppercase block leading-none">NACIONALIDAD</span>
                        <span className="font-bold text-white text-[10.5px]">{activeDeclaration.nationality}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold uppercase block leading-none">CONTROL FRONTERIZO</span>
                        <span className="font-bold text-white leading-none">{activeDeclaration.borderCrossing}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold uppercase block leading-none">REGISTRO DE INGRESO</span>
                        <span className="font-bold text-emerald-400">{new Date(activeDeclaration.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-700 pt-1.5 flex justify-between items-center text-[7.5px] text-slate-500">
                      <span>CHILE SAG DEPARTAMENTO CONTROL SANITARIO</span>
                      <span className="text-emerald-500">★ VERIFICADO DIGITALMENTE</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Digital Signature */}
          {activeDeclaration.signatureDataUrl && (
            <div className="space-y-1">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Firma Digital del Declarante
              </h4>
              <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 flex flex-col items-center justify-center min-h-[60px]">
                <img
                  src={activeDeclaration.signatureDataUrl}
                  alt="Firma del Declarante"
                  className="max-h-[50px] object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[8px] text-slate-400 mt-1">Suscrito bajo juramento y validez legal</span>
              </div>
            </div>
          )}

          {/* ABUSE FORM DRAWER (DESPLEGABLE REPORTAR MALTRATO) */}
          {showAbuseForm && (
            <div className="bg-red-50/90 border border-red-200 rounded-xl p-3.5 space-y-3 animate-in slide-in-from-bottom duration-200">
              <div className="border-b border-red-200/50 pb-1.5 flex justify-between items-center">
                <span className="text-red-700 font-black text-xs uppercase flex items-center gap-1 font-display">
                  🚨 Reportar Maltrato de Mascota
                </span>
                <button
                  type="button"
                  onClick={() => setShowAbuseForm(false)}
                  className="text-[10px] bg-red-100 hover:bg-red-200 text-red-700 font-bold px-2 py-0.5 rounded cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              <div className="space-y-3 text-[11px]">
                <div>
                  <label className="block font-bold text-red-800 mb-0.5">
                    Descripción del Estado de la Mascota *
                  </label>
                  <textarea
                    rows={3}
                    value={abuseDescription}
                    onChange={(e) => setAbuseDescription(e.target.value)}
                    placeholder="Detalle los signos visibles de maltrato, deshidratación, falta de aire o contenedor inadecuado..."
                    className="w-full text-xs p-2 rounded border border-red-300 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-red-800 mb-0.5">
                    Cargar Evidencia Fotográfica (Obligatorio) *
                  </label>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleEvidenceUpload(e.target.files[0]);
                      }
                    }}
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                  />

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5 ${
                      isDragging
                        ? 'border-red-500 bg-red-100/30'
                        : abuseEvidenceUrl
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-red-300 hover:border-red-500 hover:bg-white'
                    }`}
                  >
                    {isUploading ? (
                      <div className="w-full py-1.5 space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-bold text-red-700">
                          <span>Subiendo evidencia...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-red-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-red-600 h-full transition-all duration-150"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : abuseEvidenceName ? (
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-800 block truncate max-w-[200px]">
                            {abuseEvidenceName}
                          </span>
                        </div>
                        {abuseEvidenceUrl && (
                          <img
                            src={abuseEvidenceUrl}
                            alt="Evidencia fotográfica"
                            className="h-14 mt-1 border border-slate-200 rounded object-contain max-w-[120px] bg-white p-0.5"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-1">
                        <Camera className="w-7 h-7 text-red-400" />
                        <p className="text-[10.5px] font-bold text-red-700">
                          Arrastre la fotografía aquí
                        </p>
                        <p className="text-[8.5px] text-slate-400">
                          o haga clic para seleccionar archivo (JPG, PNG)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAbuseSubmit(activeDeclaration)}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  🚨 Confirmar Reporte de Maltrato y Sanción
                </button>
              </div>
            </div>
          )}

          {/* INSPECTOR DECISION CONTROLS & NOTES */}
          {activeDeclaration.status === 'submitted' && !showAbuseForm && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              {/* Internal Notes input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  ✍️ Observaciones de la Inspección (Opcional)
                </label>
                <input
                  type="text"
                  value={inspectorNotes}
                  onChange={(e) => setInspectorNotes(e.target.value)}
                  placeholder="Ej: Equipaje inspeccionado físicamente sin novedades..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sag-blue focus:border-sag-blue bg-white"
                />
              </div>

              {/* Approve / Retain / Abuse buttons */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(activeDeclaration)}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    APROBAR INGRESO
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRetain(activeDeclaration)}
                    className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    RETENER EQUIPAJE
                  </button>
                </div>

                {/* Abuse Report Button if declaration has pets */}
                {activeDeclaration.hasPets && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAbuseForm(true);
                      setAbuseDescription('');
                      setAbuseEvidenceName('');
                      setAbuseEvidenceUrl('');
                    }}
                    className="w-full py-2 bg-gradient-to-r from-red-500 to-amber-600 text-white font-black text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:from-red-600 hover:to-amber-700 cursor-pointer"
                  >
                    🐾 REPORTAR MALTRATO DE MASCOTA
                  </button>
                )}
              </div>
            </div>
          )}

          {/* IN CASE IT IS ALREADY INSPECTED */}
          {activeDeclaration.status === 'inspected' && (
            <div className="mt-3 p-3 rounded-xl border space-y-2 text-[11px] bg-slate-50 border-slate-200">
              <span className="text-[9px] font-black text-slate-400 uppercase block tracking-wider leading-none">
                Resultado de la Inspección
              </span>
              <div className="flex items-center gap-2">
                {activeDeclaration.inspectionOutcome === 'approved' ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] uppercase">
                    ✓ Aprobado
                  </span>
                ) : activeDeclaration.inspectionOutcome === 'retained' ? (
                  <span className="inline-flex items-center gap-1 text-rose-700 font-extrabold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10px] uppercase">
                    ❌ Retenido
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-700 font-extrabold bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px] uppercase">
                    🚨 Maltrato Reportado
                  </span>
                )}
                <span className="text-slate-400 font-semibold text-[9.5px]">
                  {activeDeclaration.inspectionDate ? new Date(activeDeclaration.inspectionDate).toLocaleString() : ''}
                </span>
              </div>
              <p className="text-slate-600 font-medium italic">
                "{activeDeclaration.inspectionNotes}"
              </p>

              {/* If abuse details exists, render them too */}
              {activeDeclaration.abuseReport && (
                <div className="border-t border-slate-200 pt-2 space-y-1.5">
                  <p className="font-extrabold text-red-700 text-[10px] uppercase">Evidencia de Maltrato Animal</p>
                  <p className="text-slate-500 leading-tight">{activeDeclaration.abuseReport.description}</p>
                  {activeDeclaration.abuseReport.evidenceUrl && (
                    <img
                      src={activeDeclaration.abuseReport.evidenceUrl}
                      alt="Evidencia fotográfica"
                      className="max-h-[120px] rounded border border-slate-200 object-contain bg-white p-0.5 mt-1"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
