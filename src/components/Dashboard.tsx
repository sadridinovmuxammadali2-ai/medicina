import React, { useState, useMemo } from 'react';
import type { TestOrder, Reagent, TestCatalogItem, TestResultItem } from '../types/lab';
import { Activity, Clock, CheckCircle2, AlertCircle, TrendingUp, Search, X, Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translateCategoryName, translateTestName } from '../utils/categoryTranslator';

interface DashboardProps {
  orders: TestOrder[];
  reagents: Reagent[];
  testCatalog?: TestCatalogItem[];
  onSelectOrder: (order: TestOrder) => void;
  onUpdateOrder?: (order: TestOrder) => void;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = React.memo(({
  orders,
  reagents,
  testCatalog = [],
  onSelectOrder,
  onUpdateOrder,
  onNavigate
}) => {
  const { currentLanguage, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  // Quick Add Test Modal State
  const [addingTestForOrder, setAddingTestForOrder] = useState<TestOrder | null>(null);
  const [addTestSearch, setAddTestSearch] = useState('');
  const [modalCategoryFilter, setModalCategoryFilter] = useState<string>('all');

  const stats = useMemo(() => ({
    todayRevenue: orders.reduce((sum, o) => sum + o.price, 0),
    pendingCount: orders.filter(o => o.status === 'kutilmoqda' || o.status === 'jarayonda').length,
    completedCount: orders.filter(o => o.status === 'tasdiqlangan').length,
    citoCount: orders.filter(o => o.urgency === 'cito').length,
    lowStockReagents: reagents.filter(r => r.quantity <= r.minQuantity).length
  }), [orders, reagents]);
  const filteredOrders = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return orders.filter(o =>
      o.patientName.toLowerCase().includes(q) ||
      o.orderNumber.includes(searchTerm) ||
      o.testName.toLowerCase().includes(q)
    );
  }, [orders, searchTerm]);

  // Unique categories list for modal filter
  const modalCategoriesList = useMemo(() => {
    return Array.from(new Set(testCatalog.map(c => c.category)));
  }, [testCatalog]);

  // Flat list of all tests in catalog for quick add picker
  const allCatalogTests = useMemo(() => {
    const tests: { id: string; name: string; price: number; unit: string; refMin: number; refMax: number; category: string }[] = [];
    testCatalog.forEach(cat => {
      cat.subGroups.forEach(sg => {
        sg.items.forEach(it => {
          tests.push({
            id: it.id,
            name: it.name,
            price: it.price,
            unit: it.unit || 'birlik',
            refMin: it.refMin || 0,
            refMax: it.refMax || 100,
            category: cat.category
          });
        });
      });
    });
    return tests;
  }, [testCatalog]);

  const matchingCatalogTests = useMemo(() => {
    const q = addTestSearch.toLowerCase();
    return allCatalogTests.filter(t => {
      const matchesCategory = modalCategoryFilter === 'all' || t.category === modalCategoryFilter;
      const matchesQuery = addTestSearch.trim() === '' ||
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [allCatalogTests, modalCategoryFilter, addTestSearch]);

  const handleRemoveTestFromOrder = (order: TestOrder, resultIndex: number) => {
    const removedTest = order.results[resultIndex];
    if (!removedTest) return;

    const catalogItem = allCatalogTests.find(t => t.name === removedTest.parameterName || t.id === removedTest.parameterId);
    
    // Calculate price deduction for the removed test
    const priceToDeduct = catalogItem 
      ? catalogItem.price 
      : (order.results.length > 0 ? Math.round(order.price / order.results.length) : 45000);

    const updatedResults = order.results.filter((_, idx) => idx !== resultIndex);
    const updatedPrice = Math.max(0, order.price - priceToDeduct);

    const updatedOrder: TestOrder = {
      ...order,
      price: updatedPrice,
      testName: updatedResults.map(r => r.parameterName).join(', '),
      results: updatedResults
    };

    if (onUpdateOrder) {
      onUpdateOrder(updatedOrder);
    }
  };

  const handleAddTestItemToOrder = (order: TestOrder, catalogTestItem: typeof allCatalogTests[0]) => {
    // Check if test is already in order
    if (order.results.some(r => r.parameterName === catalogTestItem.name)) {
      alert(`⚠️ "${catalogTestItem.name}" tahlili bemor ro'yxatida allaqachon mavjud!`);
      return;
    }

    const newResultItem: TestResultItem = {
      parameterId: catalogTestItem.id,
      parameterName: catalogTestItem.name,
      value: '',
      unit: catalogTestItem.unit,
      refMin: catalogTestItem.refMin,
      refMax: catalogTestItem.refMax,
      status: 'normal'
    };

    const updatedResults = [...order.results, newResultItem];
    const updatedOrder: TestOrder = {
      ...order,
      price: order.price + catalogTestItem.price,
      testName: updatedResults.map(r => r.parameterName).join(', '),
      results: updatedResults
    };

    if (onUpdateOrder) {
      onUpdateOrder(updatedOrder);
    }
    setAddingTestForOrder(updatedOrder);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today Revenue */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/40 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-5 shadow-xl shadow-emerald-950/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 group">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t('stat_today_revenue')}</p>
              <h3 className="text-2xl font-black text-emerald-400 font-mono tracking-tight group-hover:text-emerald-300 transition-colors">
                {stats.todayRevenue.toLocaleString()} <span className="text-xs font-medium text-emerald-500/80">so'm</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/40 border border-amber-500/20 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl shadow-amber-950/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 group">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t('stat_in_progress')}</p>
              <h3 className="text-2xl font-black text-amber-400 font-mono tracking-tight group-hover:text-amber-300 transition-colors">
                {stats.pendingCount} <span className="text-xs font-medium text-amber-500/80">{t('patients_count')}</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(245,158,11,0.15)] group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-teal-950/40 border border-teal-500/20 hover:border-teal-500/40 rounded-2xl p-5 shadow-xl shadow-teal-950/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 group">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t('stat_completed')}</p>
              <h3 className="text-2xl font-black text-teal-400 font-mono tracking-tight group-hover:text-teal-300 transition-colors">
                {stats.completedCount} <span className="text-xs font-medium text-teal-500/80">{t('ready_count')}</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/25 text-teal-400 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(20,184,166,0.15)] group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* CITO Urgent */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-rose-950/40 border border-rose-500/20 hover:border-rose-500/40 rounded-2xl p-5 shadow-xl shadow-rose-950/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 group">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t('stat_cito')}</p>
              <h3 className="text-2xl font-black text-rose-400 font-mono tracking-tight group-hover:text-rose-300 transition-colors">
                {stats.citoCount} <span className="text-xs font-medium text-rose-500/80">{t('cito_urgent_count')}</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(244,63,94,0.15)] group-hover:scale-110 transition-transform">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Queue Table Container */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 space-y-5 shadow-2xl">
        
        {/* Table Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2 tracking-wide">
                {t('table_patient_queue_title')}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('table_patient_queue_desc')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative group">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-teal-400 absolute left-3.5 top-3 transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search_patient_placeholder')}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-teal-500/70 text-slate-200 placeholder-slate-500 rounded-2xl text-xs pl-10 pr-4 py-2.5 transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-64"
              />
            </div>

            <button
              onClick={() => onNavigate('registration')}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {t('btn_new_patient')}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/90 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-800/80 text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">{t('col_no')}</th>
                <th className="py-3.5 px-4">{t('col_patient_info')}</th>
                <th className="py-3.5 px-4 min-w-[340px]">{t('col_selected_tests')}</th>
                <th className="py-3.5 px-4">{t('col_status')}</th>
                <th className="py-3.5 px-4 font-bold">{t('col_amount')}</th>
                <th className="py-3.5 px-4 text-right">{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500 font-medium">
                    Hozircha bemorlar ro'yxati yo'q. Qabul bo'limida bemor ro'yxatga oling.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors group">
                    {/* Index */}
                    <td className="py-4 px-4 text-center font-mono text-slate-400 font-bold">
                      <span className="w-7 h-7 rounded-lg bg-slate-950/80 border border-slate-800 inline-flex items-center justify-center text-xs text-slate-300">
                        {idx + 1}
                      </span>
                    </td>

                    {/* Patient Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-cyan-400 text-slate-950 flex items-center justify-center font-black text-base uppercase shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                          {order.patientName ? order.patientName.charAt(0) : 'B'}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-sm group-hover:text-teal-300 transition-colors">
                              {order.patientName}
                            </span>
                            <span className="bg-teal-500/10 border border-teal-500/40 text-teal-300 font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-sm">
                              {order.patientId || `PAT-${order.orderNumber}`}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 font-medium">
                            <span>Tel: {order.patientPhone}</span>
                            <span className="text-slate-600">•</span>
                            <span>{order.patientAge} yosh ({order.patientGender})</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* INTERACTIVE TEST CHIPS WITH X DELETE BUTTON & + ADD BUTTON */}
                    <td className="py-4 px-4 min-w-[380px]">
                      <div className="space-y-2">
                        {/* Header for tests inside table cell */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                            {t('selected_tests_count')}
                            <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                              {order.results.length} TA
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setAddingTestForOrder(order)}
                            className="text-[11px] font-black text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 px-3 py-1 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" /> {t('btn_add_test')}
                          </button>
                        </div>

                        {/* Interactive Test Chips Container */}
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto bg-slate-950/90 p-3 rounded-2xl border border-slate-800/90 shadow-inner">
                          {(() => {
                            const hasOAM = order.results.some(r => r.parameterId.startsWith('oam-'));
                            const nonOamResults = order.results.filter(r => !r.parameterId.startsWith('oam-'));

                            return (
                              <>
                                {hasOAM && (
                                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-950/90 via-emerald-950/90 to-slate-900 text-emerald-300 border border-emerald-400/50 px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold shadow-lg">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                                    <span>🧪 Общий анализ мочи (ОАМ - 34 ko'rsatkich)</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const oamCount = order.results.filter(r => r.parameterId.startsWith('oam-')).length;
                                        const oamDeduction = oamCount > 0 ? Math.min(order.price, Math.max(70000, Math.round(order.price * 0.4))) : 70000;
                                        const updatedResults = order.results.filter(r => !r.parameterId.startsWith('oam-'));
                                        const updatedPrice = Math.max(0, order.price - oamDeduction);
                                        if (onUpdateOrder) onUpdateOrder({
                                          ...order,
                                          price: updatedPrice,
                                          testName: updatedResults.map(r => r.parameterName).join(', '),
                                          results: updatedResults
                                        });
                                      }}
                                      className="ml-1 text-emerald-300 hover:text-rose-400 font-black w-4 h-4 rounded-md inline-flex items-center justify-center hover:bg-rose-500/20 transition-colors"
                                      title="Общий анализ мочи (ОАМ) tahlilini olib tashlash"
                                    >
                                      ✕
                                    </button>
                                  </span>
                                )}

                                {nonOamResults.map((res, rIdx) => (
                                  <span
                                    key={rIdx}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 hover:from-teal-950/80 hover:to-slate-900 text-teal-200 border border-teal-500/30 hover:border-teal-400/60 px-3 py-1 rounded-xl text-[11px] font-bold shadow-sm transition-all group/chip"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]"></span>
                                    <span>{translateTestName(res.parameterName, currentLanguage)}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveTestFromOrder(order, order.results.indexOf(res))}
                                      className="ml-1 text-slate-400 hover:text-rose-400 font-black w-4 h-4 rounded-md inline-flex items-center justify-center hover:bg-rose-500/20 transition-colors"
                                      title="Ushbu tahlilni o'chirish"
                                    >
                                      ✕
                                    </button>
                                  </span>
                                ))}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      {order.status === 'tasdiqlangan' && (
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                          <CheckCircle2 className="w-4 h-4" /> {t('status_completed')}
                        </span>
                      )}
                      {order.status === 'jarayonda' && (
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                          <Clock className="w-4 h-4 animate-spin" /> {t('status_in_progress')}
                        </span>
                      )}
                      {order.status === 'kutilmoqda' && (
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-800/90 text-slate-300 border border-slate-700/80">
                          ⏳ {t('status_pending')}
                        </span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 font-black text-emerald-400 font-mono text-base tracking-tight drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                      {order.price.toLocaleString()} <span className="text-xs text-emerald-500/80 font-normal">so'm</span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => {
                            onSelectOrder(order);
                            onNavigate('workstation');
                          }}
                          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-lg shadow-teal-500/25 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          {t('btn_laborant')}
                        </button>
                        <button
                          onClick={() => {
                            onSelectOrder(order);
                            onNavigate('blank');
                          }}
                          className="bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Blankani chop etish"
                        >
                          {t('btn_blank')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP MODAL: QUICK ADD TEST TO PATIENT ORDER */}
      {addingTestForOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  Bemorga Tahlil Qo'shish (Quick Add)
                </h3>
                <p className="text-xs text-teal-300 font-semibold mt-0.5">
                  Bemor: {addingTestForOrder.patientName} ({addingTestForOrder.patientId})
                </p>
              </div>
              <button
                onClick={() => setAddingTestForOrder(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Catalog Test Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={addTestSearch}
                onChange={(e) => setAddTestSearch(e.target.value)}
                placeholder="🔍 Qo'shiladigan tahlil ko'rsatkichini izlash..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/70 transition-all shadow-inner"
              />
            </div>

            {/* Category Filter Pills inside Modal */}
            <div className="space-y-1.5 border-t border-b border-slate-800/80 py-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Tahlil Kategoriyalari bo'yicha saralash:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto text-xs">
                <button
                  type="button"
                  onClick={() => setModalCategoryFilter('all')}
                  className={`px-3 py-1 rounded-xl text-[11px] font-extrabold uppercase transition-all ${
                    modalCategoryFilter === 'all'
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  БАРЧАСИ ({allCatalogTests.length})
                </button>

                {modalCategoriesList.map(cat => {
                  const countForCat = allCatalogTests.filter(t => t.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setModalCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-extrabold uppercase transition-all ${
                        modalCategoryFilter === cat
                          ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {translateCategoryName(cat, currentLanguage)} ({countForCat})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Matching Catalog Tests Selection List */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 text-xs">
              {matchingCatalogTests.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Ushbu kategoriya bo'yicha tahlillar topilmadi.
                </div>
              ) : (
                matchingCatalogTests.map(catTest => {
                  const isAlreadyInOrder = addingTestForOrder.results.some(r => r.parameterName === catTest.name);

                  return (
                    <div
                      key={catTest.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                        isAlreadyInOrder
                          ? 'bg-slate-950/60 border-slate-800/80 opacity-60'
                          : 'bg-slate-950 border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-850/60'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{translateTestName(catTest.name, currentLanguage)}</span>
                          <span className="bg-slate-800/90 text-teal-300 text-[10px] px-2 py-0.5 rounded-md font-mono">
                            {translateCategoryName(catTest.category, currentLanguage)}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          Birligi: {catTest.unit} • Me'yor: {catTest.refMin} - {catTest.refMax}
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <span className="font-bold text-emerald-400 font-mono text-xs">
                          {catTest.price.toLocaleString()} so'm
                        </span>
                        <button
                          type="button"
                          disabled={isAlreadyInOrder}
                          onClick={() => handleAddTestItemToOrder(addingTestForOrder, catTest)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isAlreadyInOrder
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                          }`}
                        >
                          {isAlreadyInOrder ? "✓ Qoshilgan" : "+ Qoshish"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAddingTestForOrder(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                Yopish
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
});

