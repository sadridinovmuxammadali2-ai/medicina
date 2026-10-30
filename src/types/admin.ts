export type UserRole = 'admin' | 'doctor' | 'laborant' | 'cashier' | 'receptionist';

export interface DiagnosticModule {
  id: string; // e.g. 'priem', 'laboratoriya', 'uzd', 'gruppa', 'rentgen', 'mrt', 'fgds', 'mskt'
  code: string; // e.g. 'PRIEM', 'LAB', 'UZD', 'GROUP', 'RENTGEN', 'MRT', 'FGDS', 'MSKT'
  name: string; // e.g. 'Прием', 'Лаборатория', 'Узд', 'Группа', 'Рентген', 'МРТ', 'ФГДС', 'МСКТ'
  icon: string; // e.g. '📋', '🧪', '🩺', '👥', '🩻', '🧠', '🔬', '🖥️'
  enabled: boolean;
  categoryName?: string;
  description?: string;
  isSystem?: boolean;
}

export interface UserPermissions {
  canAccessDashboard: boolean;
  canAccessRegistration: boolean;
  canAccessCashier: boolean;
  canAccessWorkstation: boolean;
  canAccessDoctors: boolean;
  canAccessBlank: boolean;
  canAccessCatalog: boolean;
  canAccessInventory: boolean;
  canAccessAdmin: boolean;
}

export interface ClinicBranch {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  managerName: string;
  status: 'active' | 'inactive';
  createdAt: string;
  permissions: UserPermissions;
}

export interface SystemUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: 'active' | 'blocked';
  phone: string;
  lastLogin: string;
  createdAt: string;
  avatarUrl?: string;
  branchId?: string;
  branchName?: string;
  permissions: UserPermissions;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ClinicConfig {
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  currency: string;
  taxRate: number;
  citoMultiplier: number;
  autoApproveNormalResults: boolean;
  autoSendSmsOnComplete: boolean;
  workingHours: string;
  receiptFooter: string;
  activeBranchId?: string;
}

export interface LisEquipment {
  id: string;
  name: string;
  model: string;
  type: 'biochemistry' | 'hematology' | 'pcr' | 'immuno' | 'coagulation';
  connectionType: 'tcp' | 'rs232' | 'file';
  ipAddress: string;
  port: number;
  status: 'online' | 'offline' | 'busy' | 'error';
  lastDataReceived: string;
  autoFetch: boolean;
}

export interface SmsGatewayConfig {
  provider: 'eskiz' | 'playmobile' | 'telegram';
  apiToken: string;
  senderId: string;
  botToken: string;
  chatId: string;
  enabled: boolean;
  templateUz: string;
  templateRu: string;
  templateEn: string;
}

export interface SystemHealthStats {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  databaseSizeMb: number;
  uptime: string;
  storageUsedPercent: number;
  totalRecords: number;
}
