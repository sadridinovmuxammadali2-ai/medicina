import { useState, useEffect, useMemo, useCallback } from 'react';
import AOS from 'aos';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Registration } from './components/Registration';
import { Cashier } from './components/Cashier';
import { LabWorkstation } from './components/LabWorkstation';
import { DoctorsManager } from './components/DoctorsManager';
import { ResultBlank } from './components/ResultBlank';
import { TestCatalogManager } from './components/TestCatalogManager';
import { Inventory } from './components/Inventory';
import { AdminPanel } from './components/AdminPanel';
import { MobileSimulator } from './components/MobileSimulator';
import { INITIAL_PATIENTS, INITIAL_DOCTORS, INITIAL_ORDERS, INITIAL_REAGENTS, INITIAL_TEST_CATALOG } from './data/mockData';
import { INITIAL_DIAGNOSTIC_MODULES } from './data/mockAdminData';
import type { Patient, Doctor, TestOrder, Reagent, TestCatalogItem } from './types/lab';
import type { DiagnosticModule } from './types/admin';

export function App() {
  // Restore viewMode from localStorage (default: 'desktop')
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'split'>(() => {
    const saved = localStorage.getItem('smartlab_viewMode');
    return (saved as 'desktop' | 'mobile' | 'split') || 'desktop';
  });

  // Restore activeTab from URL hash or localStorage (default: 'registration')
  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['dashboard', 'registration', 'cashier', 'workstation', 'doctors', 'blank', 'catalog', 'inventory', 'admin'].includes(hash)) {
      return hash;
    }
    const savedTab = localStorage.getItem('smartlab_activeTab');
    return savedTab || 'registration';
  });

  // Restore permanent PATIENT DATABASE from localStorage
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('smartlab_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  // Restore permanent DOCTORS DATABASE from localStorage (merged with INITIAL_DOCTORS)
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('smartlab_doctors_v3');
    if (saved) {
      const parsed: Doctor[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(d => d.id));
      const missing = INITIAL_DOCTORS.filter(d => !existingIds.has(d.id));
      return [...parsed, ...missing];
    }
    return INITIAL_DOCTORS;
  });

  // Restore diagnosticModules from localStorage
  const [diagnosticModules, setDiagnosticModules] = useState<DiagnosticModule[]>(() => {
    const saved = localStorage.getItem('smartlab_diagnostic_modules_v2');
    if (saved) {
      const parsed: DiagnosticModule[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(m => m.id));
      const missing = INITIAL_DIAGNOSTIC_MODULES.filter(m => !existingIds.has(m.id));
      return [...parsed, ...missing];
    }
    return INITIAL_DIAGNOSTIC_MODULES;
  });

  // Restore testCatalog from localStorage (v7 merged with INITIAL_TEST_CATALOG including ПРИЕМ)
  const [testCatalog, setTestCatalog] = useState<TestCatalogItem[]>(() => {
    const saved = localStorage.getItem('smartlab_testCatalog_v7');
    if (saved) {
      const parsed: TestCatalogItem[] = JSON.parse(saved);
      const existingCategories = new Set(parsed.map(c => c.category));
      const missingCats = INITIAL_TEST_CATALOG.filter(c => !existingCategories.has(c.category));
      return [...missingCats, ...parsed];
    }
    return INITIAL_TEST_CATALOG;
  });

  // Restore orders from localStorage
  const [orders, setOrders] = useState<TestOrder[]>(() => {
    const saved = localStorage.getItem('smartlab_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Restore reagents from localStorage
  const [reagents, setReagents] = useState<Reagent[]>(() => {
    const saved = localStorage.getItem('smartlab_reagents');
    return saved ? JSON.parse(saved) : INITIAL_REAGENTS;
  });

  // Selected Order
  const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(() => {
    const savedId = localStorage.getItem('smartlab_selectedOrderId');
    if (savedId) {
      const found = orders.find(o => o.id === savedId);
      if (found) return found;
    }
    return orders[0] || null;
  });

  // Sync viewMode to localStorage
  useEffect(() => {
    localStorage.setItem('smartlab_viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    const timer = window.setTimeout(() => AOS.refreshHard(), 120);
    return () => window.clearTimeout(timer);
  }, [activeTab, viewMode]);

  // Sync activeTab to localStorage & URL Hash
  useEffect(() => {
    localStorage.setItem('smartlab_activeTab', activeTab);
    window.location.hash = activeTab;
  }, [activeTab]);

  // Sync patients to permanent localStorage database
  useEffect(() => {
    localStorage.setItem('smartlab_patients', JSON.stringify(patients));
  }, [patients]);

  // Sync doctors to permanent localStorage database
  useEffect(() => {
    localStorage.setItem('smartlab_doctors_v3', JSON.stringify(doctors));
  }, [doctors]);

  // Sync testCatalog to localStorage
  useEffect(() => {
    localStorage.setItem('smartlab_testCatalog_v7', JSON.stringify(testCatalog));
  }, [testCatalog]);

  // Sync orders to localStorage
  useEffect(() => {
    localStorage.setItem('smartlab_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync reagents to localStorage
  useEffect(() => {
    localStorage.setItem('smartlab_reagents', JSON.stringify(reagents));
  }, [reagents]);

  // Sync selectedOrder to localStorage
  useEffect(() => {
    if (selectedOrder) {
      localStorage.setItem('smartlab_selectedOrderId', selectedOrder.id);
    }
  }, [selectedOrder]);

  const handleSavePatient = useCallback((newPatient: Patient): Patient => {
    let finalPatientObj: Patient = newPatient;
    setPatients(prevPatients => {
      const existing = prevPatients.find(p => p.passportOrId && p.passportOrId === newPatient.passportOrId);
      if (existing) {
        finalPatientObj = existing;
        return prevPatients;
      }
      const nextNum = prevPatients.length + 1;
      const paddedNum = nextNum.toString().padStart(4, '0');
      finalPatientObj = {
        ...newPatient,
        id: `PAT-${paddedNum}`,
        patientNumber: nextNum
      };
      return [finalPatientObj, ...prevPatients];
    });
    return finalPatientObj;
  }, []);

  const handleAddDoctor = useCallback((newDoc: Doctor) => {
    setDoctors(prev => [newDoc, ...prev]);

    // Also automatically create a consultation item under ПРИЕМ in testCatalog!
    setTestCatalog(prevCatalog => {
      const groupTitleName = newDoc.specialty.toUpperCase();
      const newItem = {
        id: `doc-item-${newDoc.id}`,
        name: `${newDoc.fullName} — ${newDoc.specialty} Qabuli`,
        price: newDoc.consultationFee || 110000,
        unit: 'Qabul',
        refMin: 0,
        refMax: 0
      };

      const priemCat = prevCatalog.find(c => c.category === 'ПРИЕМ (ШИФОКОРЛАР QABULI)');
      if (!priemCat) {
        return [
          {
            id: 'cat-priem',
            category: 'ПРИЕМ (ШИФОКОРЛАР QABULI)',
            subGroups: [
              {
                id: `sg-priem-${Date.now()}`,
                groupTitle: groupTitleName,
                items: [newItem]
              }
            ]
          },
          ...prevCatalog
        ];
      }

      return prevCatalog.map(cat => {
        if (cat.category !== 'ПРИЕМ (ШИФОКОРЛАР QABULI)') return cat;

        const existingSg = cat.subGroups.find(sg => sg.groupTitle === groupTitleName);
        let updatedSubGroups;

        if (existingSg) {
          updatedSubGroups = cat.subGroups.map(sg => {
            if (sg.groupTitle !== groupTitleName) return sg;
            return { ...sg, items: [...sg.items, newItem] };
          });
        } else {
          updatedSubGroups = [
            ...cat.subGroups,
            { id: `sg-priem-${Date.now()}`, groupTitle: groupTitleName, items: [newItem] }
          ];
        }

        return { ...cat, subGroups: updatedSubGroups };
      });
    });
  }, []);

  const handleUpdateDoctors = useCallback((updated: Doctor[]) => {
    setDoctors(updated);
  }, []);

  const handleDeleteDoctor = useCallback((id: string) => {
    if (confirm('Ushbu shifokorni o\'chirishga ishonchingiz komilmi?')) {
      setDoctors(prev => prev.filter(d => d.id !== id));
    }
  }, []);

  const handleAddOrder = useCallback((newOrder: TestOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
    setActiveTab('cashier'); // Automatic transition to Cashier upon registration!
  }, []);

  const handleClearOrders = useCallback(() => {
    if (confirm('Bugungi qabul va tahlillar navbatini tozalashga ishonchingiz komilmi? (Eslatib o\'tamiz: Bemorlar va Shifokorlar bazasi o\'chmaydi)')) {
      setOrders([]);
      setSelectedOrder(null);
      localStorage.removeItem('smartlab_orders');
      localStorage.removeItem('smartlab_selectedOrderId');
      alert('✅ Bugungi navbat tozalandi!');
    }
  }, []);

  const handleUpdateOrder = useCallback((updatedOrder: TestOrder) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    setSelectedOrder(updatedOrder);
  }, []);

  const handleAddReagent = useCallback((newReagent: Reagent) => {
    setReagents(prev => [newReagent, ...prev]);
  }, []);

  const handleAddTestCatalog = useCallback((newTestCatalogItem: TestCatalogItem) => {
    setTestCatalog(prev => [...prev, newTestCatalogItem]);
  }, []);

  const handleUpdateTestCatalog = useCallback((updatedCatalog: TestCatalogItem[]) => {
    setTestCatalog(updatedCatalog);

    // Build a map of updated reference norms by test ID and lowercased name
    const normMap = new Map<string, { name: string; unit: string; refMin: number; refMax: number; refString: string }>();

    updatedCatalog.forEach(cat => {
      cat.subGroups.forEach(sg => {
        sg.items.forEach(item => {
          const rMin = item.refMin ?? 0;
          const rMax = item.refMax ?? 0;
          const normStr = rMin > 0 || rMax > 0
            ? `${rMin} - ${rMax}`
            : 'в норме';
          const normData = {
            name: item.name,
            unit: item.unit || '',
            refMin: rMin,
            refMax: rMax,
            refString: normStr
          };
          normMap.set(item.id, normData);
          normMap.set(item.name.trim().toLowerCase(), normData);
        });
      });
    });

    // Automatically update reference norms across all orders in Laborant Workstation!
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => {
        let hasChanges = false;
        const updatedResults = order.results.map(res => {
          const match = normMap.get(res.parameterId) || normMap.get(res.parameterName.trim().toLowerCase());
          if (match) {
            hasChanges = true;
            return {
              ...res,
              parameterName: match.name,
              unit: match.unit,
              refMin: match.refMin,
              refMax: match.refMax,
              refString: match.refString
            };
          }
          return res;
        });

        return hasChanges ? { ...order, results: updatedResults } : order;
      });

      return updatedOrders;
    });
  }, []);

  const handleDeleteTestCatalog = useCallback((id: string) => {
    if (confirm('Ushbu tahlil turini spravochnikdan o\'chirishga ishonchingiz komilmi?')) {
      setTestCatalog(prev => prev.filter(item => item.id !== id));
    }
  }, []);

  const stats = useMemo(() => ({
    todayOrders: orders.length,
    pendingCount: orders.filter(o => o.status === 'kutilmoqda' || o.status === 'jarayonda').length,
    completedCount: orders.filter(o => o.status === 'tasdiqlangan').length,
    citoCount: orders.filter(o => o.urgency === 'cito').length
  }), [orders]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-slate-950 app-shell">
      {/* Global Header & Nav */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onClearOrders={handleClearOrders}
      />

      {/* Main Content Area */}
      <main data-aos="fade-up" data-aos-duration="750" className="max-w-7xl mx-auto px-4 py-6 page-content">
        {/* View Mode 1: Desktop Only */}
        {viewMode === 'desktop' && (
          <div>
            {activeTab === 'dashboard' && (
              <Dashboard
                orders={orders}
                reagents={reagents}
                testCatalog={testCatalog}
                onSelectOrder={(ord) => setSelectedOrder(ord)}
                onUpdateOrder={handleUpdateOrder}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 'registration' && (
              <Registration
                testCatalog={testCatalog}
                patients={patients}
                doctors={doctors}
                diagnosticModules={diagnosticModules}
                onAddOrder={handleAddOrder}
                onSavePatient={handleSavePatient}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 'cashier' && (
              <Cashier
                orders={orders}
                selectedOrder={selectedOrder}
                testCatalog={testCatalog}
                onUpdateOrder={handleUpdateOrder}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 'workstation' && (
              <LabWorkstation
                orders={orders}
                selectedOrder={selectedOrder}
                onUpdateOrder={handleUpdateOrder}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 'doctors' && (
              <DoctorsManager
                doctors={doctors}
                onAddDoctor={handleAddDoctor}
                onUpdateDoctors={handleUpdateDoctors}
                onDeleteDoctor={handleDeleteDoctor}
              />
            )}
            {activeTab === 'blank' && (
              <ResultBlank
                order={selectedOrder}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 'catalog' && (
              <TestCatalogManager
                testCatalog={testCatalog}
                onAddTestCatalog={handleAddTestCatalog}
                onUpdateTestCatalog={handleUpdateTestCatalog}
                onDeleteTestCatalog={handleDeleteTestCatalog}
              />
            )}
            {activeTab === 'inventory' && (
              <Inventory
                reagents={reagents}
                onAddReagent={handleAddReagent}
              />
            )}
            {activeTab === 'admin' && (
              <AdminPanel
                diagnosticModules={diagnosticModules}
                onUpdateDiagnosticModules={setDiagnosticModules}
              />
            )}
          </div>
        )}

        {/* View Mode 2: Mobile App Simulator Only */}
        {viewMode === 'mobile' && (
          <MobileSimulator
            orders={orders}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
            onNavigate={(tab) => {
              setViewMode('desktop');
              setActiveTab(tab);
            }}
          />
        )}

        {/* View Mode 3: Split Screen (PC Workspace + Mobile App Simulator side-by-side) */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex gap-2 text-xs font-semibold overflow-x-auto">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1 rounded-lg ${activeTab === 'dashboard' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('registration')}
                  className={`px-3 py-1 rounded-lg ${activeTab === 'registration' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  📝 Qabul
                </button>
                <button
                  onClick={() => setActiveTab('cashier')}
                  className={`px-3 py-1 rounded-lg ${activeTab === 'cashier' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  💳 Kassa
                </button>
                <button
                  onClick={() => setActiveTab('workstation')}
                  className={`px-3 py-1 rounded-lg ${activeTab === 'workstation' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  🔬 Laborant
                </button>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`px-3 py-1 rounded-lg ${activeTab === 'doctors' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  👩‍⚕️ Shifokorlar
                </button>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`px-3 py-1 rounded-lg ${activeTab === 'catalog' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  🧪 Tahlillar
                </button>
                <button
                  onClick={() => setActiveTab('blank')}
                  className={`px-3 py-1 rounded-lg ${activeTab === 'blank' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  📄 Blank
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1 rounded-lg ${activeTab === 'admin' ? 'bg-purple-500 text-white font-bold' : 'text-purple-400'}`}
                >
                  ⚙️ Admin
                </button>
              </div>

              {activeTab === 'dashboard' && (
                <Dashboard
                  orders={orders}
                  reagents={reagents}
                  testCatalog={testCatalog}
                  onSelectOrder={(ord) => setSelectedOrder(ord)}
                  onUpdateOrder={handleUpdateOrder}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}
              {activeTab === 'registration' && (
                <Registration
                  testCatalog={testCatalog}
                  patients={patients}
                  doctors={doctors}
                  diagnosticModules={diagnosticModules}
                  onAddOrder={handleAddOrder}
                  onSavePatient={handleSavePatient}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}
              {activeTab === 'cashier' && (
                <Cashier
                  orders={orders}
                  selectedOrder={selectedOrder}
                  onUpdateOrder={handleUpdateOrder}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}
              {activeTab === 'workstation' && (
                <LabWorkstation
                  orders={orders}
                  selectedOrder={selectedOrder}
                  onUpdateOrder={handleUpdateOrder}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}
              {activeTab === 'doctors' && (
                <DoctorsManager
                  doctors={doctors}
                  onAddDoctor={handleAddDoctor}
                  onUpdateDoctors={handleUpdateDoctors}
                  onDeleteDoctor={handleDeleteDoctor}
                />
              )}
              {activeTab === 'blank' && (
                <ResultBlank
                  order={selectedOrder}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}
              {activeTab === 'catalog' && (
                <TestCatalogManager
                  testCatalog={testCatalog}
                  onAddTestCatalog={handleAddTestCatalog}
                  onUpdateTestCatalog={handleUpdateTestCatalog}
                  onDeleteTestCatalog={handleDeleteTestCatalog}
                />
              )}
              {activeTab === 'inventory' && (
                <Inventory
                  reagents={reagents}
                  onAddReagent={handleAddReagent}
                />
              )}
              {activeTab === 'admin' && (
                <AdminPanel
                  diagnosticModules={diagnosticModules}
                  onUpdateDiagnosticModules={setDiagnosticModules}
                />
              )}
            </div>

            <div className="sticky top-20">
              <MobileSimulator
                orders={orders}
                onSelectOrder={(ord) => setSelectedOrder(ord)}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
