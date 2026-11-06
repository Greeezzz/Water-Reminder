import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-[#EAF8FD] flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-[#BFE9F5] max-w-md w-full space-y-8 text-center">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[#09BAED] flex items-center justify-center">
            <svg className="w-12 h-12 text-[#033F4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-4xl font-black text-[#033F4F] mb-2">Water Reminder</h1>
          <p className="text-sm text-[#055F78] font-semibold">Pantau hidrasi harian kamu dengan mudah</p>
        </div>

        {/* Login Button */}
        <button
          onClick={signInWithGoogle}
          className="w-full py-4 px-6 bg-white hover:bg-gray-50 border-2 border-slate-300 text-slate-700 font-bold rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Masuk dengan Google
        </button>

        {/* Info */}
        <p className="text-xs text-[#055F78] leading-relaxed">
          Dengan masuk, data kamu akan tersimpan secara aman dan bisa diakses dari perangkat mana pun.
        </p>
      </div>
    </div>
  );
}
