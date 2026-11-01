import React, { useState, useEffect } from 'react';
import { Droplet, User, Activity, Scale, CheckCircle2 } from 'lucide-react';

export default function AkmalCalculator({ onSave }) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('normal'); // 'normal' (30) or 'active' (40)
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load existing data from localStorage if available
    const savedData = localStorage.getItem('water_user_profile');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setName(parsed.name || '');
        setGender(parsed.gender || 'male');
        setWeight(parsed.weight || '');
        setActivityLevel(parsed.activityLevel || 'normal');
        setResult(parsed.targetWater || null);
      } catch (e) {
        console.error('Error parsing saved profile', e);
      }
    }
  }, []);

  const handleCalculate = (e) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!w || w <= 0) {
      alert('Masukkan berat badan yang valid!');
      return;
    }

    // Logika Perhitungan sesuai PRD:
    // Total Air (ml) = Berat Badan (kg) * Multiplier (30 untuk normal, 40 untuk aktif)
    const multiplier = activityLevel === 'active' ? 40 : 30;
    const totalWaterMl = w * multiplier;

    const profileData = {
      name,
      gender,
      weight: w,
      activityLevel,
      multiplier,
      targetWater: totalWaterMl,
      updatedAt: new Date().toISOString()
    };

    setResult(totalWaterMl);
    localStorage.setItem('water_user_profile', JSON.stringify(profileData));
    localStorage.setItem('water_target_ml', totalWaterMl.toString());

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    if (onSave) {
      onSave(profileData);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 text-left">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 rounded-xl">
          <Droplet className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Kalkulator Kebutuhan Air</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Fitur 1 (Akmal) - Hitung target harian air minum Anda</p>
        </div>
      </div>

      <form onSubmit={handleCalculate} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-500" /> Nama Panggilan
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Akmal"
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" /> Jenis Kelamin
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`py-2.5 px-4 rounded-xl border font-medium text-sm transition-all ${
                gender === 'male'
                  ? 'bg-cyan-500 text-white border-cyan-500 shadow-md'
                  : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
              }`}
            >
              Laki-laki
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`py-2.5 px-4 rounded-xl border font-medium text-sm transition-all ${
                gender === 'female'
                  ? 'bg-cyan-500 text-white border-cyan-500 shadow-md'
                  : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
              }`}
            >
              Perempuan
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-500" /> Berat Badan (kg)
          </label>
          <input
            type="number"
            step="0.1"
            min="10"
            max="300"
            required
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Contoh: 60"
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" /> Tingkat Aktivitas Harian
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="normal">Normal / Standar (Multiplier 30)</option>
            <option value="active">Aktif / Sering Olahraga (Multiplier 40)</option>
          </select>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            * Rumus: Berat Badan (kg) × {activityLevel === 'active' ? '40' : '30'} ml
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
        >
          <Droplet className="w-5 h-5" /> Hitung & Simpan Kebutuhan Air
        </button>
      </form>

      {result !== null && (
        <div className="mt-6 p-5 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/50 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-cyan-800 dark:text-cyan-300">Hasil Kebutuhan Air Harian:</span>
            {saved && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Tersimpan ke localStorage!
              </span>
            )}
          </div>
          <div className="text-3xl font-extrabold text-cyan-700 dark:text-cyan-200">
            {result.toLocaleString('id-ID')} ml <span className="text-lg font-normal text-zinc-600 dark:text-zinc-400">({(result / 1000).toFixed(2)} Liter)</span>
          </div>
          <p className="text-xs text-cyan-900 dark:text-cyan-300 mt-2">
            Data ini telah disimpan secara otomatis dan dapat digunakan oleh halaman jadwal dan dashboard utama.
          </p>
        </div>
      )}
    </div>
  );
}
