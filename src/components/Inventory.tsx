import React, { useState } from 'react';
import type { Reagent } from '../types/lab';
import { AlertTriangle, Plus, CheckCircle, Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translateCategoryName } from '../utils/categoryTranslator';

interface InventoryProps {
  reagents: Reagent[];
  onAddReagent: (newReagent: Reagent) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ reagents, onAddReagent }) => {
  const { currentLanguage, t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [catalogNumber, setCatalogNumber] = useState('');
  const [category, setCategory] = useState('Biokimyo');
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState('flakon');
  const [minQuantity] = useState(3);
  const [expiryDate, setExpiryDate] = useState('2027-01-01');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReagent: Reagent = {
      id: `r-${Date.now()}`,
      name,
      catalogNumber,
      category,
      quantity: Number(quantity),
      unit,
      minQuantity: Number(minQuantity),
      expiryDate,
      status: Number(quantity) <= Number(minQuantity) ? 'low' : 'ok'
    };
    onAddReagent(newReagent);
    setShowAddForm(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-400" />
            {t('inv_title')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('inv_subtitle')}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? t('btn_close') : t('btn_add_reagent')}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-teal-500/30 rounded-2xl p-5 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            {t('form_new_reagent')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t('reagent_name')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="masalan: Mindray BC-5300 Lyse"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t('catalog_num')}</label>
              <input
                type="text"
                required
                value={catalogNumber}
                onChange={(e) => setCatalogNumber(e.target.value)}
                placeholder="RE-MIN-902"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t('reagent_category')}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
              >
                <option value="Gematologiya">{translateCategoryName('Gematologiya', currentLanguage)}</option>
                <option value="Biokimyo">{translateCategoryName('Biokimyo', currentLanguage)}</option>
                <option value="Gormonlar">{translateCategoryName('Gormonlar', currentLanguage)}</option>
                <option value="PZR va Ekspress">{translateCategoryName('PZR va Ekspress', currentLanguage)}</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t('stock_qty')}</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t('unit_of_measure')}</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="L, quti, flakon"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t('expiry_date')}</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2 rounded-xl text-xs cursor-pointer shadow-md transition-all"
          >
            {t('save_btn')}
          </button>
        </form>
      )}

      {/* Reagents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-3">{t('reagent_name_col')}</th>
                <th className="py-3 px-3">{t('reagent_category')}</th>
                <th className="py-3 px-3">{t('available_qty_col')}</th>
                <th className="py-3 px-3">{t('expiry_date')}</th>
                <th className="py-3 px-3">{t('col_status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {reagents.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-white">
                    <div>{item.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{item.catalogNumber}</div>
                  </td>
                  <td className="py-3 px-3 text-teal-400 font-semibold">
                    {translateCategoryName(item.category, currentLanguage)}
                  </td>
                  <td className="py-3 px-3 font-bold text-sm">
                    <span className={item.status === 'low' ? 'text-amber-400 font-mono' : 'text-white font-mono'}>
                      {item.quantity} {item.unit}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono">Min: {item.minQuantity} {item.unit}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">{item.expiryDate}</td>
                  <td className="py-3 px-3">
                    {item.status === 'ok' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" /> {t('status_ok')}
                      </span>
                    )}
                    {item.status === 'low' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <AlertTriangle className="w-3 h-3" /> {t('status_low')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

