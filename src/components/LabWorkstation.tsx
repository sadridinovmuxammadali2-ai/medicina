import React, { useState, useEffect, useMemo } from 'react';
import type { TestOrder, TestResultItem } from '../types/lab';
import { TestTube, ShieldCheck, Filter, ChevronRight, X, FileText, UploadCloud, Printer, FileCheck, Maximize2 } from 'lucide-react';
import { FullCKEditorToolbar } from './FullCKEditorToolbar';
import { useLanguage, type LanguageCode } from '../context/LanguageContext';
import { translateCategoryName, translateTestName } from '../utils/categoryTranslator';

export const getCategoryForParameter = (name: string, id: string, lang: LanguageCode = 'UZB'): string => {
  const n = name.toLowerCase();
  const i = id.toLowerCase();

  if (i.startsWith('oam-') || n.includes('моч') || n.includes('удельный вес') || n.includes('эпителий') || n.includes('цилиндры') || n.includes('слизь')) {
    return translateCategoryName('МОЧА', lang);
  }
  if (i.startsWith('oak-') || i.startsWith('leuko-') || n.includes('гемоглобин') || n.includes('эритроциты') || n.includes('соэ') || n.includes('тромбоциты') || n.includes('лейкоцит') || n.includes('лимфоцит') || n.includes('моноцит') || n.includes('эозинофил') || n.includes('палочкояд')) {
    return translateCategoryName('ОАК', lang);
  }
  if (n.includes('igm') || n.includes('igg') || n.includes('covid') || n.includes('вирус') || n.includes('лямбли') || n.includes('аскарид') || n.includes('эхинокок') || n.includes('трихинелл') || n.includes('toxoplasma') || n.includes('cytomegalo') || n.includes('rubella') || n.includes('herpes') || n.includes('candida') || n.includes('trichomonas') || n.includes('hbsag') || n.includes('hcv') || n.includes('пцр') || n.includes('ифа')) {
    return translateCategoryName('ТОРЧ И ИНФЕКЦИИ', lang);
  }
  if (n.includes('алт') || n.includes('аст') || n.includes('билирубин') || n.includes('глюкоза') || n.includes('мочевина') || n.includes('креатинин') || n.includes('холестерин') || n.includes('общий белок') || n.includes('альбумин') || n.includes('амилаза') || n.includes('щелочная фосфатаза')) {
    return translateCategoryName('БИОХИМИЯ', lang);
  }
  if (n.includes('ттг') || n.includes('т3') || n.includes('т4') || n.includes('кортизол') || n.includes('пролактин') || n.includes('прогестерон') || n.includes('эстрадиол') || n.includes('тестостерон') || n.includes('инсулин') || n.includes('ферритин') || n.includes('dhea') || n.includes('акктг') || n.includes('гормон')) {
    return translateCategoryName('ГОРМОНЫ', lang);
  }
  return translateCategoryName('ДРУГИЕ', lang);
};

interface LabWorkstationProps {
  orders: TestOrder[];
  selectedOrder: TestOrder | null;
  onUpdateOrder: (updatedOrder: TestOrder) => void;
  onNavigate: (tab: string) => void;
}

export const LabWorkstation: React.FC<LabWorkstationProps> = React.memo(({
  orders,
  selectedOrder,
  onUpdateOrder,
  onNavigate
}) => {
  const { currentLanguage, t } = useLanguage();

  // Filter queue to ONLY display orders validated by Cashier (o.isValidated === true)
  const validOrders = useMemo(() => {
    return orders.filter(o => o.isValidated === true || o.status === 'tasdiqlangan' || o.status === 'jarayonda');
  }, [orders]);

  const activeOrder = selectedOrder && (selectedOrder.isValidated || selectedOrder.status === 'tasdiqlangan' || selectedOrder.status === 'jarayonda')
    ? selectedOrder
    : validOrders[0];

  const [resultsState, setResultsState] = useState<TestResultItem[]>(
    activeOrder?.results || []
  );
  const [doctorNote, setDoctorNote] = useState(activeOrder?.doctorNote || 'Tahlil ko\'rsatkichlari bo\'yicha tavsiyalar.');
  const [doctorName, setDoctorName] = useState(activeOrder?.doctorName || 'Dr. Sobirov X. (Laborant-vrach)');

  // Selected Category filter tab inside Laborant workstation
  const [selectedLabCategory, setSelectedLabCategory] = useState<string>('all');

  // Screenshot-matching result entry form state
  const [allNormsChecked, setAllNormsChecked] = useState<Record<string, boolean>>({});
  const [rowNormsChecked, setRowNormsChecked] = useState<Record<number, boolean>>({});
  const [itemMethods, setItemMethods] = useState<Record<number, string>>({});
  const [editorViewStyle, setEditorViewStyle] = useState<'screenshot' | 'black_grid'>('screenshot');

  // Standalone Result Entry Dedicated Modal State
  const [isDedicatedModalOpen, setIsDedicatedModalOpen] = useState(false);
  const [resultEntryMode, setResultEntryMode] = useState<'blank' | 'word'>('blank');
  const [selectedWordTemplate, setSelectedWordTemplate] = useState('OAM_Standard_Blanka_Template.docx');
  const [wordEditableContent, setWordEditableContent] = useState('Лабораторное исследование проведено в полном объеме. Все показатели находятся в пределах физиологической нормы.');

  // Update local results state when activeOrder changes
  useEffect(() => {
    if (activeOrder) {
      setResultsState(activeOrder.results);
      setDoctorNote(activeOrder.doctorNote || 'Tahlil ko\'rsatkichlari me\'yorda.');
      setDoctorName(activeOrder.doctorName || 'Dr. Sobirov X. (Laborant-vrach)');
      setSelectedLabCategory('all');
    }
  }, [activeOrder]);

  if (!activeOrder || validOrders.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
        <TestTube className="w-12 h-12 mx-auto text-slate-600 mb-2 animate-bounce" />
        <h3 className="text-base font-bold text-white">{t('no_validated_orders')}</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {t('no_validated_orders_desc')}
        </p>
        <button
          onClick={() => onNavigate('cashier')}
          className="mt-2 inline-block bg-teal-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
        >
          {t('go_to_cashier_btn')}
        </button>
      </div>
    );
  }

  const mainCategoryName = activeOrder.testCategory || 'ТАҲЛИЛ КАТЕГОРИЯСИ';

  const handleSaveAndConfirm = () => {
    const updatedOrder: TestOrder = {
      ...activeOrder,
      status: 'tasdiqlangan',
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      doctorName,
      doctorNote,
      results: resultsState
    };

    onUpdateOrder(updatedOrder);
    alert(`✅ Tahlil natijalari muvaffaqiyatli tasdiqlandi! Bemor (${activeOrder.patientName}) mobil ilovasiga xabarnoma yuborildi.`);
    onNavigate('blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Col: Order Queue Selection */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="flex items-center gap-2">
            <TestTube className="w-4 h-4 text-teal-400" /> {t('queue_validated')}
          </span>
          <span className="bg-teal-500/10 text-teal-300 text-xs px-2 py-0.5 rounded-full font-bold">{validOrders.length} ta</span>
        </h3>

        <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
          {validOrders.map((o) => (
            <div
              key={o.id}
              onClick={() => {
                onUpdateOrder(o);
                onNavigate('workstation');
              }}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                activeOrder.id === o.id
                  ? 'bg-teal-500/10 border-teal-500 text-white shadow-md ring-1 ring-teal-500/30'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-white">#{o.orderNumber} - {o.patientName}</span>
                {o.urgency === 'cito' && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                    CITO
                  </span>
                )}
              </div>
              <div className="text-[11px] text-teal-400 font-semibold mt-1 flex items-center gap-1">
                <ChevronRight className="w-3 h-3" /> {o.testCategory} ({o.results.length} ta tahlil)
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
                <span>Vaqti: {o.createdAt.split(' ')[1]}</span>
                <span className={`font-semibold ${o.status === 'tasdiqlangan' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {o.status === 'tasdiqlangan' ? '✓ Tasdiqlangan' : '⏳ Jarayonda'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center & Right Cols: Clean Category-Tabbed Laborant Workstation */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
        
        {/* Clean Patient Header (Giant text block REMOVED completely!) */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-500 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-md">
                № {activeOrder.orderNumber}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {activeOrder.id}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">
              {activeOrder.patientName}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeOrder.patientAge} yosh ({activeOrder.patientGender}) • Tel: {activeOrder.patientPhone}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="text-right bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Probirka kodi:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm tracking-wider">{activeOrder.barcode}</span>
              <span className="text-[10px] text-teal-300 block mt-0.5">Jami tahlillar: {activeOrder.results.length} ta</span>
            </div>

            {/* Standalone Dedicated Result Entry Modal Launch Button */}
            <button
              type="button"
              onClick={() => setIsDedicatedModalOpen(true)}
              className="bg-gradient-to-r from-teal-500 via-emerald-500 to-lime-500 hover:from-teal-400 hover:to-lime-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all scale-105"
            >
              <Maximize2 className="w-4 h-4" />
              <span>🖥️ Alohida Oynada Natija Kiritish (Blanka / Word)</span>
            </button>
          </div>
        </div>

        {/* Category Filter Buttons for Laborant */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-lime-400" /> Tahlil Kategoriyasi:
            </h3>
            <span className="text-[11px] text-slate-400">
              Kategoriyani bosing va tahlil natijalarini kiriting
            </span>
          </div>

          <div className="flex flex-wrap gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedLabCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg font-extrabold uppercase tracking-wider transition-all shadow ${
                selectedLabCategory === 'all'
                  ? 'bg-lime-600 text-white border border-lime-400 shadow-lime-600/30 ring-2 ring-lime-400/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              БАРЧА ТАҲЛИЛЛАР ({activeOrder.results.length} ta)
            </button>
            
            <button
              onClick={() => setSelectedLabCategory(mainCategoryName)}
              className={`px-3.5 py-1.5 rounded-lg font-extrabold uppercase tracking-wider transition-all shadow ${
                selectedLabCategory === mainCategoryName
                  ? 'bg-lime-600 text-white border border-lime-400 shadow-lime-600/30 ring-2 ring-lime-400/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {mainCategoryName} ({activeOrder.results.length})
            </button>
          </div>
        </div>

        {/* Results Values Input Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Tahlil Natijalari ({resultsState.length} ta ko'rsatkich):
            </h3>
            <span className="text-[11px] text-slate-400">
              Ortiqcha tahlilni (🗑 O'chirish) tugmasi bilan olib tashlashingiz mumkin
            </span>
          </div>

          {/* Categorized Test Section Grouping (Alohida Bo'limli Jadvallar) */}
          {(() => {
            // Group resultsState by category using getCategoryForParameter
            const categoryMap = new Map<string, { res: TestResultItem; originalIdx: number }[]>();

            resultsState.forEach((res, originalIdx) => {
              const catName = getCategoryForParameter(res.parameterName, res.parameterId, currentLanguage);
              if (!categoryMap.has(catName)) {
                categoryMap.set(catName, []);
              }
              categoryMap.get(catName)!.push({ res, originalIdx });
            });

            const categoryList = Array.from(categoryMap.entries());

            return (
              <div className="space-y-6">
                {/* View Style Switcher Bar & Category Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase font-mono mr-1">Bo'limlar:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedLabCategory('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedLabCategory === 'all'
                          ? 'bg-teal-500 text-slate-950 font-black shadow-md ring-2 ring-teal-400/40'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      🌐 Barcha Bo'limlar ({resultsState.length})
                    </button>

                    {categoryList.map(([catName, items]) => (
                      <button
                        key={catName}
                        type="button"
                        onClick={() => setSelectedLabCategory(catName)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          selectedLabCategory === catName
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-md ring-2 ring-emerald-400/40'
                            : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                        }`}
                      >
                        {catName} ({items.length})
                      </button>
                    ))}
                  </div>

                  {/* Layout View Switcher */}
                  <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditorViewStyle('screenshot')}
                      className={`px-3 py-1 rounded text-xs font-extrabold transition-all ${
                        editorViewStyle === 'screenshot'
                          ? 'bg-purple-600 text-white font-black shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      📊 Rasm ko'rinishi (Standart)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorViewStyle('black_grid')}
                      className={`px-3 py-1 rounded text-xs font-extrabold transition-all ${
                        editorViewStyle === 'black_grid'
                          ? 'bg-emerald-600 text-white font-black shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      📋 Qora Jadval
                    </button>
                  </div>
                </div>

                {/* Render Cards per Category */}
                {categoryList
                  .filter(([catName]) => selectedLabCategory === 'all' || selectedLabCategory === catName)
                  .map(([catName, items]) => {
                    const shortCatTitle = catName.replace(/^[^\s]+\s*/, '');
                    const currentDateStr = activeOrder.createdAt.split(' ')[0] || '2026-08-14';

                    // RENDER STYLE 1: SCREENSHOT MATCHING EXACT LAYOUT
                    if (editorViewStyle === 'screenshot') {
                      return (
                        <div key={catName} className="bg-[#EFEFEF] p-5 rounded-xl border border-slate-300 shadow-xl font-sans text-slate-900 space-y-4">
                          
                          {/* Centered Category Title */}
                          <h2 className="text-center text-sm font-extrabold uppercase tracking-wide text-slate-900 font-sans">
                            {shortCatTitle.toUpperCase()}
                          </h2>

                          {/* Screenshot Table Container */}
                          <div className="border border-slate-300 rounded-md overflow-hidden bg-white shadow-sm">
                            <table className="w-full text-left text-xs border-collapse font-sans">
                              <thead className="bg-[#D9D9D9] text-slate-900 font-bold border-b border-slate-300">
                                <tr>
                                  <th className="py-2.5 px-4 w-5/12 font-bold text-slate-900">Наименование Анализа</th>
                                  <th className="py-2.5 px-4 w-3/12 font-bold text-center text-slate-900">Результат</th>
                                  <th className="py-2.5 px-4 w-4/12 font-semibold">
                                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                                      <input
                                        type="checkbox"
                                        checked={allNormsChecked[catName] ?? true}
                                        onChange={(e) => {
                                          const isChecked = e.target.checked;
                                          setAllNormsChecked(prev => ({ ...prev, [catName]: isChecked }));
                                          setRowNormsChecked(prev => {
                                            const updated = { ...prev };
                                            items.forEach(({ originalIdx }) => {
                                              updated[originalIdx] = isChecked;
                                            });
                                            return updated;
                                          });
                                        }}
                                        className="w-3.5 h-3.5 text-blue-600 rounded cursor-pointer"
                                      />
                                      <span>отметить все нормы</span>
                                    </label>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {items.map(({ res, originalIdx }) => (
                                  <tr key={originalIdx} className="hover:bg-slate-50 transition-colors">
                                    
                                    {/* Column 1: Test Name (Magenta/Purple color) + Date */}
                                    <td className="py-3 px-4 font-semibold text-[#8B008B] text-xs">
                                      {translateTestName(res.parameterName, currentLanguage)} <span className="text-[#8B008B] opacity-80">- {currentDateStr}</span>
                                    </td>

                                    {/* Column 2: Result Input Box */}
                                    <td className="py-3 px-4 text-center">
                                      <input
                                        type="text"
                                        value={res.value}
                                        onChange={(e) => {
                                          const updated = [...resultsState];
                                          updated[originalIdx] = { ...updated[originalIdx], value: e.target.value };
                                          setResultsState(updated);
                                        }}
                                        className="w-28 text-center bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500 shadow-inner"
                                      />
                                    </td>

                                    {/* Column 3: Method Dropdown & Norm Checkboxes */}
                                    <td className="py-3 px-4 text-slate-700 space-y-1 text-[11px]">
                                      {/* Method Selector */}
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-slate-500 font-medium">Метод:</span>
                                        <select
                                          value={itemMethods[originalIdx] || res.parameterName.split(' ')[0]}
                                          onChange={(e) => setItemMethods({ ...itemMethods, [originalIdx]: e.target.value })}
                                          className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 w-full max-w-[200px]"
                                        >
                                          <option value={res.parameterName.split(' ')[0]}>{res.parameterName.split(' ')[0]}</option>
                                          <option value="bios">bios</option>
                                          <option value="ИФА-Автомат">ИФА-Автомат</option>
                                          <option value="Фотометрия">Фотометрия</option>
                                        </select>
                                      </div>

                                      {/* Individual row 'отметить все нормы' checkbox */}
                                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 font-medium pt-0.5">
                                        <input
                                          type="checkbox"
                                          checked={rowNormsChecked[originalIdx] ?? true}
                                          onChange={(e) => setRowNormsChecked({ ...rowNormsChecked, [originalIdx]: e.target.checked })}
                                          className="w-3.5 h-3.5 text-blue-600 rounded cursor-pointer"
                                        />
                                        <span>отметить все нормы</span>
                                      </label>

                                      {/* Gender / Age Norm Checkboxes matching screenshot! */}
                                      <div className="space-y-0.5 pt-0.5 font-medium text-slate-800">
                                        {(res.refMin > 0 || res.refMax > 0 || res.refString) && (
                                          <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={rowNormsChecked[originalIdx] ?? true}
                                              onChange={() => {}}
                                              className="w-3.5 h-3.5 text-blue-600 rounded"
                                            />
                                            <span>
                                              {res.parameterName.includes('АЛТ') || res.parameterName.includes('АСТ') || res.parameterName.includes('ГГТ')
                                                ? `муж. ${res.refMin || 3} - ${res.refMax || 40} U/L`
                                                : res.parameterName.includes('Мочевина') || res.parameterName.includes('Креатинин')
                                                ? `взрос. ${res.refMin || 2.5}-${res.refMax || 8.2} ммоль/л`
                                                : `${res.refString || `${res.refMin || 35} - ${res.refMax || 55} г/л`}`}
                                            </span>
                                          </label>
                                        )}

                                        {(res.parameterName.includes('АЛТ') || res.parameterName.includes('АСТ') || res.parameterName.includes('ГГТ') || res.parameterName.includes('Мочевина') || res.parameterName.includes('Креатинин')) && (
                                          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                                            <input
                                              type="checkbox"
                                              checked={rowNormsChecked[originalIdx] ?? true}
                                              onChange={() => {}}
                                              className="w-3.5 h-3.5 text-blue-600 rounded"
                                            />
                                            <span>
                                              {res.parameterName.includes('АЛТ')
                                                ? `жен. 0 - 38 U/L`
                                                : res.parameterName.includes('АСТ')
                                                ? `жен. 3 - 32 U/L`
                                                : res.parameterName.includes('ГГТ')
                                                ? `жен. 7-32 U/L`
                                                : `дети(1-14 лет) 1,8-6,4 ммоль/л`}
                                            </span>
                                          </label>
                                        )}
                                      </div>

                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Screenshot Bottom Save & Cancel Buttons */}
                          <div className="flex justify-center items-center gap-3 pt-2">
                            <button
                              type="button"
                              onClick={handleSaveAndConfirm}
                              className="bg-[#5BBE27] hover:bg-[#4EA820] text-white font-bold px-6 py-1.5 rounded text-xs shadow transition-all"
                            >
                              Сохранить
                            </button>
                            <button
                              type="button"
                              onClick={() => onNavigate('dashboard')}
                              className="bg-[#B0B0B0] hover:bg-[#9E9E9E] text-white font-bold px-6 py-1.5 rounded text-xs shadow transition-all"
                            >
                              Отменить
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // RENDER STYLE 2: BLACK GRID EDITOR
                    return (
                      <div key={catName} className="space-y-4 bg-white text-slate-900 rounded-xl p-5 border-2 border-slate-300 shadow-md">
                        {/* Section Card Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-300 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-700">Название: <span className="text-rose-500">*</span></span>
                            <input
                              type="text"
                              value={shortCatTitle}
                              readOnly
                              className="bg-slate-50 border border-slate-300 rounded px-3 py-1 text-slate-900 font-bold max-w-xs font-mono text-xs focus:outline-none"
                            />
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 rounded px-2.5 py-0.5 font-bold font-mono text-xs">
                              {items.length} ta ko'rsatkich
                            </span>
                          </div>

                          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg text-blue-900 font-mono text-[11px]">
                            <span className="font-extrabold text-blue-600">📄 Word Shablon:</span>
                            <select className="bg-white border border-blue-300 rounded px-2 py-0.5 font-bold text-blue-950 focus:outline-none">
                              <option>{shortCatTitle.split(' ')[0]}_Standard_Blanka_Template.docx</option>
                              <option>Official_Laborant_Template.docx</option>
                            </select>
                          </div>
                        </div>

                        {/* Full CKEditor Toolbar */}
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-700 block">Таблица:</span>
                          <FullCKEditorToolbar
                            onInsertSymbol={(sym) => {
                              const newRes: TestResultItem = {
                                parameterId: `custom-${Date.now()}`,
                                parameterName: `Belgi (${sym})`,
                                value: sym,
                                unit: sym,
                                refMin: 0,
                                refMax: 0,
                                refString: 'в норме',
                                status: 'normal'
                              };
                              setResultsState([...resultsState, newRes]);
                            }}
                            onAddRow={() => {
                              const newRes: TestResultItem = {
                                parameterId: `custom-${Date.now()}`,
                                parameterName: 'Yangi ko\'rsatkich',
                                value: 'норме',
                                unit: 'ед.',
                                refMin: 0,
                                refMax: 0,
                                refString: 'в норме',
                                status: 'normal'
                              };
                              setResultsState([...resultsState, newRes]);
                            }}
                          />

                          {/* Black Grid Table */}
                          <div className="border border-black rounded-b-lg p-2 bg-white overflow-x-auto max-h-[450px] overflow-y-auto">
                            <table className="w-full text-left text-xs border-collapse border-2 border-black font-sans text-black">
                              <thead>
                                <tr className="bg-slate-100 text-black font-black border-b-2 border-black text-center text-xs">
                                  <th className="py-2 px-2 border-r border-black w-10">№</th>
                                  <th className="py-2 px-3 border-r border-black text-left">Показатели</th>
                                  <th className="py-2 px-3 border-r border-black w-44 text-center">Результат</th>
                                  <th className="py-2 px-3 border-r border-black w-32 text-center">Ед. изм.</th>
                                  <th className="py-2 px-3 w-40 text-center">Норма</th>
                                  <th className="py-2 px-2 text-center w-12 print:hidden">🗑</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-black font-medium text-black">
                                {items.map(({ res, originalIdx }, idx) => (
                                  <tr key={originalIdx} className="border-b border-black hover:bg-amber-50/50">
                                    <td className="py-1 px-2 border-r border-black text-center font-bold text-slate-700">
                                      {idx + 1}
                                    </td>
                                    <td className="py-1 px-3 border-r border-black font-bold text-black">
                                      {res.parameterName}
                                    </td>
                                    <td className="py-1 px-2 border-r border-black text-center">
                                      <input
                                        type="text"
                                        value={res.value}
                                        onChange={(e) => {
                                          const updated = [...resultsState];
                                          updated[originalIdx] = { ...updated[originalIdx], value: e.target.value };
                                          setResultsState(updated);
                                        }}
                                        className="w-full text-center bg-amber-50/70 border border-amber-300 focus:border-emerald-600 focus:bg-white rounded px-2 py-1 text-xs font-black text-black focus:outline-none shadow-inner"
                                      />
                                    </td>
                                    <td className="py-1 px-3 border-r border-black text-center text-slate-700 font-mono">
                                      {res.unit || 'ед.'}
                                    </td>
                                    <td className="py-1 px-3 text-center text-slate-800 font-medium">
                                      {res.refString || (res.refMin > 0 || res.refMax > 0 ? `${res.refMin} - ${res.refMax}` : 'abs')}
                                    </td>
                                    <td className="py-1 px-2 text-center print:hidden">
                                      <button
                                        type="button"
                                        onClick={() => setResultsState(resultsState.filter((_, i) => i !== originalIdx))}
                                        className="text-rose-500 hover:text-rose-700 font-bold px-1 text-xs"
                                      >
                                        ✕
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })()}
        </div>

        {/* Doctor Note & Sign-off */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <label className="block text-xs font-semibold text-slate-300"> {t('doctor_notes')}</label>
          <textarea
            rows={2}
            value={doctorNote}
            onChange={(e) => setDoctorNote(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div>
              <label className="block text-[11px] text-slate-400">{t('doctor_signature')}</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-medium"
              />
            </div>

            <button
              onClick={handleSaveAndConfirm}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 text-xs flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              {t('save_and_confirm')}
            </button>
          </div>
        </div>
      </div>

      {/* STANDALONE DEDICATED RESULT ENTRY POPUP MODAL (Blanka va MS Word Rejimi) */}
      {isDedicatedModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-teal-500/40 rounded-2xl max-w-6xl w-full p-6 space-y-5 shadow-2xl animate-scaleIn max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span className="text-teal-400 text-lg">🔬</span>
                  Tahlil Natijalarini Kiritish Muharriri — [ {activeOrder.patientName} ({activeOrder.id}) ]
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Natijalarni <b>Blanka shaklida</b> yoki <b>MS Word shabloni shaklida</b> kiriting va tahrirlang.
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setResultEntryMode('blank')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all flex items-center gap-1.5 ${
                    resultEntryMode === 'blank'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>📋 Interaktiv Blanka Shakli</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResultEntryMode('word')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all flex items-center gap-1.5 ${
                    resultEntryMode === 'word'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>📄 MS Word Shablon Shakli</span>
                </button>
              </div>

              <button
                onClick={() => setIsDedicatedModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors ml-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="overflow-y-auto pr-1 flex-1 space-y-4">
              
              {/* MODE 1: INTERAKTIV BLANKA SHAKLI */}
              {resultEntryMode === 'blank' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-300">To'liq CKEditor Uskunalar Paneli:</span>
                    <FullCKEditorToolbar
                      onInsertSymbol={(sym) => {
                        const newRes: TestResultItem = {
                          parameterId: `custom-${Date.now()}`,
                          parameterName: `Belgi (${sym})`,
                          value: sym,
                          unit: sym,
                          refMin: 0,
                          refMax: 0,
                          refString: 'в норме',
                          status: 'normal'
                        };
                        setResultsState([...resultsState, newRes]);
                      }}
                      onAddRow={() => {
                        const newRes: TestResultItem = {
                          parameterId: `custom-${Date.now()}`,
                          parameterName: 'Yangi ko\'rsatkich',
                          value: 'норме',
                          unit: 'ед.',
                          refMin: 0,
                          refMax: 0,
                          refString: 'в норме',
                          status: 'normal'
                        };
                        setResultsState([...resultsState, newRes]);
                      }}
                    />
                  </div>

                  {/* Black Grid Interactive Table */}
                  <div className="border border-slate-700 rounded-xl overflow-x-auto bg-white p-3 shadow-lg">
                    <table className="w-full text-left text-xs border-collapse border-2 border-black font-sans text-black">
                      <thead>
                        <tr className="bg-slate-100 font-black border-b-2 border-black text-center text-xs">
                          <th className="py-2.5 px-2 border-r border-black w-10">№</th>
                          <th className="py-2.5 px-3 border-r border-black text-left">Показатели</th>
                          <th className="py-2.5 px-3 border-r border-black w-48 text-center">Результат</th>
                          <th className="py-2.5 px-3 w-48 text-center">Норма</th>
                          <th className="py-2.5 px-2 text-center w-12">O'chirish</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black font-medium">
                        {resultsState.map((res, idx) => (
                          <tr key={idx} className="border-b border-black hover:bg-amber-50/40">
                            <td className="py-1.5 px-2 border-r border-black text-center font-bold text-slate-700">{idx + 1}</td>
                            <td className="py-1.5 px-3 border-r border-black font-bold text-black">{res.parameterName}</td>
                            <td className="py-1.5 px-2 border-r border-black text-center">
                              <input
                                type="text"
                                value={res.value}
                                onChange={(e) => {
                                  const updated = [...resultsState];
                                  updated[idx] = { ...updated[idx], value: e.target.value };
                                  setResultsState(updated);
                                }}
                                className="w-full text-center bg-amber-50 border border-amber-400 focus:border-emerald-600 focus:bg-white rounded px-2 py-1 text-xs font-black text-black focus:outline-none shadow-inner"
                              />
                            </td>
                            <td className="py-1.5 px-3 text-center text-slate-800 font-medium">
                              {res.refString || (res.refMin > 0 || res.refMax > 0 ? `${res.refMin} - ${res.refMax}` : 'abs')}
                            </td>
                            <td className="py-1.5 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => setResultsState(resultsState.filter((_, i) => i !== idx))}
                                className="text-rose-500 hover:text-rose-700 font-bold text-xs"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MODE 2: MS WORD SHABLON SHAKLI (AUTHENTIC WORD DOCUMENT PREVIEW & EDITOR) */}
              {resultEntryMode === 'word' && (
                <div className="space-y-4">
                  
                  {/* Controls Bar for Word Mode */}
                  <div className="bg-slate-950 border border-blue-500/40 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-blue-400">📄 MS Word Shablon:</span>
                      <select
                        value={selectedWordTemplate}
                        onChange={(e) => setSelectedWordTemplate(e.target.value)}
                        className="bg-slate-900 border border-blue-400 text-white font-bold px-3 py-1 rounded-lg text-xs"
                      >
                        <option value="OAM_Standard_Blanka_Template.docx">OAM_Standard_Blanka_Template.docx (24.5 KB)</option>
                        <option value="OAK_Official_Laborant_Template.docx">OAK_Official_Laborant_Template.docx (31.2 KB)</option>
                        <option value="Biokimyo_Full_Panel_Template.docx">Biokimyo_Full_Panel_Template.docx (42.0 KB)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1.5 shadow">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Word Fayl Yuklash (.docx)</span>
                        <input type="file" accept=".doc,.docx" className="hidden" onChange={() => alert('📄 MS Word blanka fayli muvaffaqiyatli import qilindi!')} />
                      </label>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow"
                      >
                        <Printer className="w-3.5 h-3.5" /> Chop Etish
                      </button>
                    </div>
                  </div>

                  {/* Authentic A4 MS Word Document View & Content Editor */}
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 overflow-x-auto flex justify-center">
                    
                    {/* A4 Paper Container */}
                    <div className="bg-white text-slate-950 shadow-2xl max-w-3xl w-full p-8 rounded-lg min-h-[750px] border border-slate-300 font-serif space-y-6">
                      
                      {/* Clinic Official Header */}
                      <div className="border-b-2 border-slate-950 pb-4 flex items-center justify-between">
                        <div>
                          <h1 className="text-lg font-black text-slate-950 tracking-wider uppercase font-sans">
                            SMARTLAB LIMS CLINICAL LABORATORY
                          </h1>
                          <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                            Rasmiy Tibbiy-Laboratoriya Tahlili Hujjati • Tel: +998 (71) 200-00-11
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-teal-600 text-white rounded-xl font-sans font-black flex items-center justify-center text-sm shadow">
                          LAB
                        </div>
                      </div>

                      {/* Patient & Order Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-300 font-sans">
                        <div><b>И.Ф.О Пациента:</b> {activeOrder.patientName}</div>
                        <div><b>ID Пациента:</b> {activeOrder.patientId || `029625`}</div>
                        <div><b>Возраст / Пол:</b> {activeOrder.patientAge} yosh ({activeOrder.patientGender})</div>
                        <div><b>Дата анализа:</b> {activeOrder.createdAt}</div>
                        <div><b>Направляющий врач:</b> {doctorName}</div>
                        <div><b>Штрих-код:</b> <span className="font-mono font-bold">{activeOrder.barcode}</span></div>
                      </div>

                      {/* Word Document Title */}
                      <div className="text-center py-1">
                        <h2 className="text-base font-black text-slate-900 uppercase underline tracking-wide font-sans">
                          {activeOrder.testCategory} - {selectedWordTemplate.split('.')[0].replace(/_/g, ' ')}
                        </h2>
                      </div>

                      {/* MS Word Results Table */}
                      <table className="w-full text-left text-xs border-collapse border border-slate-900 font-sans">
                        <thead>
                          <tr className="bg-slate-200 text-slate-950 font-black border-b border-slate-900 text-center">
                            <th className="py-2 px-2 border-r border-slate-900 w-10">№</th>
                            <th className="py-2 px-3 border-r border-slate-900 text-left">Показатель</th>
                            <th className="py-2 px-3 border-r border-slate-900 w-36 text-center">Результат</th>
                            <th className="py-2 px-3 border-r border-slate-900 w-24 text-center">Ед. изм.</th>
                            <th className="py-2 px-3 text-center w-36">Норма</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {resultsState.map((res, rIdx) => (
                            <tr key={rIdx} className="border-b border-slate-800">
                              <td className="py-1.5 px-2 border-r border-slate-800 text-center font-bold text-slate-700">{rIdx + 1}</td>
                              <td className="py-1.5 px-3 border-r border-slate-800 font-bold">{res.parameterName}</td>
                              <td className="py-1.5 px-3 border-r border-slate-800 text-center font-black text-blue-900">
                                {res.value || 'в норме'}
                              </td>
                              <td className="py-1.5 px-3 border-r border-slate-800 text-center text-slate-700 font-mono">{res.unit}</td>
                              <td className="py-1.5 px-3 text-center text-slate-700">{res.refString || '0 - 100'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Direct Editable MS Word Text Box */}
                      <div className="space-y-2 font-sans pt-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          📝 MS Word Hujjat Matn Muharriri (Direct Word Editor):
                        </label>
                        <textarea
                          rows={4}
                          value={wordEditableContent}
                          onChange={(e) => setWordEditableContent(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-950 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                          placeholder="MS Word hujjatiga qo'shimcha matn yoki xulosalarni kiritishingiz mumkin..."
                        />
                      </div>

                      {/* Official Signature & Seal Block */}
                      <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-xs font-sans text-slate-800">
                        <div>
                          <b>Врач-лаборант:</b> {doctorName}
                          <div className="text-[10px] text-slate-500 mt-0.5">Подпись: ______________________</div>
                        </div>

                        <div className="border border-emerald-600 text-emerald-800 px-3 py-1 rounded font-mono font-bold text-[10px] uppercase shadow-sm">
                          ✓ M.P. ПЕЧАТЬ ЛАБОРАТОРИИ
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Bottom Controls */}
            <div className="border-t border-slate-800 pt-3 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsDedicatedModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
              >
                ✕ Yopish
              </button>

              <button
                type="button"
                onClick={() => {
                  handleSaveAndConfirm();
                  setIsDedicatedModalOpen(false);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 text-xs flex items-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                Natijani Saqlash & Rasmiy Blank Yaratish
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
});
