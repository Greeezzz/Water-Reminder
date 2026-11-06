import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard({ currentGoal, scheduleActive }) {
  const { user } = useAuth();
  const [consumed, setConsumed] = useState(Number(localStorage.getItem('water_consumed')) || 0);
  const [goal, setGoal] = useState(Number(currentGoal) || Number(localStorage.getItem('water_goal')) || 2000);
  const [syncStatus, setSyncStatus] = useState('Terhubung ke sistem lokal');

  useEffect(() => {
    if (currentGoal) {
      setGoal(Number(currentGoal));
    }
  }, [currentGoal]);

  useEffect(() => {
    localStorage.setItem('water_consumed', consumed);
  }, [consumed]);

  const addWater = (amount) => {
    const newConsumed = consumed + amount;
    setConsumed(newConsumed);
    syncToSupabase(newConsumed);
  };

  const resetWater = () => {
    setConsumed(0);
    localStorage.setItem('water_consumed', 0);
  };

  const syncToSupabase = async (amount) => {
    if (!user) return; // Skip if no user logged in
    
    try {
      setSyncStatus('Menyinkronkan ke Supabase...');
      const { error } = await supabase
        .from('water_logs')
        .insert([{ 
          user_id: user.id,
          amount: amount,
          logged_at: new Date().toISOString()
        }]);

      if (error) {
        console.warn('Supabase insert error:', error.message);
        setSyncStatus('Tersimpan lokal (Supabase offline)');
      } else {
        setSyncStatus('Tersinkron ke Supabase ✓');
      }
    } catch (err) {
      setSyncStatus('Tersimpan lokal');
    }
  };

  const percentage = Math.min(Math.round((consumed / goal) * 100), 100);

  const getProgressColor = (pct) => {
  if (pct >= 100) return '#22C55E'; // hijau: tercapai
  if (pct >= 70) return '#09BAED';  // biru: hampir
  if (pct >= 40) return '#FACC15';  // kuning: setengah jalan
  return '#FB7185';                 // merah muda: masih sedikit
  };
  const progressColor = getProgressColor(percentage);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-[#BFE9F5] space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#BFE9F5] pb-6">
          <div>
            <h2 className="text-3xl font-black text-[#033F4F]">Dashboard Utama</h2>
            <p className="text-sm text-[#055F78] font-semibold mt-1">Pantau rekapitulasi hidrasi harian kamu</p>
          </div>
          <div className="px-5 py-2.5 bg-[#EAF8FD] border-2 border-[#09BAED] text-[#033F4F] rounded-2xl font-bold">
            🎯 {goal} ml
          </div>
        </div>

        {/* Progress Card */}
        <div className="p-8 bg-gradient-to-br from-[#055F78] to-[#067FA1] rounded-3xl shadow-2xl space-y-6">
          <span 
            className="inline-block text-xs uppercase tracking-widest font-extrabold px-4 py-1.5 rounded-full text-[#033F4F]"
            style={{ backgroundColor: progressColor }}
          >
            Progress Hari Ini
          </span>

          <div className="space-y-2">
            <div 
              className="text-7xl font-black drop-shadow-lg"
              style={{ color: progressColor }}
            >
              {consumed} <span className="text-3xl font-bold">/ {goal} ml</span>
            </div>
            <p 
              className="text-base font-semibold"
              style={{ color: progressColor }}
            >
              {percentage >= 100
                ? '🎉 Target tercapai! Luar biasa!'
                : `Kurang ${Math.max(0, goal - consumed)} ml lagi untuk mencapai target.`}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full rounded-full h-6 overflow-hidden p-1.5" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${percentage}%`,
                minWidth: percentage > 0 ? '12px' : '0',
                backgroundColor: progressColor,
                boxShadow: `0 0 20px ${progressColor}`,
              }}
            ></div>
          </div>

          <div 
            className="flex justify-between items-center text-sm font-bold"
            style={{ color: progressColor }}
          >
            <span>0%</span>
            <span
              className="text-base font-black px-4 py-1.5 rounded-full text-[#033F4F]"
              style={{ backgroundColor: progressColor }}
            >
              {percentage}%
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#033F4F]">💧 Tambah Konsumsi Air Cepat</h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => addWater(100)}
              className="py-4 bg-[#EAF8FD] hover:bg-[#09BAED]/20 text-[#055F78] font-bold rounded-2xl border-2 border-[#09BAED]/50 hover:border-[#09BAED] transition-all active:scale-95"
            >
              <div className="text-2xl font-black">+100</div>
              <div className="text-xs font-semibold opacity-80">ml</div>
            </button>
            <button
              onClick={() => addWater(250)}
              className="py-4 bg-[#09BAED] hover:bg-[#08A0C9] text-[#033F4F] font-bold rounded-2xl shadow-lg transition-all active:scale-95"
            >
              <div className="text-2xl font-black">+250</div>
              <div className="text-xs font-semibold opacity-90">ml (1 Gelas)</div>
            </button>
            <button
              onClick={() => addWater(500)}
              className="py-4 bg-[#EAF8FD] hover:bg-[#09BAED]/20 text-[#055F78] font-bold rounded-2xl border-2 border-[#09BAED]/50 hover:border-[#09BAED] transition-all active:scale-95"
            >
              <div className="text-2xl font-black">+500</div>
              <div className="text-xs font-semibold opacity-80">ml (1 Botol)</div>
            </button>
          </div>
        </div>

        {/* Status Section */}
        <div className="p-6 bg-[#EAF8FD] rounded-2xl border-2 border-[#BFE9F5] space-y-4">
          <h3 className="text-lg font-bold text-[#033F4F]">📊 Status & Kontrol</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-[#09BAED]/30">
              <span className="text-sm font-bold text-[#033F4F]">Status Jadwal</span>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${scheduleActive ? 'bg-[#09BAED] text-[#033F4F]' : 'bg-slate-300 text-[#055F78]'}`}>
                {scheduleActive ? '✓ Aktif' : '✕ Non-Aktif'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-[#09BAED]/30">
              <span className="text-sm font-bold text-[#033F4F]">Sinkronisasi</span>
              <span className="text-xs font-bold text-[#067FA1]">{syncStatus}</span>
            </div>
          </div>
          <button
            onClick={resetWater}
            className="w-full py-3 bg-white hover:bg-rose-50 border-2 border-rose-300 hover:border-rose-500 text-rose-700 font-bold rounded-xl transition-all active:scale-95"
          >
            ↺ Reset Harian
          </button>
        </div>
      </div>
    </div>
  );
}
