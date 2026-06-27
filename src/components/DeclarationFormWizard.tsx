import React, { useState, useRef, useEffect } from 'react';
import { User, MapPin, ClipboardList, CheckSquare, ChevronRight, ChevronLeft, Calendar, FileText, AlertOctagon, HelpCircle, AlertTriangle, ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { BorderCrossing, DeclaredItem, Declaration, RiskLevel } from '../types';
import { CHILE_BORDER_CROSSINGS, getRiskBadgeColor, getRiskIconColor } from '../data';
import ProductSearch from './ProductSearch';

interface DeclarationFormWizardProps {
  onSubmit: (declaration: Declaration) => void;
}

export default function DeclarationFormWizard({ onSubmit }: DeclarationFormWizardProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Personal Info
  const [fullName, setFullName] = useState('');
  const [documentType, setDocumentType] = useState<'rut' | 'passport' | 'dni'>('passport');
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [nationality, setNationality] = useState('');

  // Step 2: Trip Info
  const [borderCrossing, setBorderCrossing] = useState(CHILE_BORDER_CROSSINGS[0].id);
  const [transportType, setTransportType] = useState<'car' | 'bus' | 'motorcycle' | 'pedestrian' | 'other'>('car');
  const [vehiclePlate, setVehiclePlate] = useState('');

  // Step 3: Product Declarations
  const [hasProductsToDeclare, setHasProductsToDeclare] = useState<boolean | null>(null);
  const [declaredItems, setDeclaredItems] = useState<DeclaredItem[]>([]);
  // Individual categories checked
  const [categoryVegetal, setCategoryVegetal] = useState(false);
  const [categoryAnimal, setCategoryAnimal] = useState(false);
  const [categoryChemical, setCategoryChemical] = useState(false);

  // Step 4: Signature & Oath
  const [acceptOath, setAcceptOath] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Auto-scrolling to top on step change for a mobile feel
  useEffect(() => {
    const el = document.getElementById('wizard-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  // Clean canvas signature
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw helpful background text guide
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(10, canvas.height - 20);
        ctx.lineTo(canvas.width - 10, canvas.height - 20);
        ctx.stroke();
      }
    }
    setHasSignature(false);
  };

  // Setup canvas with guides on render
  useEffect(() => {
    if (step === 4 && canvasRef.current) {
      const canvas = canvasRef.current;
      // Fit signature pad to physical display
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 140;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(15, canvas.height - 30);
        ctx.lineTo(canvas.width - 15, canvas.height - 30);
        ctx.stroke();
      }
    }
  }, [step]);

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);

    const pos = getEventPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = '#0f2c59';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Prevent scrolling when drawing on touch screens
    if (e.cancelable) e.preventDefault();

    const pos = getEventPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getEventPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  // Product Selection Handlers
  const handleAddProduct = (name: string, category: 'vegetal' | 'animal' | 'chemical' | 'other', risk: RiskLevel) => {
    const newItem: DeclaredItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      category,
      riskLevel: risk,
    };
    setDeclaredItems((prev) => [...prev, newItem]);
    setHasProductsToDeclare(true);

    // Auto check category boxes
    if (category === 'vegetal') setCategoryVegetal(true);
    if (category === 'animal') setCategoryAnimal(true);
    if (category === 'chemical') setCategoryChemical(true);
  };

  const handleRemoveProduct = (id: string) => {
    setDeclaredItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (updated.length === 0) {
        setHasProductsToDeclare(null);
      }
      return updated;
    });
  };

  // Validators
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Nombre completo es obligatorio.';
    if (!documentNumber.trim()) newErrors.documentNumber = 'Documento es obligatorio.';
    if (!nationality.trim()) newErrors.nationality = 'Nacionalidad es obligatoria.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Ingrese un correo electrónico válido.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!borderCrossing) newErrors.borderCrossing = 'Seleccione el control fronterizo.';
    if (transportType !== 'pedestrian' && !vehiclePlate.trim()) {
      newErrors.vehiclePlate = 'Patente del vehículo requerida para transporte motorizado.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (hasProductsToDeclare === null) {
      newErrors.hasProducts = 'Debe indicar si trae o no productos para ingresar.';
    } else if (hasProductsToDeclare === true && declaredItems.length === 0) {
      newErrors.declaredItems = 'Ha seleccionado que trae productos. Por favor declare al menos uno usando el buscador.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    if (!acceptOath) newErrors.acceptOath = 'Debe declarar bajo juramento para enviar.';
    if (!hasSignature) newErrors.signature = 'Debe firmar en el recuadro digital.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setErrors({});
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = () => {
    if (validateStep4()) {
      const signatureDataUrl = canvasRef.current?.toDataURL();
      const newDeclaration: Declaration = {
        id: `SAG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        fullName,
        documentType,
        documentNumber,
        email,
        nationality,
        borderCrossing: CHILE_BORDER_CROSSINGS.find(b => b.id === borderCrossing)?.name || borderCrossing,
        transportType,
        vehiclePlate: transportType !== 'pedestrian' ? vehiclePlate.toUpperCase() : undefined,
        hasProductsToDeclare: hasProductsToDeclare === true,
        declaredItems: hasProductsToDeclare === true ? declaredItems : [],
        signatureDataUrl,
        createdAt: new Date().toISOString(),
        status: 'submitted',
      };
      onSubmit(newDeclaration);
    }
  };

  return (
    <div id="wizard-container" className="w-full max-w-md mx-auto bg-slate-50/30 p-3 space-y-3">
      {/* Step Indicators */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-white rounded-xl border border-slate-200/65 shadow-xs">
        {[1, 2, 3, 4].map((num) => {
          const isActive = step === num;
          const isCompleted = step > num;
          return (
            <React.Fragment key={num}>
              <div className="flex items-center gap-1.5 flex-1 justify-center">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-sag-blue text-white shadow-xs'
                      : isCompleted
                      ? 'bg-sag-green text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? '✓' : num}
                </div>
                <span className={`text-[10px] font-bold ${isActive ? 'text-sag-dark' : 'text-slate-400 hidden sm:inline'}`}>
                  {num === 1 ? 'Viajero' : num === 2 ? 'Ruta' : num === 3 ? 'Declarar' : 'Firma'}
                </span>
              </div>
              {num < 4 && (
                <div className={`h-0.5 w-3 transition-all duration-300 ${step > num ? 'bg-sag-green' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP 1: Datos Personales */}
      {step === 1 && (
        <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-sm font-extrabold text-sag-dark flex items-center gap-1.5 font-display">
              <User className="w-4 h-4 text-sag-blue" />
              1. Identificación del Viajero
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Ingrese sus datos de identidad oficiales para el control fronterizo.</p>
          </div>

          <div className="space-y-2.5">
            <div>
              <label htmlFor="fullname" className="block text-[11px] font-bold text-slate-600 mb-0.5">
                Nombre Completo *
              </label>
              <input
                id="fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Alberto Pérez Gómez"
                className={`w-full text-xs px-2.5 py-1.5 rounded border focus:outline-none focus:ring-1 focus:ring-sag-blue ${
                  errors.fullName ? 'border-sag-red bg-rose-50/20' : 'border-slate-300'
                } text-gray-800 font-medium`}
              />
              {errors.fullName && <p className="text-[10px] text-sag-red mt-0.5 font-semibold">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label htmlFor="doc-type" className="block text-[11px] font-bold text-slate-600 mb-0.5">
                  Tipo *
                </label>
                <select
                  id="doc-type"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as any)}
                  className="w-full text-xs px-1.5 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sag-blue text-gray-800 bg-white font-medium"
                >
                  <option value="passport">Pasaporte</option>
                  <option value="rut">RUT Chile</option>
                  <option value="dni">DNI / Cédula</option>
                </select>
              </div>

              <div className="col-span-2">
                <label htmlFor="doc-num" className="block text-[11px] font-bold text-slate-600 mb-0.5">
                  N° Documento / Identificación *
                </label>
                <input
                  id="doc-num"
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder={documentType === 'rut' ? '12.345.678-9' : 'AB123456'}
                  className={`w-full text-xs px-2.5 py-1.5 rounded border focus:outline-none focus:ring-1 focus:ring-sag-blue ${
                    errors.documentNumber ? 'border-sag-red bg-rose-50/20' : 'border-slate-300'
                  } text-gray-800 font-mono`}
                />
                {errors.documentNumber && <p className="text-[10px] text-sag-red mt-0.5 font-semibold">{errors.documentNumber}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="nationality" className="block text-[11px] font-bold text-slate-600 mb-0.5">
                Nacionalidad *
              </label>
              <input
                id="nationality"
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="Argentina, Peruana, Española..."
                className={`w-full text-xs px-2.5 py-1.5 rounded border focus:outline-none focus:ring-1 focus:ring-sag-blue ${
                  errors.nationality ? 'border-sag-red bg-rose-50/20' : 'border-slate-300'
                } text-gray-800 font-medium`}
              />
              {errors.nationality && <p className="text-[10px] text-sag-red mt-0.5 font-semibold">{errors.nationality}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-[11px] font-bold text-slate-600 mb-0.5">
                Correo Electrónico (Recibo digital) *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className={`w-full text-xs px-2.5 py-1.5 rounded border focus:outline-none focus:ring-1 focus:ring-sag-blue ${
                  errors.email ? 'border-sag-red bg-rose-50/20' : 'border-slate-300'
                } text-gray-800 font-medium`}
              />
              {errors.email && <p className="text-[10px] text-sag-red mt-0.5 font-semibold">{errors.email}</p>}
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                Enviaremos una copia firmada con código QR para presentar sin internet ante el control oficial del SAG.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Datos de Ruta */}
      {step === 2 && (
        <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-sm font-extrabold text-sag-dark flex items-center gap-1.5 font-display">
              <MapPin className="w-4 h-4 text-sag-blue" />
              2. Datos del Cruce Terrestre
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Especifique el puesto fronterizo por donde ingresa a territorio chileno.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="border-crossing" className="block text-[11px] font-bold text-slate-600 mb-0.5">
                Control Fronterizo Terrestre *
              </label>
              <select
                id="border-crossing"
                value={borderCrossing}
                onChange={(e) => setBorderCrossing(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sag-blue text-gray-800 bg-white font-medium"
              >
                {CHILE_BORDER_CROSSINGS.map((bc) => (
                  <option key={bc.id} value={bc.id}>
                    {bc.name} ({bc.connectedCountry} ➔ Chile)
                  </option>
                ))}
              </select>
              {errors.borderCrossing && <p className="text-[10px] text-sag-red mt-0.5 font-semibold">{errors.borderCrossing}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                Medio de Transporte *
              </label>
              <div className="grid grid-cols-2 gap-1.5" id="transport-options">
                {[
                  { id: 'car', label: '🚗 Auto' },
                  { id: 'bus', label: '🚌 Autobús' },
                  { id: 'motorcycle', label: '🏍 Moto' },
                  { id: 'pedestrian', label: '🥾 Peatón' },
                ].map((trans) => (
                  <button
                    key={trans.id}
                    type="button"
                    onClick={() => {
                      setTransportType(trans.id as any);
                      if (trans.id === 'pedestrian') setVehiclePlate('');
                    }}
                    className={`py-1.5 px-2 text-xs font-bold rounded border text-center transition-all cursor-pointer ${
                      transportType === trans.id
                        ? 'border-sag-blue bg-blue-50/70 text-sag-blue shadow-2xs font-extrabold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {trans.label}
                  </button>
                ))}
              </div>
            </div>

            {transportType !== 'pedestrian' && (
              <div>
                <label htmlFor="vehicle-plate" className="block text-[11px] font-bold text-slate-600 mb-0.5">
                  Patente del Vehículo / Matrícula *
                </label>
                <input
                  id="vehicle-plate"
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  placeholder="Ej: AA-BB-11 o AB123CD"
                  className={`w-full text-xs px-2.5 py-1.5 rounded border uppercase focus:outline-none focus:ring-1 focus:ring-sag-blue ${
                    errors.vehiclePlate ? 'border-sag-red bg-rose-50/20' : 'border-slate-300'
                  } text-gray-800 font-mono font-medium`}
                />
                {errors.vehiclePlate && <p className="text-[10px] text-sag-red mt-0.5 font-semibold">{errors.vehiclePlate}</p>}
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  Se requiere para el manifiesto conjunto del vehículo y equipajes en el control de aduanas.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Declaración de Productos (The Core Requirement) */}
      {step === 3 && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="border-b border-slate-100 pb-1.5">
              <h2 className="text-sm font-extrabold text-sag-dark flex items-center gap-1.5 font-display">
                <ClipboardList className="w-4 h-4 text-sag-blue" />
                3. Declaración de Mercancías
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                La legislación de Chile exige declarar todo producto vegetal, animal o biológico que ingrese al país.
              </p>
            </div>

            {/* Direct legal alert prompt */}
            <div className="bg-amber-50/70 border border-amber-200 p-2.5 rounded-lg text-amber-900 flex items-start gap-2 text-[10.5px] leading-normal">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-amber-950 block">Norma chilena de ingreso terrestre:</span>
                Si declara traer un producto, el inspector lo evaluará. Si está prohibido, lo desechará <strong>sin multa</strong>. Si NO lo declara y el SAG lo encuentra, se le aplicará una <strong>multa inmediata de hasta 30 UTM</strong>.
              </div>
            </div>

            {/* Selection Yes/No button */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 leading-normal">
                ¿Transporta alimentos, semillas, plantas, carnes, quesos o medicamentos veterinarios? *
              </label>

              <div className="grid grid-cols-2 gap-2" id="declarable-yes-no">
                <button
                  type="button"
                  onClick={() => setHasProductsToDeclare(true)}
                  className={`py-2 px-2.5 rounded border-2 font-bold text-xs transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    hasProductsToDeclare === true
                      ? 'border-sag-red bg-rose-50/40 text-sag-red shadow-2xs font-extrabold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <span className="text-xs">Sí, traigo productos</span>
                  <span className="text-[9px] font-medium text-slate-400">(Debo listarlos abajo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHasProductsToDeclare(false);
                    setDeclaredItems([]);
                    setCategoryVegetal(false);
                    setCategoryAnimal(false);
                    setCategoryChemical(false);
                  }}
                  className={`py-2 px-2.5 rounded border-2 font-bold text-xs transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    hasProductsToDeclare === false
                      ? 'border-sag-green bg-emerald-50/40 text-sag-green shadow-2xs font-extrabold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <span className="text-xs">No traigo nada</span>
                  <span className="text-[9px] font-medium text-slate-400">(Equipaje limpio)</span>
                </button>
              </div>
              {errors.hasProducts && <p className="text-[10px] text-sag-red font-semibold">{errors.hasProducts}</p>}
            </div>
          </div>

          {/* Conditional Product Search & List when "Yes" selected */}
          {hasProductsToDeclare === true && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Product list currently added to this declaration */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Productos Declarados ({declaredItems.length})
                  </span>
                  {declaredItems.length > 0 && (
                    <span className="text-[9px] bg-sag-red/10 text-sag-red px-1.5 py-0.2 rounded-full font-bold">
                      Sujeto a Inspección
                    </span>
                  )}
                </div>

                {declaredItems.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 border border-dashed border-slate-200 rounded-lg space-y-1">
                    <ClipboardList className="w-6 h-6 mx-auto text-slate-300" />
                    <p className="text-[11px] font-medium">No ha agregado ningún producto todavía.</p>
                    <p className="text-[10px] font-semibold text-sag-red">
                      ¡Búsquelo abajo para agregarlo de inmediato!
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {declaredItems.map((item) => (
                      <div key={item.id} className="py-1.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-sm shrink-0">
                            {item.category === 'vegetal' ? '🍏' : item.category === 'animal' ? '🥩' : '💊'}
                          </span>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-800 block truncate">{item.name}</span>
                            <span className={`inline-block text-[9px] px-1 py-0.1 rounded border font-medium ${getRiskBadgeColor(item.riskLevel)}`}>
                              {item.riskLevel === 'prohibited' ? 'Ingreso prohibido fresco' : item.riskLevel === 'restricted' ? 'Restringido' : 'Autorizado'}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(item.id)}
                          className="text-slate-400 hover:text-sag-red p-1 rounded hover:bg-slate-50 shrink-0 cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.declaredItems && <p className="text-[10px] text-sag-red font-semibold bg-rose-50/50 p-1.5 rounded border border-rose-100">{errors.declaredItems}</p>}
              </div>

              {/* Automatic alert search component */}
              <ProductSearch onAddProduct={handleAddProduct} />
            </div>
          )}

          {/* Guarantee screen for clean luggage */}
          {hasProductsToDeclare === false && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-950 space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-1 font-extrabold text-[11px] text-emerald-800 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4" />
                Declaración Jurada sin Mercancía Regulada
              </div>
              <p className="text-[10.5px] leading-relaxed text-emerald-900 font-medium">
                Usted declara que no ingresa ningún artículo orgánico o biológico regulado por el SAG de Chile.
              </p>
              <p className="text-[10px] bg-white/70 p-2 rounded border border-emerald-200/50 leading-relaxed font-semibold text-emerald-950">
                ⚠️ El equipaje será revisado por caninos detectores y rayos X. Omitir productos de riesgo conlleva multas aduaneras inmediatas.
              </p>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: Firma Digital y Juramento Legal */}
      {step === 4 && (
        <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-sm font-extrabold text-sag-dark flex items-center gap-1.5 font-display">
              <FileText className="w-4 h-4 text-sag-blue" />
              4. Juramento de Veracidad y Firma
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Su declaración tiene carácter legal bajo la normativa chilena.</p>
          </div>

          <div className="space-y-3">
            {/* Legal Oath Checkbox */}
            <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 select-none cursor-pointer transition-all ${
              acceptOath ? 'bg-blue-50/50 border-sag-blue text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            onClick={() => setAcceptOath(!acceptOath)}
            id="oath-checkbox-container"
            >
              <div className="mt-0.5 shrink-0">
                <input
                  id="oath-checkbox"
                  type="checkbox"
                  checked={acceptOath}
                  onChange={() => {}} // Handled by div click
                  className="rounded text-sag-blue focus:ring-sag-blue h-3.5 w-3.5"
                />
              </div>
              <div className="text-[10px] leading-relaxed">
                <span className="font-extrabold text-slate-800 block mb-0.5">DECLARO BAJO JURAMENTO:</span>
                Que los datos registrados en esta declaración corresponden a lo que transporto en mi equipaje y vehículo. Entiendo que omitir información o mentir es una infracción aduanera sancionada con multas severas y decomiso inmediato.
              </div>
            </div>
            {errors.acceptOath && <p className="text-[10px] text-sag-red font-semibold">{errors.acceptOath}</p>}


            {/* Touch Signature Pad */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-700">
                  Firma Digital del Declarante *
                </label>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-[10px] font-bold text-sag-red hover:underline"
                >
                  Limpiar Firma
                </button>
              </div>

              <div className="relative border border-slate-300 rounded-lg overflow-hidden bg-slate-50 shadow-inner">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full bg-slate-50 cursor-crosshair touch-none"
                  style={{ height: '140px' }}
                />
                {!hasSignature && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300 text-xs">
                    Firmar con su dedo o puntero aquí
                  </div>
                )}
              </div>
              {errors.signature && <p className="text-[10px] text-sag-red font-medium">{errors.signature}</p>}
            </div>

            {/* Warnings and official stamps */}
            <div className="p-3 bg-slate-100 rounded-lg text-slate-700 text-[10px] leading-relaxed flex items-start gap-1.5 border border-slate-200">
              <AlertOctagon className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                Esta declaración móvil es procesada electrónicamente por el sistema fronterizo SAG y genera un recibo digital oficial válido para los pasos fronterizos chilenos autorizados. No requiere impresión física.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Button Controls */}
      <div className="flex gap-3 px-1">
        {step > 1 && (
          <button
            id="wizard-btn-back"
            type="button"
            onClick={handleBack}
            className="flex-1 py-3 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
            Atrás
          </button>
        )}

        {step < 4 ? (
          <button
            id="wizard-btn-next"
            type="button"
            onClick={handleNext}
            className="flex-grow py-3 text-xs font-bold text-white bg-sag-blue rounded-xl hover:bg-sag-dark active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            Siguiente Paso
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        ) : (
          <button
            id="wizard-btn-submit"
            type="button"
            onClick={handleFinalSubmit}
            className="flex-grow py-3 text-xs font-bold text-white bg-sag-green rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            <ShieldCheck className="w-4.5 h-4.5" />
            Enviar Declaración
          </button>
        )}
      </div>
    </div>
  );
}
