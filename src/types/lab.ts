export type Gender = 'erkak' | 'ayol';
export type TestStatus = 'kutilmoqda' | 'jarayonda' | 'tasdiqlangan' | 'bekor_qilingan';
export type Urgency = 'oddiy' | 'cito'; // CITO = Express/Urgent

export interface Patient {
  id: string; // e.g. PAT-0001, PAT-0002 (sequential ID)
  patientNumber: number; // e.g. 1, 2, 3
  passportOrId: string;
  fullName: string;
  birthDate: string;
  gender: Gender;
  phone: string;
  address?: string;
  registeredAt: string;
  referredByDoctor?: string;
  totalVisits?: number;
}

export interface IndividualTestItem {
  id: string;
  name: string;
  price: number;
  unit?: string;
  refMin?: number;
  refMax?: number;
}

export interface TestSubGroup {
  id: string;
  groupTitle: string; // e.g. "ГЕМАТОЛОГИЯ", "ЭКСПРЕСС-ТЕСТ", "ОАК"
  items: IndividualTestItem[];
}

export interface TestCatalogItem {
  id: string;
  category: string;
  subGroups: TestSubGroup[];
}

export interface TestResultItem {
  parameterId: string;
  parameterName: string;
  value: number | string;
  unit: string;
  refMin: number;
  refMax: number;
  refString?: string; // Custom clinical reference range string (e.g. "< 3.3 mkmol/l", "0-5 в п/зр")
  subGroup?: string;  // Group header name for structured sub-tables (e.g. "Эпителий :", "Соли :")
  isQualitative?: boolean; // True for qualitative tests (Качественный)
  status: 'low' | 'normal' | 'high';
}

export interface Doctor {
  id: string; // e.g. DOC-001, DOC-002
  doctorNumber: number;
  fullName: string;
  specialty: string;
  workplace?: string;
  phone: string;
  commissionRate?: number;
  totalReferrals?: number;
  isActive?: boolean; // Active state (Faol / Nofaol)
  consultationFee?: number; // Qabul narxi (so'm)
  roomNumber?: string; // Khona / Cabinet number (e.g. 204-xona)
  categoryModule?: string; // e.g. 'priem', 'uzd', 'rentgen', 'mrt', 'fgds', 'mskt', 'laboratoriya'
}

export interface TestOrder {
  id: string;
  orderNumber: string;
  patientId: string; // References Patient.id (PAT-0001)
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: Gender;
  testCategory: string;
  testName: string;
  price: number;
  status: TestStatus;
  urgency: Urgency;
  isValidated?: boolean; // Set to true when Cashier checks Валидность and clicks Сохранить!
  isPaid?: boolean;
  paymentMethod?: string;
  createdAt: string; // Date string e.g. "2026-08-16 16:45"
  completedAt?: string;
  doctorId?: string; // References Doctor.id (DOC-001)
  doctorName?: string;
  doctorNote?: string;
  results: TestResultItem[];
  barcode: string;
  qrCodeUrl: string;
}

export interface Reagent {
  id: string;
  name: string;
  catalogNumber: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  expiryDate: string;
  status: 'ok' | 'low' | 'expired';
}

export interface HealthTrendPoint {
  date: string;
  val: number;
  refMin: number;
  refMax: number;
}
