import React, { useEffect, useState, useRef } from 'react';
import { Droplets, Check, Clock, X, Volume2, VolumeX } from 'lucide-react';
import { playWaterDropSound, playChimeSound, playSoundFile } from '../utils/audio';

/**
 * Komponen Notifikasi Pop-up (Toast) Gaya WhatsApp
 * Fitur 3: Dibuat oleh Salsabila
 * 
 * Props:
 * - isOpen: boolean (apakah toast sedang aktif tampil)
 * - title: string (judul notifikasi)
 * - message: string (pesan pengingat minum)
 * - amount: number (jumlah air dalam ml, default: 250)
 * - soundEnabled: boolean (default: true)
 * - soundType: 'water-drop' | 'chime' | 'wav-file' (default: 'water-drop')
 * - autoCloseDuration: number (durasi dalam ms, 0 = tidak otomatis tutup, default: 12000)
 * - onDrink: function(amount) (dipanggil saat tombol 'Sudah Minum' diklik)
 * - onSnooze: function(minutes) (dipanggil saat tombol 'Tunda' diklik)
 * - onClose: function() (dipanggil saat tombol silang atau auto close)
 */
export default function WaterNotificationToast({
  isOpen = false,
  title = 'Waktunya Minum Air!',
  message = 'Minum segelas air (250 ml) sekarang untuk menjaga hidrasi & fokus kamu.',
  amount = 250,
  soundEnabled = true,
  soundType = 'water-drop',
  autoCloseDuration = 12000,
  onDrink,
  onSnooze,
  onClose,
}) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const soundPlayedRef = useRef(false);

  // Mainkan audio saat notifikasi muncul
  useEffect(() => {
    if (isOpen) {
      if (soundEnabled && !soundPlayedRef.current) {
        if (soundType === 'water-drop') {
          playWaterDropSound();
        } else if (soundType === 'chime') {
          playChimeSound();
        } else if (soundType === 'wav-file') {
          playSoundFile('/sounds/water-drop.wav');
        }
        soundPlayedRef.current = true;
      }
    } else {
      soundPlayedRef.current = false;
    }
  }, [isOpen, soundEnabled, soundType]);

  // Timer auto close & progress bar
  useEffect(() => {
    if (!isOpen || autoCloseDuration <= 0) return;

    const intervalTime = 50;
    const step = (intervalTime / autoCloseDuration) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            if (onClose) onClose();
            return 0;
          }
          return Math.max(0, prev - step);
        });
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      setProgress(100);
    };
  }, [isOpen, autoCloseDuration, isPaused, onClose]);

  if (!isOpen) return null;

  const handleDrink = () => {
    if (onDrink) onDrink(amount);
    if (onClose) onClose();
  };

  const handleSnooze = (minutes = 10) => {
    if (onSnooze) onSnooze(minutes);
    if (onClose) onClose();
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-top-4"
    >
      <div className="bg-white/95 backdrop-blur-md border border-[#09BAED]/25 rounded-2xl shadow-xl p-4 text-[#033F4F] relative overflow-hidden transition-all duration-200 hover:shadow-2xl">
        {/* Progress bar countdown di bagian paling atas */}
        {autoCloseDuration > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#09BAED]/15 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#09BAED] to-[#067FA1] transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* WhatsApp-Style Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#055F78]/10 text-xs font-medium text-[#055F78]/80">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-[#09BAED] flex items-center justify-center text-white shadow-sm">
              <Droplets className="w-3 h-3 fill-white" />
            </div>
            <span className="font-bold tracking-wider text-[11px] uppercase text-[#033F4F]">
              WATER REMINDER
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-[#055F78]/60">Sekarang</span>
            {soundEnabled ? (
              <span title="Suara notifikasi aktif" className="text-[#09BAED]">
                <Volume2 className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span title="Suara senyap" className="text-gray-400">
                <VolumeX className="w-3.5 h-3.5" />
              </span>
            )}
            <button
              onClick={onClose}
              className="text-[#055F78]/50 hover:text-[#033F4F] p-0.5 rounded-md hover:bg-[#055F78]/10 transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Notifikasi */}
        <div className="flex items-start space-x-3 my-1">
          <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-[#09BAED]/15 text-[#09BAED] flex items-center justify-center shadow-inner">
            <Droplets className="w-6 h-6 animate-bounce" />
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <h4 className="text-sm font-bold text-[#033F4F] leading-snug">
              {title}
            </h4>
            <p className="text-xs text-[#055F78]/85 mt-0.5 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* WhatsApp Quick Action Buttons */}
        <div className="mt-3.5 pt-2 border-t border-[#055F78]/10 flex items-center space-x-2">
          {/* Tombol Utama: Sudah Minum */}
          <button
            type="button"
            onClick={handleDrink}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#09BAED] hover:bg-[#08A0C9] active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition-all duration-150 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Sudah Minum (+{amount}ml)</span>
          </button>

          {/* Tombol Sekunder: Tunda 10 Menit */}
          <button
            type="button"
            onClick={() => handleSnooze(10)}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#055F78]/10 hover:bg-[#055F78]/15 active:scale-[0.98] text-[#055F78] hover:text-[#033F4F] text-xs font-semibold transition-all duration-150 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Tunda 10 Menit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
