import React, { useState, useEffect } from 'react';
import { Droplet, User, Activity, Scale, CheckCircle2 } from 'lucide-react';

export default function Calculator({ onSaveGoal }) {
  const [weight, setWeight] = useState(localStorage.getItem('water_weight') || '60');
  const [gender, setGender] = useState(localStorage.getItem('water_gender') || 'female');
  const [activity, setActivity] = useState(localStorage.getItem('water_activity') || 'normal');
  const [glassSize, setGlassSize] = useState(localStorage.getItem('water_glass_size') || '250');
  const [calculatedGoal, setCalculatedGoal] = useState(localStorage.getItem('water_goal') || '2000');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    calculateWater();
  }, [weight, gender, activity, glassSize]);

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
    localStorage.setItem('water_glass_size', glassSize);
    localStorage.setItem('water_goal', goal);
    if (onSaveGoal) onSaveGoal(goal);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const gSize = parseInt(glassSize) || 250;
  const totalGlasses = (calculatedGoal / gSize).toFixed(1);
  const hourlyRate = Math.round(calculatedGoal / 14); // Asumsi 14 jam aktif

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 max-w-xl mx-auto text-left">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-100 text-cyan-600 rounded-2xl shadow-xs">
          <Droplet className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Kalkulator Kebutuhan Air</h2>
          <p className="text-sm text-slate-500">Fitur oleh Akmal - Hitung target air harian Anda</p>
        </div>
      </div>

      <form onSubmit={calculateWater} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-600" /> Berat Badan (kg)
          </label>
          <input
            type="number"
            step="0.1"
            min="10"
            max="300"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            placeholder="Contoh: 55"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-600" /> Jenis Kelamin
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
          >
            <option value="female">Perempuan</option>
            <option value="male">Laki-laki</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
            <span className="text-cyan-600 font-bold">🥛</span> Ukuran Gelas / Botol
          </label>
          <select
            value={glassSize}
            onChange={(e) => setGlassSize(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
          >
            <option value="200">Gelas Kecil (200 ml)</option>
            <option value="250">Gelas Standar (250 ml)</option>
            <option value="300">Gelas Besar (300 ml)</option>
            <option value="500">Tumblr / Botol (500 ml)</option>
            <option value="600">Botol Sedang (600 ml)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-600" /> Tingkat Aktivitas
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
          >
            <option value="normal">Normal / Sedenter ({gender === 'male' ? '35' : '31'} ml/kg - EFSA)</option>
            <option value="active">Aktif / Olahraga ({gender === 'male' ? '40' : '38'} ml/kg - EFSA)</option>
          </select>
          <p className="text-xs text-slate-500 mt-1.5">
            * Rumus EFSA/NIH: Berat Badan × {gender === 'male' ? (activity === 'active' ? '40' : '35') : (activity === 'active' ? '38' : '31')} ml
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
        >
          <Droplet className="w-5 h-5" /> Hitung & Simpan Target
        </button>
      </form>

      <div className="mt-6 p-6 bg-cyan-50/80 border border-cyan-100 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-cyan-900">Target Kebutuhan Air Harian:</span>
          {saved && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" /> Terupdate!
            </span>
          )}
        </div>
        <div className="text-3xl font-extrabold text-cyan-700">
          {Number(calculatedGoal).toLocaleString('id-ID')} ml <span className="text-lg font-normal text-slate-600">({(calculatedGoal / 1000).toFixed(2)} Liter)</span>
        </div>

        {/* Breakdown details */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-cyan-200/60">
          <div className="p-3.5 bg-white rounded-2xl border border-cyan-100 shadow-xs">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              🥛 Setara Gelas ({glassSize} ml):
            </span>
            <div className="text-lg font-extrabold text-slate-800 mt-1">
              ~ {totalGlasses} Gelas <span className="text-xs font-normal text-slate-500">({Math.round(totalGlasses)} gelas)</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-cyan-100 shadow-xs">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              ⏱️ Rekomendasi Per Jam:
            </span>
            <div className="text-lg font-extrabold text-slate-800 mt-1">
              ~ {hourlyRate} ml <span className="text-xs font-normal text-slate-500">/ jam (14 jam)</span>
            </div>
          </div>
        </div>

        <span className="text-xs text-cyan-900/80 block pt-1 leading-relaxed">
          * Tips: Bagi konsumsi air secara berkala (1 gelas setiap 1.5 - 2 jam) dari pagi hingga malam hari.
        </span>
      </div>
    </div>
  );
}
