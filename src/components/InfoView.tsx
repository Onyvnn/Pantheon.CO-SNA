import React from 'react';
import { HelpCircle, AlertTriangle, CheckCircle, Shield, FileText, ExternalLink, Info, Award } from 'lucide-react';

export default function InfoView() {
  return (
    <div className="w-full max-w-md mx-auto p-3 space-y-3">
      {/* Overview Banner */}
      <div className="bg-gradient-to-br from-sag-dark to-sag-blue text-white rounded-xl p-4 shadow-sm space-y-2 relative overflow-hidden">
        {/* Chilean Goverment Decorative Star */}
        <div className="absolute right-[-15px] top-[-15px] opacity-10 text-[90px] font-bold">★</div>

        <div className="bg-white/10 p-1.5 rounded inline-block">
          <Shield className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-xs font-black tracking-tight font-display">Patrimonio Sanitario de Chile</h2>
          <p className="text-[10px] text-slate-200 leading-normal font-light">
            Chile posee una geografía única aislada por la Cordillera, el Océano y el Desierto. El SAG protege esta condición impidiendo el ingreso de plagas que dañarían irremediablemente la flora, fauna y agricultura nacional.
          </p>
        </div>
      </div>

      {/* Quick Guide: Semáforo SAG */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2.5">
        <h3 className="text-[10px] font-black text-sag-dark uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-sag-blue" />
          Guía de Productos Permitidos y Prohibidos
        </h3>

        <div className="space-y-2 text-[10px]">
          {/* Prohibidos */}
          <div className="bg-rose-50/50 p-2.5 rounded border border-rose-100 space-y-1">
            <span className="font-extrabold text-sag-red uppercase flex items-center gap-1 text-[9px]">
              <span className="w-2 h-2 rounded-full bg-sag-red"></span>
              ❌ Prohibido Ingresar (Frescos o Artesanales)
            </span>
            <ul className="list-disc list-inside text-slate-700 pl-1 space-y-0.5 leading-normal">
              <li>Frutas y verduras frescas (manzanas, plátanos, etc.)</li>
              <li>Carnes frescas o crudas de vacuno, cerdo, pollo, cordero</li>
              <li>Cecinas rústicas, embutidos artesanales, salames caseros</li>
              <li>Miel pura, panales, cera de abejas o propóleo</li>
              <li>Quesos artesanales o de leche no pasteurizada</li>
              <li>Plantas vivas, esquejes, ramas o tierra/abono de jardín</li>
              <li>Semillas para siembra o granos crudos sin procesar</li>
            </ul>
          </div>

          {/* Restringidos */}
          <div className="bg-amber-50/50 p-2.5 rounded border border-amber-100 space-y-1">
            <span className="font-extrabold text-amber-800 uppercase flex items-center gap-1 text-[9px]">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              ⚠ Restringido (Exige Declaración obligatoria)
            </span>
            <ul className="list-disc list-inside text-slate-700 pl-1 space-y-0.5 leading-normal">
              <li>Frutos secos con cáscara (nueces, almendras con piel)</li>
              <li>Queso maduro industrial envasado al vacío</li>
              <li>Alimentos procesados de marcas comerciales selladas</li>
              <li>Alimento para mascotas en saco original sellado</li>
              <li>Medicamentos de uso veterinario (con receta oficial)</li>
              <li>Artesanías rústicas de madera o cortezas</li>
            </ul>
          </div>

          {/* Permitidos */}
          <div className="bg-emerald-50/50 p-2.5 rounded border border-emerald-100 space-y-1">
            <span className="font-extrabold text-sag-green uppercase flex items-center gap-1 text-[9px]">
              <span className="w-2 h-2 rounded-full bg-sag-green"></span>
              ✓ Permitido (Declarar igual para facilitar paso)
            </span>
            <ul className="list-disc list-inside text-slate-700 pl-1 space-y-0.5 leading-normal">
              <li>Yerba Mate procesada, seca, molida y envasada</li>
              <li>Café tostado, molido o en grano comercial</li>
              <li>Chocolates, dulces y galletas comerciales selladas</li>
              <li>Vino, cerveza y licores comerciales (límite de 2.5 litros)</li>
              <li>Aceites de cocina comerciales</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Las Multas SAG */}
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 space-y-1.5">
        <h3 className="text-[10px] font-black text-sag-red uppercase tracking-wider flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-sag-red" />
          ¿Cuáles son las Sanciones y Multas?
        </h3>
        <p className="text-[10px] text-rose-950 leading-normal font-semibold">
          Si el inspector del SAG detecta en su equipaje un producto prohibido u orgánico regulado que usted <strong>NO declaró</strong> en el formulario, incurre en delito aduanero:
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-[9px] text-rose-900 font-bold">
          <div className="bg-white/60 p-1.5 rounded border border-rose-100 text-center">
            <span className="block text-[9.5px] font-black text-sag-red">Multas</span>
            Desde 3 a 30 UTM (aprox. $200.000 a $2.000.000 CLP).
          </div>
          <div className="bg-white/60 p-1.5 rounded border border-rose-100 text-center">
            <span className="block text-[9.5px] font-black text-sag-red">Decomiso</span>
            Pérdida inmediata de las especies, destruidas en incinerador.
          </div>
        </div>
        <p className="text-[9px] text-rose-800 leading-normal text-center italic font-bold">
          "En Chile, declarar todo es la única forma de evitar multas seguras."
        </p>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2">
        <h3 className="text-[10px] font-black text-sag-dark uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-sag-blue" />
          Preguntas Frecuentes
        </h3>

        <div className="divide-y divide-slate-100 text-[10px] space-y-2">
          <div className="pt-1.5">
            <span className="font-extrabold text-slate-800 block">¿Qué pasa si tengo dudas sobre un alimento?</span>
            <p className="text-slate-500 leading-normal">
              Márquelo como "Sí traigo productos" y agréguelo en su lista. En la frontera, el inspector lo examinará de forma gratuita y le dirá si pasa o no. Nunca se le multará por declarar un producto, solo se le multará si lo esconde.
            </p>
          </div>

          <div className="pt-1.5">
            <span className="font-extrabold text-slate-800 block">¿Puedo ingresar con mi perro o gato mascota?</span>
            <p className="text-slate-500 leading-normal">
              Sí, pero requiere presentar el Certificado Zoosanitario de Exportación emitido por la autoridad sanitaria de su país de origen (ej: SENASA en Argentina, SENASAG en Bolivia) que acredite vacunas vigentes y desparasitación.
            </p>
          </div>

          <div className="pt-1.5">
            <span className="font-extrabold text-slate-800 block">¿Es necesario imprimir este formulario?</span>
            <p className="text-slate-500 leading-normal">
              No es necesario imprimir. El sistema genera un código QR que se puede almacenar en el celular como imagen. El oficial en frontera escaneará su pantalla directamente.
            </p>
          </div>
        </div>
      </div>

      {/* Official Footnote Links */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center space-y-1.5 text-[9px] text-slate-500">
        <div className="flex justify-center items-center gap-1 font-extrabold text-slate-700">
          <FileText className="w-3.5 h-3.5 text-sag-blue" />
          Normativa Vigente SAG Chile
        </div>
        <p className="leading-normal">
          Resolución exenta N° 3.036 de ingreso de equipaje y mercancías de turistas.
        </p>
        <a
          href="https://www.sag.gob.cl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sag-blue hover:underline inline-flex items-center gap-1 font-bold cursor-pointer"
        >
          Visitar Sitio Web Oficial del SAG
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
}
