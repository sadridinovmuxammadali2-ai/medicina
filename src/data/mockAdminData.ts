import type { SystemUser, UserPermissions, UserRole, AuditLog, ClinicConfig, LisEquipment, SmsGatewayConfig, SystemHealthStats, ClinicBranch, DiagnosticModule } from '../types/admin';

export const INITIAL_DIAGNOSTIC_MODULES: DiagnosticModule[] = [
  { id: 'priem', code: 'PRIEM', name: '📋 Прием', icon: '📋', enabled: true, isSystem: true, description: 'Bemor ma\'lumotlarini kiritish va umumiy qabul' },
  { id: 'laboratoriya', code: 'LAB', name: '🧪 Лаборатория', icon: '🧪', enabled: true, isSystem: true, description: 'Qon, siydik va bio-kimyoviy laboratoriya tahlillari' },
  { id: 'uzd', code: 'UZD', name: '🩺 Узд', icon: '🩺', enabled: true, categoryName: 'УЗД', description: 'Ultra-tovushli diagnostika (УЗИ / ЭхоКГ)' },
  { id: 'gruppa', code: 'GROUP', name: '👥 Группа', icon: '👥', enabled: true, isSystem: true, description: 'Guruhli tahlillar va kompleks paketlar' },
  { id: 'rentgen', code: 'RENTGEN', name: '🩻 Рентген', icon: '🩻', enabled: true, categoryName: 'РЕНТГЕН', description: 'Raqamli rentgenografiya va flyuorografiya' },
  { id: 'mrt', code: 'MRT', name: '🧠 МРТ', icon: '🧠', enabled: true, categoryName: 'МРТ', description: 'Magnit-rezonans tomografiya' },
  { id: 'fgds', code: 'FGDS', name: '🔬 ФГДС', icon: '🔬', enabled: true, categoryName: 'ФГДС', description: 'Fibrogastroduodenoskopiya (Gastroduodenoskopiya)' },
  { id: 'mskt', code: 'MSKT', name: '🖥️ МСКТ', icon: '🖥️', enabled: true, categoryName: 'МСКТ', description: 'Kompyuter tomografiyasi (MSKT / KT)' },
];

export const DEFAULT_PERMISSIONS_BY_ROLE: Record<UserRole, UserPermissions> = {
  admin: {
    canAccessDashboard: true,
    canAccessRegistration: true,
    canAccessCashier: true,
    canAccessWorkstation: true,
    canAccessDoctors: true,
    canAccessBlank: true,
    canAccessCatalog: true,
    canAccessInventory: true,
    canAccessAdmin: true
  },
  laborant: {
    canAccessDashboard: true,
    canAccessRegistration: false,
    canAccessCashier: false,
    canAccessWorkstation: true,
    canAccessDoctors: false,
    canAccessBlank: true,
    canAccessCatalog: true,
    canAccessInventory: true,
    canAccessAdmin: false
  },
  cashier: {
    canAccessDashboard: true,
    canAccessRegistration: true,
    canAccessCashier: true,
    canAccessWorkstation: false,
    canAccessDoctors: false,
    canAccessBlank: true,
    canAccessCatalog: false,
    canAccessInventory: false,
    canAccessAdmin: false
  },
  doctor: {
    canAccessDashboard: true,
    canAccessRegistration: true,
    canAccessCashier: false,
    canAccessWorkstation: false,
    canAccessDoctors: true,
    canAccessBlank: true,
    canAccessCatalog: true,
    canAccessInventory: false,
    canAccessAdmin: false
  },
  receptionist: {
    canAccessDashboard: true,
    canAccessRegistration: true,
    canAccessCashier: true,
    canAccessWorkstation: false,
    canAccessDoctors: true,
    canAccessBlank: true,
    canAccessCatalog: false,
    canAccessInventory: false,
    canAccessAdmin: false
  }
};

export const INITIAL_CLINIC_BRANCHES: ClinicBranch[] = [
  {
    id: 'BR-01',
    code: 'FIL-01',
    name: 'Markaziy Laboratoriya (Toshkent)',
    address: 'Toshkent sh., Yunusobod t., Amir Temur ko\'chasi 108-uy',
    phone: '+998 71 200 00 11',
    managerName: 'Dr. Akmal Rahimov',
    status: 'active',
    createdAt: '2025-01-01',
    permissions: DEFAULT_PERMISSIONS_BY_ROLE.admin
  },
  {
    id: 'BR-02',
    code: 'FIL-02',
    name: 'Chilonzor Diagnostika Filiali',
    address: 'Toshkent sh., Chilonzor t., Lutfiy ko\'chasi 45-uy',
    phone: '+998 71 277 55 44',
    managerName: 'Dilshod Tursunov',
    status: 'active',
    createdAt: '2025-03-15',
    permissions: {
      canAccessDashboard: true,
      canAccessRegistration: true,
      canAccessCashier: true,
      canAccessWorkstation: true,
      canAccessDoctors: true,
      canAccessBlank: true,
      canAccessCatalog: true,
      canAccessInventory: false,
      canAccessAdmin: false
    }
  },
  {
    id: 'BR-03',
    code: 'FIL-03',
    name: 'Samarqand Markaziy Filiali',
    address: 'Samarqand sh., Dagbit ko\'chasi 12-uy',
    phone: '+998 66 233 11 00',
    managerName: 'Prof. Sobir Karimov',
    status: 'active',
    createdAt: '2025-05-10',
    permissions: {
      canAccessDashboard: true,
      canAccessRegistration: true,
      canAccessCashier: true,
      canAccessWorkstation: true,
      canAccessDoctors: true,
      canAccessBlank: true,
      canAccessCatalog: true,
      canAccessInventory: true,
      canAccessAdmin: false
    }
  },
  {
    id: 'BR-04',
    code: 'FIL-04',
    name: "Farg'ona Qabul Punkt Filiali",
    address: "Farg'ona sh., Al-Farg'oniy ko'chasi 88-uy",
    phone: '+998 73 244 88 99',
    managerName: 'Sevara Alimova',
    status: 'active',
    createdAt: '2025-08-20',
    permissions: {
      canAccessDashboard: true,
      canAccessRegistration: true,
      canAccessCashier: true,
      canAccessWorkstation: false,
      canAccessDoctors: true,
      canAccessBlank: true,
      canAccessCatalog: false,
      canAccessInventory: false,
      canAccessAdmin: false
    }
  }
];

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'USR-101',
    name: 'Dr. Akmal Rahimov',
    username: 'admin',
    email: 'admin@smartlab.uz',
    role: 'admin',
    status: 'active',
    phone: '+998 90 123 45 67',
    lastLogin: '2026-09-20 23:15',
    createdAt: '2025-01-10',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    branchId: 'BR-01',
    branchName: 'Markaziy Laboratoriya (Toshkent)',
    permissions: DEFAULT_PERMISSIONS_BY_ROLE.admin
  },
  {
    id: 'USR-102',
    name: 'Nodira Qosimova',
    username: 'laborant1',
    email: 'laborant@smartlab.uz',
    role: 'laborant',
    status: 'active',
    phone: '+998 93 987 65 43',
    lastLogin: '2026-09-20 22:40',
    createdAt: '2025-02-15',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-78853b0e14c3?w=150&auto=format&fit=crop&q=80',
    branchId: 'BR-01',
    branchName: 'Markaziy Laboratoriya (Toshkent)',
    permissions: DEFAULT_PERMISSIONS_BY_ROLE.laborant
  },
  {
    id: 'USR-103',
    name: 'Dilshod Tursunov',
    username: 'kassir',
    email: 'cashier@smartlab.uz',
    role: 'cashier',
    status: 'active',
    phone: '+998 97 555 11 22',
    lastLogin: '2026-09-20 21:10',
    createdAt: '2025-03-01',
    branchId: 'BR-02',
    branchName: 'Chilonzor Diagnostika Filiali',
    permissions: DEFAULT_PERMISSIONS_BY_ROLE.cashier
  },
  {
    id: 'USR-104',
    name: 'Prof. Sobir Karimov',
    username: 'dr_karimov',
    email: 'karimov@med.uz',
    role: 'doctor',
    status: 'active',
    phone: '+998 99 888 33 44',
    lastLogin: '2026-09-19 18:30',
    createdAt: '2025-01-20',
    branchId: 'BR-03',
    branchName: 'Samarqand Markaziy Filiali',
    permissions: DEFAULT_PERMISSIONS_BY_ROLE.doctor
  },
  {
    id: 'USR-105',
    name: 'Sevara Alimova',
    username: 'reception',
    email: 'reception@smartlab.uz',
    role: 'receptionist',
    status: 'active',
    phone: '+998 91 333 44 55',
    lastLogin: '2026-09-20 20:05',
    createdAt: '2025-04-12',
    branchId: 'BR-04',
    branchName: "Farg'ona Qabul Punkt Filiali",
    permissions: DEFAULT_PERMISSIONS_BY_ROLE.receptionist
  }
];

export const INITIAL_CLINIC_CONFIG: ClinicConfig = {
  clinicName: 'SmartLab Central Diagnostic Center',
  address: 'Toshkent sh., Yunusobod t., Amir Temur ko\'chasi, 108-uy',
  phone: '+998 71 200 00 11',
  email: 'info@smartlab.uz',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
  currency: 'so\'m',
  taxRate: 0,
  citoMultiplier: 1.3,
  autoApproveNormalResults: false,
  autoSendSmsOnComplete: true,
  workingHours: '08:00 - 20:00 (Dushanba - Shanba)',
  receiptFooter: 'SmartLab LIMS - Salomatligingiz biz uchun muhim!',
  activeBranchId: 'BR-01'
};

export const INITIAL_LIS_EQUIPMENT: LisEquipment[] = [
  {
    id: 'LIS-01',
    name: 'Mindray BS-240',
    model: 'BS-240 Auto Chemistry Analyzer',
    type: 'biochemistry',
    connectionType: 'tcp',
    ipAddress: '192.168.1.120',
    port: 9100,
    status: 'online',
    lastDataReceived: '2026-09-20 23:28',
    autoFetch: true
  },
  {
    id: 'LIS-02',
    name: 'Sysmex XN-550',
    model: 'XN-550 Hematology Analyzer',
    type: 'hematology',
    connectionType: 'rs232',
    ipAddress: '192.168.1.121',
    port: 8080,
    status: 'online',
    lastDataReceived: '2026-09-20 23:15',
    autoFetch: true
  },
  {
    id: 'LIS-03',
    name: 'Cobas e411',
    model: 'Roche Cobas e411 Immunoassay',
    type: 'immuno',
    connectionType: 'tcp',
    ipAddress: '192.168.1.125',
    port: 9200,
    status: 'busy',
    lastDataReceived: '2026-09-20 23:20',
    autoFetch: true
  },
  {
    id: 'LIS-04',
    name: 'Rotor-Gene Q PCR',
    model: 'QIAGEN Real-Time PCR',
    type: 'pcr',
    connectionType: 'file',
    ipAddress: '192.168.1.130',
    port: 5000,
    status: 'offline',
    lastDataReceived: '2026-09-19 17:45',
    autoFetch: false
  }
];

export const INITIAL_SMS_CONFIG: SmsGatewayConfig = {
  provider: 'eskiz',
  apiToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNtYXJ0TGFiIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  senderId: 'SmartLab',
  botToken: '789123456:AAFd4389fnk_example_bot_token',
  chatId: '-100192837465',
  enabled: true,
  templateUz: 'Hurmatli {PATIENT_NAME}, sizning {ORDER_ID} raqamli tahlil natijangiz tayyor bo\'ldi: {LINK}',
  templateRu: 'Уважаемый(ая) {PATIENT_NAME}, ваш результат анализа №{ORDER_ID} готов: {LINK}',
  templateEn: 'Dear {PATIENT_NAME}, your test result #{ORDER_ID} is ready: {LINK}'
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-5001',
    timestamp: '2026-09-20 23:25:12',
    userName: 'Nodira Qosimova',
    userRole: 'laborant',
    action: 'Natija tasdiqlandi',
    module: 'Laborant Kabineti',
    details: 'Bemor: Anvarov Jasur (ID: P-904), Tahlil: Obshiy Analiz Krovi - Natija tasdiqlandi.',
    ipAddress: '192.168.1.45',
    severity: 'info'
  },
  {
    id: 'LOG-5002',
    timestamp: '2026-09-20 23:12:44',
    userName: 'Dilshod Tursunov',
    userRole: 'cashier',
    action: 'To\'lov qabul qilindi',
    module: 'Kassa',
    details: 'Bemor: Karimova Nigora. Summa: 185,000 so\'m (Humo kassa cheki #K-8812)',
    ipAddress: '192.168.1.18',
    severity: 'info'
  },
  {
    id: 'LOG-5003',
    timestamp: '2026-09-20 22:50:00',
    userName: 'Dr. Akmal Rahimov',
    userRole: 'admin',
    action: 'SMS Shlyuzi sozlamasi o\'zgartirildi',
    module: 'Admin Panel',
    details: 'Eskiz.uz SMS Provayder tokeni va shablonlar yangilandi.',
    ipAddress: '192.168.1.10',
    severity: 'warning'
  },
  {
    id: 'LOG-5004',
    timestamp: '2026-09-20 21:30:19',
    userName: 'Sevara Alimova',
    userRole: 'receptionist',
    action: 'Yangi bemor qabul qilindi',
    module: 'Bemor Ro\'yxati',
    details: 'Bemor: Toshmatov Otabek (PINFL: 3120495810023)',
    ipAddress: '192.168.1.15',
    severity: 'info'
  },
  {
    id: 'LOG-5005',
    timestamp: '2026-09-20 19:40:02',
    userName: 'System Daemon',
    userRole: 'admin',
    action: 'LIS Apparat Ulanishi Uzildi',
    module: 'LIS Hardware',
    details: 'Rotor-Gene Q PCR aparati bilan bog\'lanish uzildi (IP: 192.168.1.130)',
    ipAddress: '127.0.0.1',
    severity: 'critical'
  }
];

export const INITIAL_SYSTEM_STATS: SystemHealthStats = {
  cpuUsage: 18,
  memoryUsage: 42,
  activeConnections: 14,
  databaseSizeMb: 128.4,
  uptime: '14 kun, 6 soat, 22 daqiqa',
  storageUsedPercent: 24,
  totalRecords: 14850
};
