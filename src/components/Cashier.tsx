import React, { useState, useEffect, useMemo } from 'react';
import type { TestOrder, TestCatalogItem } from '../types/lab';
import { CreditCard, Printer, Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translateCategoryName, translateTestName } from '../utils/categoryTranslator';

const formatLiveTimestamp = (d = new Date()): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

interface CashierProps {
  orders: TestOrder[];
  selectedOrder: TestOrder | null;
  testCatalog?: TestCatalogItem[];
  onUpdateOrder: (updatedOrder: TestOrder) => void;
  onNavigate: (tab: string) => void;
}

export interface PaymentTransaction {
  num: number;
  id: string;
  patientName: string;
  comment: string;
  amount: number;
  discount: number;
  discountType: string;
  paymentForm: string;
  user: string;
  date: string;
}

export const Cashier: React.FC<CashierProps> = React.memo(({
  orders,
  selectedOrder,
  testCatalog = [],
  onUpdateOrder,
}) => {
  const { currentLanguage, t } = useLanguage();
  const activeOrder = selectedOrder || orders[0];

  // Dynamic real-time auto-updating timestamp clock
  const [liveTime, setLiveTime] = useState<string>(formatLiveTimestamp());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(formatLiveTimestamp());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cashier form state matching the screenshot
  const [paymentForm, setPaymentForm] = useState('Наличными');
  const [discountVal, setDiscountVal] = useState(0);
  const [discountUnit, setDiscountUnit] = useState('нет');
  const [receivedAmount, setReceivedAmount] = useState<number>(activeOrder ? activeOrder.price : 0);
  const [notes, setNotes] = useState('');
  const [cashierUser] = useState('Хусанова Насиба');

  // Validity and Print checkboxes state
  const [validityChecked, setValidityChecked] = useState(true);
  const [printChecked, setPrintChecked] = useState(false);

  // Discount Card Modal state
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountCardCode, setDiscountCardCode] = useState('');

  // Catalog Test Selector Modal state (ONLY allow adding existing catalog tests)
  const [addingTestForTxNum, setAddingTestForTxNum] = useState<number | null>(null);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('all');

  // List of all valid, official tests from testCatalog ONLY
  const availableCatalogTests = useMemo(() => {
    if (!testCatalog || testCatalog.length === 0) return [];
    const list: { id: string; name: string; category: string; price: number; unit?: string }[] = [];
    testCatalog.forEach(cat => {
      cat.subGroups.forEach(sg => {
        sg.items.forEach(item => {
          list.push({
            id: item.id,
            name: item.name,
            category: cat.category,
            price: item.price,
            unit: item.unit
          });
        });
      });
    });
    return list;
  }, [testCatalog]);

  const catalogCategories = useMemo(() => {
    if (!testCatalog) return [];
    return testCatalog.map(c => c.category);
  }, [testCatalog]);

  const filteredCatalogTests = useMemo(() => {
    const q = catalogSearchQuery.toLowerCase().trim();
    return availableCatalogTests.filter(tItem => {
      if (catalogCategoryFilter !== 'all' && tItem.category !== catalogCategoryFilter) {
        return false;
      }
      if (q !== '') {
        const matches = tItem.name.toLowerCase().includes(q) ||
          tItem.category.toLowerCase().includes(q) ||
          tItem.id.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [availableCatalogTests, catalogSearchQuery, catalogCategoryFilter]);

  // Filter mode for transactions table: 'all' vs 'active_patient'
  const [txFilterMode, setTxFilterMode] = useState<'all' | 'active_patient'>('all');

  // Expanded transaction item state
  const [expandedTxNum, setExpandedTxNum] = useState<number | null>(1);

  // Transactions list (Денежные операции с аккаунтом) matching screenshot with past & current histories
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const historicalTx: PaymentTransaction[] = [
      {
        num: 1,
        id: '029625',
        patientName: 'Шарипова Хадича Рахимжон кизи',
        comment: 'Оплата за Кортизол, Прогестерон, Пролактин, Лютеинизирующий гормон (LH), Фолликулостимулирующий гормон ФСГ (FSH), Эстрадиол E2 (Эстроген), Эстриол E3 (Эстроген), Соматотропный гормон СТГ (GH), Трансферрин, Тиреотропный гормон ТТГ, Антитела к рецепторам ТТГ (анти-рТТГ), Трийодтиронин свободный Т3 св, Тироксин свободный Т4 св, Трийодтиронин общий Т3, Тироксин общий Т4, Тестостерон, Свободный тестостерон, Дегидроэпиандростерона Сульфат [DHEA-S], Инсулин, Инсулиноподобный фактор роста [ИФР], Хорионический гонадотропин (HCG/B-HCG), 17-Оксипрогестерон, Антитела к тиреоглобулину (АТ-ТГ), Антитела к ТиреоПероксидазе (АТ-ТПО), Ферритин, С-пептид, Адренокортикотропный гормон АККТГ (ACTH), Мозговой натрийуретический пропептид (NT-proBNP), Паратиреоидный гормон (PTH), Тиреоглобулин, Кальцитонин, Антимюллеров гормон (АМГ), Глобулин связывающий половые гормоны, Ингибин B, Витамин B12, Фолиевая кислота, Кортизол в моче, Норадреналин (кровь), Индекс HOMA, Гомоцистеин, D-димер, Интерлейкин-6, Прокальцитонин, Адреналин (кровь), Vitamin D - 25 OH, Общий белок, Альбумин, Аланинаминотрансфераза (АЛТ), Аспартатаминотрансфераза (АСТ), Глюкоза, Мочевина, Креатинин, Мочевая кислота',
        amount: 320000,
        discount: 0,
        discountType: 'Обычный',
        paymentForm: 'Наличными',
        user: 'Хусанова Насиба',
        date: '2026-08-11 15:17:01'
      },
      {
        num: 2,
        id: '029625',
        patientName: 'Шарипова Хадича Рахимжон кизи',
        comment: 'Оплата за экспресс тест',
        amount: 80000,
        discount: 0,
        discountType: 'Обычный',
        paymentForm: 'UzCard / Humo',
        user: 'Хусанова Насиба',
        date: '2026-08-11 15:09:38'
      },
      {
        num: 3,
        id: '029625',
        patientName: 'Шарипова Хадича Рахимжон кизи',
        comment: 'Первичный прием',
        amount: 40000,
        discount: 0,
        discountType: 'Обычный',
        paymentForm: 'Наличными',
        user: 'Хусанова Насиба',
        date: '2023-09-15 08:08:46'
      }
    ];

    // Live registered orders mapped into cashier payment history
    const liveOrdersTx: PaymentTransaction[] = orders.map((ord, idx) => ({
      num: historicalTx.length + idx + 1,
      id: ord.patientId || `PAT-${ord.orderNumber}`,
      patientName: ord.patientName,
      comment: ord.testName ? `Оплата за ${ord.testName}` : 'Оплата за анализы',
      amount: ord.price,
      discount: 0,
      discountType: 'Обычный',
      paymentForm: 'Наличными',
      user: 'Хусанова Насиба',
      date: ord.createdAt || formatLiveTimestamp()
    }));

    return [...liveOrdersTx, ...historicalTx];
  });

  const [searchTx, setSearchTx] = useState('');
  const [showCount, setShowCount] = useState(5);

  if (!activeOrder) {
    return (
      <div className="text-center py-12 text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
        <CreditCard className="w-12 h-12 mx-auto text-slate-600 mb-2" />
        <p>Кассада тўлов қилиш uchun актив пациент йўқ.</p>
      </div>
    );
  }

  // Calculate final total based on discount
  const finalTotal = useMemo(() => {
    if (!activeOrder) return 0;
    let total = activeOrder.price;
    if (discountUnit === '%') {
      total = Math.round(activeOrder.price * (1 - discountVal / 100));
    } else if (discountUnit === 'сум') {
      total = Math.max(0, activeOrder.price - discountVal);
    }
    return total;
  }, [activeOrder, discountUnit, discountVal]);

  const deleteTestFromTransaction = (txNum: number, testNameToRemove: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.num !== txNum) return tx;
      const rawTests = tx.comment.replace(/^Оплата за\s*/i, '').split(/,\s*/).filter(Boolean);
      const updatedTests = rawTests.filter(t => t.trim() !== testNameToRemove.trim());
      const updatedComment = updatedTests.length > 0 ? `Оплата за ${updatedTests.join(', ')}` : 'Оплата за анализы (bo\'sh)';
      return {
        ...tx,
        comment: updatedComment
      };
    }));
    alert(`🗑️ "${testNameToRemove}" tahlili to'lov ro'yxatidan o'chirildi!`);
  };

  const addTestToTransaction = (txNum: number, newTestName: string) => {
    if (!newTestName || !newTestName.trim()) return;
    setTransactions(prev => prev.map(tx => {
      if (tx.num !== txNum) return tx;
      const rawTests = tx.comment.replace(/^Оплата за\s*/i, '').split(/,\s*/).filter(Boolean);
      const updatedTests = [...rawTests, newTestName.trim()];
      return {
        ...tx,
        comment: `Оплата за ${updatedTests.join(', ')}`
      };
    }));
    alert(`✅ "${newTestName}" tahlili to'lov ro'yxatiga qo'shildi!`);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeOrder) return;

    const newTx: PaymentTransaction = {
      num: transactions.length + 1,
      id: activeOrder.orderNumber,
      patientName: activeOrder.patientName,
      comment: `Оплата за ${activeOrder.testName}`,
      amount: finalTotal,
      discount: discountVal,
      discountType: discountUnit === '%' ? 'Процент' : discountUnit === 'сум' ? 'Сумма' : 'Обычный',
      paymentForm,
      user: cashierUser,
      date: liveTime
    };

    setTransactions([newTx, ...transactions]);

    const updatedOrder: TestOrder = {
      ...activeOrder,
      isPaid: true,
      isValidated: validityChecked,
    };
    onUpdateOrder(updatedOrder);

    if (validityChecked) {
      alert(`✅ Тўлов ва Валидность сақланди! Пациент (${activeOrder.patientName}) Лаборатория кабинетига юборилди.`);
    } else {
      alert(`✅ Тўлов сақланди! (Диққат: Лабораторияга кўриниши учун Валидность катагини белгилаб, Сохранить тугмасини босинг).`);
    }
  };

  const handlePrintCheque = () => {
    window.print();
  };

  const filteredTx = transactions.filter(t => {
    if (txFilterMode === 'active_patient' && activeOrder) {
      const matchName = t.patientName.toLowerCase().includes(activeOrder.patientName.toLowerCase()) ||
                        activeOrder.patientName.toLowerCase().includes(t.patientName.toLowerCase());
      if (!matchName) return false;
    }

    const matchesSearch =
      t.patientName.toLowerCase().includes(searchTx.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTx.toLowerCase()) ||
      t.paymentForm.toLowerCase().includes(searchTx.toLowerCase()) ||
      t.comment.toLowerCase().includes(searchTx.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top Patient Payment Form Card - Redesigned with Premium Dark Glassmorphism */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 text-white font-sans">
        
        {/* Top Header Bar: Patient Name, ID Badge & Discount Card Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-teal-500/20">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">
                  {activeOrder.patientName}
                </h2>
                <span className="text-[11px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full">
                  {activeOrder.patientId || `PAT-${activeOrder.orderNumber}`}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>{activeOrder.patientAge ? `${activeOrder.patientAge} yosh` : 'Bemor'}</span>
                <span>•</span>
                <span>{activeOrder.patientGender === 'erkak' ? 'Erkak' : activeOrder.patientGender === 'ayol' ? 'Ayol' : '—'}</span>
                <span>•</span>
                <span>Tel: {activeOrder.patientPhone || '—'}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDiscountModal(true)}
            className="bg-gradient-to-r from-lime-600 to-emerald-600 hover:from-lime-500 hover:to-emerald-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-lime-600/20 tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            {t('attach_discount_card')}
          </button>
        </div>

        {/* Yellow Warning Alert Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-300 flex items-center gap-3 font-medium shadow-inner">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{t('required_warning')}</span>
        </div>

        {/* 3-Column Payment Form Layout */}
        <form onSubmit={handleSavePayment} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          
          {/* Left Col: Payment Method, Balances & Amounts */}
          <div className="space-y-4 lg:col-span-1 border-r border-slate-800/80 pr-0 lg:pr-6">
            
            {/* Balance Metric Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                {t('client_balance')} <span className="text-rose-400 font-bold">*</span>
              </span>
              <div className="text-right">
                <span className="font-mono font-extrabold text-emerald-400 text-sm block">0 сум</span>
                <span className="text-[10px] text-emerald-300/80 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 inline-block font-mono">
                  {t('no_debt')}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-200">
                {t('select_payment')} <span className="text-rose-400 font-bold">*</span>
              </label>
              
              {/* Payment Method Quick Option Cards */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Наличными', label: 'Наличными', icon: '💵' },
                  { id: 'UzCard / Humo', label: 'UzCard / Humo', icon: '💳' },
                  { id: 'Payme / Click', label: 'Payme / Click', icon: '📱' },
                  { id: 'Перечисление', label: 'Перечисление', icon: '📄' },
                ].map(item => {
                  const isSelected = paymentForm === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentForm(item.id)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-500/20 border-teal-400 text-white font-extrabold ring-2 ring-teal-400/40 shadow-lg shadow-teal-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="text-xs truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Discount Controls */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
              <span className="block font-bold text-slate-300">{t('discount_label')}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={discountVal}
                  onChange={(e) => setDiscountVal(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-teal-500"
                />
                <select
                  value={discountUnit}
                  onChange={(e) => setDiscountUnit(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 font-bold text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="нет">нет</option>
                  <option value="%">%</option>
                  <option value="сум">сум</option>
                </select>
              </div>
            </div>

            {/* Total Display Block */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/30 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 text-[11px] block uppercase font-mono font-bold">{t('grand_total')}</span>
              <div className="text-xl font-black text-emerald-400 font-mono tracking-wide">
                {finalTotal.toLocaleString()} сум
              </div>
            </div>

            {/* Received Amount Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-300">{t('received_amount')}</label>
                <button
                  type="button"
                  onClick={() => setReceivedAmount(finalTotal)}
                  className="text-[10px] text-teal-400 hover:text-teal-300 underline font-bold cursor-pointer"
                >
                  {t('equalize')}
                </button>
              </div>
              <input
                type="number"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-white text-sm focus:outline-none focus:border-teal-500"
              />
              {receivedAmount > finalTotal && (
                <div className="text-xs text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-mono flex items-center justify-between mt-1">
                  <span>{t('change_return')}</span>
                  <strong className="font-bold text-amber-400">{(receivedAmount - finalTotal).toLocaleString()} so'm</strong>
                </div>
              )}
            </div>

            {/* Notes Textarea */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-300">{t('for_notes')}</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Form Submit Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-lime-600 to-emerald-600 hover:from-lime-500 hover:to-emerald-500 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg shadow-lime-600/20 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {t('save_payment')}
              </button>
              <button
                type="button"
                onClick={() => setNotes('')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-700 cursor-pointer"
              >
                {t('cancel_payment')}
              </button>
            </div>
          </div>

          {/* Middle Col: Validity Checklist */}
          <div className="space-y-4 lg:col-span-1 border-r border-slate-800/80 pr-0 lg:pr-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <span className="text-amber-400">⚡</span>
                  <span>{t('validity')}</span>
                </h3>
                <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-mono">
                  Lab Status
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                {t('validity_desc')}
              </p>

              <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <label className="flex items-center justify-between font-mono text-slate-200 cursor-pointer hover:bg-slate-900 p-1.5 rounded transition-colors">
                  <span className="text-xs">{activeOrder.createdAt || liveTime}</span>
                  <input
                    type="checkbox"
                    checked={validityChecked}
                    onChange={(e) => setValidityChecked(e.target.checked)}
                    className="w-4 h-4 text-lime-500 rounded bg-slate-900 border-slate-700 cursor-pointer focus:ring-lime-500"
                  />
                </label>
                <label className="flex items-center justify-between font-mono text-slate-400 cursor-pointer hover:bg-slate-900 p-1.5 rounded transition-colors">
                  <span className="text-xs">{liveTime}</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-lime-500 rounded bg-slate-900 border-slate-700 cursor-pointer focus:ring-lime-500"
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const updatedOrder: TestOrder = {
                  ...activeOrder,
                  isValidated: validityChecked,
                  status: validityChecked ? 'jarayonda' : activeOrder.status
                };
                onUpdateOrder(updatedOrder);
                if (validityChecked) {
                  alert(`✅ Валидность тасдиқланди! Пациент (${activeOrder.patientName}) Лаборатория кабинетига юборилди.`);
                } else {
                  alert(`⚠️ Валидность олиб ташланди.`);
                }
              }}
              className="w-full bg-gradient-to-r from-lime-600 to-emerald-600 hover:from-lime-500 hover:to-emerald-500 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              {t('save_button')}
            </button>
          </div>

          {/* Right Col: Print Cheque */}
          <div className="space-y-4 lg:col-span-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <span className="text-cyan-400">🖨️</span>
                  <span>{t('print_receipt')}</span>
                </h3>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
                  Kassa Cheki
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                {t('print_receipt_desc')}
              </p>

              <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <label className="flex items-center justify-between font-mono text-slate-200 cursor-pointer hover:bg-slate-900 p-1.5 rounded transition-colors">
                  <span className="text-xs">{activeOrder.createdAt || liveTime}</span>
                  <input
                    type="checkbox"
                    checked={printChecked}
                    onChange={(e) => setPrintChecked(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 cursor-pointer focus:ring-cyan-500"
                  />
                </label>
                <label className="flex items-center justify-between font-mono text-slate-400 cursor-pointer hover:bg-slate-900 p-1.5 rounded transition-colors">
                  <span className="text-xs">{liveTime}</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 cursor-pointer focus:ring-cyan-500"
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePrintCheque}
              className="w-full bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-black px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-600/20 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              {t('print_button')}
            </button>
          </div>

        </form>
      </div>

      {/* Discount Card Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-teal-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 text-white font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-400" />
                <span>Дисконт Карта Biriktirish</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowDiscountModal(false)}
                className="text-slate-400 hover:text-white font-bold p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block font-bold text-slate-300">
                Дисконт карта рақами yoki Promo-kod:
              </label>
              <input
                type="text"
                value={discountCardCode}
                onChange={(e) => setDiscountCardCode(e.target.value)}
                placeholder="Masalan: CARD-1002 yoki VIP50"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-teal-400"
              />

              <div>
                <span className="block font-bold text-slate-400 mb-2">Standard chegirma darajasi (Tezkor tanlov):</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '5% Chegirma', val: 5, unit: '%' },
                    { label: '10% Chegirma', val: 10, unit: '%' },
                    { label: '15% Chegirma', val: 15, unit: '%' },
                    { label: '20% VIP', val: 20, unit: '%' },
                    { label: '50% Maxsus', val: 50, unit: '%' },
                    { label: '100% Bepul', val: 100, unit: '%' },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setDiscountVal(preset.val);
                        setDiscountUnit(preset.unit);
                        setShowDiscountModal(false);
                        alert(`✅ ${preset.label} qo'llanildi!`);
                      }}
                      className="bg-slate-950 hover:bg-teal-500 hover:text-slate-950 border border-slate-800 text-slate-200 font-bold p-2 rounded-xl text-center text-[11px] transition-all cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  if (discountCardCode.trim()) {
                    setDiscountVal(10);
                    setDiscountUnit('%');
                    setShowDiscountModal(false);
                    alert(`✅ Дисконт karta (${discountCardCode}) faollashtirildi! 10% chegirma berildi.`);
                  } else {
                    alert('Iltimos, karta kodi kiritilsin!');
                  }
                }}
                className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-2 rounded-xl text-xs uppercase cursor-pointer"
              >
                Biriktirish
              </button>
              <button
                type="button"
                onClick={() => setShowDiscountModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Section: Денежные операции с аккаунтом (Matching Screenshot Table) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-100 space-y-3 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-400" />
            {t('account_operations')}
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTxFilterMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                txFilterMode === 'all'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold'
                  : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {t('all_patients')}
            </button>

            <button
              type="button"
              onClick={() => setTxFilterMode('active_patient')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                txFilterMode === 'active_patient'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow'
                  : 'bg-slate-950 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10'
              }`}
            >
              {t('patient_history')} ({activeOrder.patientName})
            </button>
          </div>
        </div>

        {/* Controls Bar: Show Count Dropdown & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">{t('show_rows')}</span>
            <select
              value={showCount}
              onChange={(e) => setShowCount(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-bold"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Поиск:</span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchTx}
                onChange={(e) => setSearchTx(e.target.value)}
                placeholder="Поиск платежа..."
                className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Transactions History Table (Matching Screenshot Columns) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">{t('col_tx_num')}</th>
                <th className="py-2.5 px-3">{t('col_tx_id')}</th>
                <th className="py-2.5 px-3">{t('col_tx_patient')}</th>
                <th className="py-2.5 px-3">{t('col_tx_comment')}</th>
                <th className="py-2.5 px-3 font-bold">{t('col_tx_paid')}</th>
                <th className="py-2.5 px-3">{t('col_tx_discount')}</th>
                <th className="py-2.5 px-3">{t('col_tx_discount_type')}</th>
                <th className="py-2.5 px-3">{t('col_tx_payment_form')}</th>
                <th className="py-2.5 px-3">{t('col_tx_user')}</th>
                <th className="py-2.5 px-3">{t('col_tx_date')}</th>
                <th className="py-2.5 px-3 text-center">{t('col_tx_status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTx.slice(0, showCount).map((tx) => (
                <tr key={tx.num} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-center font-mono text-slate-500 font-bold">{tx.num}</td>
                  <td className="py-2.5 px-3 font-mono text-teal-400 font-bold">{tx.id}</td>
                  <td className="py-2.5 px-3 font-bold text-white">{tx.patientName}</td>
                  <td className="py-2.5 px-3 min-w-[280px]">
                    {(() => {
                      const isTestPayment = tx.comment.toLowerCase().startsWith('оплата за');
                      if (!isTestPayment) {
                        return <span className="text-slate-300 font-medium">{tx.comment}</span>;
                      }

                      const rawTests = tx.comment.replace(/^Оплата за\s*/i, '').split(/,\s*/).filter(Boolean);
                      const isExpanded = expandedTxNum === tx.num;

                      return (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-extrabold text-[11px]">
                              Оплата за:
                            </span>
                            <span className="bg-slate-950 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                              {rawTests.length} ta tahlil
                            </span>
                            <button
                              type="button"
                              onClick={() => setExpandedTxNum(isExpanded ? null : tx.num)}
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline ml-auto bg-slate-950 px-2 py-0.5 rounded border border-cyan-500/30"
                            >
                              {isExpanded ? '▲ Yopish' : '▼ Ro\'yxatni ko\'rish'}
                            </button>
                          </div>

                          {/* Compact preview when collapsed */}
                          {!isExpanded && (
                            <div className="text-[11px] text-slate-400 max-w-[280px] line-clamp-2 leading-relaxed">
                              {rawTests.slice(0, 4).join(', ')}
                              {rawTests.length > 4 && <span className="text-cyan-400 font-mono font-bold"> ... +{rawTests.length - 4} ta</span>}
                            </div>
                          )}

                          {/* Structured Badge Grid with Individual Delete Buttons when Expanded */}
                          {isExpanded && (
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 space-y-2 mt-1 shadow-2xl max-h-56 overflow-y-auto">
                              <div className="flex items-center justify-between text-[10px] text-slate-300 border-b border-slate-800 pb-1.5 font-bold">
                                <span>Tartiblangan tahlillar ro'yxati ({rawTests.length} ta):</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAddingTestForTxNum(tx.num);
                                    setCatalogSearchQuery('');
                                    setCatalogCategoryFilter('all');
                                  }}
                                  className="text-emerald-400 hover:text-emerald-300 font-extrabold text-[10px] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  + Tahlil Qo'shish
                                </button>
                              </div>

                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {rawTests.map((tName, tIdx) => (
                                  <div
                                    key={`${tName}-${tIdx}`}
                                    className="bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-teal-500/50 text-slate-200 px-2 py-1 rounded-lg text-[11px] font-sans flex items-center gap-1.5 transition-all shadow-sm group"
                                  >
                                    <span className="font-semibold text-slate-200">{tName}</span>
                                    <button
                                      type="button"
                                      onClick={() => deleteTestFromTransaction(tx.num, tName)}
                                      className="text-slate-400 group-hover:text-rose-400 font-black p-0.5 rounded hover:bg-rose-500/20 text-xs"
                                      title={`"${tName}" tahlilini ro'yxatdan o'chirish`}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="py-2.5 px-3 font-black text-emerald-400 font-mono text-sm">{tx.amount.toLocaleString()} сум</td>
                  <td className="py-2.5 px-3 text-slate-400">{tx.discount} сум</td>
                  <td className="py-2.5 px-3 text-slate-400">{tx.discountType}</td>
                  <td className="py-2.5 px-3 text-teal-300 font-semibold">{tx.paymentForm}</td>
                  <td className="py-2.5 px-3 text-slate-300">{tx.user}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{tx.date}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center text-emerald-400 gap-1 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ✕
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add ONLY Official Tests from Catalog */}
      {addingTestForTxNum !== null && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl text-white font-sans">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span className="text-emerald-400">🔬</span>
                  <span>Katalogdan Tahlil Qo'shish</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Faqat tizim tahlillar katalogida mavjud bo'lgan rasmiy tahlillarni biriktirishingiz mumkin
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddingTestForTxNum(null)}
                className="text-slate-400 hover:text-white font-bold p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={catalogSearchQuery}
                onChange={(e) => setCatalogSearchQuery(e.target.value)}
                placeholder="🔍 Tahlil nomini qidiring (masalan: OAK, ВЭБ, Глюкоза, Гормон)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                BO'LIM BO'YICHA SARALASH:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto text-xs bg-slate-950 p-2 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setCatalogCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    catalogCategoryFilter === 'all'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  🌐 Barchasi ({availableCatalogTests.length})
                </button>
                {catalogCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCatalogCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      catalogCategoryFilter === cat
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {translateCategoryName(cat, currentLanguage)}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Official Catalog Tests List */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-800/60">
              {filteredCatalogTests.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs font-mono">
                  Bunday tahlil katalogda topilmadi.
                </div>
              ) : (
                filteredCatalogTests.map(testItem => (
                  <div
                    key={testItem.id}
                    className="pt-2 flex items-center justify-between gap-3 hover:bg-slate-800/50 p-2 rounded-xl transition-colors"
                  >
                    <div className="truncate">
                      <div className="text-xs font-extrabold text-white flex items-center gap-2 truncate">
                        <span className="bg-slate-950 border border-slate-800 text-teal-400 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex-shrink-0">
                          {translateCategoryName(testItem.category, currentLanguage)}
                        </span>
                        <span className="truncate">{translateTestName(testItem.name, currentLanguage)}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        Birlik: {testItem.unit || 'birlik'} • ID: {testItem.id}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs font-mono font-extrabold text-emerald-400">
                        {testItem.price.toLocaleString()} so'm
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          addTestToTransaction(addingTestForTxNum, testItem.name);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1"
                      >
                        + Qo'shish
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAddingTestForTxNum(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Tayyor (Yopish)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
});
