import React, { useState, useMemo } from 'react';
import type { TestOrder, Gender, Urgency, TestCatalogItem, IndividualTestItem, Patient, Doctor, TestResultItem } from '../types/lab';
import type { DiagnosticModule } from '../types/admin';
import { INITIAL_DIAGNOSTIC_MODULES } from '../data/mockAdminData';
import { OAM_FULL_PANEL_RESULTS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { translateCategoryName, translateSubGroupTitle, translateTestName } from '../utils/categoryTranslator';
import { UserPlus, CheckCircle, Search, Check, UserCheck, CreditCard, MapPin, ChevronDown } from 'lucide-react';

const getCategoryIcon = (catName: string): string => {
  const n = catName.toLowerCase();
  if (n.includes('узд') || n.includes('узи')) return '🩺';
  if (n.includes('рентген') || n.includes('rentgen')) return '🩻';
  if (n.includes('мрт') || n.includes('mrt')) return '🧠';
  if (n.includes('фгдс') || n.includes('fgds')) return '🔬';
  if (n.includes('мскт') || n.includes('mskt') || n.includes('кт')) return '🖥️';
  if (n.includes('моч') || n.includes('оам')) return '🧪';
  if (n.includes('кров') || n.includes('оак')) return '🩸';
  if (n.includes('ифа') || n.includes('инфекци') || n.includes('торч') || n.includes('паразит')) return '🔬';
  if (n.includes('биохими')) return '🧪';
  if (n.includes('гормон')) return '🧬';
  if (n.includes('экспресс')) return '⚡';
  if (n.includes('микроскоп')) return '🔬';
  if (n.includes('пцр')) return '🧬';
  if (n.includes('аутоиммун')) return '🛡️';
  return '📋';
};

interface RegistrationProps {
  testCatalog: TestCatalogItem[];
  patients: Patient[];
  doctors: Doctor[];
  diagnosticModules?: DiagnosticModule[];
  onAddOrder: (newOrder: TestOrder) => void;
  onSavePatient: (patient: Patient) => Patient;
  onNavigate: (tab: string) => void;
}

export const Registration: React.FC<RegistrationProps> = React.memo(({
  testCatalog,
  patients,
  doctors,
  diagnosticModules,
  onAddOrder,
  onSavePatient,
  onNavigate
}) => {
  const { currentLanguage, t } = useLanguage();
  // Search patient database autocomplete state
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedExistingPatient, setSelectedExistingPatient] = useState<Patient | null>(null);

  // Active module tab state (priem, laboratoriya, uzd, gruppa, rentgen, mrt, fgds, mskt, or custom)
  const [activeModuleTab, setActiveModuleTab] = useState<string>('laboratoriya');
  const [showLabSection, setShowLabSection] = useState(true);
  const [showCategoryContent, setShowCategoryContent] = useState(true);

  // Priem / Doctor appointment search & specialty filter state
  const [priemSearch, setPriemSearch] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('all');

  // Separate Name Input Fields
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');

  // Other Patient Details
  const [passportId, setPassportId] = useState('');
  const [birthDate, setBirthDate] = useState('1995-01-01');
  const [gender, setGender] = useState<Gender>('erkak');
  const [phone, setPhone] = useState('+998 ');
  const [address, setAddress] = useState('');
  const [referredDoctor, setReferredDoctor] = useState('');
  
  // Non-laboratory category names (Diagnostic Modules & Priem)
  const nonLabCategoryNames = useMemo(() => {
    const set = new Set<string>();
    set.add('ПРИЕМ (ШИФОКОРЛАР QABULI)');
    set.add('ПРИЕМ');

    const modulesList = diagnosticModules || INITIAL_DIAGNOSTIC_MODULES;
    modulesList.forEach(m => {
      if (m.id !== 'laboratoriya' && m.categoryName) {
        set.add(m.categoryName.toUpperCase());
      }
    });

    ['УЗД', 'РЕНТГЕН', 'МРТ', 'ФГДС', 'МСКТ', 'УЗИ', 'КТ'].forEach(c => set.add(c));
    return set;
  }, [diagnosticModules]);

  const isLabCategory = useMemo(() => {
    return (catName: string): boolean => {
      const upper = catName.trim().toUpperCase();
      if (nonLabCategoryNames.has(upper)) return false;
      for (const nonLab of nonLabCategoryNames) {
        if (upper.startsWith(nonLab)) return false;
      }
      return true;
    };
  }, [nonLabCategoryNames]);

  // Selected category tab (laboratory categories only)
  const labCategoriesList = useMemo(() => {
    return testCatalog
      .map(item => item.category)
      .filter(cat => isLabCategory(cat));
  }, [testCatalog, isLabCategory]);

  const totalLabItemsCount = useMemo(() => {
    return testCatalog
      .filter(c => isLabCategory(c.category))
      .reduce((acc, cat) => acc + cat.subGroups.reduce((a, sg) => a + sg.items.length, 0), 0);
  }, [testCatalog, isLabCategory]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtered doctors list for Priem / Diagnostic Appointments
  const priemDoctorsList = useMemo(() => {
    const q = priemSearch.toLowerCase();
    return doctors.filter(doc => {
      if (selectedSpecialtyFilter !== 'all' && !doc.specialty.toLowerCase().includes(selectedSpecialtyFilter.toLowerCase())) {
        return false;
      }
      if (q.trim() !== '') {
        const matches = doc.fullName.toLowerCase().includes(q) ||
          doc.specialty.toLowerCase().includes(q) ||
          doc.id.toLowerCase().includes(q) ||
          (doc.roomNumber && doc.roomNumber.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [doctors, priemSearch, selectedSpecialtyFilter]);

  // Currently selected individual test IDs (default empty)
  const [selectedTestItemIds, setSelectedTestItemIds] = useState<string[]>([]);

  const [urgency, setUrgency] = useState<Urgency>('oddiy');
  const [submittedOrder, setSubmittedOrder] = useState<TestOrder | null>(null);

  // Flat list of all available tests across all categories
  const allTestsMap = useMemo(() => {
    const map = new Map<string, IndividualTestItem>();
    testCatalog.forEach(cat => {
      cat.subGroups.forEach(sg => {
        sg.items.forEach(it => {
          map.set(it.id, it);
        });
      });
    });
    return map;
  }, [testCatalog]);

  // Selected test objects
  const selectedTestObjects = useMemo(() => {
    return selectedTestItemIds
      .map(id => allTestsMap.get(id))
      .filter((item): item is IndividualTestItem => item !== undefined);
  }, [selectedTestItemIds, allTestsMap]);

  // Search filtered patients from central database
  const matchingPatients = useMemo(() => {
    if (patientSearch.trim() === '') return [];
    const q = patientSearch.toLowerCase();
    return patients.filter(p =>
      p.fullName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.passportOrId.toLowerCase().includes(q) ||
      p.phone.includes(patientSearch)
    );
  }, [patientSearch, patients]);

  const handleSelectPatientFromDatabase = (p: Patient) => {
    setSelectedExistingPatient(p);
    
    // Split full name into parts if possible
    const nameParts = p.fullName.trim().split(' ');
    setLastName(nameParts[0] || '');
    setFirstName(nameParts[1] || '');
    setMiddleName(nameParts.slice(2).join(' ') || '');
    
    setPassportId(p.passportOrId);
    setBirthDate(p.birthDate);
    setGender(p.gender);
    setPhone(p.phone);
    setAddress(p.address || '');
    setPatientSearch('');
  };

  const handleClearPatientSelection = () => {
    setSelectedExistingPatient(null);
    setLastName('');
    setFirstName('');
    setMiddleName('');
    setPassportId('');
    setPhone('+998 ');
    setAddress('');
  };

  // Helper to count selected tests per category
  const getCategorySelectedCount = (catName: string) => {
    const catObj = testCatalog.find(c => c.category === catName);
    if (!catObj) return 0;
    let count = 0;
    catObj.subGroups.forEach(sg => {
      sg.items.forEach(it => {
        if (selectedTestItemIds.includes(it.id)) count++;
      });
    });
    return count;
  };

  // Toggle individual test
  const toggleTestItem = (id: string) => {
    if (selectedTestItemIds.includes(id)) {
      setSelectedTestItemIds(selectedTestItemIds.filter(iId => iId !== id));
    } else {
      setSelectedTestItemIds([...selectedTestItemIds, id]);
    }
  };

  // Toggle entire subgroup box
  const toggleSubGroup = (subGroupItemIds: string[]) => {
    const allSelected = subGroupItemIds.every(id => selectedTestItemIds.includes(id));
    if (allSelected) {
      setSelectedTestItemIds(selectedTestItemIds.filter(id => !subGroupItemIds.includes(id)));
    } else {
      const newSet = new Set([...selectedTestItemIds, ...subGroupItemIds]);
      setSelectedTestItemIds(Array.from(newSet));
    }
  };

  const basePrice = selectedTestObjects.reduce((sum, t) => sum + t.price, 0);
  const totalPrice = urgency === 'cito' ? Math.round(basePrice * 1.3) : basePrice;

  const calculateAge = (bDate: string) => {
    const birthYear = new Date(bDate).getFullYear();
    return 2026 - birthYear;
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTestObjects.length === 0) {
      alert('Iltimos, kamida bitta tahlil turini tanlang!');
      return;
    }

    const compiledFullName = `${lastName.trim()} ${firstName.trim()} ${middleName.trim()}`.trim();

    // Save or resolve patient in central database
    let activePatient: Patient;
    if (selectedExistingPatient) {
      activePatient = selectedExistingPatient;
    } else {
      const nextNum = patients.length + 1;
      const paddedNum = nextNum.toString().padStart(4, '0');
      const newPatientObj: Patient = {
        id: `PAT-${paddedNum}`,
        patientNumber: nextNum,
        passportOrId: passportId,
        fullName: compiledFullName,
        birthDate,
        gender,
        phone,
        address,
        registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        referredByDoctor: referredDoctor,
        totalVisits: 1
      };
      activePatient = onSavePatient(newPatientObj);
    }

    const orderNum = Math.floor(100 + Math.random() * 900).toString();
    const orderId = `ORD-2026-${orderNum}`;
    const barcodeStr = `890${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newOrder: TestOrder = {
      id: orderId,
      orderNumber: orderNum,
      patientId: activePatient.id,
      patientName: activePatient.fullName,
      patientPhone: activePatient.phone,
      patientAge: calculateAge(activePatient.birthDate),
      patientGender: activePatient.gender,
      testCategory: selectedCategory,
      testName: selectedTestObjects.map(t => t.name).join(', '),
      price: totalPrice,
      status: 'kutilmoqda',
      urgency,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      barcode: barcodeStr,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://smartlab.uz/verify/${orderId}`,
      results: selectedTestObjects.flatMap((t): TestResultItem[] => {
        if (t.id === 'u-1' || t.name.includes('Общий анализ мочи') || t.name.includes('ОАМ')) {
          return OAM_FULL_PANEL_RESULTS.map(oam => ({
            parameterId: oam.parameterId,
            parameterName: oam.parameterName,
            value: oam.value,
            unit: oam.unit,
            refMin: oam.refMin,
            refMax: oam.refMax,
            refString: oam.refString,
            subGroup: oam.subGroup,
            status: 'normal' as const
          }));
        }
        return [{
          parameterId: t.id,
          parameterName: t.name,
          value: '',
          unit: t.unit || 'birlik',
          refMin: t.refMin || 0,
          refMax: t.refMax || 100,
          refString: undefined,
          subGroup: undefined,
          status: 'normal' as const
        }];
      })
    };

    onAddOrder(newOrder);
    setSubmittedOrder(newOrder);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-400" />
            {t('patient_reg_title')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('patient_reg_desc')}
          </p>
        </div>
      </div>

      {submittedOrder ? (
        /* Ticket & Barcode Preview after submission */
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-6 animate-fadeIn">
          <div className="flex items-center gap-3 text-emerald-400 font-bold text-lg">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            {t('ticket_success')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-5 rounded-xl border border-slate-800">
            {/* Ticket Info */}
            <div className="space-y-3 text-xs text-slate-300">
              <div className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex justify-between">
                <span>{t('receipt_no')} {submittedOrder.orderNumber}</span>
                <span className="text-teal-400 font-mono font-bold">{t('patient_id')} {submittedOrder.patientId}</span>
              </div>
              <div><strong className="text-slate-400">{t('patient_fullname')}</strong> {submittedOrder.patientName} ({submittedOrder.patientAge} yosh, {submittedOrder.patientGender})</div>
              <div><strong className="text-slate-400">{t('phone')}:</strong> {submittedOrder.patientPhone}</div>
              <div><strong className="text-slate-400">{t('category')}</strong> <span className="text-teal-400 font-semibold">{submittedOrder.testCategory}</span></div>
              <div className="flex items-center justify-between">
                <strong className="text-slate-400 block mb-1">{t('tests_list')} ({submittedOrder.results.length} {t('items_count')}):</strong>
                <span className="text-[11px] text-teal-400">{t('delete_test_tip')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto bg-slate-900 p-3 rounded-xl border border-slate-800">
                {submittedOrder.results.map((res, rIdx) => (
                  <span key={rIdx} className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-300 border border-teal-500/30 px-2.5 py-1 rounded-lg font-bold text-xs group hover:border-rose-500/50 transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>{res.parameterName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedResults = submittedOrder.results.filter((_, idx) => idx !== rIdx);
                        const updatedOrder = {
                          ...submittedOrder,
                          testName: updatedResults.map(r => r.parameterName).join(', '),
                          results: updatedResults
                        };
                        setSubmittedOrder(updatedOrder);
                        onAddOrder(updatedOrder);
                      }}
                      className="ml-1 text-slate-400 hover:text-rose-400 font-black p-0.5 rounded hover:bg-rose-500/20"
                      title="Ushbu tahlilni o'chirish"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div><strong className="text-slate-400">{t('referring_doctor')}:</strong> {referredDoctor || '—'}</div>
              <div><strong className="text-slate-400">{t('total_payment')}</strong> <span className="text-emerald-400 font-bold text-sm">{submittedOrder.price.toLocaleString()} so'm</span></div>
            </div>

            {/* Barcode & QR Code */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl text-slate-900 space-y-2 text-center">
              <img src={submittedOrder.qrCodeUrl} alt="QR Code" className="w-24 h-24" />
              <div className="font-mono font-bold text-xs">{t('barcode_label')} {submittedOrder.barcode}</div>
              <p className="text-[10px] text-slate-500">{t('barcode_tip')}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setSubmittedOrder(null);
                setSelectedExistingPatient(null);
                setLastName('');
                setFirstName('');
                setMiddleName('');
                setAddress('');
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-xl text-xs"
            >
              {t('btn_new_reception')}
            </button>
            <button
              onClick={() => onNavigate('cashier')}
              className="bg-lime-600 hover:bg-lime-500 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {t('btn_go_to_cashier')}
            </button>
          </div>
        </div>
      ) : (
        /* Main Registration Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Central Database Search & Patient Info */}
          <div id="patient-info-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-teal-400" />
                1. {t('patient_reg_title')}
              </h3>

              {/* Patient Count Badge */}
              <span className="text-xs text-teal-300 font-mono bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                {t('patients_in_db')} <strong>{patients.length} {t('patients_count')}</strong>
              </span>
            </div>

            {/* Patient Search Autocomplete Box */}
            <div className="relative">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder={t('search_patient_db')}
                  className="w-full bg-slate-950 border border-teal-500/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                />
              </div>

              {/* Autocomplete Dropdown List */}
              {matchingPatients.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-teal-500/50 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto text-xs divide-y divide-slate-800">
                  {matchingPatients.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPatientFromDatabase(p)}
                      className="p-3 hover:bg-teal-500/20 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
                            {p.id}
                          </span>
                          {p.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Pasport: {p.passportOrId} • Tel: {p.phone} • Tug'ilgan: {p.birthDate}
                        </div>
                      </div>
                      <span className="text-teal-400 font-bold text-[11px] bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        Tanlash →
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Selected Patient Banner */}
            {selectedExistingPatient && (
              <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-teal-200">
                <div className="flex items-center gap-2 font-bold">
                  <UserCheck className="w-5 h-5 text-teal-400" />
                  <span>{t('selected_from_db')} <strong className="text-white">{selectedExistingPatient.fullName}</strong> ({selectedExistingPatient.id})</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearPatientSelection}
                  className="text-xs text-rose-400 underline font-semibold"
                >
                  {t('new_patient_reg')}
                </button>
              </div>
            )}

            {/* Separate Name & Details Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Familiyasi */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('last_name')} <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder={t('last_name')}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-teal-500 placeholder:text-slate-600"
                />
              </div>

              {/* Ismi */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('first_name')} <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder={t('first_name')}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-teal-500 placeholder:text-slate-600"
                />
              </div>

              {/* Otasining ismi */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('middle_name')}</label>
                <input
                  type="text"
                  placeholder={t('middle_name')}
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-teal-500 placeholder:text-slate-600"
                />
              </div>

              {/* Pasport / ID seriya № */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('passport_id')}</label>
                <input
                  type="text"
                  placeholder={t('passport_id')}
                  value={passportId}
                  onChange={(e) => setPassportId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-teal-500 placeholder:text-slate-600"
                />
              </div>

              {/* Tug'ilgan sanasi */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('birth_date')} <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Jinsi */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('gender')} <span className="text-rose-500">*</span></label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-teal-500"
                >
                  <option value="erkak">{t('gender_male')}</option>
                  <option value="ayol">{t('gender_female')}</option>
                </select>
              </div>

              {/* Telefon raqami */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('phone')} <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder={t('phone')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-teal-500 placeholder:text-slate-600"
                />
              </div>

              {/* Manzili */}
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  {t('address')}
                </label>
                <input
                  type="text"
                  placeholder={t('address')}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-teal-500 placeholder:text-slate-600"
                />
              </div>

              {/* Yo'naltirgan Shifokor */}
              <div className="md:col-span-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-300">{t('referring_doctor')}</label>
                  {/* Realtime Doctor ID Verification Badge */}
                  {(() => {
                    const matchedDoc = doctors.find(d => 
                      d.id.toLowerCase() === referredDoctor.trim().toLowerCase() ||
                      d.doctorNumber.toString() === referredDoctor.trim() ||
                      `doc-${referredDoctor.trim()}`.toLowerCase() === d.id.toLowerCase()
                    );
                    if (matchedDoc) {
                      return (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                          {t('doctor_verified')} {matchedDoc.fullName} ({matchedDoc.specialty})
                        </span>
                      );
                    }
                    if (referredDoctor.trim() !== '') {
                      return (
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          {t('new_doctor_id')} ({referredDoctor})
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>

                <input
                  type="text"
                  placeholder="Shifokor ID raqami (masalan: DOC-001 yoki 001)"
                  value={referredDoctor}
                  onChange={(e) => setReferredDoctor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-teal-500 placeholder:text-slate-600 placeholder:font-sans"
                />
              </div>

            </div>
          </div>

          {/* Section 2: Screenshot-matching Green Category Buttons & Subgroup Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            
            {/* Dynamic Header Buttons Bar: Priem, Laboratoriya, UZD, Gruppa, Rentgen, MRT, FGDS, MSKT etc */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              {(diagnosticModules || INITIAL_DIAGNOSTIC_MODULES).filter(m => m.enabled).map(mod => {
                const isActive = activeModuleTab === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => {
                      setActiveModuleTab(mod.id);
                      if (mod.id === 'priem') {
                        const el = document.getElementById('patient-info-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      } else if (mod.id === 'laboratoriya') {
                        setShowLabSection(true);
                        if (!isLabCategory(selectedCategory)) {
                          setSelectedCategory('all');
                        }
                      } else if (mod.categoryName) {
                        setSelectedCategory(mod.categoryName);
                        setShowCategoryContent(true);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-cyan-600/30 ring-2 ring-cyan-400 font-extrabold scale-105'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span>
                      {mod.icon} {
                        mod.id === 'priem' ? t('module_priem').replace(/^[\s\S]*?\s/, '') :
                        mod.id === 'laboratoriya' ? t('module_laboratoriya').replace(/^[\s\S]*?\s/, '') :
                        mod.id === 'uzd' ? t('module_uzd').replace(/^[\s\S]*?\s/, '') :
                        mod.id === 'gruppa' ? t('module_gruppa').replace(/^[\s\S]*?\s/, '') :
                        mod.id === 'rentgen' ? t('module_rentgen').replace(/^[\s\S]*?\s/, '') :
                        mod.id === 'mrt' ? t('module_mrt').replace(/^[\s\S]*?\s/, '') :
                        mod.id === 'fgds' ? t('module_fgds').replace(/^[\s\S]*?\s/, '') :
                        mod.id === 'mskt' ? t('module_mskt').replace(/^[\s\S]*?\s/, '') :
                        translateCategoryName(mod.name, currentLanguage)
                      }
                    </span>
                    {mod.id === 'laboratoriya' && selectedTestObjects.length > 0 && (
                      <span className="bg-white/20 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-full ml-1 font-bold">
                        {selectedTestObjects.length}
                      </span>
                    )}
                    {mod.id === 'laboratoriya' && (
                      <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${showLabSection ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Display Priem / Doctors Consultation Section if active */}
            {activeModuleTab === 'priem' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-xl border border-teal-500/30">
                  <div>
                    <h3 className="text-sm font-extrabold text-teal-300 flex items-center gap-2">
                      <span>{t('doctor_consultation_title')}</span>
                      <span className="bg-teal-500/20 text-teal-300 text-[10px] px-2 py-0.5 rounded-full border border-teal-500/30 font-mono">
                        {doctors.filter(d => d.isActive !== false).length} {t('active_doctors_count')}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {t('doctor_consultation_desc')}
                    </p>
                  </div>

                  {/* Search Input for Doctor in Priem */}
                  <div className="relative w-full md:w-72">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={priemSearch}
                      onChange={(e) => setPriemSearch(e.target.value)}
                      placeholder={t('search_doctor_placeholder')}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Specialty Filter Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 font-mono">{t('specialty_filter')}</span>
                  {['all', 'Kardiolog', 'Nevropatolog', 'Endokrinolog', 'Ginekolog', 'Urolog', 'Terapevt', 'Gastroenterolog', 'Oftalmolog', 'LOR', 'Xirurg', 'Pediatr', 'UZI'].map(spec => {
                    const isSel = selectedSpecialtyFilter === spec;
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => setSelectedSpecialtyFilter(spec)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          isSel
                            ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                            : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                        }`}
                      >
                        {spec === 'all' ? t('all_specialists') : spec}
                      </button>
                    );
                  })}
                </div>

                {/* Doctor Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {priemDoctorsList.map(doc => {
                    const isDocActive = doc.isActive !== false;
                    const isSelectedForPatient = referredDoctor.trim().toLowerCase() === doc.id.toLowerCase();

                    return (
                      <div
                        key={doc.id}
                        className={`p-4 rounded-xl border transition-all space-y-3 relative overflow-hidden ${
                          isSelectedForPatient
                            ? 'bg-teal-950/40 border-teal-400 ring-2 ring-teal-400/50 shadow-lg shadow-teal-500/10'
                            : isDocActive
                            ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            : 'bg-slate-950/40 border-slate-900 opacity-60'
                        }`}
                      >
                        {/* Top Bar */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black ${
                              isSelectedForPatient ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-teal-400'
                            }`}>
                              🩺
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-white leading-snug">
                                {doc.fullName}
                              </h4>
                              <span className="text-[10px] font-mono font-extrabold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 inline-block mt-0.5">
                                {doc.id} — {doc.specialty}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border font-mono ${
                            isDocActive
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}>
                            {isDocActive ? t('reception_open') : t('reception_inactive')}
                          </span>
                        </div>

                        {/* Info Items */}
                        <div className="space-y-1 text-[11px] text-slate-300 border-t border-slate-900 pt-2 font-sans">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">{t('room_no')}</span>
                            <span className="font-bold text-amber-300 font-mono">{doc.roomNumber || '101-xona'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">{t('consultation_fee')}</span>
                            <span className="font-extrabold text-emerald-400 font-mono">{(doc.consultationFee || 110000).toLocaleString()} so'm</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">{t('workplace')}</span>
                            <span className="text-slate-200 font-semibold">{doc.workplace || 'Klinika'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">{t('contact')}</span>
                            <span className="text-slate-300 font-mono">{doc.phone}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        {isDocActive ? (
                          <button
                            type="button"
                            onClick={() => {
                              setReferredDoctor(doc.id);
                              alert(`✅ ${doc.fullName} (${doc.specialty}) qabuliga biriktirildi! ID: ${doc.id}`);
                            }}
                            className={`w-full py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSelectedForPatient
                                ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400/40'
                                : 'bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-200 border border-slate-700'
                            }`}
                          >
                            {isSelectedForPatient ? (
                              <>
                                <Check className="w-4 h-4 text-slate-950" />
                                <span>{t('appointment_selected')} ({doc.id})</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4" />
                                <span>{t('book_appointment')}</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="w-full py-2 rounded-xl text-[11px] font-bold text-slate-500 bg-slate-900 border border-slate-800 text-center">
                            {t('reception_inactive')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Display Non-Lab Diagnostic Module Section (UZD, Rentgen, MRT, FGDS, MSKT, etc.) */}
            {activeModuleTab !== 'laboratoriya' && activeModuleTab !== 'priem' && (() => {
              const activeDiagModule = (diagnosticModules || INITIAL_DIAGNOSTIC_MODULES).find(m => m.id === activeModuleTab);
              if (!activeDiagModule) return null;

              const targetCatName = (activeDiagModule.categoryName || activeDiagModule.name || '').toLowerCase();
              const diagCatObj = testCatalog.find(c => {
                const catLower = c.category.toLowerCase();
                return catLower === targetCatName ||
                  (activeDiagModule.categoryName && catLower.includes(activeDiagModule.categoryName.toLowerCase())) ||
                  catLower.includes(activeDiagModule.id.toLowerCase());
              });

              const deptDoctors = doctors.filter(d => {
                if (d.isActive === false) return false;
                if (d.categoryModule === activeDiagModule.id) return true;
                const s = d.specialty.toLowerCase();
                const m = activeDiagModule.name.toLowerCase();
                return s.includes(m) || s.includes(activeDiagModule.id) || (activeDiagModule.categoryName && s.includes(activeDiagModule.categoryName.toLowerCase()));
              });

              return (
                <div className="space-y-5 pt-2 border-t border-slate-800">
                  {/* Top Diagnostic Header Banner */}
                  <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-cyan-300 flex items-center gap-2">
                        <span>{activeDiagModule.icon} {activeDiagModule.name} {t('diag_services')}</span>
                        <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-2.5 py-0.5 rounded-full border border-cyan-500/30 font-mono">
                          {diagCatObj ? diagCatObj.subGroups.reduce((a, sg) => a + sg.items.length, 0) : 0} {t('test_services_count')}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {activeDiagModule.description || 'Diagnostik tekshiruv apparaturasi va apparat ko\'rigi xizmatlari'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800/50">
                      <span>{t('category_code')}</span>
                      <strong className="text-white">{activeDiagModule.categoryName || activeDiagModule.code || activeDiagModule.id.toUpperCase()}</strong>
                    </div>
                  </div>

                  {/* Diagnostic Procedures / Scans Checkbox Grid */}
                  {diagCatObj ? (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <h4 className="text-xs font-extrabold text-white flex items-center gap-2 uppercase tracking-wide">
                          <span>{getCategoryIcon(diagCatObj.category)}</span>
                          <span>{translateCategoryName(diagCatObj.category, currentLanguage)} {t('services_and_prices')}</span>
                        </h4>
                        <span className="text-[11px] text-teal-400 font-mono font-bold">
                          {t('selected_count')} {diagCatObj.subGroups.reduce((acc, sg) => acc + sg.items.filter(it => selectedTestItemIds.includes(it.id)).length, 0)} ta
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {diagCatObj.subGroups.map(subGroup => {
                          const subGroupItemIds = subGroup.items.map(it => it.id);
                          const isGroupAllSelected = subGroupItemIds.every(id => selectedTestItemIds.includes(id));
                          const isGroupSomeSelected = subGroupItemIds.some(id => selectedTestItemIds.includes(id));

                          return (
                            <div key={subGroup.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                              <label className="flex items-center gap-2 font-extrabold text-slate-200 uppercase text-xs border-b border-slate-800 pb-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isGroupAllSelected}
                                  ref={(el) => {
                                    if (el) el.indeterminate = isGroupSomeSelected && !isGroupAllSelected;
                                  }}
                                  onChange={() => toggleSubGroup(subGroupItemIds)}
                                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700 cursor-pointer"
                                />
                                <span>{translateSubGroupTitle(subGroup.groupTitle, currentLanguage)}</span>
                              </label>

                              <div className="space-y-2">
                                {subGroup.items.map(item => {
                                  const isChecked = selectedTestItemIds.includes(item.id);
                                  return (
                                    <label
                                      key={item.id}
                                      className={`flex items-center justify-between text-xs cursor-pointer p-2 rounded-lg transition-colors border ${
                                        isChecked
                                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-bold'
                                          : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate pr-2">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => toggleTestItem(item.id)}
                                          className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700 cursor-pointer flex-shrink-0"
                                        />
                                        <span className="truncate">{translateTestName(item.name, currentLanguage)}</span>
                                      </div>
                                      <span className="font-mono font-bold text-emerald-400 text-xs flex-shrink-0">
                                        {item.price.toLocaleString()} so'm
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
                      Ushbu bo'lim uchun tekshiruv xizmatlari topilmadi.
                    </div>
                  )}

                  {/* Department Specialist Doctors Grid */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <span>🩺</span>
                      <span>{activeDiagModule.name} Mutaxassis Shifokorlari</span>
                    </h4>

                    {deptDoctors.length === 0 ? (
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-400">
                        Ushbu bo'limga hozircha alohida mutaxassis shifokor biriktirilmagan. (Shifokorlar Bo'limidan kiritishingiz mumkin)
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {deptDoctors.map(doc => {
                          const isSelectedForPatient = referredDoctor.trim().toLowerCase() === doc.id.toLowerCase();
                          return (
                            <div
                              key={doc.id}
                              className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                                isSelectedForPatient
                                  ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg'
                                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-extrabold text-xs text-white">{doc.fullName}</div>
                                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                                  {doc.id}
                                </span>
                              </div>

                              <div className="text-[11px] text-slate-400 space-y-1 font-sans">
                                <div>Mutaxassisligi: <strong className="text-slate-200">{doc.specialty}</strong></div>
                                <div>Xona №: <strong className="text-amber-300 font-mono">{doc.roomNumber || '101-xona'}</strong></div>
                                <div>Qabul narxi: <strong className="text-emerald-400 font-mono">{(doc.consultationFee || 110000).toLocaleString()} so'm</strong></div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setReferredDoctor(doc.id);
                                  alert(`✅ ${doc.fullName} (${doc.specialty}) qabuliga biriktirildi! ID: ${doc.id}`);
                                }}
                                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  isSelectedForPatient
                                    ? 'bg-emerald-500 text-slate-950 font-black'
                                    : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 border border-slate-700'
                                }`}
                              >
                                {isSelectedForPatient ? '✓ Qabulga Tanlangan' : '+ Shifokorga Biriktirish'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Display Lab section if active/open */}
            {activeModuleTab === 'laboratoriya' && showLabSection && (
              <div className="space-y-4 pt-2">
                {/* Top Category Bar (Matching Laborant Kabineti Style 100%) */}
                {/* Top Category Bar (Matching Laborant Kabineti Style 100%) */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 font-mono">{t('departments_label')}</span>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setShowCategoryContent(true);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedCategory === 'all'
                        ? 'bg-teal-500 text-slate-950 font-black shadow-md ring-2 ring-teal-400/40 scale-105'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>🌐 {t('all_departments')}</span>
                    <span className="bg-slate-950/40 px-1.5 py-0.5 rounded font-mono text-[10px]">
                      ({totalLabItemsCount})
                    </span>
                  </button>

                  {labCategoriesList.map(cat => {
                    const isSelected = selectedCategory === cat;
                    const selectedCount = getCategorySelectedCount(cat);
                    const catObj = testCatalog.find(c => c.category === cat);
                    const totalCatItems = catObj ? catObj.subGroups.reduce((a, sg) => a + sg.items.length, 0) : 0;
                    const catIcon = getCategoryIcon(cat);

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setShowCategoryContent(prev => !prev);
                          } else {
                            setSelectedCategory(cat);
                            setShowCategoryContent(true);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-md ring-2 ring-emerald-400/40 scale-105'
                            : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                        }`}
                      >
                        <span>{catIcon} {translateCategoryName(cat, currentLanguage)}</span>
                        <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${selectedCount > 0 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>
                          ({selectedCount > 0 ? `${selectedCount} / ${totalCatItems}` : totalCatItems})
                        </span>
                        {isSelected && (
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCategoryContent ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                    );
                  })}
                </div>

            {showCategoryContent && (
              <>
                {(() => {
                  const displayedCategories = selectedCategory === 'all'
                    ? testCatalog.filter(c => isLabCategory(c.category))
                    : testCatalog.filter(c => c.category === selectedCategory);

                  return (
                    <div className="space-y-6">
                      {displayedCategories.map((catObj) => (
                        <div key={catObj.category} className="space-y-3">
                          {/* Category Header Title */}
                          <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
                            <span className="text-base">{getCategoryIcon(catObj.category)}</span>
                            <h3 className="text-sm font-extrabold text-teal-400 uppercase tracking-wider">
                              {translateCategoryName(catObj.category, currentLanguage)}
                            </h3>
                            <span className="text-[11px] text-slate-500 font-mono">
                              ({catObj.subGroups.reduce((a, sg) => a + sg.items.length, 0)} {t('items_count')})
                            </span>
                          </div>

                          {/* Sub-group Cards Masonry Layout */}
                          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
                            {catObj.subGroups.map((subGroup) => {
                              const subGroupItemIds = subGroup.items.map(it => it.id);
                              const isGroupAllSelected = subGroupItemIds.every(id => selectedTestItemIds.includes(id));
                              const isGroupSomeSelected = subGroupItemIds.some(id => selectedTestItemIds.includes(id));

                              return (
                                <div
                                  key={subGroup.id}
                                  className="break-inside-avoid mb-4 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-3 shadow-md hover:border-slate-700 transition-all h-fit"
                                >
                                  <div>
                                    {/* SubGroup Header with Checkbox */}
                                    <label className="flex items-center gap-2 font-black text-slate-100 uppercase tracking-wide border-b border-slate-800 pb-2 cursor-pointer text-[11px]">
                                      <input
                                        type="checkbox"
                                        checked={isGroupAllSelected}
                                        ref={(el) => {
                                          if (el) el.indeterminate = isGroupSomeSelected && !isGroupAllSelected;
                                        }}
                                        onChange={() => toggleSubGroup(subGroupItemIds)}
                                        className="w-4 h-4 rounded text-lime-500 focus:ring-lime-500 bg-slate-900 border-slate-700 cursor-pointer"
                                      />
                                      <span>{translateSubGroupTitle(subGroup.groupTitle, currentLanguage)}</span>
                                    </label>

                                    {/* Items list inside this box */}
                                    <div className="space-y-2 mt-3">
                                      {subGroup.items.map((item) => {
                                        const isChecked = selectedTestItemIds.includes(item.id);

                                        return (
                                          <label
                                            key={item.id}
                                            className={`flex items-center justify-between text-xs cursor-pointer p-1 rounded transition-colors ${
                                              isChecked ? 'bg-lime-500/10 text-lime-300 font-bold' : 'text-slate-300 hover:text-white'
                                            }`}
                                          >
                                            <div className="flex items-center gap-2 truncate pr-2">
                                              <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => toggleTestItem(item.id)}
                                                className="w-3.5 h-3.5 rounded text-lime-500 focus:ring-lime-500 bg-slate-900 border-slate-700 cursor-pointer flex-shrink-0"
                                              />
                                              <span className="truncate">{translateTestName(item.name, currentLanguage)}</span>
                                            </div>

                                            <div className="flex items-center gap-1 font-mono text-slate-400 flex-shrink-0 text-[11px]">
                                              <span className="text-slate-600">-------</span>
                                              <span className={item.price === 0 ? 'text-slate-500 font-normal' : 'text-emerald-400 font-bold'}>
                                                {item.price}
                                              </span>
                                            </div>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </>
            )}

            {/* Bottom Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={selectedTestObjects.length === 0}
                  className="bg-lime-600 hover:bg-lime-500 disabled:opacity-50 text-white font-extrabold px-6 py-2.5 rounded-lg text-xs shadow-lg shadow-lime-600/30 uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  {t('add_patient_order')} ({selectedTestObjects.length})
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-lg text-xs border border-slate-700"
                >
                  {t('clear_list')}
                </button>
              </div>

              {/* Total Calculation Display */}
              <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Shoshilinchlik:</span>
                  <div className="flex gap-1.5 mt-0.5">
                    <button
                      type="button"
                      onClick={() => setUrgency('oddiy')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${urgency === 'oddiy' ? 'bg-teal-500 text-slate-950' : 'text-slate-400'}`}
                    >
                      {t('urgency_normal')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency('cito')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${urgency === 'cito' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
                    >
                      {t('urgency_cito')}
                    </button>
                  </div>
                </div>

                <div className="text-right border-l border-slate-800 pl-4">
                  <span className="text-slate-400 text-[10px] block">{t('total_payment')}</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {totalPrice.toLocaleString()} so'm
                  </span>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        </form>
      )}
    </div>
  );
});
