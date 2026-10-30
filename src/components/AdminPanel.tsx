import React, { useState } from 'react';
import {
  Shield, Users, Settings, Cpu, MessageSquare, FileText, Database,
  Activity, CheckCircle2, AlertTriangle, Plus, Search,
  Edit, Trash2, RefreshCw, Download, Upload, Lock, Unlock,
  Server, Wifi, Key, Copy, Check, Building,
  DollarSign, Power, Terminal, AlertCircle, Save, Filter, CheckSquare, Square,
  Camera, MapPin, Globe, Play
} from 'lucide-react';
import type { SystemUser, UserRole, UserPermissions, AuditLog, ClinicConfig, LisEquipment, SmsGatewayConfig, SystemHealthStats, ClinicBranch, DiagnosticModule } from '../types/admin';
import {
  INITIAL_SYSTEM_USERS,
  INITIAL_CLINIC_CONFIG,
  INITIAL_LIS_EQUIPMENT,
  INITIAL_SMS_CONFIG,
  INITIAL_AUDIT_LOGS,
  INITIAL_SYSTEM_STATS,
  DEFAULT_PERMISSIONS_BY_ROLE,
  INITIAL_CLINIC_BRANCHES,
  INITIAL_DIAGNOSTIC_MODULES
} from '../data/mockAdminData';
import { apiService, type ApiResponse } from '../services/apiService';
import { LoaderSpinner } from './LoaderSpinner';

const PRESET_AVATARS = [
  { label: 'Dr. Akmal', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80' },
  { label: 'Nodira Q.', url: 'https://images.unsplash.com/photo-1594824813566-78853b0e14c3?w=150&auto=format&fit=crop&q=80' },
  { label: 'Dr. Karimov', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Dr. Malika', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Laborant', url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80' },
  { label: 'Dilshod T.', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Sevara A.', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
];

// Module permissions label definitions with icons and descriptions
const MODULE_PERMISSIONS_LIST: { key: keyof UserPermissions; label: string; icon: string; desc: string }[] = [
  { key: 'canAccessDashboard', label: "📊 Boshqaruv Paneli", icon: "📊", desc: "Tizim analitikasi, tushum va navbat ko'rsatkichlarini ko'rish" },
  { key: 'canAccessRegistration', label: "📝 Bemor Ro'yxati & Qabul", icon: "📝", desc: "Yangi bemorlarni ro'yxatga olish va tahlillar buyurtma qilish" },
  { key: 'canAccessCashier', label: "💳 Kassa & To'lovlar", icon: "💳", desc: "Tahlillar uchun to'lovlarni qabul qilish va chek chiqarish" },
  { key: 'canAccessWorkstation', label: "🔬 Laborant Kabineti", icon: "🔬", desc: "Tahlil natijalarini kiritish va apparat ma'lumotlarini tasdiqlash" },
  { key: 'canAccessDoctors', label: "👩‍⚕️ Shifokorlar Bo'limi", icon: "👩‍⚕️", desc: "Yo'naltiruvchi shifokorlar bazasi va bonuslarni boshqarish" },
  { key: 'canAccessBlank', label: "📄 Rasmiy Blank", icon: "📄", desc: "Natijalar ruxsatnoma va bosma PDF blanklarini chop etish" },
  { key: 'canAccessCatalog', label: "🧪 Tahlil Turlari Spravochnigi", icon: "🧪", desc: "Tahlil narxlari, normativ diapazonlari va parametrlarni tahrirlash" },
  { key: 'canAccessInventory', label: "📦 Ombor & Reaktivlar", icon: "📦", desc: "Laboratoriya reaktivlari, qoldiqlar va ombor kirim-chiqimlari" },
  { key: 'canAccessAdmin', label: "⚙️ Admin Panel Boshqaruvi", icon: "⚙️", desc: "Foydalanuvchilar, LIS apparatlar va tizim sozlamalariga to'liq kirish" },
];

interface AdminPanelProps {
  diagnosticModules?: DiagnosticModule[];
  onUpdateDiagnosticModules?: (modules: DiagnosticModule[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = React.memo(({ diagnosticModules, onUpdateDiagnosticModules }) => {
  // Active Tab inside Admin Panel
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'branches' | 'settings' | 'lis' | 'sms' | 'audit' | 'backup' | 'api'>('api');

  // Admin Data State with LocalStorage Persistence
  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem('smartlab_admin_users');
    if (saved) {
      const parsed: SystemUser[] = JSON.parse(saved);
      return parsed.map(u => ({
        ...u,
        permissions: u.permissions || DEFAULT_PERMISSIONS_BY_ROLE[u.role] || DEFAULT_PERMISSIONS_BY_ROLE.laborant
      }));
    }
    return INITIAL_SYSTEM_USERS;
  });

  const [branches, setBranches] = useState<ClinicBranch[]>(() => {
    const saved = localStorage.getItem('smartlab_admin_branches');
    return saved ? JSON.parse(saved) : INITIAL_CLINIC_BRANCHES;
  });

  const [clinicConfig, setClinicConfig] = useState<ClinicConfig>(() => {
    const saved = localStorage.getItem('smartlab_admin_clinicConfig');
    return saved ? JSON.parse(saved) : INITIAL_CLINIC_CONFIG;
  });

  const [lisEquipments, setLisEquipments] = useState<LisEquipment[]>(() => {
    const saved = localStorage.getItem('smartlab_admin_lisEquipments');
    return saved ? JSON.parse(saved) : INITIAL_LIS_EQUIPMENT;
  });

  const [smsConfig, setSmsConfig] = useState<SmsGatewayConfig>(() => {
    const saved = localStorage.getItem('smartlab_admin_smsConfig');
    return saved ? JSON.parse(saved) : INITIAL_SMS_CONFIG;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('smartlab_admin_auditLogs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [systemStats] = useState<SystemHealthStats>(INITIAL_SYSTEM_STATS);

  // Diagnostic Modules State
  const [diagModules, setDiagModules] = useState<DiagnosticModule[]>(() => {
    if (diagnosticModules && diagnosticModules.length > 0) return diagnosticModules;
    const saved = localStorage.getItem('smartlab_diagnostic_modules_v2');
    if (saved) {
      const parsed: DiagnosticModule[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(m => m.id));
      const missing = INITIAL_DIAGNOSTIC_MODULES.filter(m => !existingIds.has(m.id));
      return [...parsed, ...missing];
    }
    return INITIAL_DIAGNOSTIC_MODULES;
  });

  const [isDiagModalOpen, setIsDiagModalOpen] = useState(false);
  const [editingDiagModule, setEditingDiagModule] = useState<DiagnosticModule | null>(null);
  const [diagFormData, setDiagFormData] = useState<{
    code: string;
    name: string;
    icon: string;
    categoryName: string;
    description: string;
    enabled: boolean;
  }>({
    code: '',
    name: '',
    icon: '🩻',
    categoryName: '',
    description: '',
    enabled: true
  });

  const handleSaveDiagModule = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: DiagnosticModule[];
    if (editingDiagModule) {
      updated = diagModules.map(m => m.id === editingDiagModule.id ? {
        ...m,
        code: diagFormData.code.toUpperCase(),
        name: diagFormData.name,
        icon: diagFormData.icon,
        categoryName: diagFormData.categoryName || diagFormData.name.replace(/^[\s\S]*?\s/, ''),
        description: diagFormData.description,
        enabled: diagFormData.enabled
      } : m);
    } else {
      const newId = `diag-${Date.now()}`;
      const newMod: DiagnosticModule = {
        id: newId,
        code: diagFormData.code.toUpperCase() || 'CUSTOM',
        name: diagFormData.name,
        icon: diagFormData.icon || '🩺',
        categoryName: diagFormData.categoryName || diagFormData.name.replace(/^[\s\S]*?\s/, ''),
        description: diagFormData.description,
        enabled: diagFormData.enabled,
        isSystem: false
      };
      updated = [...diagModules, newMod];
    }

    setDiagModules(updated);
    if (onUpdateDiagnosticModules) {
      onUpdateDiagnosticModules(updated);
    }
    localStorage.setItem('smartlab_diagnostic_modules_v2', JSON.stringify(updated));
    setIsDiagModalOpen(false);
    setEditingDiagModule(null);
    showToast(editingDiagModule ? 'Diagnostika moduli yangilandi! ✅' : 'Yangi diagnostika moduli qo\'shildi! 🎉');
  };

  const handleToggleDiagModule = (id: string) => {
    const updated = diagModules.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m);
    setDiagModules(updated);
    if (onUpdateDiagnosticModules) {
      onUpdateDiagnosticModules(updated);
    }
    localStorage.setItem('smartlab_diagnostic_modules_v2', JSON.stringify(updated));
    showToast('Modul holati o\'zgartirildi! 🔄');
  };

  const handleDeleteDiagModule = (id: string) => {
    const mod = diagModules.find(m => m.id === id);
    if (mod?.isSystem) {
      alert('Tizim standarti bo\'lgan modulni o\'chira olmaysiz. Faqat holatini nofaol qilishingiz mumkin.');
      return;
    }
    if (confirm('Ushbu diagnostika modulini o\'chirishga ishonchingiz komilmi?')) {
      const updated = diagModules.filter(m => m.id !== id);
      setDiagModules(updated);
      if (onUpdateDiagnosticModules) {
        onUpdateDiagnosticModules(updated);
      }
      localStorage.setItem('smartlab_diagnostic_modules_v2', JSON.stringify(updated));
      showToast('Diagnostika moduli o\'chirildi! 🗑️');
    }
  };

  // User Filter & Search
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userBranchFilter, setUserBranchFilter] = useState<string>('all');

  // Audit Filter
  const [auditSearch, setAuditSearch] = useState('');
  const [auditSeverityFilter, setAuditSeverityFilter] = useState<string>('all');

  // API TEST BENCH & LOADER SPINNER STATE
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [apiLoaderType, setApiLoaderType] = useState<'oval' | 'threedots' | 'dna' | 'tailspin' | 'rotating'>('oval');
  const [apiLoaderLabel, setApiLoaderLabel] = useState('');
  const [apiLastResponse, setApiLastResponse] = useState<ApiResponse<any> | null>(null);
  const [caughtApiErrors, setCaughtApiErrors] = useState<{ id: string; time: string; msg: string; ms: number }[]>([]);

  // User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [userFormData, setUserFormData] = useState<{
    name: string;
    username: string;
    email: string;
    phone: string;
    role: UserRole;
    status: 'active' | 'blocked';
    avatarUrl: string;
    branchId: string;
    branchName: string;
    permissions: UserPermissions;
  }>({
    name: '',
    username: '',
    email: '',
    phone: '',
    role: 'laborant',
    status: 'active',
    avatarUrl: '',
    branchId: 'BR-01',
    branchName: 'Markaziy Laboratoriya (Toshkent)',
    permissions: { ...DEFAULT_PERMISSIONS_BY_ROLE.laborant }
  });

  // Branch Modal State
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<ClinicBranch | null>(null);
  const [branchFormData, setBranchFormData] = useState<{
    code: string;
    name: string;
    address: string;
    phone: string;
    managerName: string;
    status: 'active' | 'inactive';
    permissions: UserPermissions;
  }>({
    code: '',
    name: '',
    address: '',
    phone: '',
    managerName: '',
    status: 'active',
    permissions: { ...DEFAULT_PERMISSIONS_BY_ROLE.admin }
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to LocalStorage
  const saveUsersToStorage = (newUsers: SystemUser[]) => {
    setUsers(newUsers);
    localStorage.setItem('smartlab_admin_users', JSON.stringify(newUsers));
  };

  const saveBranchesToStorage = (newBranches: ClinicBranch[]) => {
    setBranches(newBranches);
    localStorage.setItem('smartlab_admin_branches', JSON.stringify(newBranches));
  };

  const saveClinicConfigToStorage = (newConfig: ClinicConfig) => {
    setClinicConfig(newConfig);
    localStorage.setItem('smartlab_admin_clinicConfig', JSON.stringify(newConfig));
    showToast("Klinika va tizim sozlamalari saqlandi! ✅");
  };

  const saveLisToStorage = (newLis: LisEquipment[]) => {
    setLisEquipments(newLis);
    localStorage.setItem('smartlab_admin_lisEquipments', JSON.stringify(newLis));
  };

  const saveSmsToStorage = (newSms: SmsGatewayConfig) => {
    setSmsConfig(newSms);
    localStorage.setItem('smartlab_admin_smsConfig', JSON.stringify(newSms));
    showToast("SMS va Telegram gateway sozlamalari yangilandi! 📲");
  };

  const addAuditLog = (action: string, module: string, severity: 'info' | 'warning' | 'critical' = 'info', details: string = '') => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('uz-UZ'),
      userName: "Admin",
      userRole: "admin",
      action,
      module,
      details: details || action,
      ipAddress: "192.168.1.100",
      severity
    };
    setAuditLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('smartlab_admin_auditLogs', JSON.stringify(updated));
      return updated;
    });
  };

  // ================= SERVER API & ERROR HANDLING DEMO TEST HANDLERS =================
  const handleTestServerHealth = async () => {
    setIsApiLoading(true);
    setApiLoaderType('oval');
    setApiLoaderLabel("Server holati va ping tekshirilmoqda... (try-catch-finally)");
    setApiLastResponse(null);

    try {
      const response = await apiService.checkServerHealth();
      setApiLastResponse(response);
      if (response.success) {
        showToast(`Server sog'lom! Ping: ${response.data?.ping}ms ✅`);
        addAuditLog("Server health check: Success", "API Service", "info");
      } else {
        setCaughtApiErrors(prev => [{
          id: `ERR-${Date.now()}`,
          time: response.timestamp,
          msg: response.error || 'Server error',
          ms: response.executionTimeMs
        }, ...prev]);
        showToast(`Xatolik ushlandi (catch): ${response.error}`);
        addAuditLog(`Server error caught: ${response.error}`, "API Service", "warning");
      }
    } catch (fatalErr: any) {
      setCaughtApiErrors(prev => [{
        id: `ERR-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        msg: fatalErr.message,
        ms: 0
      }, ...prev]);
    } finally {
      setIsApiLoading(false); // Always stops loader in finally block
    }
  };

  const handleTestLisConnectionWithThrow = async () => {
    setIsApiLoading(true);
    setApiLoaderType('tailspin');
    setApiLoaderLabel("Rotor-Gene Q PCR apparati TCP porti sinovdan o'tkazilmoqda (throw Error demo)...");
    setApiLastResponse(null);

    try {
      const response = await apiService.testLisEquipmentConnection('Rotor-Gene Q PCR', '192.168.1.130');
      setApiLastResponse(response);
      if (!response.success) {
        setCaughtApiErrors(prev => [{
          id: `ERR-${Date.now()}`,
          time: response.timestamp,
          msg: response.error || 'LIS Error',
          ms: response.executionTimeMs
        }, ...prev]);
        showToast("throw kodi bilan otilgan LIS xatoligi ushlandi! 🚨");
        addAuditLog("LIS connection throw error caught", "LIS Hardware", "critical");
      }
    } catch (err: any) {
      showToast("Catch xatoligi: " + err.message);
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleTestSmsTokenValidation = async () => {
    setIsApiLoading(true);
    setApiLoaderType('threedots');
    setApiLoaderLabel("Eskiz.uz SMS API tokeni tekshirilmoqda...");
    setApiLastResponse(null);

    try {
      const response = await apiService.testSmsToken(smsConfig.provider, smsConfig.apiToken);
      setApiLastResponse(response);
      if (response.success) {
        showToast(`SMS API Token tasdiqlandi! Kreditlar: ${response.data?.credits} ✅`);
      } else {
        setCaughtApiErrors(prev => [{
          id: `ERR-${Date.now()}`,
          time: response.timestamp,
          msg: response.error || 'SMS Token Error',
          ms: response.executionTimeMs
        }, ...prev]);
        showToast("SMS Token xatoligi ushlandi! ⚠️");
      }
    } catch (err: any) {
      showToast("SMS Error: " + err.message);
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleTestCloudSyncDna = async () => {
    setIsApiLoading(true);
    setApiLoaderType('dna');
    setApiLoaderLabel("Ma'lumotlar bazasi Cloud server bilan sinxronlanmoqda...");
    setApiLastResponse(null);

    try {
      const response = await apiService.syncCloudData();
      setApiLastResponse(response);
      showToast("Cloud sinxronizatsiya muvaffaqiyatli! 14,850 yozuv sinxronlandi ☁️");
    } catch (err: any) {
      showToast("Sync Error: " + err.message);
    } finally {
      setIsApiLoading(false);
    }
  };

  // ================= USER MODAL HANDLERS =================
  const handleOpenUserModal = (user?: SystemUser) => {
    if (user) {
      setEditingUser(user);
      setUserFormData({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        avatarUrl: user.avatarUrl || '',
        branchId: user.branchId || 'BR-01',
        branchName: user.branchName || 'Markaziy Laboratoriya (Toshkent)',
        permissions: user.permissions || { ...DEFAULT_PERMISSIONS_BY_ROLE[user.role] }
      });
    } else {
      setEditingUser(null);
      setUserFormData({
        name: '',
        username: '',
        email: '',
        phone: '',
        role: 'laborant',
        status: 'active',
        avatarUrl: '',
        branchId: 'BR-01',
        branchName: 'Markaziy Laboratoriya (Toshkent)',
        permissions: { ...DEFAULT_PERMISSIONS_BY_ROLE.laborant }
      });
    }
    setIsUserModalOpen(true);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showToast("Xatolik: Rasm hajmi 5MB dan oshmasligi kerak! ⚠️");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setUserFormData(prev => ({ ...prev, avatarUrl: result }));
          showToast("Xodim avatari rasmi joylashtirildi! 📸");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setUserFormData({
      ...userFormData,
      role: newRole,
      permissions: { ...DEFAULT_PERMISSIONS_BY_ROLE[newRole] }
    });
  };

  const handleTogglePermission = (permKey: keyof UserPermissions) => {
    setUserFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permKey]: !prev.permissions[permKey]
      }
    }));
  };

  const handleSetAllPermissions = (value: boolean) => {
    const updated: UserPermissions = {
      canAccessDashboard: value,
      canAccessRegistration: value,
      canAccessCashier: value,
      canAccessWorkstation: value,
      canAccessDoctors: value,
      canAccessBlank: value,
      canAccessCatalog: value,
      canAccessInventory: value,
      canAccessAdmin: value
    };
    setUserFormData(prev => ({ ...prev, permissions: updated }));
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.name || !userFormData.username) {
      showToast("Xatolik: Ism va Login to'ldirilishi shart! ⚠️");
      return;
    }

    const selectedBranch = branches.find(b => b.id === userFormData.branchId);

    let updatedList: SystemUser[];
    if (editingUser) {
      updatedList = users.map(u =>
        u.id === editingUser.id
          ? {
              ...u,
              ...userFormData,
              branchName: selectedBranch ? selectedBranch.name : userFormData.branchName
            }
          : u
      );
      addAuditLog(`Foydalanuvchi tahrirlandi: ${userFormData.username} (${userFormData.role}) - Filial: ${selectedBranch?.name}`, 'Admin Panel', 'info');
      showToast(`Foydalanuvchi "${userFormData.name}" yangilandi! ✨`);
    } else {
      const newUser: SystemUser = {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        ...userFormData,
        branchName: selectedBranch ? selectedBranch.name : 'Markaziy Laboratoriya (Toshkent)',
        lastLogin: 'Hali kirmagan',
        createdAt: new Date().toISOString().split('T')[0]
      };
      updatedList = [newUser, ...users];
      addAuditLog(`Yangi foydalanuvchi yaratildi: ${userFormData.username} (${userFormData.role})`, 'Admin Panel', 'info');
      showToast(`Yangi foydalanuvchi "${userFormData.name}" qo'shildi! 🎉`);
    }

    saveUsersToStorage(updatedList);
    setIsUserModalOpen(false);
  };

  const handleToggleUserStatus = (user: SystemUser) => {
    const nextStatus = user.status === 'active' ? 'blocked' : 'active';
    const updated = users.map(u => u.id === user.id ? { ...u, status: nextStatus as 'active' | 'blocked' } : u);
    saveUsersToStorage(updated);
    addAuditLog(`Foydalanuvchi holati o'zgartirildi: ${user.username} -> ${nextStatus}`, 'Admin Panel', 'warning');
    showToast(`Foydalanuvchi "${user.name}" holati: ${nextStatus === 'active' ? 'Faol ✅' : 'Bloklangan 🚫'}`);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Haqiqatan ham foydalanuvchi "${userName}"ni o'chirmoqchimisiz?`)) {
      const updated = users.filter(u => u.id !== userId);
      saveUsersToStorage(updated);
      addAuditLog(`Foydalanuvchi o'chirildi: ${userName} (ID: ${userId})`, 'Admin Panel', 'critical');
      showToast(`Foydalanuvchi "${userName}" o'chirildi.`);
    }
  };

  const handleToggleSingleUserPermission = (userId: string, permKey: keyof UserPermissions) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const currentVal = Boolean(targetUser.permissions && targetUser.permissions[permKey]);
    const updatedVal = !currentVal;

    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          permissions: {
            ...(u.permissions || DEFAULT_PERMISSIONS_BY_ROLE[u.role]),
            [permKey]: updatedVal
          }
        };
      }
      return u;
    });

    const moduleInfo = MODULE_PERMISSIONS_LIST.find(m => m.key === permKey);
    saveUsersToStorage(updatedUsers);

    if (updatedVal) {
      showToast(`"${targetUser.name}" ga ${moduleInfo?.label || permKey} ruxsati berildi! ✅`);
      addAuditLog(`Ruxsat berildi: ${targetUser.username} -> ${moduleInfo?.label}`, 'Admin Panel', 'info');
    } else {
      showToast(`"${targetUser.name}" dan ${moduleInfo?.label || permKey} ruxsati olib tashlandi! 🚫`);
      addAuditLog(`Ruxsat olib tashlandi: ${targetUser.username} -> ${moduleInfo?.label}`, 'Admin Panel', 'warning');
    }
  };

  const handleToggleAllPermissionsForUser = (userId: string, value: boolean) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          permissions: {
            canAccessDashboard: value,
            canAccessRegistration: value,
            canAccessCashier: value,
            canAccessWorkstation: value,
            canAccessDoctors: value,
            canAccessBlank: value,
            canAccessCatalog: value,
            canAccessInventory: value,
            canAccessAdmin: value
          }
        };
      }
      return u;
    });

    saveUsersToStorage(updatedUsers);
    showToast(`"${targetUser.name}" uchun barcha ruxsatlar ${value ? 'yoqildi ✅' : 'o\'chirildi 🚫'}`);
    addAuditLog(`Barcha ruxsatlar ${value ? 'berildi' : 'o\'chirildi'}: ${targetUser.username}`, 'Admin Panel', 'warning');
  };

  // ================= BRANCH (FILIAL) MODAL HANDLERS =================
  const handleOpenBranchModal = (branch?: ClinicBranch) => {
    if (branch) {
      setEditingBranch(branch);
      setBranchFormData({
        code: branch.code,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        managerName: branch.managerName,
        status: branch.status,
        permissions: branch.permissions || { ...DEFAULT_PERMISSIONS_BY_ROLE.admin }
      });
    } else {
      setEditingBranch(null);
      const nextNum = branches.length + 1;
      setBranchFormData({
        code: `FIL-0${nextNum}`,
        name: '',
        address: '',
        phone: '',
        managerName: '',
        status: 'active',
        permissions: { ...DEFAULT_PERMISSIONS_BY_ROLE.admin }
      });
    }
    setIsBranchModalOpen(true);
  };

  const handleToggleBranchPermission = (permKey: keyof UserPermissions) => {
    setBranchFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permKey]: !prev.permissions[permKey]
      }
    }));
  };

  const handleSetAllBranchPermissions = (value: boolean) => {
    const updated: UserPermissions = {
      canAccessDashboard: value,
      canAccessRegistration: value,
      canAccessCashier: value,
      canAccessWorkstation: value,
      canAccessDoctors: value,
      canAccessBlank: value,
      canAccessCatalog: value,
      canAccessInventory: value,
      canAccessAdmin: value
    };
    setBranchFormData(prev => ({ ...prev, permissions: updated }));
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchFormData.name || !branchFormData.code) {
      showToast("Xatolik: Filial nomi va kodi to'ldirilishi shart! ⚠️");
      return;
    }

    let updatedBranches: ClinicBranch[];
    if (editingBranch) {
      updatedBranches = branches.map(b =>
        b.id === editingBranch.id
          ? { ...b, ...branchFormData }
          : b
      );
      addAuditLog(`Filial tahrirlandi: ${branchFormData.name} (${branchFormData.code})`, 'Admin Panel', 'info');
      showToast(`Filial "${branchFormData.name}" sozlamalari yangilandi! 🏢`);
    } else {
      const newBranch: ClinicBranch = {
        id: `BR-0${branches.length + 1}`,
        ...branchFormData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      updatedBranches = [...branches, newBranch];
      addAuditLog(`Yangi filial ochildi: ${branchFormData.name} (${branchFormData.code})`, 'Admin Panel', 'info');
      showToast(`Yangi filial "${branchFormData.name}" ochildi! 🎉`);
    }

    saveBranchesToStorage(updatedBranches);
    setIsBranchModalOpen(false);
  };

  const handleToggleBranchStatus = (branch: ClinicBranch) => {
    const nextStatus = branch.status === 'active' ? 'inactive' : 'active';
    const updated = branches.map(b => b.id === branch.id ? { ...b, status: nextStatus as 'active' | 'inactive' } : b);
    saveBranchesToStorage(updated);
    addAuditLog(`Filial holati o'zgartirildi: ${branch.name} -> ${nextStatus}`, 'Admin Panel', 'warning');
    showToast(`Filial "${branch.name}" holati: ${nextStatus === 'active' ? 'Faol ✅' : 'Nofaol 🚫'}`);
  };

  const handleDeleteBranch = (branchId: string, branchName: string) => {
    if (window.confirm(`Haqiqatan ham "${branchName}" filialini o'chirmoqchimisiz?`)) {
      const updated = branches.filter(b => b.id !== branchId);
      saveBranchesToStorage(updated);
      addAuditLog(`Filial o'chirildi: ${branchName} (ID: ${branchId})`, 'Admin Panel', 'critical');
      showToast(`Filial "${branchName}" o'chirildi.`);
    }
  };

  const handleToggleBranchCardPermission = (branchId: string, permKey: keyof UserPermissions) => {
    const targetBranch = branches.find(b => b.id === branchId);
    if (!targetBranch) return;

    const currentVal = Boolean(targetBranch.permissions && targetBranch.permissions[permKey]);
    const updatedVal = !currentVal;

    const updatedBranches = branches.map(b => {
      if (b.id === branchId) {
        return {
          ...b,
          permissions: {
            ...(b.permissions || DEFAULT_PERMISSIONS_BY_ROLE.admin),
            [permKey]: updatedVal
          }
        };
      }
      return b;
    });

    const moduleInfo = MODULE_PERMISSIONS_LIST.find(m => m.key === permKey);
    saveBranchesToStorage(updatedBranches);

    if (updatedVal) {
      showToast(`"${targetBranch.name}" filialiga ${moduleInfo?.label} ruxsati berildi! 🏢`);
      addAuditLog(`Filial ruxsati berildi: ${targetBranch.code} -> ${moduleInfo?.label}`, 'Admin Panel', 'info');
    } else {
      showToast(`"${targetBranch.name}" filialidan ${moduleInfo?.label} ruxsati olib tashlandi! 🚫`);
      addAuditLog(`Filial ruxsati olib tashlandi: ${targetBranch.code} -> ${moduleInfo?.label}`, 'Admin Panel', 'warning');
    }
  };

  // Toggle LIS Status
  const handleToggleLisStatus = (lisId: string) => {
    const updated = lisEquipments.map(eq => {
      if (eq.id === lisId) {
        const nextStatus: 'online' | 'offline' = eq.status === 'online' ? 'offline' : 'online';
        return { ...eq, status: nextStatus, lastDataReceived: new Date().toLocaleString() };
      }
      return eq;
    });
    saveLisToStorage(updated);
    showToast("LIS apparat holati o'zgartirildi! 🔬");
  };

  // Database Backup Export (JSON Download)
  const handleExportBackup = () => {
    const allData = {
      timestamp: new Date().toISOString(),
      version: 'SmartLab LIMS PRO 3.4',
      users,
      branches,
      clinicConfig,
      lisEquipments,
      smsConfig,
      auditLogs,
      patients: JSON.parse(localStorage.getItem('smartlab_patients') || '[]'),
      orders: JSON.parse(localStorage.getItem('smartlab_orders') || '[]'),
      testCatalog: JSON.parse(localStorage.getItem('smartlab_testCatalog_v6') || '[]'),
      reagents: JSON.parse(localStorage.getItem('smartlab_reagents') || '[]')
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SmartLab_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addAuditLog('Tizim bazasi to\'liq zaxira fayl (JSON) ko\'rinishida yuklab olindi', 'Admin Panel', 'info');
    showToast("Zaxira fayli muvaffaqiyatli yuklab olindi! 💾");
  };

  // Restore Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.users) saveUsersToStorage(parsed.users);
          if (parsed.branches) saveBranchesToStorage(parsed.branches);
          if (parsed.clinicConfig) setClinicConfig(parsed.clinicConfig);
          if (parsed.lisEquipments) saveLisToStorage(parsed.lisEquipments);
          if (parsed.smsConfig) setSmsConfig(parsed.smsConfig);
          if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);

          addAuditLog('Tizim bazasi fayldan qayta tiklandi (Restore)', 'Admin Panel', 'warning');
          showToast("Tizim ma'lumotlari muvaffaqiyatli qayta tiklandi! 🔄");
        } catch (err) {
          alert("Faylni o'qishda xatolik yuz berdi. Noto'g'ri JSON formati!");
        }
      };
    }
  };

  // Copy helper
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.phone.includes(userSearch);
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesBranch = userBranchFilter === 'all' || u.branchId === userBranchFilter;
    return matchesSearch && matchesRole && matchesBranch;
  });

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
                          log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
                          log.module.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesSeverity = auditSeverityFilter === 'all' || log.severity === auditSeverityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 animate-bounce border border-teal-300">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Panel Header Banner */}
      <div className="max-w-7xl mx-auto mb-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
          <Shield className="w-96 h-96 text-teal-400" />
        </div>

        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950">
            <Shield className="w-8 h-8 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-wide">ADMINISTRATOR BOSHGARUV PANELI</h1>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                PRO SYSTEM v3.4
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Server API error handling (try-catch-finally, throw) & react-loader-spinner, Filiallar va Galishka ruxsatlari
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-teal-300 px-4 py-2.5 rounded-xl border border-teal-500/30 text-xs font-bold transition-all shadow hover:shadow-teal-500/10"
          >
            <Download className="w-4 h-4 text-teal-400" />
            Zaxirash (JSON)
          </button>
          <label className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-teal-500/20 transition-all cursor-pointer">
            <Upload className="w-4 h-4 text-slate-950" />
            Tiklash (Restore)
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Admin Tabbed Navigation */}
      <div className="max-w-7xl mx-auto mb-6 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 overflow-x-auto shadow-lg">
        <button
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'api'
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Globe className="w-4 h-4" />
          🌐 Server API & Error Handling (Loaders)
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'branches'
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Building className="w-4 h-4" />
          🏢 Filiallar ({branches.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          👥 Xodimlar va Ruxsatlar ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-4 h-4" />
          📊 Tizim Holati
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Settings className="w-4 h-4" />
          ⚙️ Tizim Sozlamalari
        </button>

        <button
          onClick={() => setActiveTab('lis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'lis'
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Cpu className="w-4 h-4" />
          🔬 LIS Uskunalar ({lisEquipments.filter(e => e.status === 'online').length}/{lisEquipments.length})
        </button>

        <button
          onClick={() => setActiveTab('sms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'sms'
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          💬 SMS & Telegram
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          🛡️ Audit Loglar ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'backup'
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Database className="w-4 h-4" />
          💾 Zaxirash
        </button>
      </div>

      {/* TAB CONTENT AREAS */}
      <div className="max-w-7xl mx-auto">

        {/* ================= TAB 0: SERVER API & ERROR HANDLING (TRY-CATCH-FINALLY, THROW & REACT-LOADER-SPINNER) ================= */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-teal-400" />
                    Server API Error Handling Engine & Loader Spinners
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Server bilan ishlashda <code>try</code>, <code>throw</code>, <code>catch</code>, <code>finally</code> mantiqlari hamda <strong>react-loader-spinner</strong> kutubxonasi
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-mono font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Async HTTP API simulation ready
                  </span>
                </div>
              </div>

              {/* TEST BENCH ACTION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={handleTestServerHealth}
                  disabled={isApiLoading}
                  className="bg-slate-950 border border-slate-800 hover:border-teal-500/60 p-4 rounded-xl text-left transition-all group disabled:opacity-50 shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      try-catch-finally
                    </span>
                    <Play className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="text-xs font-black text-white">1. Server Health Check</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Async so'rov: <code>try</code> (asosiy kod), random <code>throw</code> error va <code>finally</code> (loader reset)
                  </p>
                </button>

                <button
                  onClick={handleTestLisConnectionWithThrow}
                  disabled={isApiLoading}
                  className="bg-slate-950 border border-slate-800 hover:border-rose-500/60 p-4 rounded-xl text-left transition-all group disabled:opacity-50 shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      throw Error
                    </span>
                    <Play className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="text-xs font-black text-white">2. LIS TCP Hardware Test</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Shtatdagi <code>throw new Error(...)</code> bilan otilgan apparat aloqa xatoligini ushlash
                  </p>
                </button>

                <button
                  onClick={handleTestSmsTokenValidation}
                  disabled={isApiLoading}
                  className="bg-slate-950 border border-slate-800 hover:border-amber-500/60 p-4 rounded-xl text-left transition-all group disabled:opacity-50 shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      token validation
                    </span>
                    <Play className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="text-xs font-black text-white">3. SMS Gateway Token Test</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Eskiz.uz API tokeni to'g'riligini tekshirish (HTTP 401 error handling)
                  </p>
                </button>

                <button
                  onClick={handleTestCloudSyncDna}
                  disabled={isApiLoading}
                  className="bg-slate-950 border border-slate-800 hover:border-cyan-500/60 p-4 rounded-xl text-left transition-all group disabled:opacity-50 shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      DNA Spinner
                    </span>
                    <Play className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="text-xs font-black text-white">4. Cloud Sinxronizatsiya</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    react-loader-spinner ning animatsiyali DNA va Oval spinnerlarini ko'rish
                  </p>
                </button>
              </div>

              {/* LIVE LOADER SPINNER DISPLAY */}
              {isApiLoading && (
                <div className="bg-slate-950 p-6 rounded-2xl border border-teal-500/40 flex flex-col items-center justify-center space-y-3 shadow-xl animate-in fade-in zoom-in duration-200">
                  <LoaderSpinner
                    type={apiLoaderType}
                    color="#14b8a6"
                    size={48}
                    label={apiLoaderLabel}
                  />
                  <span className="text-[11px] font-mono text-slate-400">
                    Async execution in progress... (finally block will stop loader automatically)
                  </span>
                </div>
              )}

              {/* LAST API RESPONSE OR ERROR BOX */}
              {apiLastResponse && !isApiLoading && (
                <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                  apiLastResponse.success
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-2">
                      {apiLastResponse.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                      {apiLastResponse.success ? 'SERVER NORMALLIK BILAN JAVOB BERDI' : 'XATOLIK USHLANDI (CATCH EXCEPTION)'}
                    </span>
                    <span className="font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">
                      Vaqt: {apiLastResponse.executionTimeMs}ms | {apiLastResponse.timestamp}
                    </span>
                  </div>
                  <pre className="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-200 overflow-x-auto border border-slate-800">
                    {JSON.stringify(apiLastResponse, null, 2)}
                  </pre>
                </div>
              )}

              {/* ERROR HANDLING CODE ARCHITECTURE EXPLANATION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <h3 className="text-xs font-black text-teal-400 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> Error Handling & Async Server Kodeks (Tushuntirish)
                  </h3>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-teal-400 font-mono">1. try &#123; ... &#125;</strong>
                      <p className="text-[11px] text-slate-400">
                        Asosiy server kodi joylashadi. HTTP/TCP so'rovlari va ma'lumotlar tortish shu yerda bajariladi.
                      </p>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-rose-400 font-mono">2. throw new Error("...")</strong>
                      <p className="text-[11px] text-slate-400">
                        Server javob bermasa yoki token noto'g'ri bo'lsa, <code>throw</code> orqali xatolik otilib, kod ijrosi to'xtatiladi va <code>catch</code> ga uzatiladi.
                      </p>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-amber-400 font-mono">3. catch (error) &#123; ... &#125;</strong>
                      <p className="text-[11px] text-slate-400">
                        Xatolikni ushlaydi, foydalanuvchiga tushunarli xabar chiqaradi hamda tizimni qulashdan saqlaydi.
                      </p>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-cyan-400 font-mono">4. finally &#123; ... &#125;</strong>
                      <p className="text-[11px] text-slate-400">
                        Natijadan (muvaffaqiyat yoki xatolik) qat'i nazar doim ishlaydi hamda spinner loader va taymerlarni o'chiradi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CAUGHT ERRORS LOG CONSOLE */}
                <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                      <h3 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        Ushlangan Server Xatoliklari (Catch Console Log)
                      </h3>
                      {caughtApiErrors.length > 0 && (
                        <button
                          onClick={() => setCaughtApiErrors([])}
                          className="text-[10px] font-bold text-rose-400 hover:underline"
                        >
                          Tozalash
                        </button>
                      )}
                    </div>

                    {caughtApiErrors.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-xs italic">
                        Hali xatoliklar ushlanmadi. Yuqoridagi tugmalarni bosib sinab ko'ring!
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {caughtApiErrors.map(errLog => (
                          <div key={errLog.id} className="p-3 bg-slate-900 rounded-xl border border-rose-500/30 text-xs space-y-1">
                            <div className="flex items-center justify-between font-mono text-[10px] text-rose-400 font-bold">
                              <span>{errLog.id}</span>
                              <span>{errLog.time} ({errLog.ms}ms)</span>
                            </div>
                            <p className="font-mono text-[11px] text-slate-200 leading-snug">{errLog.msg}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800/80 flex items-center justify-between">
                    <span>react-loader-spinner v6.1.6 activated</span>
                    <span className="text-teal-400 font-mono font-bold">Total caught: {caughtApiErrors.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 1: FILIALLAR BOSHQARUVI (BRANCHES) ================= */}
        {activeTab === 'branches' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-teal-400" />
                  Filiallar Ochish va Ruxsatlarni Sozlash (☑️ Galishka Nazorati)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Laboratoriya shaxobchalari (filiallar) ro'yxati, ruxsat etilgan modullar va mas'ul rahbarlar
                </p>
              </div>

              <button
                onClick={() => handleOpenBranchModal()}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 px-4 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-teal-500/20 transition-all"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                + Yangi Filial Ochish
              </button>
            </div>

            {/* Branches Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {branches.map(branch => {
                const branchUsersCount = users.filter(u => u.branchId === branch.id).length;
                const permCount = Object.values(branch.permissions || {}).filter(Boolean).length;

                return (
                  <div key={branch.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 relative hover:border-slate-700 transition-all shadow-md">
                    {/* Top Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-black text-sm">
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold bg-slate-900 text-teal-300 px-2 py-0.5 rounded border border-slate-800">
                              {branch.code}
                            </span>
                            <h3 className="text-sm font-black text-white">{branch.name}</h3>
                          </div>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                            {branch.address}
                          </p>
                        </div>
                      </div>

                      <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold border ${
                        branch.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${branch.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
                        {branch.status === 'active' ? 'Faol Filial' : 'Nofaol'}
                      </span>
                    </div>

                    {/* Details Box */}
                    <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-900 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Mas'ul Rahbar:</span>
                        <span className="font-bold text-slate-200">{branch.managerName || 'Belgilanmagan'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Telefon:</span>
                        <span className="font-mono text-teal-300">{branch.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Biriktirilgan Xodimlar:</span>
                        <span className="font-bold text-emerald-400">{branchUsersCount} ta xodim</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Ochilgan sana:</span>
                        <span className="text-slate-300">{branch.createdAt}</span>
                      </div>
                    </div>

                    {/* Branch Module Permission Galishka Toggles */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-400 flex items-center gap-1">
                          <CheckSquare className="w-3.5 h-3.5 text-teal-400" />
                          Filialda ruxsat berilgan modullar ({permCount}/9):
                        </span>
                        <button
                          onClick={() => handleOpenBranchModal(branch)}
                          className="text-teal-400 hover:underline text-[10px] font-bold"
                        >
                          Ruxsatlarni tahrirlash →
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 items-center">
                        {MODULE_PERMISSIONS_LIST.map(mod => {
                          const isAllowed = Boolean(branch.permissions && branch.permissions[mod.key]);
                          return (
                            <button
                              key={mod.key}
                              type="button"
                              onClick={() => handleToggleBranchCardPermission(branch.id, mod.key)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all border ${
                                isAllowed
                                  ? 'bg-teal-500/20 text-teal-200 border-teal-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 shadow-sm'
                                  : 'bg-slate-900 text-slate-600 border-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 opacity-40 hover:opacity-100'
                              }`}
                              title={`${mod.label}: ${isAllowed ? '✅ Yoqilgan (O\'chirish uchun bosing)' : '🚫 O\'chirilgan (Yoqish uchun bosing)'}`}
                            >
                              {isAllowed ? <CheckSquare className="w-3 h-3 text-emerald-400" /> : <Square className="w-3 h-3 text-slate-600" />}
                              <span>{mod.icon}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                      <button
                        onClick={() => handleToggleBranchStatus(branch)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                          branch.status === 'active'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        {branch.status === 'active' ? 'Vaqtincha to\'xtatish' : 'Faollashtirish'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenBranchModal(branch)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" /> Tahrirlash
                        </button>
                        <button
                          onClick={() => handleDeleteBranch(branch.id, branch.name)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all"
                          title="Filialni o'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 2: USER MANAGEMENT & PERMISSIONS (GALISHKA) ================= */}
        {activeTab === 'users' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-400" />
                  Xodimlar Boshqaruvi, Filial Biriktirish va Ruxsatlar (☑️ Galishka Nazorati)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tizimda ishlash huquqiga ega bo'lgan xodimlarni qo'shish, filialga biriktirish va modullar ruxsatlarini galishka (checkbox) orqali belgilash
                </p>
              </div>

              <button
                onClick={() => handleOpenUserModal()}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-lg shadow-teal-500/20 transition-all"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                + Yangi Xodim Qo'shish & Ruxsat Berish
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Ism, login yoki telefon bo'yicha qidiruv..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Branch Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Building className="w-4 h-4 text-slate-400" />
                <select
                  value={userBranchFilter}
                  onChange={(e) => setUserBranchFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="all">Barcha Filiallar</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Role Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="all">Barcha Rollar</option>
                  <option value="admin">Administrator</option>
                  <option value="doctor">Shifokor</option>
                  <option value="laborant">Laborant</option>
                  <option value="cashier">Kassir</option>
                  <option value="receptionist">Регистратура</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-3">XODIM F.I.SH / AVATAR</th>
                    <th className="p-3">LOGIN</th>
                    <th className="p-3">BIRIKTIRILGAN FILIAL</th>
                    <th className="p-3">ASOSIY ROLI</th>
                    <th className="p-3">ISHLASH RUXSATLARI (☑️ MODULLAR)</th>
                    <th className="p-3">HOLATI</th>
                    <th className="p-3 text-right">AMALLAR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredUsers.map(user => {
                    const permCount = Object.values(user.permissions || {}).filter(Boolean).length;
                    return (
                      <tr key={user.id} className="hover:bg-slate-800/40 transition-all">
                        <td className="p-3 font-semibold text-white">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                              alt={user.name}
                              className="w-9 h-9 rounded-full border border-slate-700 object-cover"
                            />
                            <div>
                              <div className="font-bold text-slate-100">{user.name}</div>
                              <div className="text-[10px] text-slate-400">{user.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-teal-300 font-bold">{user.username}</td>

                        {/* Branch Column */}
                        <td className="p-3">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-200 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
                            <Building className="w-3.5 h-3.5 text-teal-400" />
                            {user.branchName || 'Markaziy Laboratoriya'}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase border ${
                            user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                            user.role === 'doctor' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                            user.role === 'laborant' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                            user.role === 'cashier' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                            'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>

                        {/* Interactive Permissions Column */}
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1.5 items-center max-w-lg">
                            {MODULE_PERMISSIONS_LIST.map(mod => {
                              const isAllowed = Boolean(user.permissions && user.permissions[mod.key]);
                              return (
                                <button
                                  key={mod.key}
                                  type="button"
                                  onClick={() => handleToggleSingleUserPermission(user.id, mod.key)}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
                                    isAllowed
                                      ? 'bg-teal-500/20 text-teal-200 border-teal-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 shadow-sm'
                                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40 opacity-50 hover:opacity-100'
                                  }`}
                                  title={`${mod.label}: ${isAllowed ? "✅ Ruxsat berilgan (O'chirish uchun bosing)" : "🚫 Ruxsat o'chirilgan (Qo'shish uchun bosing)"}`}
                                >
                                  {isAllowed ? (
                                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Square className="w-3.5 h-3.5 text-slate-600" />
                                  )}
                                  <span>{mod.icon}</span>
                                </button>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => handleToggleAllPermissionsForUser(user.id, permCount < 9)}
                              className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-all cursor-pointer ml-1"
                              title={permCount < 9 ? "Barcha 9 ta ruxsatni berish" : "Barcha ruxsatlarni olib tashlash"}
                            >
                              ({permCount}/9)
                            </button>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className={`flex items-center gap-1.5 font-bold ${
                            user.status === 'active' ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
                            {user.status === 'active' ? 'Faol' : 'Bloklangan'}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleUserStatus(user)}
                              className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                                user.status === 'active'
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              }`}
                              title={user.status === 'active' ? "Bloklash" : "Faollashtirish"}
                            >
                              {user.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleOpenUserModal(user)}
                              className="px-2.5 py-1.5 bg-slate-800 text-teal-300 border border-slate-700 hover:bg-slate-700 rounded-lg transition-all flex items-center gap-1 font-bold text-xs"
                              title="Tahrirlash va Ruxsatlarni o'zgartirish"
                            >
                              <Edit className="w-3.5 h-3.5" /> Tahrirlash
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 rounded-lg transition-all"
                              title="O'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-teal-500/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase text-slate-400">Server CPU Ishlashi</span>
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <Server className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{systemStats.cpuUsage}%</span>
                  <span className="text-xs text-emerald-400 font-bold">✓ Normal</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full" style={{ width: `${systemStats.cpuUsage}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-cyan-500/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase text-slate-400">Operativ Xotira (RAM)</span>
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{systemStats.memoryUsage}%</span>
                  <span className="text-xs text-cyan-400 font-bold">8.4 GB / 16 GB</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full" style={{ width: `${systemStats.memoryUsage}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase text-slate-400">Faol LIS Uskunalar</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Wifi className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-400">
                    {lisEquipments.filter(e => e.status === 'online' || e.status === 'busy').length} / {lisEquipments.length}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">apparat javob bermoqda</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(lisEquipments.filter(e => e.status === 'online').length / lisEquipments.length) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-indigo-500/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase text-slate-400">Ma'lumotlar Bazasi</span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{systemStats.databaseSizeMb} MB</span>
                  <span className="text-xs text-indigo-300 font-bold">{systemStats.totalRecords.toLocaleString()} yozuv</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${systemStats.storageUsedPercent}%` }}></div>
                </div>
              </div>
            </div>

            {/* Middle System Health & Live Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* System Details Box */}
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Terminal className="w-4 h-4 text-teal-400" />
                  Tizim Server Ma'lumotlari
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Versiya:</span>
                    <span className="font-bold text-teal-400">SmartLab LIMS PRO 3.4.0</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Uptime (Uzoq ishlash):</span>
                    <span className="font-bold text-emerald-400">{systemStats.uptime}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Tizim Muhiti:</span>
                    <span className="font-bold text-indigo-300">Production Node.js / Vite</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Sessiya Ulanishlari:</span>
                    <span className="font-bold text-cyan-300">{systemStats.activeConnections} ta faol terminallar</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400">SMS Gateway:</span>
                    <span className={`font-bold ${smsConfig.enabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {smsConfig.enabled ? `Faol (${smsConfig.provider.toUpperCase()})` : 'O\'chirilgan'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Audit Log Preview */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      Oxirgi Xavfsizlik va Audit Harakatlari
                    </h3>
                    <button
                      onClick={() => setActiveTab('audit')}
                      className="text-xs text-teal-400 hover:underline font-bold"
                    >
                      Barchasini ko'rish →
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {auditLogs.slice(0, 4).map(log => (
                      <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start justify-between gap-3 text-xs">
                        <div className="flex items-start gap-2.5">
                          <span className={`p-1.5 rounded-lg mt-0.5 ${
                            log.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            log.severity === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                          }`}>
                            {log.severity === 'critical' ? <AlertCircle className="w-3.5 h-3.5" /> :
                             log.severity === 'warning' ? <AlertTriangle className="w-3.5 h-3.5" /> :
                             <CheckCircle2 className="w-3.5 h-3.5" />}
                          </span>
                          <div>
                            <div className="font-bold text-slate-200 flex items-center gap-2">
                              {log.action}
                              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                                {log.module}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[11px] mt-0.5">{log.details}</p>
                          </div>
                        </div>
                        <div className="text-right text-[11px] text-slate-500 whitespace-nowrap">
                          <div className="font-medium text-slate-300">{log.userName}</div>
                          <div>{log.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: CLINIC SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-400" />
                Klinika va Laboratoriya Tizim Sozlamalari
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Klinika rekvizitlari, CITO narx stavkasi va natijalarni avto-tasdiqlash qoidalari
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); saveClinicConfigToStorage(clinicConfig); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Clinic Data */}
                <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4" /> Klinika Ma'lumotlari
                  </h3>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">Klinika / Laboratoriya Nomi</label>
                    <input
                      type="text"
                      value={clinicConfig.clinicName}
                      onChange={(e) => setClinicConfig({ ...clinicConfig, clinicName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">Manzil</label>
                    <input
                      type="text"
                      value={clinicConfig.address}
                      onChange={(e) => setClinicConfig({ ...clinicConfig, address: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">Telefon</label>
                      <input
                        type="text"
                        value={clinicConfig.phone}
                        onChange={(e) => setClinicConfig({ ...clinicConfig, phone: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">Email</label>
                      <input
                        type="email"
                        value={clinicConfig.email}
                        onChange={(e) => setClinicConfig({ ...clinicConfig, email: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">Ish Vaqti Shablon</label>
                    <input
                      type="text"
                      value={clinicConfig.workingHours}
                      onChange={(e) => setClinicConfig({ ...clinicConfig, workingHours: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Pricing & Auto Rules */}
                <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Narxlash va Avto-Qoidalar
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">Valyuta</label>
                      <input
                        type="text"
                        value={clinicConfig.currency}
                        onChange={(e) => setClinicConfig({ ...clinicConfig, currency: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">CITO Koeffitsiyenti (Ko'paytirgich)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={clinicConfig.citoMultiplier}
                        onChange={(e) => setClinicConfig({ ...clinicConfig, citoMultiplier: parseFloat(e.target.value) || 1.0 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">Kassa Cheki Tagyozuvi (Footer text)</label>
                    <input
                      type="text"
                      value={clinicConfig.receiptFooter}
                      onChange={(e) => setClinicConfig({ ...clinicConfig, receiptFooter: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer bg-slate-900 p-3 rounded-lg border border-slate-800 hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={clinicConfig.autoApproveNormalResults}
                        onChange={(e) => setClinicConfig({ ...clinicConfig, autoApproveNormalResults: e.target.checked })}
                        className="w-4 h-4 accent-teal-500 rounded"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">Norma Natijalarni Avto-Tasdiqlash</div>
                        <div className="text-[10px] text-slate-400">Agar apparat natijasi norma oralig'ida bo'lsa, laborant tasdiqlashisiz ham blank tayyor deb belgilansin</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer bg-slate-900 p-3 rounded-lg border border-slate-800 hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={clinicConfig.autoSendSmsOnComplete}
                        onChange={(e) => setClinicConfig({ ...clinicConfig, autoSendSmsOnComplete: e.target.checked })}
                        className="w-4 h-4 accent-teal-500 rounded"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">Tayyor Natijaga Avto SMS Yuborish</div>
                        <div className="text-[10px] text-slate-400">Tahlil natijasi tayyor bo'lishi bilan bemor telefoniga havola bilan SMS boradi</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-300 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  Sozlamalarni Saqlash
                </button>
              </div>
            </form>

            {/* ================= DIAGNOSTIC & LAB MODULES MANAGEMENT ================= */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" /> Diagnostika va Laboratoriya Bo'limlari / Modullari Sozlamasi
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Qabul (Registration) panelining yuqori tugmalar barida ko'rinadigan diagnostika turlarini (Rentgen, MRT, FGDS, MSKT, UZD va h.k.) yoqish, o'chirish va yangi modullar qo'shish
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingDiagModule(null);
                    setDiagFormData({
                      code: '',
                      name: '',
                      icon: '🩻',
                      categoryName: '',
                      description: '',
                      enabled: true
                    });
                    setIsDiagModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all shadow-md shadow-cyan-600/20 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Yangi Modul Qo'shish</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {diagModules.map(mod => (
                  <div
                    key={mod.id}
                    className={`p-3.5 rounded-xl border transition-all space-y-2 relative ${
                      mod.enabled
                        ? 'bg-slate-900 border-slate-700 shadow-md'
                        : 'bg-slate-900/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl bg-slate-950 p-2 rounded-lg border border-slate-800">{mod.icon}</span>
                        <div>
                          <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                            {mod.name}
                            {mod.isSystem && (
                              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Tizim</span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-cyan-400 font-bold">KOD: {mod.code}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleDiagModule(mod.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          mod.enabled
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {mod.enabled ? '✓ Faol' : '✕ Nofaol'}
                      </button>
                    </div>

                    {mod.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>
                    )}

                    {mod.categoryName && (
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        <span>Kategoriya:</span>
                        <span className="text-teal-300 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {mod.categoryName}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDiagModule(mod);
                          setDiagFormData({
                            code: mod.code,
                            name: mod.name,
                            icon: mod.icon,
                            categoryName: mod.categoryName || '',
                            description: mod.description || '',
                            enabled: mod.enabled
                          });
                          setIsDiagModalOpen(true);
                        }}
                        className="text-xs text-teal-400 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 px-2 py-1 rounded flex items-center gap-1 font-semibold transition-all cursor-pointer"
                      >
                        <Edit className="w-3 h-3" /> Tahrirlash
                      </button>

                      {!mod.isSystem && (
                        <button
                          type="button"
                          onClick={() => handleDeleteDiagModule(mod.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2 py-1 rounded flex items-center gap-1 font-semibold transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> O'chirish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal for adding/editing Diagnostic Module */}
            {isDiagModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      {editingDiagModule ? 'Diagnostika Modulini Tahrirlash' : 'Yangi Diagnostika Modulini Qo\'shish'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsDiagModalOpen(false)}
                      className="text-slate-400 hover:text-white text-lg font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveDiagModule} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Modul Nomi (masalan: 🩻 Рентген yoki 🧠 МРТ)</label>
                      <input
                        type="text"
                        required
                        placeholder="masalan: 🩻 Рентген"
                        value={diagFormData.name}
                        onChange={(e) => setDiagFormData({ ...diagFormData, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Modul Kodi (masalan: RENTGEN)</label>
                        <input
                          type="text"
                          required
                          placeholder="RENTGEN"
                          value={diagFormData.code}
                          onChange={(e) => setDiagFormData({ ...diagFormData, code: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none font-mono uppercase font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Icon / Emoji (masalan: 🩻)</label>
                        <input
                          type="text"
                          required
                          placeholder="🩻"
                          value={diagFormData.icon}
                          onChange={(e) => setDiagFormData({ ...diagFormData, icon: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none text-center font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Biriktiriladigan Tahlil / Diagnostika Kategoriyasi</label>
                      <input
                        type="text"
                        placeholder="masalan: РЕНТГЕН yoki МРТ"
                        value={diagFormData.categoryName}
                        onChange={(e) => setDiagFormData({ ...diagFormData, categoryName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Tavsifi (Qisqacha)</label>
                      <textarea
                        rows={2}
                        placeholder="Laboratoriya va diagnostika bo'limining qisqacha tavsifi..."
                        value={diagFormData.description}
                        onChange={(e) => setDiagFormData({ ...diagFormData, description: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={diagFormData.enabled}
                        onChange={(e) => setDiagFormData({ ...diagFormData, enabled: e.target.checked })}
                        className="w-4 h-4 accent-teal-500 rounded"
                      />
                      <span className="text-xs font-bold text-white">Ushbu modulni hoziroq faollashtirish (Qabul panelida ko'rsatish)</span>
                    </label>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsDiagModalOpen(false)}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20"
                      >
                        Saqlash
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: LIS EQUIPMENT ================= */}
        {activeTab === 'lis' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-teal-400" />
                  LIS (Laboratory Information System) Apparatlar Ulanishi
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Laboratoriya bio-kimyoviy va gematologik tahlil uskunalarini avtomatlashtirilgan ulanishi
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  TCP/IP Server Listening Port: 9100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lisEquipments.map(eq => (
                <div key={eq.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-slate-800 text-teal-300 px-2 py-0.5 rounded border border-slate-700 font-bold">
                          {eq.id}
                        </span>
                        <h3 className="text-sm font-bold text-white">{eq.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{eq.model}</p>
                    </div>

                    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold border ${
                      eq.status === 'online' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      eq.status === 'busy' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${eq.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
                      {eq.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Ulanish Turi & IP:</span>
                      <span className="font-mono text-slate-200">{eq.connectionType.toUpperCase()} ({eq.ipAddress}:{eq.port})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Oxirgi ma'lumot:</span>
                      <span className="text-slate-200">{eq.lastDataReceived}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                      Avto-Ma'lumot tortish: <strong className="text-white">{eq.autoFetch ? 'YOQILGAN' : 'O\'CHIRILGAN'}</strong>
                    </span>

                    <button
                      onClick={() => handleToggleLisStatus(eq.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        eq.status === 'online'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {eq.status === 'online' ? 'Ulanishni uzish' : 'Qayta ulash'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: SMS & TELEGRAM ================= */}
        {activeTab === 'sms' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-teal-400" />
                  SMS & Telegram Bildirishnoma Shlyuzlari
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Eskiz.uz, PlayMobile API va Telegram Bot orqali bemorlarga avtomatik natija jo'natish
                </p>
              </div>

              <label className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsConfig.enabled}
                  onChange={(e) => saveSmsToStorage({ ...smsConfig, enabled: e.target.checked })}
                  className="w-4 h-4 accent-teal-500 rounded"
                />
                <span className="text-xs font-bold text-white">SMS Shlyuzni Yoqish</span>
              </label>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); saveSmsToStorage(smsConfig); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Provider API settings */}
                <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                    <Key className="w-4 h-4" /> Provider & API Kalitlar
                  </h3>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">SMS Provayderi</label>
                    <select
                      value={smsConfig.provider}
                      onChange={(e) => setSmsConfig({ ...smsConfig, provider: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="eskiz">Eskiz.uz (O'zbekiston)</option>
                      <option value="playmobile">PlayMobile SMS</option>
                      <option value="telegram">Faqat Telegram Bot</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">API Token (Eskiz / PlayMobile)</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={smsConfig.apiToken}
                        onChange={(e) => setSmsConfig({ ...smsConfig, apiToken: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-10 py-2 text-xs text-white font-mono focus:border-teal-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyText(smsConfig.apiToken, 'token')}
                        className="absolute right-2 top-2 text-slate-400 hover:text-white"
                      >
                        {copiedKey === 'token' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">Sender ID (Alpha Name)</label>
                      <input
                        type="text"
                        value={smsConfig.senderId}
                        onChange={(e) => setSmsConfig({ ...smsConfig, senderId: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">Telegram Chat ID (Alerts)</label>
                      <input
                        type="text"
                        value={smsConfig.chatId}
                        onChange={(e) => setSmsConfig({ ...smsConfig, chatId: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Templates */}
                <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Bildirishnoma Shablonlari
                  </h3>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">🇺🇿 Uzbekcha Shablon</label>
                    <textarea
                      rows={2}
                      value={smsConfig.templateUz}
                      onChange={(e) => setSmsConfig({ ...smsConfig, templateUz: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">🇷🇺 Ruscha Shablon</label>
                    <textarea
                      rows={2}
                      value={smsConfig.templateRu}
                      onChange={(e) => setSmsConfig({ ...smsConfig, templateRu: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-300 transition-all"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  SMS Sozlamalarini Saqlash
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB: AUDIT LOGS ================= */}
        {activeTab === 'audit' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-400" />
                  Audit va Xavfsizlik Harakatlari Jurnali
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tizimda bajarilgan barcha muhim operatsiyalar, to'lovlar, natijalar va tizim loglari
                </p>
              </div>

              <button
                onClick={() => handleCopyText(JSON.stringify(auditLogs, null, 2), 'audit_json')}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <Copy className="w-4 h-4" />
                Loglarni Nusxalash
              </button>
            </div>

            {/* Audit Search */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Xodim nomi, harakat yoki modul bo'yicha qidiruv..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <select
                value={auditSeverityFilter}
                onChange={(e) => setAuditSeverityFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 w-full sm:w-auto"
              >
                <option value="all">Barcha Xavflilik Darajalari</option>
                <option value="info">Info (Oddiy)</option>
                <option value="warning">Warning (Ogohlantirish)</option>
                <option value="critical">Critical (Kritik)</option>
              </select>
            </div>

            {/* Audit Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-3">ID / VAQT</th>
                    <th className="p-3">XODIM / ROLI</th>
                    <th className="p-3">HARAKAT & MODUL</th>
                    <th className="p-3">BATAFSIL TAVSIF</th>
                    <th className="p-3">IP MANZIL</th>
                    <th className="p-3 text-right">DARAJA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredAuditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-all">
                      <td className="p-3">
                        <div className="font-mono text-teal-400 font-bold">{log.id}</div>
                        <div className="text-[10px] text-slate-500">{log.timestamp}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-white">{log.userName}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{log.userRole}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-200">{log.action}</div>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">
                          {log.module}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300 max-w-md">{log.details}</td>
                      <td className="p-3 font-mono text-slate-400">{log.ipAddress}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${
                          log.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                          log.severity === 'warning' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                          'bg-teal-500/20 text-teal-400 border-teal-500/30'
                        }`}>
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB: BACKUP & RESTORE ================= */}
        {activeTab === 'backup' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-400" />
                Ma'lumotlar Bazasini Zaxiralash va Qayta Tiklash
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Barcha bemorlar, tahlil natijalari, reaktivlar va sozlamalarni zaxiralash (Export/Import)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Backup Card */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 border border-teal-500/20">
                    <Download className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">To'liq Zaxira Nusxa Yuklash (Export JSON)</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Tizimdagi barcha foydalanuvchilar, bemorlar bazasi, kassa orderlari, LIS sozlamalari va audit loglarini shifrlangan JSON ko'rinishida kompyuteringizga saqlab oling.
                  </p>
                </div>

                <button
                  onClick={handleExportBackup}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 py-3 rounded-xl font-black text-xs shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-300 transition-all"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  Hozir Zaxiralash (.JSON)
                </button>
              </div>

              {/* Restore Card */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Zaxiradan Qayta Tiklash (Restore JSON)</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Avval saqlab olingan SmartLab JSON zaxira faylini tanlab, tizim ma'lumotlarini 100% holatda qayta tiklang.
                  </p>
                </div>

                <label className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 py-3 rounded-xl font-extrabold text-xs shadow transition-all cursor-pointer">
                  <Upload className="w-4 h-4 text-amber-400" />
                  Fayldan Tiklash (.JSON)
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD / EDIT SYSTEM USER & RUXSATLAR (GALISHKA CHECKBOXES) */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-400" />
                  {editingUser ? `${editingUser.name} - Ruxsatlarni Tahrirlash` : 'Yangi Xodim Qo\'shish va Ruxsat Berish'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Xodim rekvizitlari, biriktirilgan filial va har bir modul galishka ruxsatlari
                </p>
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-5">
              {/* AVATAR UPLOAD & SELECTOR SECTION */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="text-xs font-black text-teal-400 uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  XODIM AVATAR RASMI (KOMPYUTERDAN YUKLASH YOKI SHABLON TANLASH)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Avatar Circle Preview */}
                  <div className="relative group flex-shrink-0">
                    <img
                      src={userFormData.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                      alt="Xodim Avatari"
                      className="w-20 h-20 rounded-full object-cover border-2 border-teal-500/80 shadow-lg shadow-teal-500/10 bg-slate-900"
                    />
                    <label
                      htmlFor="user-avatar-upload-file"
                      className="absolute inset-0 bg-slate-950/80 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-[10px] font-bold text-teal-300"
                      title="Rasmni almashtirish"
                    >
                      <Camera className="w-5 h-5 text-teal-400 mb-0.5" />
                      Yuklash
                    </label>
                    <input
                      id="user-avatar-upload-file"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label
                        htmlFor="user-avatar-upload-file"
                        className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-950" />
                        Kompyuterdan Rasm Fayli Yuklash (.jpg, .png)
                      </label>

                      {userFormData.avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setUserFormData({ ...userFormData, avatarUrl: '' })}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-lg text-xs font-bold border border-rose-500/30 transition-all"
                          title="Rasmni olib tashlash"
                        >
                          O'chirish
                        </button>
                      )}
                    </div>

                    {/* Presets */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">Tayyor Shablon Avatarlar (1-click):</span>
                      <div className="flex flex-wrap gap-2">
                        {PRESET_AVATARS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setUserFormData({ ...userFormData, avatarUrl: preset.url })}
                            className={`w-8 h-8 rounded-full border-2 overflow-hidden transition-all ${
                              userFormData.avatarUrl === preset.url
                                ? 'border-teal-400 ring-2 ring-teal-400/50 scale-110'
                                : 'border-slate-700 hover:border-teal-500 opacity-70 hover:opacity-100'
                            }`}
                            title={preset.label}
                          >
                            <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Xodim F.I.SH *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Dr. Alisher Karimov"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Login (Username) *</label>
                  <input
                    type="text"
                    required
                    placeholder="alisher_k"
                    value={userFormData.username}
                    onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Biriktirilgan Filial *</label>
                  <select
                    value={userFormData.branchId}
                    onChange={(e) => setUserFormData({ ...userFormData, branchId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-teal-300 font-bold focus:border-teal-500 focus:outline-none"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>🏢 {b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Asosiy Roli (Pre-set Shablon)</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold focus:border-teal-500 focus:outline-none"
                  >
                    <option value="admin">⚙️ Administrator (To'liq ruxsat)</option>
                    <option value="laborant">🔬 Laborant (Laboratoriya kabineti)</option>
                    <option value="cashier">💳 Kassir (Kassa & Qabul)</option>
                    <option value="doctor">👩‍⚕️ Shifokor (Qabul & Blank)</option>
                    <option value="receptionist">📝 Registratura (Qabul & Kassa)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Telefon Raqami</label>
                  <input
                    type="text"
                    placeholder="+998 90 123 45 67"
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Email Manzili</label>
                  <input
                    type="email"
                    placeholder="user@smartlab.uz"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Hisob Holati</label>
                  <select
                    value={userFormData.status}
                    onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value as 'active' | 'blocked' })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold focus:border-teal-500 focus:outline-none"
                  >
                    <option value="active">✅ Faol (Active)</option>
                    <option value="blocked">🚫 Bloklangan (Blocked)</option>
                  </select>
                </div>
              </div>

              {/* PERMISSION CHECKBOXES (GALISHKA) SECTION */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div>
                    <h4 className="text-xs font-black text-teal-400 uppercase tracking-wider flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ISHLASH RUXSATLARI (☑️ GALISHKA QILIB BELGILANG)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Ushbu xodim SmartLab LIMS tizimining qaysi modullarida ishlay olishini tanlang:
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleSetAllPermissions(true)}
                      className="px-2.5 py-1 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/40 rounded text-[10px] font-bold transition-all"
                    >
                      ☑️ Barchasiga ruxsat
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetAllPermissions(false)}
                      className="px-2.5 py-1 bg-slate-800 text-slate-400 hover:bg-slate-700 rounded text-[10px] font-bold transition-all"
                    >
                      ☐ Bekor qilish
                    </button>
                  </div>
                </div>

                {/* 9 Permission Checkbox Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {MODULE_PERMISSIONS_LIST.map(mod => {
                    const isChecked = Boolean(userFormData.permissions && userFormData.permissions[mod.key]);
                    return (
                      <label
                        key={mod.key}
                        onClick={() => handleTogglePermission(mod.key)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          isChecked
                            ? 'bg-teal-500/15 border-teal-500/50 text-white shadow-md shadow-teal-500/5'
                            : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-600" />
                          )}
                        </div>

                        <div>
                          <div className={`text-xs font-bold flex items-center gap-1.5 ${isChecked ? 'text-teal-200 font-extrabold' : 'text-slate-300'}`}>
                            {mod.label}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                            {mod.desc}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-300 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  {editingUser ? 'Saqlash' : 'Xodimlarga Ruxsat Berib Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT CLINIC BRANCH & PERMISSIONS */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-teal-400" />
                  {editingBranch ? `${editingBranch.name} - Filial Sozlamalari` : 'Yangi Laboratoriya Filiali Ochish'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Filial kodi, nomi, manzili va ushbu filialda ruxsat berilgan modullar galishka (checkbox) sozlamalari
                </p>
              </div>
              <button
                onClick={() => setIsBranchModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Filial Nomi *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Chilonzor Diagnostika Filiali"
                    value={branchFormData.name}
                    onChange={(e) => setBranchFormData({ ...branchFormData, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Filial Kodi *</label>
                  <input
                    type="text"
                    required
                    placeholder="FIL-02"
                    value={branchFormData.code}
                    onChange={(e) => setBranchFormData({ ...branchFormData, code: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">Manzili (Shahar, Tuman, Ko'cha)</label>
                  <input
                    type="text"
                    placeholder="Toshkent sh., Chilonzor t., Lutfiy ko'chasi 45-uy"
                    value={branchFormData.address}
                    onChange={(e) => setBranchFormData({ ...branchFormData, address: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Mas'ul Rahbar F.I.SH</label>
                  <input
                    type="text"
                    placeholder="Masalan: Dilshod Tursunov"
                    value={branchFormData.managerName}
                    onChange={(e) => setBranchFormData({ ...branchFormData, managerName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Telefon Raqami</label>
                  <input
                    type="text"
                    placeholder="+998 71 277 55 44"
                    value={branchFormData.phone}
                    onChange={(e) => setBranchFormData({ ...branchFormData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Filial Holati</label>
                  <select
                    value={branchFormData.status}
                    onChange={(e) => setBranchFormData({ ...branchFormData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold focus:border-teal-500 focus:outline-none"
                  >
                    <option value="active">✅ Faol Filial (Active)</option>
                    <option value="inactive">🚫 Vaqtincha Nofaol (Inactive)</option>
                  </select>
                </div>
              </div>

              {/* BRANCH MODULE PERMISSIONS (GALISHKA) */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div>
                    <h4 className="text-xs font-black text-teal-400 uppercase tracking-wider flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      USHBU FILIALDA ISHLASH RUXSAT ETILGAN MODULLAR (☑️ GALISHKA)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Filialda qaysi laboratoriya modullari ishga tushirilishini galishka orqali belgilang:
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleSetAllBranchPermissions(true)}
                      className="px-2.5 py-1 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/40 rounded text-[10px] font-bold transition-all"
                    >
                      ☑️ Barchasiga ruxsat
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetAllBranchPermissions(false)}
                      className="px-2.5 py-1 bg-slate-800 text-slate-400 hover:bg-slate-700 rounded text-[10px] font-bold transition-all"
                    >
                      ☐ Bekor qilish
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {MODULE_PERMISSIONS_LIST.map(mod => {
                    const isChecked = Boolean(branchFormData.permissions && branchFormData.permissions[mod.key]);
                    return (
                      <label
                        key={mod.key}
                        onClick={() => handleToggleBranchPermission(mod.key)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          isChecked
                            ? 'bg-teal-500/15 border-teal-500/50 text-white shadow-md shadow-teal-500/5'
                            : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-600" />
                          )}
                        </div>

                        <div>
                          <div className={`text-xs font-bold flex items-center gap-1.5 ${isChecked ? 'text-teal-200 font-extrabold' : 'text-slate-300'}`}>
                            {mod.label}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                            {mod.desc}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-300 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  {editingBranch ? 'Filial Sozlamalarini Saqlash' : 'Yangi Filialni Ochish va Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});
