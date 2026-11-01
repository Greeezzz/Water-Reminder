import React, { useState, useEffect } from 'react';
import { Droplet, User, Activity, Scale, CheckCircle2 } from 'lucide-react';

export default function Calculator({ onSaveGoal }) {
  const [weight, setWeight] = useState(localStorage.getItem('water_weight') || '60');
  const [gender, setGender] = useState(localStorage.getItem('water_gender') || 'female');
  const [activity, setActivity] = useState(localStorage.getItem('water_activity') || 'normal');
  const [calculatedGoal, setCalculatedGoal] = useState(localStorage.getItem('water_goal') || '2000');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    calculateWater();
  }, [weight, activity]);

  const calculateWater = (e) => {
    if (e) e.preventDefault();
    const w = parseFloat(weight) || 0;
    
    // Formula ilmiah berdasarkan standar EFSA (European Food Safety Authority) & NIH / NASEM:
    // - Perempuan: Normal 31 ml/kg, Aktif 38 ml/kg
    // - Laki-laki: Normal 35 ml/kg, Aktif 40 ml/kg
    let multiplier = 31;
    if (gender === 'male') {
      multiplier = activity === 'active' ? 40 : 35;
    } else {
      multiplier = activity === 'active' ? 38 : 31;
    }

    const goal = Math.round(w * multiplier);
    setCalculatedGoal(goal);
    localStorage.setItem('water_weight', weight);
    localStorage.setItem('water_gender', gender);
    localStorage.setItem('water_activity', activity);
    localStorage.setItem('water_goal', goal);
    if (onSaveGoal) onSaveGoal(goal);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 max-w-xl mx-auto text-left">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 rounded-xl">
          <Droplet className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Kalkulator Kebutuhan Air</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Fitur oleh Akmal - Hitung target air harian Anda</p>
        </div>
      </div>

      <form onSubmit={calculateWater} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-500" /> Berat Badan (kg)
          </label>
          <input
            type="number"
            step="0.1"
            min="10"
            max="300"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Contoh: 55"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-500" /> Jenis Kelamin
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="female">Perempuan</option>
            <option value="male">Laki-laki</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" /> Tingkat Aktivitas
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="normal">Normal / Sedenter ({gender === 'male' ? '35' : '31'} ml/kg - EFSA Standar)</option>
            <option value="active">Aktif / Olahraga ({gender === 'male' ? '40' : '38'} ml/kg - EFSA Standar)</option>
          </select>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            * Rumus Ilmiah EFSA/NIH: Berat Badan × {gender === 'male' ? (activity === 'active' ? '40' : '35') : (activity === 'active' ? '38' : '31')} ml
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
        >
          <Droplet className="w-5 h-5" /> Hitung & Simpan Target
        </button>
      </form>

      <div className="mt-6 p-5 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/50 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-cyan-800 dark:text-cyan-300">Target Kebutuhan Air Anda:</span>
          {saved && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Terupdate!
            </span>
          )}
        </div>
        <div className="text-3xl font-extrabold text-cyan-700 dark:text-cyan-200">
          {Number(calculatedGoal).toLocaleString('id-ID')} ml <span className="text-lg font-normal text-zinc-600 dark:text-zinc-400">({(calculatedGoal / 1000).toFixed(2)} Liter)</span>
        </div>
        <span className="text-xs text-cyan-900 dark:text-cyan-300 mt-2 block">
          Tersimpan otomatis ke sistem & localStorage untuk dashboard dan jadwal.
        </span>
      </div>
    </div>
  );
}
