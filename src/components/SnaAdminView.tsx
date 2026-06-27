import React, { useState } from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  FileText, 
  MapPin, 
  Calendar, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Download, 
  Filter, 
  RefreshCw, 
  Info,
  CheckCircle,
  XCircle,
  HeartCrack,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Declaration, BorderCrossing } from '../types';
import { CHILE_BORDER_CROSSINGS } from '../data';
import { motion } from 'motion/react';

interface SnaAdminViewProps {
  declarations: Declaration[];
}

// 6-Month Simulated Historical Data to make the charts and aggregates realistic
interface MonthlyStat {
  month: string;
  name: string;
  total: number;
  approved: number;
  retained: number;
  reportedAbuse: number;
}

const HISTORICAL_MONTHS: MonthlyStat[] = [
  { month: '2026-01', name: 'Ene 2026', total: 340, approved: 295, retained: 42, reportedAbuse: 3 },
  { month: '2026-02', name: 'Feb 2026', total: 420, approved: 360, retained: 54, reportedAbuse: 6 },
  { month: '2026-03', name: 'Mar 2026', total: 290, approved: 252, retained: 35, reportedAbuse: 3 },
  { month: '2026-04', name: 'Abr 2026', total: 210, approved: 185, retained: 23, reportedAbuse: 2 },
  { month: '2026-05', name: 'May 2026', total: 180, approved: 161, retained: 18, reportedAbuse: 1 },
  { month: '2026-06', name: 'Jun 2026', total: 250, approved: 215, retained: 31, reportedAbuse: 4 }
];

export default function SnaAdminView({ declarations }: SnaAdminViewProps) {
  // Filter states
  const [selectedCrossing, setSelectedCrossing] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Interaction/Export states
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Convert current user declarations to matching format for totals
  // And combine them with simulated history to display a rich dashboard
  
  // Filtered actual user declarations
  const filteredUserDecs = declarations.filter(dec => {
    // 1. Paso fronterizo filter
    const crossingObj = CHILE_BORDER_CROSSINGS.find(c => c.name === dec.borderCrossing || c.id === dec.borderCrossing);
    const crossingId = crossingObj ? crossingObj.id : dec.borderCrossing.toLowerCase();
    const matchesCrossing = selectedCrossing === 'all' || crossingId === selectedCrossing;

    // 2. Período filter
    let matchesPeriod = true;
    const decDate = new Date(dec.createdAt);
    const now = new Date();
    
    if (selectedPeriod === 'today') {
      matchesPeriod = decDate.toDateString() === now.toDateString();
    } else if (selectedPeriod === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesPeriod = decDate >= oneWeekAgo;
    } else if (selectedPeriod === 'month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesPeriod = decDate >= oneMonthAgo;
    }

    // 3. Tipo filter
    let matchesType = true;
    if (selectedType === 'with_products') {
      matchesType = dec.hasProductsToDeclare === true;
    } else if (selectedType === 'with_pets') {
      matchesType = dec.hasPets === true;
    } else if (selectedType === 'both') {
      matchesType = dec.hasProductsToDeclare === true && dec.hasPets === true;
    } else if (selectedType === 'none') {
      matchesType = dec.hasProductsToDeclare === false && dec.hasPets === false;
    }

    return matchesCrossing && matchesPeriod && matchesType;
  });

  // Calculate historical baseline sums depending on filters to keep metrics cohesive
  // If a specific crossing is filtered, we dynamically scale down the baseline data 
  // to represent a realistic proportion (sinceLos Libertadores gets ~35%, Samoré ~20%, etc.)
  let scaleFactor = 1.0;
  if (selectedCrossing !== 'all') {
    if (selectedCrossing === 'libertadores') scaleFactor = 0.35;
    else if (selectedCrossing === 'samore') scaleFactor = 0.20;
    else if (selectedCrossing === 'chacalluta') scaleFactor = 0.15;
    else scaleFactor = 0.05;
  }

  // Type multiplier to adjust historical baselines
  let typeFactor = 1.0;
  if (selectedType === 'with_products') typeFactor = 0.40;
  else if (selectedType === 'with_pets') typeFactor = 0.15;
  else if (selectedType === 'both') typeFactor = 0.05;
  else if (selectedType === 'none') typeFactor = 0.45;

  // Build the live months stats
  const monthlyData: MonthlyStat[] = HISTORICAL_MONTHS.map(m => ({
    ...m,
    total: Math.round(m.total * scaleFactor * typeFactor),
    approved: Math.round(m.approved * scaleFactor * typeFactor),
    retained: Math.round(m.retained * scaleFactor * typeFactor),
    reportedAbuse: Math.round(m.reportedAbuse * scaleFactor * typeFactor),
  }));

  // Add the user's declarations in June 2026
  const userJuneDecs = filteredUserDecs;
  const juneStat = monthlyData[5]; // June 2026 is index 5
  juneStat.total += userJuneDecs.length;
  juneStat.approved += userJuneDecs.filter(d => d.inspectionOutcome === 'approved').length;
  juneStat.retained += userJuneDecs.filter(d => d.inspectionOutcome === 'retained').length;
  juneStat.reportedAbuse += userJuneDecs.filter(d => d.inspectionOutcome === 'reported_abuse').length;

  // Calculate Totals for Summary Cards (Historical Baseline + Real User Input)
  const totalDeclarations = monthlyData.reduce((acc, m) => acc + m.total, 0);
  const totalApproved = monthlyData.reduce((acc, m) => acc + m.approved, 0);
  const totalRetained = monthlyData.reduce((acc, m) => acc + m.retained, 0);
  const totalAbuse = monthlyData.reduce((acc, m) => acc + m.reportedAbuse, 0);
  
  // Rates
  const retentionRate = totalDeclarations > 0 ? ((totalRetained / totalDeclarations) * 100).toFixed(1) : '0.0';
  const abuseRate = totalDeclarations > 0 ? ((totalAbuse / totalDeclarations) * 100).toFixed(1) : '0.0';

  // Export to CSV (Excel format)
  const handleExportExcel = () => {
    setIsExportingExcel(true);
    setExportMessage('Analizando registros y preparando planilla...');

    setTimeout(() => {
      // Build high fidelity CSV structure
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID Declaracion,Fecha Registro,Declarante,Documento,Tipo Doc,Paso Fronterizo,Declara Productos,Declara Mascotas,Estado Inspeccion,Resultado,Inspector Notas,Reporte Maltrato\n";

      // Include real user records
      filteredUserDecs.forEach(dec => {
        const hasProd = dec.hasProductsToDeclare ? "SI" : "NO";
        const hasPet = dec.hasPets ? "SI" : "NO";
        const outcome = dec.inspectionOutcome || "Pendiente";
        const notes = (dec.inspectionNotes || "").replace(/,/g, ";");
        const abuse = dec.abuseReport ? `SI: ${dec.abuseReport.description.replace(/,/g, ";")}` : "NO";
        csvContent += `${dec.id},${dec.createdAt},"${dec.fullName}",${dec.documentNumber},${dec.documentType},"${dec.borderCrossing}",${hasProd},${hasPet},${dec.status},${outcome},"${notes}","${abuse}"\n`;
      });

      // Append historical simulated details for complete export scale
      monthlyData.forEach((m, idx) => {
        for (let i = 0; i < Math.min(m.total, 15); i++) {
          const fakeId = `SAG-2026-F${idx}${i}`;
          const date = `${m.month}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T12:00:00Z`;
          const fakeNames = ["John Doe", "María González", "Carlos Muñoz", "Ana Silva", "Pierre Dupont", "Jean Luc", "Sofia Rossi"];
          const name = fakeNames[i % fakeNames.length];
          const doc = `${10000000 + i * 54321}-${i % 9}`;
          const border = CHILE_BORDER_CROSSINGS[i % CHILE_BORDER_CROSSINGS.length].name;
          const isRetained = i < m.retained ? "SI" : "NO";
          const isAbuse = i < m.reportedAbuse ? "SI" : "NO";
          const outcome = isAbuse === "SI" ? "Reportado Maltrato" : isRetained === "SI" ? "Retenido" : "Aprobado";
          csvContent += `${fakeId},${date},"${name}",${doc},RUT,"${border}",SI,${isAbuse === "SI" ? "SI" : "NO"},inspected,${outcome},"Inspeccion historica autorizada","${isAbuse === "SI" ? "Mascota transportada sin ventilacion" : "NO"}"\n`;
        }
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `SNA_Reporte_Declaraciones_${selectedCrossing}_${selectedPeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExportingExcel(false);
      setExportMessage('✓ Planilla Excel (.CSV) descargada exitosamente.');
      setTimeout(() => setExportMessage(null), 4000);
    }, 1500);
  };

  // Export to PDF
  const handleExportPdf = () => {
    setIsExportingPdf(true);
    setExportMessage('Compilando informe ejecutivo SAG-SNA...');

    setTimeout(() => {
      // Create simple printing or data url layout
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Informe Ejecutivo SNA - Aduanas de Chile</title>
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #333; }
                .header { border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 25px; }
                .logo-box { float: right; border: 1px solid #ccc; padding: 5px; text-align: center; font-size: 8px; }
                .title { font-size: 24px; font-weight: bold; color: #1e3a8a; margin: 0; }
                .subtitle { font-size: 12px; color: #666; margin-top: 5px; }
                .stats-grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
                .stat-card { border: 1px solid #e2e8f0; padding: 15px; rounded: 8px; text-align: center; background-color: #f8fafc; }
                .stat-val { font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 5px; }
                .stat-lbl { font-size: 10px; color: #64748b; text-transform: uppercase; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 12px; }
                th { background-color: #f1f5f9; color: #1e3a8a; font-weight: bold; }
                .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
                .badge-approved { background-color: #d1fae5; color: #065f46; }
                .badge-retained { background-color: #fee2e2; color: #991b1b; }
                .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 10px; color: #94a3b8; text-align: center; margin-top: 50px; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="logo-box">
                  GOBIERNO DE CHILE<br>SERVICIO NACIONAL DE ADUANAS
                </div>
                <h1 class="title">REPORTE CONSOLIDADO DE ADUANAS (SNA)</h1>
                <p class="subtitle">Generado el: ${new Date().toLocaleString()} | Filtro Paso: ${selectedCrossing} | Período: ${selectedPeriod}</p>
              </div>

              <h2>Resumen Ejecutivo de Gestión Fronteriza</h2>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-lbl">Total Declaraciones</div>
                  <div class="stat-val">${totalDeclarations}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-lbl">Ingresos Aprobados</div>
                  <div class="stat-val">${totalApproved}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-lbl">Retenciones Aplicadas</div>
                  <div class="stat-val" style="color: #991b1b;">${totalRetained}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-lbl">Reportes Maltrato</div>
                  <div class="stat-val" style="color: #dc2626;">${totalAbuse}</div>
                </div>
              </div>

              <h2>Desglose por Flujo Mensual (Año 2026)</h2>
              <table>
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th>Total Flujo</th>
                    <th>Aprobados</th>
                    <th>Retenciones</th>
                    <th>Maltrato Animal</th>
                    <th>% Eficacia Fiscalización</th>
                  </tr>
                </thead>
                <tbody>
                  ${monthlyData.map(m => `
                    <tr>
                      <td><strong>${m.name}</strong></td>
                      <td>${m.total}</td>
                      <td>${m.approved}</td>
                      <td>${m.retained}</td>
                      <td>${m.reportedAbuse}</td>
                      <td>${m.total > 0 ? ((m.retained / m.total) * 100).toFixed(1) : '0.0'}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <h2>Declaraciones del Viajero en Tiempo Real (${filteredUserDecs.length})</h2>
              ${filteredUserDecs.length === 0 ? '<p style="font-style: italic; color: #666;">No hay registros de usuarios ingresados en este período.</p>' : `
                <table>
                  <thead>
                    <tr>
                      <th>Folio</th>
                      <th>Fecha</th>
                      <th>Viajero</th>
                      <th>RUT / Documento</th>
                      <th>Equipaje Declarado</th>
                      <th>Estado / Inspección</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filteredUserDecs.map(d => `
                      <tr>
                        <td><code>${d.id}</code></td>
                        <td>${new Date(d.createdAt).toLocaleDateString()}</td>
                        <td>${d.fullName}</td>
                        <td>${d.documentNumber}</td>
                        <td>${d.hasProductsToDeclare ? `${d.declaredItems.length} items` : 'Ninguno'} / ${d.hasPets ? 'Mascotas' : 'No'}</td>
                        <td>
                          <span class="badge ${d.inspectionOutcome === 'approved' ? 'badge-approved' : 'badge-retained'}">
                            ${d.inspectionOutcome ? d.inspectionOutcome.toUpperCase() : 'PENDIENTE'}
                          </span>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              `}

              <div class="footer">
                Documento Oficial de Uso Interno - Servicio Nacional de Aduanas & Servicio Agrícola y Ganadero.
                <br>Santiago de Chile, 2026.
              </div>
              <script>
                window.onload = function() { window.print(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }

      setIsExportingPdf(false);
      setExportMessage('✓ Informe Ejecutivo PDF compilado y enviado a la impresora.');
      setTimeout(() => setExportMessage(null), 4000);
    }, 1500);
  };

  // Find maximum total in monthly stats to dynamically scale SVG graph height
  const maxMonthlyTotal = Math.max(...monthlyData.map(m => m.total), 1);

  return (
    <div className="space-y-4 p-3 animate-in fade-in duration-200" id="sna-admin-view">
      
      {/* Title block */}
      <div className="bg-gradient-to-r from-sag-blue to-blue-900 text-white p-4 rounded-xl border border-blue-700/40 shadow-xs relative overflow-hidden">
        <div className="absolute right-[-10px] top-[-10px] opacity-10">
          <Activity className="w-24 h-24 text-white" />
        </div>
        <span className="text-[8px] uppercase font-black tracking-wider text-emerald-300 block mb-0.5">
          SISTEMA DE REPORTERÍA INTEGRADO SNA / SAG
        </span>
        <h3 className="text-sm font-black tracking-tight font-display flex items-center gap-1.5">
          📊 Panel de Control y Auditoría - Administrador SNA
        </h3>
        <p className="text-[10.5px] text-blue-100 mt-1 leading-relaxed">
          Monitoree flujos aduaneros, tasas de retenciones sanitarias y reportes de maltrato animal en tiempo real.
        </p>
      </div>

      {/* FILTER CONTROL PANEL */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-3xs space-y-3">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Filter className="w-4 h-4 text-sag-blue" />
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
            Filtros del Reporte Ejecutivo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10.5px]">
          {/* Border Crossing Filter */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-500">Paso Fronterizo / Control</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
              <select
                value={selectedCrossing}
                onChange={(e) => setSelectedCrossing(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:ring-1 focus:ring-sag-blue focus:outline-none"
              >
                <option value="all">🌐 Todos los Pasos Terrestres</option>
                {CHILE_BORDER_CROSSINGS.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Period Filter */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-500">Período de Inspección</label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:ring-1 focus:ring-sag-blue focus:outline-none"
              >
                <option value="all">🗓️ Todo el Historial (2026)</option>
                <option value="today">☀️ Solo Hoy</option>
                <option value="week">📅 Últimos 7 Días</option>
                <option value="month">🌙 Últimos 30 Días</option>
              </select>
            </div>
          </div>

          {/* Declaration Type Filter */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-500">Tipo de Declaración</label>
            <div className="relative">
              <Layers className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:ring-1 focus:ring-sag-blue focus:outline-none"
              >
                <option value="all">🎒 Cualquier Contenido</option>
                <option value="with_products">📦 Declara Productos Agrícolas</option>
                <option value="with_pets">🐾 Acompañado de Mascotas</option>
                <option value="both">🎒 Productos y Mascotas simultáneamente</option>
                <option value="none">🚫 Declaración Limpia (Sin productos/mascotas)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* EXPORT BUTTONS & NOTIFICATIONS */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleExportExcel}
          disabled={isExportingExcel || isExportingPdf}
          className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          {isExportingExcel ? 'Procesando Excel...' : 'EXPORTAR EXCEL (.CSV)'}
        </button>

        <button
          onClick={handleExportPdf}
          disabled={isExportingExcel || isExportingPdf}
          className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          {isExportingPdf ? 'Imprimiendo PDF...' : 'EXPORTAR PDF (INFORME)'}
        </button>
      </div>

      {/* Export status toast-like feedback inside panel */}
      {exportMessage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-[10.5px] font-bold text-sag-blue flex items-center gap-2 animate-pulse">
          <Clock className="w-3.5 h-3.5 text-sag-blue" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* TOTALS SUMMARY GRID TABLE */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Total Declarations */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[8.5px] font-black text-slate-400 uppercase block tracking-wider leading-none">
            Declaraciones Totales
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-slate-800">{totalDeclarations}</span>
            <span className="text-[9px] text-slate-400 font-bold">viajes</span>
          </div>
          <p className="text-[8.5px] text-slate-500 font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3 text-emerald-500" /> +8.4% vs mes anterior
          </p>
        </div>

        {/* Approved Declarations */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[8.5px] font-black text-slate-400 uppercase block tracking-wider leading-none">
            Aprobados sin Multa
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-emerald-600">{totalApproved}</span>
            <span className="text-[9px] text-slate-400 font-bold">{(totalDeclarations > 0 ? (totalApproved / totalDeclarations * 100) : 0).toFixed(0)}%</span>
          </div>
          <p className="text-[8.5px] text-slate-500 font-semibold flex items-center gap-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Ingreso limpio autorizado
          </p>
        </div>

        {/* Retentions Applied */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[8.5px] font-black text-slate-400 uppercase block tracking-wider leading-none">
            Retenciones Sanitarias
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-amber-600">{totalRetained}</span>
            <span className="text-[9px] text-amber-500 font-black">({retentionRate}%)</span>
          </div>
          <p className="text-[8.5px] text-slate-500 font-semibold flex items-center gap-0.5">
            <ShieldAlert className="w-3 h-3 text-amber-500" /> Riesgo sanitario controlado
          </p>
        </div>

        {/* Animal Abuse Reports */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[8.5px] font-black text-slate-400 uppercase block tracking-wider leading-none">
            Maltrato Animal Reportado
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-red-600">{totalAbuse}</span>
            <span className="text-[9px] text-red-500 font-black">({abuseRate}%)</span>
          </div>
          <p className="text-[8.5px] text-slate-500 font-semibold flex items-center gap-0.5 text-red-600 font-bold">
            ⚠️ Sanciones Ley Cholito iniciadas
          </p>
        </div>
      </div>

      {/* MONTHLY FLOW BAR CHART (GRAPH) - RESPONSIVE CUSTOM SVG */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <div>
            <h4 className="text-xs font-extrabold text-slate-800 font-display">
              📈 Flujo Mensual de Declaraciones e Infracciones (2026)
            </h4>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">
              Valores acumulados de Declaraciones totales (azul) vs Retenciones (amarillo)
            </p>
          </div>
          <span className="bg-blue-50 text-sag-blue text-[8.5px] font-black uppercase px-2 py-0.5 rounded border border-blue-200">
            Fronteras Terrestres
          </span>
        </div>

        {/* SVG Responsive Chart */}
        <div className="relative pt-2">
          <svg viewBox="0 0 500 200" className="w-full h-auto overflow-visible font-sans select-none">
            {/* Grid Lines */}
            <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Left Y Axis Labels (Flow count) */}
            <text x="32" y="24" className="text-[8px] fill-slate-400 font-bold text-right" textAnchor="end">{Math.round(maxMonthlyTotal)}</text>
            <text x="32" y="64" className="text-[8px] fill-slate-400 font-bold text-right" textAnchor="end">{Math.round(maxMonthlyTotal * 0.75)}</text>
            <text x="32" y="104" className="text-[8px] fill-slate-400 font-bold text-right" textAnchor="end">{Math.round(maxMonthlyTotal * 0.5)}</text>
            <text x="32" y="144" className="text-[8px] fill-slate-400 font-bold text-right" textAnchor="end">{Math.round(maxMonthlyTotal * 0.25)}</text>
            <text x="32" y="174" className="text-[8px] fill-slate-400 font-bold text-right" textAnchor="end">0</text>

            {/* Render bars for each month */}
            {monthlyData.map((data, index) => {
              const xCenter = 40 + (index * 72) + 20; // coordinates
              const barWidth = 18;
              const gap = 4;

              // Scale heights
              const totalHeight = (data.total / maxMonthlyTotal) * 140;
              const retainedHeight = (data.retained / maxMonthlyTotal) * 140;
              const abuseHeight = (data.reportedAbuse / maxMonthlyTotal) * 140;

              // Y coordinates
              const totalY = 170 - totalHeight;
              const retainedY = 170 - retainedHeight;
              const abuseY = 170 - abuseHeight;

              const isHovered = hoveredBarIndex === index;

              return (
                <g 
                  key={data.month}
                  onMouseEnter={() => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className="cursor-pointer transition-opacity duration-200"
                  style={{ opacity: hoveredBarIndex !== null && !isHovered ? 0.4 : 1 }}
                >
                  {/* Total Flow Bar (Blue) */}
                  <rect
                    x={xCenter - barWidth - gap/2}
                    y={totalY}
                    width={barWidth}
                    height={totalHeight}
                    fill="url(#blueGradient)"
                    rx="3"
                    className="transition-all duration-300"
                  />

                  {/* Retained Bar (Amber/Yellow) */}
                  <rect
                    x={xCenter + gap/2}
                    y={retainedY}
                    width={barWidth}
                    height={retainedHeight}
                    fill="url(#amberGradient)"
                    rx="3"
                    className="transition-all duration-300"
                  />

                  {/* Abuse Bar - Small indicator dot or layered mini bar in red on top */}
                  {data.reportedAbuse > 0 && (
                    <circle
                      cx={xCenter}
                      cy={retainedY - 6}
                      r="3.5"
                      fill="#dc2626"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                  )}

                  {/* X Axis Month Name */}
                  <text
                    x={xCenter}
                    y="185"
                    className={`text-[9px] font-black text-center ${isHovered ? 'fill-sag-blue' : 'fill-slate-500'}`}
                    textAnchor="middle"
                  >
                    {data.name}
                  </text>

                  {/* Hover tooltip values drawn directly inside SVG for ultimate robustness */}
                  {isHovered && (
                    <g>
                      {/* Tooltip Background */}
                      <rect
                        x={xCenter - 50}
                        y={Math.min(totalY - 45, 100)}
                        width="100"
                        height="42"
                        fill="#0f172a"
                        rx="5"
                        opacity="0.95"
                      />
                      {/* Tooltip Text */}
                      <text x={xCenter} y={Math.min(totalY - 33, 112)} fill="#fff" className="text-[8px] font-black" textAnchor="middle">
                        {data.name}
                      </text>
                      <text x={xCenter} y={Math.min(totalY - 23, 122)} fill="#38bdf8" className="text-[7.5px] font-bold" textAnchor="middle">
                        Flujo: {data.total} dcl.
                      </text>
                      <text x={xCenter} y={Math.min(totalY - 13, 132)} fill="#fbbf24" className="text-[7.5px] font-bold" textAnchor="middle">
                        Retenido: {data.retained} ({((data.retained/data.total)*100).toFixed(0)}%)
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Definitions for gradients */}
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e40af" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-[9px] font-black text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-blue-700 block"></span>
            <span>Declaraciones de Ingreso</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-amber-500 block"></span>
            <span>Retenciones (Sanitarias)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 block"></span>
            <span>Caso Maltrato Reportado</span>
          </div>
        </div>
      </div>

      {/* FILTERED TRANSACTIONS ROW DETAILS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-3.5 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
            Auditoría de Declaraciones Recientes ({filteredUserDecs.length})
          </span>
          <span className="text-[8.5px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
            Actualizado en vivo
          </span>
        </div>

        {filteredUserDecs.length === 0 ? (
          <div className="text-center py-6 text-slate-400 space-y-1">
            <p className="text-base">🎒</p>
            <p className="text-[10.5px] font-bold text-slate-500">Ningún dato ingresado por el usuario coincide con este filtro</p>
            <p className="text-[9px] text-slate-400">Complete el formulario o simule fiscalizaciones en la pestaña de Inspector.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10.5px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[8.5px]">
                  <th className="py-2 pr-2">Folio / Fecha</th>
                  <th className="py-2 pr-2">Viajero</th>
                  <th className="py-2 pr-2">Control Paso</th>
                  <th className="py-2 pr-2 text-center">Productos</th>
                  <th className="py-2 pr-2 text-center">Mascotas</th>
                  <th className="py-2 text-right">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredUserDecs.map((dec) => (
                  <tr key={dec.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 pr-2">
                      <span className="font-mono font-bold text-slate-800 block leading-tight">{dec.id}</span>
                      <span className="text-[8.5px] text-slate-400 block leading-none">{new Date(dec.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-2.5 pr-2">
                      <span className="font-bold text-slate-800 block truncate max-w-[110px]">{dec.fullName}</span>
                      <span className="text-[8.5px] font-mono text-slate-400 block leading-none">{dec.documentNumber}</span>
                    </td>
                    <td className="py-2.5 pr-2 truncate max-w-[120px]" title={dec.borderCrossing}>
                      {dec.borderCrossing.replace('Paso ', '')}
                    </td>
                    <td className="py-2.5 pr-2 text-center">
                      {dec.hasProductsToDeclare ? (
                        <span className="inline-flex items-center gap-0.5 font-bold text-amber-600 bg-amber-50 border border-amber-200/50 px-1.5 py-0.2 rounded-full text-[9px]">
                          SÍ ({dec.declaredItems.length})
                        </span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-2 text-center">
                      {dec.hasPets ? (
                        <span className="inline-flex items-center gap-0.5 font-bold text-blue-600 bg-blue-50 border border-blue-200/50 px-1.5 py-0.2 rounded-full text-[9px]">
                          SÍ ({dec.pets.length})
                        </span>
                      ) : (
                        <span className="text-slate-400 font-semibold">No</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right font-black">
                      {dec.status === 'submitted' ? (
                        <span className="text-amber-500 uppercase text-[9px]">Pendiente</span>
                      ) : (
                        <span className={`uppercase text-[9px] ${
                          dec.inspectionOutcome === 'approved' 
                            ? 'text-emerald-600' 
                            : dec.inspectionOutcome === 'retained' 
                            ? 'text-rose-600' 
                            : 'text-red-700'
                        }`}>
                          {dec.inspectionOutcome === 'approved' ? 'Aprobado' : dec.inspectionOutcome === 'retained' ? 'Retenido' : 'Maltrato'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Regulatory Info Banner at bottom */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-2.5 text-[10.5px]">
        <Info className="w-5 h-5 text-sag-blue shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-700">Marco de Cooperación Fiscal Aduanero</p>
          <p className="text-slate-500 leading-normal">
            Los datos reportados corresponden a las normativas de la Ordenanza de Aduanas de la SNA y la Ley Nº 18.755 del SAG. Los reportes de maltrato activan la Ley Cholito Nº 21.020 en juzgados de policía local competentes.
          </p>
        </div>
      </div>
    </div>
  );
}
