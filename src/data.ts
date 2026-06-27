import { PredefinedProduct, BorderCrossing, RiskLevel } from './types';

export const CHILE_BORDER_CROSSINGS: BorderCrossing[] = [
  { id: 'libertadores', name: 'Paso Los Libertadores (Portillo)', region: 'Valparaíso', connectedCountry: 'Argentina' },
  { id: 'samore', name: 'Paso Cardenal Antonio Samoré', region: 'Los Lagos', connectedCountry: 'Argentina' },
  { id: 'chacalluta', name: 'Paso Chacalluta', region: 'Arica y Parinacota', connectedCountry: 'Perú' },
  { id: 'jama', name: 'Paso de Jama', region: 'Antofagasta', connectedCountry: 'Argentina' },
  { id: 'pino_hachado', name: 'Paso Pino Hachado', region: 'La Araucanía', connectedCountry: 'Argentina' },
  { id: 'colane', name: 'Paso Colchane (Pisiga)', region: 'Tarapacá', connectedCountry: 'Bolivia' },
  { id: 'pehuenche', name: 'Paso Pehuenche', region: 'Maule', connectedCountry: 'Argentina' },
  { id: 'mamuil', name: 'Paso Mamuil Malal', region: 'La Araucanía', connectedCountry: 'Argentina' },
  { id: 'dorotea', name: 'Paso Dorotea', region: 'Magallanes', connectedCountry: 'Argentina' },
  { id: 'jeinimeni', name: 'Paso Río Jeinimeni', region: 'Aysén', connectedCountry: 'Argentina' },
];

export const PREDEFINED_PRODUCTS: PredefinedProduct[] = [
  // ORIGEN VEGETAL - PROHIBIDOS / RESTRINGIDOS
  {
    id: 'veg_manzana',
    name: 'Manzanas o frutas frescas',
    category: 'vegetal',
    risk: 'prohibited',
    description: 'Las frutas frescas son hospederas de plagas destructivas como la Mosca de la Fruta (Ceratitis capitata).',
    recommendation: 'Está estrictamente prohibido su ingreso. Si las trae, debe declararlas obligatoriamente para que sean retenidas y destruidas por el inspector SAG sin multa. O deséchelas en los contenedores habilitados antes de la inspección.',
    fines: 'Ocular este producto y no declararlo acarrea multas desde 3 a 30 UTM (aprox. $200.000 a $2.000.000 CLP).',
    popular: true
  },
  {
    id: 'veg_platanos',
    name: 'Plátanos o bananas',
    category: 'vegetal',
    risk: 'prohibited',
    description: 'Cualquier fruta fresca puede portar insectos, hongos o bacterias que pongan en riesgo la sanidad vegetal de Chile.',
    recommendation: 'Debe declararse obligatoriamente. Será retenido para su destrucción. Consúmalo antes de cruzar el control fronterizo.',
    fines: 'Multas elevadas si es detectado en el equipaje sin declarar.',
    popular: true
  },
  {
    id: 'veg_semillas',
    name: 'Semillas (para sembrar o consumo sin procesar)',
    category: 'vegetal',
    risk: 'prohibited',
    description: 'Pueden introducir malezas cuarentenarias o virus de transmisión por semilla que arruinen los cultivos nacionales.',
    recommendation: 'Prohibido su ingreso sin autorización de importación previa. Obligatorio declarar.',
    fines: 'Decomiso inmediato y multas severas por importación clandestina.',
    popular: true
  },
  {
    id: 'veg_plantas',
    name: 'Plantas, esquejes o macetas con tierra',
    category: 'vegetal',
    risk: 'prohibited',
    description: 'La tierra contiene microorganismos, nematodos y hongos dañinos. Las plantas vivas propagan plagas de forma directa.',
    recommendation: 'No se permite su ingreso bajo ninguna circunstancia como equipaje de turista. Declare siempre.',
    fines: 'Decomiso y sanción monetaria inmediata.',
    popular: true
  },
  {
    id: 'veg_flores',
    name: 'Flores frescas o ramos ornamentales',
    category: 'vegetal',
    risk: 'prohibited',
    description: 'Pueden albergar trips, pulgones y ácaros exóticos.',
    recommendation: 'Se retendrán para destrucción en el control fronterizo. Declare para evitar multas.',
    popular: false
  },
  {
    id: 'veg_frutos_secos_con_cascara',
    name: 'Frutos secos con cáscara (nueces, almendras, etc.)',
    category: 'vegetal',
    risk: 'restricted',
    description: 'La cáscara puede albergar insectos taladradores de la madera o de la fruta (como la polilla de la manzana).',
    recommendation: 'Los frutos secos CON cáscara deben declararse. Los frutos secos SIN cáscara, tostados y envasados comercialmente suelen ser autorizados tras inspección visual, pero IGUAL deben ser declarados.',
    fines: 'No declararlos puede ser catalogado como falta.',
    popular: true
  },
  {
    id: 'veg_yerba_mate',
    name: 'Yerba Mate procesada y envasada',
    category: 'vegetal',
    risk: 'allowed',
    description: 'La yerba mate procesada, seca, molida y rotulada comercialmente representa un riesgo insignificante.',
    recommendation: 'Se autoriza su ingreso. Al ser de origen vegetal, la norma chilena exige marcar "SÍ" en la declaración general de vegetales, pero el inspector la liberará de inmediato tras ver el envase sellado.',
    popular: true
  },
  {
    id: 'veg_madera',
    name: 'Artesanías de madera rústica o corteza',
    category: 'vegetal',
    risk: 'restricted',
    description: 'La madera no tratada o con corteza puede portar insectos xilófagos (taladradores de madera) activos.',
    recommendation: 'Se debe declarar para que el inspector verifique la ausencia de aserrín o agujeros de insectos. Si está barnizada y procesada comercialmente, ingresa sin problemas.',
    popular: false
  },

  // ORIGEN ANIMAL
  {
    id: 'ani_carne_fresca',
    name: 'Carnes frescas de vacuno, cerdo, pollo u ovinos',
    category: 'animal',
    risk: 'prohibited',
    description: 'Las carnes crudas o refrigeradas pueden transmitir la Fiebre Aftosa, Peste Porcina Clásica, o Influenza Aviar.',
    recommendation: 'Totalmente prohibido su ingreso en equipaje de turistas. Consúmalas antes de llegar a la frontera o declárelas para destrucción.',
    fines: 'La introducción de carnes sin declarar es sancionada con la multa máxima y riesgo de decomiso de vehículo en casos graves.',
    popular: true
  },
  {
    id: 'ani_cecinas',
    name: 'Cecinas, embutidos, salames o jamón crudo',
    category: 'animal',
    risk: 'prohibited',
    description: 'El curado tradicional no elimina virus patógenos para los animales del país (como la Peste Porcina Africana).',
    recommendation: 'No se permite el ingreso de embutidos artesanales o jamones crudos. Deben ser declarados y retenidos. Únicamente se permiten cecinas industrializadas esterilizadas de marcas autorizadas con certificación oficial específica (difícil de portar en viajes turísticos individuales).',
    fines: 'Multas inmediatas de aduana y SAG.',
    popular: true
  },
  {
    id: 'ani_queso_fresco',
    name: 'Quesos frescos o artesanales',
    category: 'animal',
    risk: 'prohibited',
    description: 'La leche sin pasteurizar utilizada en quesos artesanales transmite tuberculosis, brucelosis y listeriosis.',
    recommendation: 'Prohibido el ingreso de quesos artesanales. Los quesos maduros industriales (envase al vacío y etiqueta de fábrica) están permitidos pero deben declararse para que el inspector apruebe su ingreso.',
    popular: true
  },
  {
    id: 'ani_miel',
    name: 'Miel de abeja (pura o panal)',
    category: 'animal',
    risk: 'prohibited',
    description: 'La miel es el principal vector de propagación de la Loque Americana y Loque Europea, bacterias letales para las colmenas chilenas.',
    recommendation: 'Está estrictamente prohibido su ingreso en equipaje de pasajeros. Declare de inmediato.',
    fines: 'Sanciones severas debido a que Chile protege intensamente su apicultura libre de enfermedades.',
    popular: true
  },
  {
    id: 'ani_leche',
    name: 'Leche líquida o derivados lácteos no procesados',
    category: 'animal',
    risk: 'prohibited',
    description: 'Pueden transportar virus animales estables.',
    recommendation: 'La leche en polvo infantil sellada en su tarro original sí está permitida, pero debe declararse. Leche líquida común de origen artesanal se destruirá.',
    popular: false
  },
  {
    id: 'ani_comida_mascotas',
    name: 'Alimento para mascotas (croquetas, sobres húmedos abiertos)',
    category: 'animal',
    risk: 'restricted',
    description: 'Contiene harinas de carne o subproductos animales que requieren control sanitario de origen.',
    recommendation: 'Solo se permite el ingreso si el saco está herméticamente cerrado de fábrica, con etiqueta visible de ingredientes y registro sanitario. Si está abierto o es a granel, será destruido. Debe declararse.',
    popular: true
  },
  {
    id: 'ani_huevos',
    name: 'Huevos de gallina u otras aves',
    category: 'animal',
    risk: 'prohibited',
    description: 'Vector directo del virus de Influenza Aviar de alta patogenicidad y Newcastle.',
    recommendation: 'Prohibido. Se destruye en frontera. Declare.',
    popular: false
  },

  // OTROS / QUÍMICOS / BIOLÓGICOS
  {
    id: 'che_medicamento_vet',
    name: 'Medicamentos de uso veterinario o vacunas',
    category: 'chemical',
    risk: 'restricted',
    description: 'Medicamentos sin registro nacional o recetas oficiales pueden poner en riesgo la fauna o ser sustancias controladas.',
    recommendation: 'Debe declararse. Solo se autorizan dosis individuales razonables si viene acompañado de receta de un médico veterinario con firma y timbre.',
    popular: false
  },
  {
    id: 'che_insecticidas',
    name: 'Plaguicidas, abonos o fertilizantes químicos/orgánicos',
    category: 'chemical',
    risk: 'prohibited',
    description: 'Sustancias que pueden alterar el medioambiente o contener esporas u hongos patógenos.',
    recommendation: 'Prohibido el ingreso en equipaje de pasajeros sin resoluciones SAG previas. Declare siempre.',
    popular: false
  },
  {
    id: 'oth_artesania_cuero',
    name: 'Artesanías de cuero crudo o piezas de museo/taxidermia',
    category: 'other',
    risk: 'restricted',
    description: 'Pieles o cueros no curtidos adecuadamente pueden portar ácaros, garrapatas o esporas de Antrax.',
    recommendation: 'Debe declararse. El cuero curtido procesado comercialmente (chaquetas, carteras, zapatos) ingresa libremente y no requiere declaración obligatoria de riesgo, pero piezas de cuero rústicas sí se inspeccionan.',
    popular: false
  },
  {
    id: 'oth_tierra',
    name: 'Tierra para jardín, lodo o arena de río',
    category: 'other',
    risk: 'prohibited',
    description: 'La tierra es el mayor reservorio de esporas, hongos y nematodos dañinos para el ecosistema agrícola.',
    recommendation: 'Prohibido por completo. Si se detecta tierra en zapatos de trekking o carpas de camping, el inspector exigirá su limpieza rigurosa antes de ingresar.',
    popular: false
  }
];

export const getRiskBadgeColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'allowed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'restricted':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'prohibited':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getRiskIconColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'allowed':
      return 'text-emerald-600';
    case 'restricted':
      return 'text-amber-600';
    case 'prohibited':
      return 'text-rose-600';
    default:
      return 'text-gray-600';
  }
};

export const getRiskLabel = (risk: RiskLevel) => {
  switch (risk) {
    case 'allowed':
      return 'Permitido (Bajo Inspección)';
    case 'restricted':
      return 'Restringido (Requiere Declaración)';
    case 'prohibited':
      return 'Prohibido (Debe ser retenido/declarado)';
  }
};
