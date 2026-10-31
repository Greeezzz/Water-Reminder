import React, { useState } from 'react';
import {
  Droplets,
  Bell,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  History,
} from 'lucide-react';
import WaterNotificationToast from './components/WaterNotificationToast';
import { useWaterReminderNotification } from './hooks/useWaterReminderNotification';
import { playWaterDropSound, playChimeSound, playSoundFile } from './utils/audio';

export default function App() {
  const [totalWaterDrank, setTotalWaterDrank] = useState(0);
  const [fastDemoSnooze, setFastDemoSnooze] = useState(false);

  // Gunakan hook notifikasi
  const {
    isOpen,
    notificationConfig,
    soundEnabled,
    setSoundEnabled,
    soundType,
    setSoundType,
    snoozeUntil,
    history,
    showNotification,
    closeNotification,
    handleDrink,
    handleSnooze,
  } = useWaterReminderNotification({
    defaultTitle: 'Saatnya Minum Air! 💧',
    defaultMessage: 'Sudah 2 jam sejak gelas terakhir. Yuk minum 250 ml air agar tubuh tetap fit!',
    defaultAmount: 250,
    onDrinkWater: (amount) => {
      setTotalWaterDrank((prev) => prev + amount);
    },
    onSnoozeWater: (minutes) => {
      console.log(`Pengingat ditunda selama ${minutes} menit`);
    },
  });

  // Handler demo tes suara langsung
  const handleTestAudio = () => {
    if (soundType === 'water-drop') {
      playWaterDropSound();
    } else if (soundType === 'chime') {
      playChimeSound();
    } else if (soundType === 'wav-file') {
      playSoundFile('/sounds/water-drop.wav');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FBFC] flex flex-col justify-between py-6 px-4">
      {/* Komponen Notifikasi Pop-up (Fitur 3) */}
      <WaterNotificationToast
        isOpen={isOpen}
        title={notificationConfig.title}
        message={notificationConfig.message}
        amount={notificationConfig.amount}
        soundEnabled={soundEnabled}
        soundType={soundType}
        autoCloseDuration={10000}
        onDrink={handleDrink}
        onSnooze={(minutes) => {
          // Jika mode demo cepat aktif, snooze hanya 5 detik agar mudah diuji
          if (fastDemoSnooze) {
            handleSnooze(0.083); // ~5 detik
          } else {
            handleSnooze(minutes);
          }
        }}
        onClose={closeNotification}
      />

      {/* Kontainer Utama Sesuai Aturan DESIGN.md (max-w-md mx-auto) */}
      <main className="w-full max-w-md mx-auto space-y-5">
        {/* Header Section */}
        <header className="bg-white rounded-2xl p-6 shadow-sm border border-[#09BAED]/20 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#09BAED]/15 text-[#09BAED] mb-3 shadow-inner">
            <Droplets className="w-8 h-8 fill-[#09BAED]" />
          </div>
          <h1 className="text-2xl font-bold text-[#033F4F] tracking-tight">
            Water Reminder
          </h1>
          <p className="text-sm text-[#055F78]/80 mt-1 font-medium">
            Fitur 3: Notifikasi Pop-up & Audio (Salsabila)
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#09BAED]/10 text-xs font-semibold text-[#067FA1]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UI Pop-up Gaya WhatsApp Aktif</span>
          </div>
        </header>

        {/* Counter Simulasi Air Diminum Hari Ini */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#09BAED]/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-semibold text-[#055F78]/70 tracking-wider">
                Total Air Diminum
              </span>
              <div className="text-2xl font-extrabold text-[#033F4F] mt-0.5">
                {totalWaterDrank} <span className="text-sm font-semibold text-[#067FA1]">ml</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTotalWaterDrank(0)}
              title="Reset hitungan air"
              className="p-2 rounded-xl text-[#055F78]/60 hover:text-[#033F4F] hover:bg-[#055F78]/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {snoozeUntil && (
            <div className="mt-3.5 flex items-center space-x-2 text-xs text-amber-700 bg-amber-50 border border-amber-200/60 px-3 py-2 rounded-xl">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 animate-spin" />
              <span>
                Notifikasi ditunda hingga{' '}
                <strong>
                  {snoozeUntil.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </strong>
              </span>
            </div>
          )}
        </section>

        {/* Panel Kontrol & Pengujian Notifikasi */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#09BAED]/20 space-y-4">
          <h2 className="text-lg font-semibold text-[#055F78]">
            Pengujian & Kontrol
          </h2>

          {/* Tombol Utama Picu Notifikasi */}
          <button
            type="button"
            onClick={() => showNotification()}
            disabled={isOpen}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-white font-semibold text-sm shadow-md transition-all duration-200 ${
              isOpen
                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                : 'bg-[#09BAED] hover:bg-[#08A0C9] active:scale-[0.99] cursor-pointer'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>{isOpen ? 'Notifikasi Sedang Tampil...' : 'Tampilkan Pop-up Notifikasi'}</span>
          </button>

          {/* Pengaturan Audio */}
          <div className="space-y-3 pt-2 border-t border-[#055F78]/10 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#033F4F]">Efek Suara Notifikasi</span>
              <button
                type="button"
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  soundEnabled
                    ? 'bg-[#09BAED]/15 text-[#067FA1] border border-[#09BAED]/30'
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                }`}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Aktif</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Mute</span>
                  </>
                )}
              </button>
            </div>

            {/* Pilihan Suara */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSoundType('water-drop')}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                  soundType === 'water-drop'
                    ? 'border-[#09BAED] bg-[#09BAED]/10 text-[#033F4F] font-semibold'
                    : 'border-gray-200 bg-gray-50/50 text-[#055F78]/70 hover:bg-gray-100'
                }`}
              >
                💧 Water Drop
              </button>

              <button
                type="button"
                onClick={() => setSoundType('chime')}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                  soundType === 'chime'
                    ? 'border-[#09BAED] bg-[#09BAED]/10 text-[#033F4F] font-semibold'
                    : 'border-gray-200 bg-gray-50/50 text-[#055F78]/70 hover:bg-gray-100'
                }`}
              >
                🔔 Gentle Chime
              </button>

              <button
                type="button"
                onClick={() => setSoundType('wav-file')}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                  soundType === 'wav-file'
                    ? 'border-[#09BAED] bg-[#09BAED]/10 text-[#033F4F] font-semibold'
                    : 'border-gray-200 bg-gray-50/50 text-[#055F78]/70 hover:bg-gray-100'
                }`}
              >
                📁 File .WAV
              </button>
            </div>

            {/* Tes Bunyi Langsung */}
            <button
              type="button"
              onClick={handleTestAudio}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-[#067FA1]/30 bg-white hover:bg-[#F4FBFC] text-[#067FA1] text-xs font-semibold transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-[#067FA1]" />
              <span>Tes Putar Suara ({soundType})</span>
            </button>

            {/* Opsi Cepat Pengujian Snooze */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#055F78]/80">Mode Demo Snooze Cepat (5 Detik)</span>
              <input
                type="checkbox"
                id="fastDemo"
                checked={fastDemoSnooze}
                onChange={(e) => setFastDemoSnooze(e.target.checked)}
                className="w-4 h-4 accent-[#09BAED] rounded cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Riwayat Respon Aksi Pengguna */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#09BAED]/20">
          <div className="flex items-center space-x-2 text-[#055F78] mb-3">
            <History className="w-4 h-4" />
            <h2 className="text-sm font-semibold">Log Respon Notifikasi</h2>
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-[#055F78]/60 italic py-2 text-center">
              Belum ada riwayat. Klik "Tampilkan Pop-up Notifikasi" lalu pilih "Sudah Minum" atau "Tunda".
            </p>
          ) : (
            <ul className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {history.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4FBFC] border border-[#09BAED]/15 text-xs"
                >
                  <div className="flex items-center space-x-2">
                    {item.action === 'DRANK' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="font-semibold text-[#033F4F]">
                      {item.action === 'DRANK'
                        ? `Sudah Minum (+${item.amount} ml)`
                        : `Ditunda ${item.minutes < 1 ? '5 detik' : `${item.minutes} menit`}`}
                    </span>
                  </div>
                  <span className="text-[#055F78]/60 text-[11px] font-mono">
                    {item.timestamp}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Footer Info Anggota Tim */}
      <footer className="text-center mt-6 text-xs text-[#055F78]/60">
        Water Reminder &bull; Feature 3 Completed by Salsabila
      </footer>
    </div>
  );
}
