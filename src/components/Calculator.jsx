import React, { useState, useEffect } from 'react';

export default function Calculator({ onSaveGoal }) {
  const [weight, setWeight] = useState(localStorage.getItem('water_weight') || '60');
  const [gender, setGender] = useState(localStorage.getItem('water_gender') || 'female');
  const [activity, setActivity] = useState(localStorage.getItem('water_activity') || 'normal');
  const [calculatedGoal, setCalculatedGoal] = useState(localStorage.getItem('water_goal') || '2000');

  useEffect(() => {
    calculateWater();
  }, [weight, activity]);

  const calculateWater = (e) => {
    if (e) e.preventDefault();
    const w = parseFloat(weight) || 0;
    const multiplier = activity === 'active' ? 40 : 30;
    const goal = w * multiplier;
    setCalculatedGoal(goal);
    localStorage.setItem('water_weight', weight);
    localStorage.setItem('water_gender', gender);
    localStorage.setItem('water_activity', activity);
    localStorage.setItem('water_goal', goal);
    if (onSaveGoal) onSaveGoal(goal);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-100 text-cyan-600 rounded-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kalkulator Kebutuhan Air</h2>
          <p className="text-sm text-slate-500">Fitur oleh Akmal - Hitung target air harian Anda</p>
        </div>
      </div>

      <form onSubmit={calculateWater} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Berat Badan (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Contoh: 55"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="female">Perempuan</option>
            <option value="male">Laki-laki</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Tingkat Aktivitas</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="normal">Normal (Multiplier 30)</option>
            <option value="active">Aktif / Olahraga (Multiplier 40)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow-md transition duration-200"
        >
          Hitung & Simpan Target
        </button>
      </form>

      <div className="mt-6 p-4 bg-cyan-50 rounded-xl border border-cyan-100 text-center">
        <span className="text-sm text-cyan-700 font-medium">Target Kebutuhan Air Anda:</span>
        <div className="text-3xl font-extrabold text-cyan-800 mt-1">{calculatedGoal} ml</div>
        <span className="text-xs text-cyan-600 mt-1 block">Tersimpan otomatis ke sistem & localStorage</span>
      </div>
    </div>
  );
}
