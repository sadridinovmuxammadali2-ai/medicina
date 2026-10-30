import React, { memo } from 'react';
import { Activity, Laptop, Smartphone, Building2, Clock, CheckCircle2, AlertCircle, Trash2, Globe, Sun, Moon } from 'lucide-react';
import { useLanguage, type LanguageCode } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  viewMode: 'desktop' | 'mobile' | 'split';
  setViewMode: (mode: 'desktop' | 'mobile' | 'split') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: {
    todayOrders: number;
    pendingCount: number;
    completedCount: number;
    citoCount: number;
  };
  onClearOrders: () => void;
}

export const Header: React.FC<HeaderProps> = memo(({
  viewMode,
  setViewMode,
  activeTab,
  setActiveTab,
  stats,
  onClearOrders
}) => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header data-aos="fade-down" data-aos-duration="650" className="app-header bg-slate-950/80 backdrop-blur-2xl text-white border-b border-slate-800/80 sticky top-0 z-50 shadow-2xl shadow-slate-950/50">
      {/* Top Status Bar & Language Selector */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between text-xs border-b border-slate-800/60 text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SmartLab LIMS v3.4 Live
          </span>

          {/* Interactive Branch Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1 text-white font-bold shadow-inner hover:border-slate-700 transition-colors">
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
            <select
              value={localStorage.getItem('smartlab_activeBranchId') || 'BR-01'}
              onChange={(e) => {
                localStorage.setItem('smartlab_activeBranchId', e.target.value);
                window.location.reload();
              }}
              className="bg-transparent text-teal-300 font-extrabold focus:outline-none cursor-pointer text-xs"
              title="Aktiv Filialni Tanlash"
            >
              <option value="BR-01" className="bg-slate-900 text-white font-bold">🏢 Markaziy Laboratoriya (Toshkent)</option>
              <option value="BR-02" className="bg-slate-900 text-white font-bold">🏢 Chilonzor Diagnostika Filiali</option>
              <option value="BR-03" className="bg-slate-900 text-white font-bold">🏢 Samarqand Markaziy Filiali</option>
              <option value="BR-04" className="bg-slate-900 text-white font-bold">🏢 Farg'ona Qabul Punkt Filiali</option>
            </select>
          </div>

          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1 text-white font-bold shadow-inner hover:border-slate-700 transition-colors">
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-white font-extrabold focus:outline-none cursor-pointer text-xs"
            >
              <option value="UZB" className="bg-slate-900 text-white font-bold">🇺🇿 UZB (O'zbekcha)</option>
              <option value="RUS" className="bg-slate-900 text-white font-bold">🇷🇺 RUS (Русский)</option>
              <option value="ENG" className="bg-slate-900 text-white font-bold">🇬🇧 ENG (English)</option>
              <option value="TUR" className="bg-slate-900 text-white font-bold">🇹🇷 TUR (Türkçe)</option>
              <option value="KGZ" className="bg-slate-900 text-white font-bold">🇰🇬 KGZ (Кыргызча)</option>
            </select>
          </div>

          {/* Dark / Light Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1 text-xs font-bold text-teal-300 hover:text-white hover:border-teal-500/50 transition-all cursor-pointer shadow-inner"
            title="Tungi / Kunduzgi rejimni o'zgartirish"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>☀️ Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>🌙 Dark</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 font-semibold">
          <span className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {t('queue_count')} <strong className="text-white font-mono">{stats.pendingCount} ta</strong>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            {t('cito_count')} <strong className="text-rose-400 font-mono">{stats.citoCount} ta</strong>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {t('completed_today')} <strong className="text-white font-mono">{stats.completedCount} ta</strong>
          </span>
          <button
            onClick={onClearOrders}
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1 rounded-xl border border-rose-500/30 transition-all font-bold cursor-pointer active:scale-95 shadow-sm"
            title="Barcha bemorlar va tahlillar ro'yxatini tozalash"
          >
            <Trash2 className="w-3.5 h-3.5" /> {t('clear_list')}
          </button>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-cyan-400 flex items-center justify-center shadow-[0_0_25px_rgba(20,184,166,0.35)] text-slate-950 font-black">
            <Activity className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-lg font-black bg-gradient-to-r from-white via-slate-100 to-teal-300 bg-clip-text text-transparent flex items-center gap-2 tracking-tight">
              SmartLab LIMS
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-teal-500/30 tracking-wider">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">{t('app_subtitle')}</p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop mode) */}
        {viewMode !== 'mobile' && (
          <nav className="flex items-center bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-semibold overflow-x-auto shadow-inner">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              {t('nav_dashboard')}
            </button>
            <button
              onClick={() => setActiveTab('registration')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'registration'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              {t('nav_registration')}
            </button>
            <button
              onClick={() => setActiveTab('cashier')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'cashier'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              {t('nav_cashier')}
            </button>
            <button
              onClick={() => setActiveTab('workstation')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'workstation'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              {t('nav_workstation')}
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'doctors'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              {t('nav_doctors')}
            </button>
            <button
              onClick={() => setActiveTab('blank')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'blank'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              {t('nav_blank')}
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              {t('nav_catalog')}
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              {t('nav_inventory')}
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'text-purple-300 hover:text-purple-100 hover:bg-purple-900/30'
              }`}
            >
              {t('nav_admin')}
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            </button>
          </nav>
        )}

        {/* View Mode Switcher (PC / Mobile App Simulator / Split View) */}
        <div className="flex items-center bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-semibold shadow-inner">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              viewMode === 'desktop' ? 'bg-slate-800 text-teal-300 border border-teal-500/30 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            {t('pc_panel')}
          </button>

          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              viewMode === 'mobile' ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            {t('mobile_app')}
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
              viewMode === 'split' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('split_view')}
          </button>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
