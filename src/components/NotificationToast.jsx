import React, { useState, useEffect } from 'react';

export default function NotificationToast({ onDrinkAction }) {
  const [showToast, setShowToast] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Audio chime helper using Web Audio API (no external file needed)
  const playSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2); // A5

      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  const triggerTestNotification = () => {
    setShowToast(true);
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    playSound();
  };

  const handleDrink = () => {
    setShowToast(false);
    if (onDrinkAction) onDrinkAction(250);
  };

  const handleSnooze = () => {
    setShowToast(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Notifikasi Pop-up & Audio</h2>
          <p className="text-sm text-slate-500">Fitur oleh Salsabila - Alert WhatsApp style & water chime</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Uji simulasi pop-up pengingat minum air dengan efek suara berdering dan tombol aksi cepat.
        </p>

        <button
          onClick={triggerTestNotification}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          Simulasi Notifikasi Sekarang
        </button>
      </div>

      {/* WhatsApp Style Toast Overlay */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-700 max-w-sm flex items-start gap-3">
            <div className="p-2 bg-emerald-700 rounded-xl">
              <svg className="w-6 h-6 text-cyan-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-300">WATER REMINDER • {currentTime}</span>
                <button onClick={() => setShowToast(false)} className="text-emerald-300 hover:text-white">×</button>
              </div>
              <p className="font-bold text-sm mt-1">Waktunya Minum Air! 💧</p>
              <p className="text-xs text-emerald-200 mt-0.5">Segarkan tubuhmu dengan segelas air (250ml).</p>
              
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleDrink}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-lg transition"
                >
                  Sudah Minum (+250ml)
                </button>
                <button
                  onClick={handleSnooze}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 font-semibold text-xs rounded-lg transition"
                >
                  Tunda 10 Menit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
