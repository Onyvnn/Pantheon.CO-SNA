export type ProductCategory = 'vegetal' | 'animal' | 'chemical' | 'other';

export type RiskLevel = 'allowed' | 'restricted' | 'prohibited';

export interface PredefinedProduct {
  id: string;
  name: string;
  category: ProductCategory;
  risk: RiskLevel;
  description: string;
  recommendation: string;
  fines?: string;
  popular?: boolean;
}

export interface DeclaredItem {
  id: string;
  name: string;
  category: ProductCategory;
  quantity?: string;
  isPredefined?: boolean;
  predefinedId?: string;
  riskLevel: RiskLevel;
}

export interface Pet {
  id: string;
  species: 'dog' | 'cat' | 'other';
  otherSpecies?: string;
  name: string;
  vaccines: string;
  vetDocName?: string;
  vetDocUrl?: string; // Data URL or placeholder for preview
}

export interface Declaration {
  id: string; // Folio e.g., SAG-2026-XXXXX
  fullName: string;
  documentType: 'rut' | 'passport' | 'dni';
  documentNumber: string;
  email: string;
  nationality: string;
  borderCrossing: string;
  transportType: 'car' | 'bus' | 'motorcycle' | 'pedestrian' | 'other';
  vehiclePlate?: string;
  hasProductsToDeclare: boolean;
  declaredItems: DeclaredItem[];
  hasPets: boolean;
  pets: Pet[];
  signatureDataUrl?: string; // Digital signature
  createdAt: string;
  status: 'draft' | 'submitted' | 'inspected';
}

export interface BorderCrossing {
  id: string;
  name: string;
  region: string;
  connectedCountry: string;
}
