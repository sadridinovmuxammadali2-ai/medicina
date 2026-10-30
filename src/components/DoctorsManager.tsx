import React, { useState, useMemo } from 'react';
import type { Doctor } from '../types/lab';
import { UserCheck, Plus, Search, Phone, Building, Percent, Award, Trash2, Edit3, X, Save } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DoctorsManagerProps {
  doctors: Doctor[];
  onAddDoctor: (newDoctor: Doctor) => void;
  onUpdateDoctors: (updatedDoctors: Doctor[]) => void;
  onDeleteDoctor: (id: string) => void;
}

export const DoctorsManager: React.FC<DoctorsManagerProps> = React.memo(({
  doctors,
  onAddDoctor,
  onUpdateDoctors,
  onDeleteDoctor
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // Form states for adding
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('Kardiolog');
  const [workplace, setWorkplace] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [commissionRate, setCommissionRate] = useState(10);
  const [consultationFee, setConsultationFee] = useState(110000);
  const [roomNumber, setRoomNumber] = useState('101-xona');
  const [isActive, setIsActive] = useState(true);

  // Filtered doctors list
  const filteredDoctors = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return doctors.filter(d => {
      const isDocActive = d.isActive !== false;
      if (statusFilter === 'active' && !isDocActive) return false;
      if (statusFilter === 'inactive' && isDocActive) return false;

      return (
        d.fullName.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.phone.includes(searchTerm) ||
        (d.roomNumber && d.roomNumber.toLowerCase().includes(q))
      );
    });
  }, [doctors, searchTerm, statusFilter]);

  const handleToggleStatus = (docId: string) => {
    const updated = doctors.map(d => d.id === docId ? { ...d, isActive: d.isActive === false ? true : false } : d);
    onUpdateDoctors(updated);
  };

  const handleSaveNewDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const nextNum = doctors.length + 1;
    const paddedNum = nextNum.toString().padStart(3, '0');
    const newDoc: Doctor = {
      id: `DOC-${paddedNum}`,
      doctorNumber: nextNum,
      fullName: fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`,
      specialty,
      workplace: workplace || 'Mutaxassislik Klinikasi',
      phone,
      commissionRate: Number(commissionRate),
      totalReferrals: 0,
      isActive,
      consultationFee: Number(consultationFee),
      roomNumber: roomNumber || '101-xona',
      categoryModule: 'priem'
    };

    onAddDoctor(newDoc);
    setIsAddModalOpen(false);
    setFullName('');
    setWorkplace('');
    alert(`✅ Yangi Shifokor (${newDoc.fullName}) kiritildi! Biriktirilgan ID: ${newDoc.id}`);
  };

  const handleSaveEditDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    const updated = doctors.map(d => d.id === editingDoctor.id ? editingDoctor : d);
    onUpdateDoctors(updated);
    setEditingDoctor(null);
    alert(`✅ Shifokor (${editingDoctor.id}) ma'lumotlari yangilandi!`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-teal-400" />
            {t('doc_mgr_title')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('doc_mgr_desc')}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          {t('btn_add_doctor')}
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">{t('stat_total_doctors')}</span>
            <strong className="text-lg font-extrabold text-white">{doctors.length} nafar</strong>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">{t('stat_total_referred')}</span>
            <strong className="text-lg font-extrabold text-emerald-400">
              {doctors.reduce((s, d) => s + (d.totalReferrals || 0), 0)} ta
            </strong>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">{t('stat_avg_bonus')}</span>
            <strong className="text-lg font-extrabold text-amber-400">10%</strong>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-2/3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Shifokor ID (DOC-001), F.I.SH, Mutaxassisligi, Xona № yoki Telefon..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full md:w-auto justify-center">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('filter_all')} ({doctors.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'active'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🟢 {t('filter_active')} ({doctors.filter(d => d.isActive !== false).length})
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'inactive'
                ? 'bg-rose-500 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔴 {t('filter_inactive')} ({doctors.filter(d => d.isActive === false).length})
          </button>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-4">{t('col_doc_id')}</th>
                <th className="py-3 px-4">{t('col_doc_name')}</th>
                <th className="py-3 px-4">{t('col_specialty_room')}</th>
                <th className="py-3 px-4">{t('col_fee')}</th>
                <th className="py-3 px-4">{t('col_workplace')}</th>
                <th className="py-3 px-4">{t('col_phone')}</th>
                <th className="py-3 px-4 text-center">{t('col_status_hdr')}</th>
                <th className="py-3 px-4 text-center">{t('col_bonus')}</th>
                <th className="py-3 px-4 text-center">{t('col_patients_count')}</th>
                <th className="py-3 px-4 text-right">{t('col_actions_hdr')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDoctors.map(doc => {
                const isDocActive = doc.isActive !== false;
                return (
                  <tr key={doc.id} className={`hover:bg-slate-800/50 transition-colors ${!isDocActive ? 'opacity-60 bg-rose-950/10' : ''}`}>
                    <td className="py-3 px-4">
                      <span className="bg-teal-500/20 text-teal-300 font-mono font-black text-xs px-2.5 py-1 rounded-md border border-teal-500/30">
                        {doc.id}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      <div>{doc.fullName}</div>
                      {doc.categoryModule && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                          Modul: {doc.categoryModule.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-teal-400 font-semibold">
                      <div>{doc.specialty}</div>
                      <div className="text-[10px] text-amber-300/80 font-mono flex items-center gap-1 mt-0.5">
                        📍 {doc.roomNumber || '101-xona'}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400 font-mono">
                      {(doc.consultationFee || 110000).toLocaleString()} so'm
                    </td>
                    <td className="py-3 px-4 text-slate-300 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      {doc.workplace || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {doc.phone}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(doc.id)}
                        title="Bosib holatini o'zgartiring (Faol / Nofaol)"
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all border ${
                          isDocActive
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30'
                        }`}
                      >
                        {isDocActive ? '🟢 Faol' : '🔴 Nofaol'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-amber-400">
                      {doc.commissionRate || 10}%
                    </td>
                    <td className="py-3 px-4 text-center font-black text-cyan-400 font-mono">
                      {doc.totalReferrals || 0} ta
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingDoctor(doc)}
                          className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Tahrirlash
                        </button>
                        <button
                          onClick={() => onDeleteDoctor(doc.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
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

      {/* POPUP MODAL: ADD DOCTOR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-400" />
                Yangi Shifokor Ro'yxatga Olish (Auto ID)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewDoctor} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Shifokor F.I.SH:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Dr. Axmedov Murod"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Mutaxassisligi:</label>
                  <input
                    type="text"
                    required
                    placeholder="Kardiolog, Endokrinolog..."
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Telefon raqami:</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Xona № (Kabinet):</label>
                  <input
                    type="text"
                    placeholder="204-xona (Bino A)"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Qabul Narxi (so'm):</label>
                  <input
                    type="number"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Ish Joyi / Shifoxona:</label>
                  <input
                    type="text"
                    placeholder="1-Shahar Shifoxonasi"
                    value={workplace}
                    onChange={(e) => setWorkplace(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Bonus Foizi (%):</label>
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-bold"
                  />
                </div>
              </div>

              {/* Status Switch Checkbox */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Qabul Statusi (Holati)</span>
                  <span className="text-[11px] text-slate-400">Faol shifokorlar bemorlar qabulida ko'rinadi</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className={`font-extrabold text-xs ${isActive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isActive ? '🟢 FAOL' : '🔴 NOFAOL'}
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  + Saqlash
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* POPUP MODAL: EDIT DOCTOR */}
      {editingDoctor && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                Shifokor Ma'lumotlarini Tahrirlash ({editingDoctor.id})
              </h3>
              <button
                onClick={() => setEditingDoctor(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDoctor} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Shifokor F.I.SH:</label>
                <input
                  type="text"
                  required
                  value={editingDoctor.fullName}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Mutaxassisligi:</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.specialty}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Telefon raqami:</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.phone}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Xona № (Kabinet):</label>
                  <input
                    type="text"
                    value={editingDoctor.roomNumber || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, roomNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Qabul Narxi (so'm):</label>
                  <input
                    type="number"
                    value={editingDoctor.consultationFee || 110000}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, consultationFee: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Ish Joyi:</label>
                  <input
                    type="text"
                    value={editingDoctor.workplace || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, workplace: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Bonus Foizi (%):</label>
                  <input
                    type="number"
                    value={editingDoctor.commissionRate || 10}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, commissionRate: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-bold"
                  />
                </div>
              </div>

              {/* Status Switch Checkbox */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Qabul Statusi (Holati)</span>
                  <span className="text-[11px] text-slate-400">Faol shifokorlar qabulida ko'rinadi</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDoctor.isActive !== false}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, isActive: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className={`font-extrabold text-xs ${editingDoctor.isActive !== false ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {editingDoctor.isActive !== false ? '🟢 FAOL' : '🔴 NOFAOL'}
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  Saqlash
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
});
