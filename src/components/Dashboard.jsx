import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Dashboard({ currentGoal, scheduleActive, intervalsList }) {
  const [consumed, setConsumed] = useState(Number(localStorage.getItem('water_consumed')) || 0);
  const [goal, setGoal] = useState(Number(currentGoal) || Number(localStorage.getItem('water_goal')) || 2000);
  const [syncStatus, setSyncStatus] = useState('Belum disinkronkan');

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
    try {
      setSyncStatus('Menyinkronkan...');
      const { data, error } = await supabase
        .from('water_logs')
        .insert([{ consumed: amount, goal: goal, date: new Date().toISOString().split('T')[0] }])
        .select();

      if (error) {
        console.warn('Supabase insert note:', error.message);
        setSyncStatus('Tersimpan lokal (Supabase offline)');
      } else {
        setSyncStatus('Tersinkron ke Supabase ✓');
      }
    } catch (err) {
      setSyncStatus('Tersimpan lokal');
    }
  };

  const percentage = Math.min(Math.round((consumed / goal) * 100), 100);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Dashboard Utama & Rekap Harian</h2>
          <p className="text-sm text-slate-500">Fitur oleh Inyaa - Pantau progress & sinkronisasi Supabase</p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl text-white shadow-md text-center space-y-4">
        <span className="text-xs uppercase tracking-widest font-semibold bg-white/20 px-3 py-1 rounded-full">Progress Hari Ini</span>
        
        <div className="text-5xl font-extrabold tracking-tight">
          {consumed} <span className="text-lg font-medium opacity-80">/ {goal} ml</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden p-0.5">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="text-sm font-medium">{percentage}% tercapai dari target harian</div>
      </div>

      {/* Manual Action Buttons */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-700">Tambah Konsumsi Air Manual:</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => addWater(100)}
            className="py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl border border-blue-200 transition"
          >
            +100 ml
          </button>
          <button
            onClick={() => addWater(250)}
            className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition"
          >
            +250 ml (1 Gelas)
          </button>
          <button
            onClick={() => addWater(500)}
            className="py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl border border-blue-200 transition"
          >
            +500 ml (Botol)
          </button>
        </div>
      </div>

      {/* Status & Sync Info */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-xs text-slate-600 space-y-1">
          <div>Status Jadwal: <span className={`font-bold ${scheduleActive ? 'text-emerald-600' : 'text-slate-500'}`}>{scheduleActive ? 'Aktif' : 'Non-Aktif'}</span></div>
          <div>Sinkronisasi: <span className="font-semibold text-blue-600">{syncStatus}</span></div>
        </div>
        <button
          onClick={resetWater}
          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition"
        >
          Reset Harian
        </button>
      </div>
    </div>
  );
}
