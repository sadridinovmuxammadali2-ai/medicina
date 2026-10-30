import React, { useState } from 'react';
import type { TestOrder } from '../types/lab';
import { PATIENT_HEMOGLOBIN_TREND } from '../data/mockData';
import { Smartphone, Bell, CheckCircle2, FileText, TrendingUp, Heart, User } from 'lucide-react';

interface MobileSimulatorProps {
  orders: TestOrder[];
  onSelectOrder: (order: TestOrder) => void;
  onNavigate: (tab: string) => void;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  orders,
  onSelectOrder,
  onNavigate
}) => {
  const [appRole, setAppRole] = useState<'patient' | 'doctor'>('patient');
  const [showNotification, setShowNotification] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-4">
      {/* Description Header */}
      <div className="text-center max-w-xl">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          SmartLab Mobile App (Bemor va Shifokor Ilovasi)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Ushbu mobil ilova orqali bemorlar tahlil natijalarini real-vaqt rejimida ko'rishadi, push-xabarnoma olishadi va o'z salomatlik ko'rsatkichlari dinamikasini kuzatishadi.
        </p>

        {/* Role switcher inside mobile simulator */}
        <div className="flex justify-center gap-2 mt-3 text-xs">
          <button
            onClick={() => setAppRole('patient')}
            className={`px-3 py-1 rounded-full font-bold transition-all ${
              appRole === 'patient' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400'
            }`}
          >
            👤 Bemor Mobil Kabineti
          </button>
          <button
            onClick={() => setAppRole('doctor')}
            className={`px-3 py-1 rounded-full font-bold transition-all ${
              appRole === 'doctor' ? 'bg-teal-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400'
            }`}
          >
            🩺 Yo'naltiruvchi Shifokor Kabineti
          </button>
        </div>
      </div>

      {/* Realistic Smartphone Device Frame */}
      <div className="w-[340px] h-[680px] bg-slate-950 rounded-[44px] p-3 border-4 border-slate-700 shadow-2xl relative flex flex-col justify-between overflow-hidden shadow-emerald-500/10">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
        </div>

        {/* Phone Content Screen */}
        <div className="w-full h-full bg-slate-900 rounded-[34px] overflow-y-auto text-slate-100 flex flex-col pt-7 pb-4 px-3 space-y-3 relative text-xs">
          
          {/* Simulated Push Notification Banner */}
          {showNotification && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-3 text-emerald-200 animate-slideDown shadow-lg relative">
              <button
                onClick={() => setShowNotification(false)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white text-[10px]"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                <Bell className="w-4 h-4 text-emerald-400 animate-bounce" /> Push Bildirishnoma
              </div>
              <p className="text-[11px] leading-tight">
                Sizning <strong>Qon umumiy tahlili</strong> natijangiz tayyor bo'ldi! PDF blankani ochish uchun bosing.
              </p>
            </div>
          )}

          {/* App Header Bar inside Phone */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {appRole === 'patient' ? 'JA' : 'DS'}
              </div>
              <div>
                <div className="font-bold text-white text-xs">
                  {appRole === 'patient' ? 'Jamshid Alimov' : 'Dr. Karimov S.'}
                </div>
                <div className="text-[10px] text-teal-400">
                  {appRole === 'patient' ? 'ID: PAT-1082' : 'Kardiolog'}
                </div>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 relative">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500"></span>
            </div>
          </div>

          {appRole === 'patient' ? (
            /* Patient View Content */
            <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
              
              {/* Quick Health Status Card */}
              <div className="bg-gradient-to-r from-teal-900/60 to-emerald-900/60 border border-teal-500/30 rounded-2xl p-3.5 text-white">
                <div className="flex justify-between items-center text-[10px] text-teal-300 font-semibold mb-1">
                  <span>SALOMATLIK INDEXI</span>
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                </div>
                <div className="text-base font-bold">Barcha ko'rsatkichlar barqaror</div>
                <p className="text-[10px] text-slate-300 mt-1">
                  Oxirgi tahlil: 16-Avgust 2026 y.
                </p>
              </div>

              {/* Hemoglobin Trend Chart */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold text-white">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Gemoqlobin Dinamikasi
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">142 g/L</span>
                </div>

                {/* SVG Line Trend Graph */}
                <div className="h-20 w-full flex items-end justify-between px-2 pt-4 relative border-b border-slate-800">
                  {PATIENT_HEMOGLOBIN_TREND.map((point, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 group">
                      <div
                        style={{ height: `${(point.val / 160) * 100}%` }}
                        className="w-2.5 bg-gradient-to-t from-teal-600 to-emerald-400 rounded-t-full transition-all group-hover:bg-emerald-300"
                      ></div>
                      <span className="text-[9px] text-slate-400 font-mono">{point.val}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 px-1">
                  <span>Sent</span>
                  <span>Dek</span>
                  <span>Mart</span>
                  <span className="text-emerald-400 font-bold">Bugun</span>
                </div>
              </div>

              {/* Patient Test Results List */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-300 flex justify-between">
                  <span>Tahlillar Tarixi</span>
                  <span className="text-[10px] text-teal-400">{orders.length} ta</span>
                </div>

                {orders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      onSelectOrder(o);
                      onNavigate('blank');
                    }}
                    className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white text-[11px]">{o.testName}</div>
                      <div className="text-[10px] text-slate-400">{o.createdAt}</div>
                    </div>

                    <div className="text-right">
                      {o.status === 'tasdiqlangan' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Tayyor
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          ⏳ Jarayonda
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Doctor View Content */
            <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
              <div className="bg-teal-900/40 border border-teal-500/30 rounded-2xl p-3 text-white">
                <div className="text-[10px] text-teal-300 font-semibold uppercase">Yo'naltirgan Bemorlarim</div>
                <div className="text-lg font-bold">14 nafar bemor</div>
                <div className="text-[10px] text-emerald-400 mt-1">Bugungi bonus: +180 000 so'm</div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-300">Oxirgi Bemorlarim</div>
                {orders.map((o) => (
                  <div key={o.id} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold text-white text-[11px]">
                      <span>{o.patientName}</span>
                      <span className="text-teal-400">{o.testName}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Holat: {o.status === 'tasdiqlangan' ? '✓ Tayyor' : 'Jarayonda'}</span>
                      <span className="text-emerald-400">PDF ko'rish →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom App Navigation Bar */}
          <div className="border-t border-slate-800 pt-2 flex justify-around text-slate-400 text-[9px] font-semibold">
            <button className="flex flex-col items-center text-teal-400">
              <Heart className="w-4 h-4" /> Bosh sahifa
            </button>
            <button className="flex flex-col items-center hover:text-white">
              <FileText className="w-4 h-4" /> Tahlillar
            </button>

            <button className="flex flex-col items-center hover:text-white">
              <User className="w-4 h-4" /> Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
