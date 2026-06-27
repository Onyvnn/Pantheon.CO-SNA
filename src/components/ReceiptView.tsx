import React from 'react';
import { ShieldCheck, Download, Calendar, MapPin, User, FileText, CheckCircle2, QrCode, ArrowLeft, Share2 } from 'lucide-react';
import { Declaration } from '../types';

interface ReceiptViewProps {
  declaration: Declaration;
  onBackToForm: () => void;
}

export default function ReceiptView({ declaration, onBackToForm }: ReceiptViewProps) {
  // Simple fake barcode rendering
  const Barcode = () => {
    return (
      <div className="flex justify-center items-center h-12 gap-[2px] bg-white p-2 border border-gray-100 rounded">
        {[2, 1, 3, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1].map((width, idx) => (
          <div
            key={idx}
            className="bg-black h-full"
            style={{ width: `${width}px` }}
          />
        ))}
      </div>
    );
  };

  // Beautiful simulated QR Code using SVG grid
  const SimulatedQRCode = ({ value }: { value: string }) => {
    // Standard static blocks to look perfectly like a real QR code
    return (
      <div className="bg-white p-3 rounded-xl border-2 border-slate-200 inline-block">
        <svg width="120" height="120" viewBox="0 0 100 100" className="mx-auto">
          {/* Top-Left Finder */}
          <rect x="0" y="0" width="30" height="30" fill="#0f2c59" />
          <rect x="5" y="5" width="20" height="20" fill="white" />
          <rect x="10" y="10" width="10" height="10" fill="#0f2c59" />

          {/* Top-Right Finder */}
          <rect x="70" y="0" width="30" height="30" fill="#0f2c59" />
          <rect x="75" y="5" width="20" height="20" fill="white" />
          <rect x="80" y="10" width="10" height="10" fill="#0f2c59" />

          {/* Bottom-Left Finder */}
          <rect x="0" y="70" width="30" height="30" fill="#0f2c59" />
          <rect x="5" y="75" width="20" height="20" fill="white" />
          <rect x="10" y="80" width="10" height="10" fill="#0f2c59" />

          {/* Alignment block */}
          <rect x="75" y="75" width="10" height="10" fill="#0f2c59" />

          {/* Simulated Random QR Code Data Pixels */}
          <rect x="40" y="0" width="5" height="10" fill="#0f2c59" />
          <rect x="50" y="5" width="10" height="5" fill="#0f2c59" />
          <rect x="45" y="15" width="15" height="5" fill="#0f2c59" />
          <rect x="35" y="25" width="5" height="15" fill="#0f2c59" />

          <rect x="0" y="40" width="10" height="5" fill="#0f2c59" />
          <rect x="15" y="45" width="10" height="10" fill="#0f2c59" />
          <rect x="5" y="60" width="20" height="5" fill="#0f2c59" />

          <rect x="40" y="40" width="20" height="20" fill="#0f2c59" />
          <rect x="45" y="45" width="10" height="10" fill="white" />

          <rect x="70" y="40" width="10" height="5" fill="#0f2c59" />
          <rect x="85" y="45" width="10" height="15" fill="#0f2c59" />
          <rect x="75" y="60" width="15" height="5" fill="#0f2c59" />

          <rect x="40" y="70" width="5" height="20" fill="#0f2c59" />
          <rect x="55" y="80" width="10" height="10" fill="#0f2c59" />
          <rect x="45" y="90" width="20" height="5" fill="#0f2c59" />

          <rect x="90" y="90" width="10" height="10" fill="#0f2c59" />
        </svg>
      </div>
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Declaración SAG Chile - ${declaration.id}`,
        text: `Declaración Jurada Digital de ingreso terrestre SAG Chile, Folio ${declaration.id}.`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(`Folio copiado al portapapeles: ${declaration.id}. Envíe este correo o tome captura de pantalla.`);
      navigator.clipboard.writeText(declaration.id);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-3 space-y-3" id="receipt-container">
      {/* Back button */}
      <button
        onClick={onBackToForm}
        className="text-[10px] font-extrabold text-sag-dark hover:text-sag-blue flex items-center gap-1 py-0.5 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Volver al Formulario
      </button>

      {/* Main Digital Pass Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col relative">
        {/* Chilean Flag / Ribbon Header */}
        <div className="h-1.5 w-full flex">
          <div className="w-1/3 bg-sag-blue"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-sag-red"></div>
        </div>

        {/* Official Header */}
        <div className="bg-sag-dark text-white p-3 text-center space-y-0.5">
          <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400">
            Documento de Viaje Oficial
          </span>
          <h2 className="text-xs font-black tracking-tight font-display">
            DECLARACIÓN JURADA DIGITAL DE INGRESO
          </h2>
          <p className="text-[9px] text-slate-300">
            Servicio Agrícola y Ganadero | Ministerio de Agricultura
          </p>
        </div>

        {/* Folio / Status Banner */}
        <div className="bg-slate-50 border-y border-slate-200 p-2 flex justify-between items-center px-3">
          <div>
            <span className="text-[8px] uppercase font-bold text-slate-400 block leading-none">
              Número de Folio
            </span>
            <span className="text-xs font-mono font-black text-sag-dark">
              {declaration.id}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-1 border ${
            declaration.hasProductsToDeclare
              ? 'bg-rose-50 border-rose-200 text-sag-red'
              : 'bg-emerald-50 border-emerald-200 text-sag-green'
          }`}>
            <span className={`w-1 h-1 rounded-full ${declaration.hasProductsToDeclare ? 'bg-sag-red' : 'bg-sag-green'}`}></span>
            {declaration.hasProductsToDeclare ? 'CON PRODUCTOS' : 'SIN PRODUCTOS'}
          </span>
        </div>

        {/* QR Code and Barcode Section */}
        <div className="p-3.5 text-center flex flex-col items-center justify-center space-y-2 bg-gradient-to-b from-white to-slate-50/50">
          <SimulatedQRCode value={declaration.id} />
          <div className="space-y-1">
            <Barcode />
            <span className="text-[8px] text-slate-400 font-mono tracking-widest block">
              *{declaration.id}*
            </span>
          </div>
        </div>

        {/* Summary Details */}
        <div className="p-3 border-t border-slate-100 space-y-2.5 text-[11px] text-slate-700">
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
            <div>
              <span className="text-[8px] text-slate-400 font-extrabold block uppercase">Nombre Declarado</span>
              <span className="font-bold text-slate-800 line-clamp-1">{declaration.fullName}</span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-extrabold block uppercase">Documento</span>
              <span className="font-bold text-slate-800 uppercase font-mono">
                {declaration.documentType}: {declaration.documentNumber}
              </span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-extrabold block uppercase">Frontera de Ingreso</span>
              <span className="font-bold text-slate-800 flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-sag-blue shrink-0" />
                {declaration.borderCrossing}
              </span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-extrabold block uppercase">Fecha de Envío</span>
              <span className="font-bold text-slate-800 flex items-center gap-0.5 font-mono">
                <Calendar className="w-3 h-3 text-sag-blue shrink-0" />
                {new Date(declaration.createdAt).toLocaleDateString('es-CL')}
              </span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-extrabold block uppercase">Transporte</span>
              <span className="font-bold text-slate-800 uppercase truncate block">
                {declaration.transportType === 'car' ? '🚗 Auto' :
                 declaration.transportType === 'bus' ? '🚌 Autobús' :
                 declaration.transportType === 'motorcycle' ? '🏍 Moto' :
                 declaration.transportType === 'pedestrian' ? 'Peatón' : 'Otro'}
                {declaration.vehiclePlate && ` (${declaration.vehiclePlate})`}
              </span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-extrabold block uppercase">Nacionalidad</span>
              <span className="font-bold text-slate-800 truncate block">{declaration.nationality}</span>
            </div>
          </div>

          {/* Declared Products List inside receipt */}
          <div className="bg-slate-50 p-2 rounded border border-slate-200 space-y-1.5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block border-b border-slate-200 pb-0.5">
              Registro de Mercancías Declaradas
            </span>
            {declaration.declaredItems.length === 0 ? (
              <p className="text-[10px] text-emerald-800 font-bold flex items-center gap-0.5">
                ✓ El pasajero declara NO traer productos vegetales ni animales regulados.
              </p>
            ) : (
              <div className="space-y-1 max-h-28 overflow-y-auto">
                {declaration.declaredItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] py-0.5 border-b border-slate-100 last:border-none">
                    <span className="text-slate-700 font-bold">• {item.name}</span>
                    <span className="text-[8px] font-extrabold bg-slate-200 text-slate-700 px-1 py-0.1 rounded uppercase">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Declared Pets List inside receipt */}
          {declaration.hasPets && declaration.pets && declaration.pets.length > 0 && (
            <div className="bg-blue-50/40 p-2 rounded border border-blue-200/50 space-y-1 mt-1 font-sans">
              <span className="text-[9px] font-black text-sag-dark uppercase tracking-wider block border-b border-blue-200/40 pb-0.5">
                🐾 Mascotas Registradas ({declaration.pets.length})
              </span>
              <div className="space-y-1.5">
                {declaration.pets.map((pet, idx) => (
                  <div key={idx} className="text-[10px] space-y-0.5 border-b border-blue-100 last:border-none pb-1 last:pb-0">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>• {pet.name} ({pet.species === 'dog' ? '🐶 Perro' : pet.species === 'cat' ? '🐱 Gato' : `🐾 ${pet.otherSpecies || 'Otro'}`})</span>
                      <span className="text-[8px] text-sag-blue font-extrabold uppercase">✓ Validado</span>
                    </div>
                    <div className="text-[8.5px] text-slate-500 font-semibold leading-tight">
                      Vacunas: {pet.vaccines}
                    </div>
                    {pet.vetDocName && (
                      <div className="text-[8px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        📎 {pet.vetDocName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signature Rendering inside receipt */}
          {declaration.signatureDataUrl && (
            <div className="border-t border-slate-100 pt-2 flex flex-col items-center">
              <span className="text-[8px] text-slate-400 font-extrabold uppercase mb-0.5">
                Firma Digital del Declarante
              </span>
              <img
                src={declaration.signatureDataUrl}
                alt="Firma"
                className="h-8 border border-slate-200 rounded p-0.5 bg-slate-50/50 max-w-[120px] object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-[8px] text-slate-400 font-semibold">
                Suscrito bajo juramento legal
              </span>
            </div>
          )}
        </div>

        {/* Disclaimer / Notice footer */}
        <div className="bg-emerald-950/5 border-t border-emerald-900/10 p-2 text-[9.5px] text-slate-500 leading-normal text-center font-semibold">
          Muestre este recibo en la barrera sanitaria. El oficial del SAG escaneará el código para completar el proceso.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => window.print()}
          className="flex-1 py-2 bg-white hover:bg-slate-50 text-sag-dark border border-slate-300 font-bold text-xs rounded flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Guardar PDF / Captura
        </button>

        <button
          onClick={handleShare}
          className="flex-1 py-2 bg-sag-blue hover:bg-sag-dark text-white font-bold text-xs rounded flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          Compartir Recibo
        </button>
      </div>

      {/* Guide Steps to border checkpoint */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1.5">
        <span className="text-[10.5px] font-extrabold text-amber-800 uppercase block tracking-wide">
          👣 Siguientes Pasos en el Control Fronterizo:
        </span>
        <ol className="list-decimal list-inside text-[10px] text-amber-900 space-y-1 leading-normal font-semibold">
          <li>
            <strong className="text-amber-950">No necesita internet:</strong> Guarde una captura de este código QR. Funcionará en plena cordillera sin cobertura.
          </li>
          <li>
            <strong className="text-amber-950">Inspección física:</strong> Pase su equipaje por rayos X en el control.
          </li>
          <li>
            <strong className="text-amber-950">Muestre su QR:</strong> En la ventanilla SAG, muestre este código para registrar su entrada.
          </li>
          <li>
            <strong className="text-amber-950">Exención de multa:</strong> Al declarar los alimentos en la lista, el inspector los retirará amigablemente si representan riesgo, <span className="underline text-sag-red font-bold">100% libre de multas</span>.
          </li>
        </ol>
      </div>
    </div>
  );
}
