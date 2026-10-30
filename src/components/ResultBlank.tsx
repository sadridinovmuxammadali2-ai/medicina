import React, { useState, useMemo } from 'react';
import type { TestOrder } from '../types/lab';
import { Printer, Download, ShieldCheck, Filter, FileText } from 'lucide-react';
import { FullCKEditorToolbar } from './FullCKEditorToolbar';
import { useLanguage } from '../context/LanguageContext';
import { translateTestName, getCategoryForParameter } from '../utils/categoryTranslator';

interface ResultBlankProps {
  order: TestOrder | null;
  onNavigate: (tab: string) => void;
}

export const ResultBlank: React.FC<ResultBlankProps> = ({ order, onNavigate }) => {
  const { currentLanguage, t } = useLanguage();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  if (!order) {
    return (
      <div className="text-center py-12 text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
        <p>Biron bir tasdiqlangan tahlil tanlanmagan.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="mt-3 text-xs text-teal-400 underline font-bold"
        >
          ← Boshqaruv paneliga qaytish
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // Group all order results by department / category using getCategoryForParameter
  const groupedResults = useMemo(() => {
    const map = new Map<string, typeof order.results>();
    order.results.forEach(res => {
      const cat = getCategoryForParameter(res.parameterName, res.parameterId, currentLanguage);
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(res);
    });
    return Array.from(map.entries());
  }, [order.results, currentLanguage]);

  // Determine categories to render on screen / print
  const visibleCategories = useMemo(() => {
    if (selectedCategoryFilter === 'all') {
      return groupedResults;
    }
    return groupedResults.filter(([catName]) => catName === selectedCategoryFilter);
  }, [groupedResults, selectedCategoryFilter]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Control Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl gap-4 print:hidden">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            {t('blank_page_title')}
          </h2>
          <p className="text-xs text-slate-400">
            {t('blank_page_desc')}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            {t('btn_print')}
          </button>
          <button
            onClick={handlePrint}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            {t('btn_download_pdf')}
          </button>
        </div>
      </div>

      {/* DEPARTMENT CATEGORY FILTER TOOLBAR (BO'LIMLAR BAR) */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2.5 print:hidden shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-400" />
            BO'LIMLAR: (Tahlillar alohida blankalarga ajratilgan)
          </span>
          <span className="text-[11px] text-teal-300 font-medium">
            Jami: {groupedResults.length} ta bo'lim / blanka
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3.5 py-2 rounded-xl font-extrabold uppercase transition-all flex items-center gap-1.5 shadow ${
              selectedCategoryFilter === 'all'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-teal-500/25 ring-2 ring-teal-400/50'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            🌐 Barcha Bo'limlar ({order.results.length})
          </button>

          {groupedResults.map(([catName, items]) => (
            <button
              key={catName}
              type="button"
              onClick={() => setSelectedCategoryFilter(catName)}
              className={`px-3.5 py-2 rounded-xl font-extrabold uppercase transition-all flex items-center gap-1.5 shadow ${
                selectedCategoryFilter === catName
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-teal-500/25 ring-2 ring-teal-400/50'
                  : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{catName}</span>
              <span className="bg-slate-800/80 text-teal-300 px-2 py-0.5 rounded-full text-[10px] font-mono">
                {items.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* RENDER EACH DEPARTMENT BLANK FORM ON SEPARATE A4 SHEET */}
      {visibleCategories.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl text-center text-slate-500 font-medium border border-slate-200">
          Ushbu bo'lim bo'yicha tahlillar topilmadi.
        </div>
      ) : (
        visibleCategories.map(([catName, items], catIdx) => {
          const isOam = catName.includes('ОАМ') || catName.includes('PESHOB') || catName.includes('МОЧА');

          return (
            <div
              key={catName}
              className="bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-10 border border-slate-200 font-sans print:shadow-none print:m-0 print:p-6 print:rounded-none mb-8 print:mb-0"
              style={{ pageBreakAfter: catIdx < visibleCategories.length - 1 ? 'always' : 'auto', breakAfter: catIdx < visibleCategories.length - 1 ? 'page' : 'auto' }}
            >
              {/* Blank Header (Letterhead) */}
              <div className="flex justify-between items-start pb-3">
                <div className="flex items-center gap-3.5">
                  {/* Logo Badge */}
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center font-black text-xl sm:text-2xl text-slate-400 select-none flex-shrink-0">
                    SL
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-black tracking-wide text-[#005B5C]">
                      SMARTLAB DIAGNOSTICS
                    </h1>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">
                      Xalqaro standartlarga ega Tibbiy Diagnostika va Laboratoriya Markazi
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Toshkent sh., Yunusobod t., Amir Temur ko'chasi 107B • Tel: +998 71 200 00 11
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-center flex-shrink-0">
                  <img
                    src={order.qrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SMARTLAB-VERIFY'}
                    alt="QR Verify"
                    className="w-14 h-14 sm:w-16 sm:h-16 border border-slate-300 p-0.5 rounded-lg shadow-sm"
                  />
                  <span className="text-[10px] font-medium text-slate-500 mt-1">Haqiqiylikni QR bilan tekshiring</span>
                </div>
              </div>

              {/* Solid Dark Teal Horizontal Line */}
              <div className="border-b-[3px] border-[#005B5C] w-full mb-4"></div>

              {/* Patient Demographics Info Box */}
              <div className="mb-5 bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-slate-700 block text-[10px] uppercase font-bold tracking-wider mb-1">BEMOR F.I.SH:</span>
                  <strong className="text-slate-900 font-extrabold text-xs block truncate">{order.patientName}</strong>
                </div>
                <div>
                  <span className="text-slate-700 block text-[10px] uppercase font-bold tracking-wider mb-1">YOSH / JINSI:</span>
                  <strong className="text-slate-800 font-semibold text-xs block">{order.patientAge} yosh ({order.patientGender})</strong>
                </div>
                <div>
                  <span className="text-slate-700 block text-[10px] uppercase font-bold tracking-wider mb-1">BUYURTMA № / SHTRIX-KOD:</span>
                  <strong className="text-[#005B5C] font-mono font-bold text-xs block">#{order.orderNumber} ({order.barcode})</strong>
                </div>
                <div>
                  <span className="text-slate-700 block text-[10px] uppercase font-bold tracking-wider mb-1">TAHLIL TOPSHIRILGAN VAQT:</span>
                  <strong className="text-slate-900 font-extrabold text-xs block">{order.completedAt || order.createdAt}</strong>
                </div>
              </div>

              {/* DEPARTMENT BLANK TITLE BANNER */}
              <div className="mb-4 bg-teal-50/80 border border-teal-200 rounded-xl px-4 py-2 flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#005B5C] uppercase tracking-wider font-mono flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  {catName} TAHLILI BLANKASI
                </span>
                <span className="text-xs text-slate-600 font-extrabold font-mono bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                  {items.length} ta ko'rsatkich
                </span>
              </div>

              {/* Table rendering based on OAM vs Standard department */}
              {isOam ? (
                <div className="mb-6 space-y-3 bg-white p-4 rounded-xl border border-slate-300">
                  {/* Title Bar & Word Template Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b pb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-700">Название: <span className="text-rose-500">*</span></span>
                      <div className="bg-slate-50 border border-slate-300 rounded px-3 py-1 text-slate-900 font-bold w-48 font-mono text-xs">
                        OAM
                      </div>
                    </div>

                    {(() => {
                      const saved = localStorage.getItem('smartlab_word_templates');
                      const wordTemplates = saved ? JSON.parse(saved) : [
                        { id: 'wt-1', name: 'OAM_Standard_Blanka_Template.docx', size: '24.5 KB' }
                      ];

                      return (
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg text-blue-900 font-mono text-[11px] print:hidden">
                          <span className="font-extrabold text-blue-600 flex items-center gap-1">
                            📄 Word Shablon:
                          </span>
                          <span className="font-bold text-blue-950 underline">
                            {wordTemplates[0]?.name || 'OAM_Template.docx'}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="space-y-1 print:hidden">
                    <span className="text-xs font-bold text-slate-700 block">Таблица:</span>
                    <FullCKEditorToolbar />
                  </div>

                  {/* Official Black Grid Table */}
                  <div className="border border-[#7BB52E] border-t-0 rounded-b-lg p-2 bg-white overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse border-2 border-black font-sans">
                      <thead>
                        <tr className="bg-slate-100 text-black font-extrabold border-b-2 border-black text-center text-xs">
                          <th className="py-1.5 px-2 border-r border-black w-10">{t('table_no')}</th>
                          <th className="py-1.5 px-3 border-r border-black text-left">{t('blank_tbl_param')}</th>
                          <th className="py-1.5 px-3 border-r border-black w-44 text-center">{t('blank_tbl_result')}</th>
                          <th className="py-1.5 px-3 w-48 text-center">{t('blank_tbl_norm')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black font-medium text-black">
                        {items.map((r, i) => {
                          const num = i + 1;
                          const hasSubgroup = Boolean(r.subGroup);

                          return (
                            <tr key={i} className="border-b border-black">
                              <td className="py-1 px-2 border-r border-black text-center font-bold text-slate-700">
                                {num <= 11 ? num : ''}
                              </td>
                              <td className="py-1 px-3 border-r border-black">
                                {hasSubgroup ? (
                                  <div className="pl-6 font-semibold text-slate-800">
                                    {translateTestName(r.parameterName, currentLanguage)}
                                  </div>
                                ) : (
                                  <span className="font-bold text-black">{translateTestName(r.parameterName, currentLanguage)}</span>
                                )}
                              </td>
                              <td className="py-1 px-3 border-r border-black text-center font-bold">
                                {r.value || 'abs'}
                              </td>
                              <td className="py-1 px-3 text-center text-slate-800 font-medium">
                                {r.refString || (r.refMin > 0 || r.refMax > 0 ? `${r.refMin} - ${r.refMax}` : 'abs')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left text-xs mb-6 border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-y border-slate-300 text-[11px]">
                      <th className="py-2.5 px-3">{t('blank_tbl_param')}</th>
                      <th className="py-2.5 px-3">{t('blank_tbl_result')}</th>
                      <th className="py-2.5 px-3">{t('blank_tbl_unit')}</th>
                      <th className="py-2.5 px-3">{t('blank_tbl_norm')}</th>
                      <th className="py-2.5 px-3">{t('blank_tbl_eval')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {items.map((r, i) => {
                      const isQualitative = r.unit === 'Качество' || r.unit === 'Kachestvo' || r.unit === 'Индекс' || r.unit === 'Титр' || r.isQualitative;
                      const valStr = r.value?.toString() || '';

                      return (
                        <tr key={i} className={r.status !== 'normal' ? 'bg-rose-50/50 font-semibold' : ''}>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{translateTestName(r.parameterName, currentLanguage)}</td>
                          <td className="py-2.5 px-3 font-black text-sm text-slate-900">
                            {valStr || '—'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 font-medium">{r.unit}</td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono">
                            {r.refString || (isQualitative ? 'Отрицательный' : `${r.refMin} - ${r.refMax}`)}
                          </td>
                          <td className="py-2.5 px-3">
                            {valStr.includes('Манфий') || r.status === 'normal' ? (
                              <span className="text-emerald-700 font-bold text-[11px]">{t('norm_ok')}</span>
                            ) : null}
                            {valStr.includes('Мусбат') || r.status === 'high' ? (
                              <span className="text-rose-700 font-extrabold text-[11px]">▲ {t('qualitative_positive')}</span>
                            ) : null}
                            {valStr.includes('Серая') || r.status === 'low' ? (
                              <span className="text-amber-700 font-extrabold text-[11px]">⚠️ {t('qualitative_gray')}</span>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* Doctor Note */}
              <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-3.5 mb-6 text-xs text-slate-800">
                <strong className="text-teal-900 font-bold block mb-1">Shifokor-Laborant Izohi:</strong>
                <p className="italic text-slate-700">{order.doctorNote || 'Tahlil ko\'rsatkichlari me\'yoriy chegarada.'}</p>
              </div>

              {/* Footer: Signatures & Stamp */}
              <div className="pt-4 border-t border-slate-300 flex justify-between items-center text-xs text-slate-700">
                <div>
                  <p className="font-bold text-slate-900">Mas'ul Vrach-Laborant:</p>
                  <p className="text-slate-600 mt-1 font-semibold">{order.doctorName || 'Dr. Sobirov X.'}</p>
                  <span className="text-[10px] text-emerald-700 font-mono">[Elektron Imzo Bilan Tasdiqlangan]</span>
                </div>

                {/* Official Stamp Mock */}
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-teal-700/60 flex flex-col items-center justify-center text-center rotate-[-12deg] p-1 text-[9px] font-bold text-teal-800 bg-teal-50/20 shadow-inner">
                  <span>"SMARTLAB" MCHJ</span>
                  <span className="text-[7px]">LABORATORIYA MUXRI</span>
                  <span className="text-[8px] mt-0.5 font-mono">TOSHKENT ★ 2026</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
