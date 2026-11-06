import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function SetupProfile() {
  const { user, createProfile } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateTarget = () => {
    const w = parseFloat(weight) || 0;
    const multiplier = activity === 'active' ? 40 : 35;
    return Math.round(w * multiplier);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !weight) {
      setError('Nama dan berat badan harus diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const targetWater = calculateTarget();
      await createProfile(name, parseFloat(weight), targetWater);
    } catch (err) {
      setError('Gagal membuat profil. Coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const targetWater = calculateTarget();

  return (
    <div className="min-h-screen bg-[#EAF8FD] flex items-center justify-center px-4 py-10">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-[#BFE9F5] max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#033F4F] mb-2">Setup Profil Kamu</h1>
          <p className="text-sm text-[#055F78] font-semibold">Isi data diri untuk menghitung kebutuhan air harian</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-700 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-[#033F4F] mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#BFE9F5] bg-[#EAF8FD] text-[#033F4F] focus:outline-none focus:ring-2 focus:ring-[#09BAED] focus:border-[#09BAED] font-semibold"
              placeholder="Contoh: John Doe"
              required
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-bold text-[#033F4F] mb-2">Berat Badan (kg)</label>
            <input
              type="number"
              step="0.1"
              min="30"
              max="200"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#BFE9F5] bg-[#EAF8FD] text-[#033F4F] focus:outline-none focus:ring-2 focus:ring-[#09BAED] focus:border-[#09BAED] font-semibold"
              placeholder="Contoh: 60"
              required
            />
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-bold text-[#033F4F] mb-2">Tingkat Aktivitas</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#BFE9F5] bg-[#EAF8FD] text-[#033F4F] focus:outline-none focus:ring-2 focus:ring-[#09BAED] focus:border-[#09BAED] font-semibold"
            >
              <option value="normal">Normal / Sedenter (35 ml/kg)</option>
              <option value="active">Aktif / Olahraga (40 ml/kg)</option>
            </select>
          </div>

          {/* Target Preview */}
          {weight && (
            <div className="p-5 bg-[#EAF8FD] border-2 border-[#09BAED] rounded-2xl">
              <p className="text-sm font-bold text-[#033F4F] mb-1">Target Air Harian Kamu:</p>
              <p className="text-3xl font-black text-[#09BAED]">{targetWater.toLocaleString('id-ID')} ml</p>
              <p className="text-xs text-[#055F78] mt-1">≈ {(targetWater / 250).toFixed(1)} gelas per hari</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#09BAED] hover:bg-[#08A0C9] text-[#033F4F] font-bold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Menyimpan...' : 'Mulai Tracking 💧'}
          </button>
        </form>
      </div>
    </div>
  );
}
