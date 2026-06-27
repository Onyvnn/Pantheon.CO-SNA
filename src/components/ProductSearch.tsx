import React, { useState, useMemo } from 'react';
import { Search, AlertTriangle, CheckCircle, HelpCircle, Plus, X, ShieldAlert } from 'lucide-react';
import { PREDEFINED_PRODUCTS, getRiskBadgeColor, getRiskIconColor } from '../data';
import { PredefinedProduct, RiskLevel } from '../types';

interface ProductSearchProps {
  onAddProduct: (productName: string, category: 'vegetal' | 'animal' | 'chemical' | 'other', risk: RiskLevel) => void;
}

export default function ProductSearch({ onAddProduct }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<PredefinedProduct | null>(null);
  const [customProduct, setCustomProduct] = useState('');
  const [customCategory, setCustomCategory] = useState<'vegetal' | 'animal' | 'chemical' | 'other'>('vegetal');

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return PREDEFINED_PRODUCTS.filter((product) =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleSelectProduct = (product: PredefinedProduct) => {
    setSelectedProduct(product);
    setSearchTerm(''); // Clear search
  };

  const handleAddSelected = () => {
    if (selectedProduct) {
      onAddProduct(selectedProduct.name, selectedProduct.category, selectedProduct.risk);
      setSelectedProduct(null);
    }
  };

  const handleAddCustom = () => {
    if (customProduct.trim()) {
      // Custom products default to 'restricted' as SAG mandates declaring everything to be safe
      onAddProduct(customProduct.trim(), customCategory, 'restricted');
      setCustomProduct('');
    }
  };

  // Determine standard alert level for anything typed
  const automaticAlert = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase();

    // Check if the current search matches any highly dangerous words
    const matchesProhibited = [
      'manzana', 'platano', 'banana', 'fruta', 'miel', 'queso', 'carne', 'jamon',
      'salame', 'embutido', 'cecina', 'huevo', 'semilla', 'planta', 'flor', 'tierra', 'lodo'
    ].some(word => term.includes(word));

    if (matchesProhibited) {
      return {
        level: 'danger',
        title: '¡ALERTA DE RIESGO SANITARIO!',
        text: 'Ha ingresado un término asociado a productos de ALTO RIESGO silvoagropecuario. El ingreso de estos productos frescos, crudos o artesanales está PROHIBIDO para turistas. Debe declararlo de forma obligatoria en este formulario para su revisión en frontera.',
        fineWarning: 'No declarar productos de riesgo conlleva multas inmediatas de 3 a 30 UTM y requisación del equipaje.'
      };
    }
    return null;
  }, [searchTerm]);

  return (
    <div id="product-search-section" className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
        <h3 className="text-xs font-extrabold text-sag-dark flex items-center gap-1 font-display">
          <Search className="w-3.5 h-3.5 text-sag-blue" />
          Buscador de Productos SAG
        </h3>
        <span className="text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-full font-bold">
          Catálogo Oficial
        </span>
      </div>

      <p className="text-[10.5px] text-slate-500 leading-snug">
        ¿Trae algún alimento, vegetal, carne o medicamento? Búsquelo aquí para ver si está permitido o si activará una alerta sanitaria.
      </p>

      {/* Search Bar */}
      <div className="relative">
        <input
          id="product-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Escriba: manzana, miel, carne, queso..."
          className="w-full text-xs pl-8 pr-8 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sag-blue placeholder:text-slate-400 text-gray-800 font-medium"
        />
        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Real-time automatic alert based on keystrokes */}
      {automaticAlert && (
        <div id="instant-keystroke-alert" className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-950 animate-pulse space-y-1">
          <div className="flex items-center gap-1 text-[10.5px] font-extrabold text-rose-700">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            {automaticAlert.title}
          </div>
          <p className="text-[10px] leading-relaxed text-rose-900 font-medium">
            {automaticAlert.text}
          </p>
          <p className="text-[9.5px] leading-normal font-bold text-rose-950 bg-rose-100/50 p-1 rounded border border-rose-200/30">
            ⚠ {automaticAlert.fineWarning}
          </p>
        </div>
      )}

      {/* Search results suggestion list */}
      {searchTerm && filteredProducts.length > 0 && (
        <div id="search-suggestions" className="border border-slate-200 rounded max-h-40 overflow-y-auto divide-y divide-slate-100 bg-slate-50/50">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              className="w-full text-left px-2.5 py-1.5 text-[11px] flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className="font-bold text-slate-700">{product.name}</span>
              <span className={`px-1.5 py-0.1 rounded text-[9px] font-semibold border ${getRiskBadgeColor(product.risk)}`}>
                {product.risk === 'prohibited' ? 'Prohibido' : product.risk === 'restricted' ? 'Restringido' : 'Permitido'}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* No results but user typed - offer to add custom product */}
      {searchTerm && filteredProducts.length === 0 && !automaticAlert && (
        <div className="p-2 bg-amber-50/80 border border-amber-200 rounded text-amber-900 space-y-1.5">
          <p className="text-[10.5px] font-medium leading-snug">
            No encontramos <strong>"{searchTerm}"</strong> en el catálogo común. Todo producto debe declararse para su inspección.
          </p>
          <div className="flex gap-1.5">
            <select
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value as any)}
              className="text-[10px] bg-white border border-amber-300 rounded px-1.5 py-0.5 text-gray-700 font-semibold"
            >
              <option value="vegetal">Vegetal</option>
              <option value="animal">Animal</option>
              <option value="chemical">Químico/Médico</option>
              <option value="other">Otro</option>
            </select>
            <button
              onClick={() => {
                onAddProduct(searchTerm, customCategory, 'restricted');
                setSearchTerm('');
              }}
              className="bg-sag-blue text-white text-[10px] font-bold px-2 py-0.5 rounded hover:bg-sag-dark transition-colors flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Declarar "{searchTerm}"
            </button>
          </div>
        </div>
      )}

      {/* Detailed Selected Product Display Card with Institutional SAG Warning */}
      {selectedProduct && (
        <div id="selected-product-alert" className="p-2.5 rounded border-2 border-dashed border-slate-300 bg-slate-50/50 flex flex-col space-y-2 relative">
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-1 right-1 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-1.5">
            {selectedProduct.risk === 'prohibited' ? (
              <div className="bg-rose-100 p-1 rounded-full text-rose-600 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
            ) : selectedProduct.risk === 'restricted' ? (
              <div className="bg-amber-100 p-1 rounded-full text-amber-600 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
            ) : (
              <div className="bg-emerald-100 p-1 rounded-full text-emerald-600 mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}

            <div className="space-y-0.5">
              <h4 className="text-[11px] font-extrabold text-slate-900 leading-tight">
                {selectedProduct.name}
              </h4>
              <p className="text-[9.5px] text-slate-500 font-semibold">
                Categoría: <span className="text-slate-700 uppercase">{selectedProduct.category}</span>
              </p>
            </div>
          </div>

          {/* Automatic alert details */}
          <div className="space-y-1.5 text-[10px]">
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="font-bold text-slate-700 block text-[9.5px] mb-0.5">Normativa SAG:</span>
              <p className="text-slate-600 leading-normal">{selectedProduct.description}</p>
            </div>

            <div className={`p-2 rounded border ${
              selectedProduct.risk === 'prohibited'
                ? 'bg-rose-50 border-rose-200 text-rose-950 font-medium'
                : selectedProduct.risk === 'restricted'
                ? 'bg-amber-50 border-amber-200 text-amber-950 font-medium'
                : 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
            }`}>
              <span className="font-extrabold block text-[9.5px] mb-0.5">Instrucción para el Viajero:</span>
              <p className="leading-normal">{selectedProduct.recommendation}</p>
            </div>

            {selectedProduct.fines && (
              <div className="bg-rose-900/10 p-2 rounded border border-rose-900/20 text-rose-950 font-semibold">
                <span className="font-bold block text-sag-red text-[9.5px]">⚠ Advertencia de Multa:</span>
                <p className="leading-normal text-[9.5px]">{selectedProduct.fines}</p>
              </div>
            )}
          </div>

          {/* Call to action to add to the form */}
          <button
            onClick={handleAddSelected}
            className={`w-full py-1.5 rounded text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer ${
              selectedProduct.risk === 'prohibited'
                ? 'bg-sag-red hover:bg-red-800'
                : selectedProduct.risk === 'restricted'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-sag-green hover:bg-emerald-700'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Declarar e incluir en mi formulario
          </button>
        </div>
      )}

      {/* Quick click popular products chips */}
      {!selectedProduct && (
        <div className="space-y-1.5">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Consultas más frecuentes:
          </span>
          <div className="flex flex-wrap gap-1">
            {PREDEFINED_PRODUCTS.filter((p) => p.popular).map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="text-[9.5px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{product.name}</span>
                <span className={`w-1 h-1 rounded-full ${
                  product.risk === 'prohibited'
                    ? 'bg-sag-red'
                    : product.risk === 'restricted'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}></span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
