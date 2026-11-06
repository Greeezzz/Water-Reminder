import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import Calculator from './components/Calculator';
import ScheduleSetup from './components/ScheduleSetup';
import LoginPage from './components/LoginPage';
import SetupProfile from './components/SetupProfile';

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scheduleActive, setScheduleActive] = useState(localStorage.getItem('water_schedule_active') === 'true');
  const [intervalsList, setIntervalsList] = useState([]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAF8FD] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#09BAED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#055F78] font-semibold">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // Show setup profile if no profile yet
  if (!profile) {
    return <SetupProfile />;
  }

  // Main app
  return (
    <div className="min-h-screen bg-[#EAF8FD] text-[#033F4F] flex flex-col">
      {/* Header */}
      <header className="w-full px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#09BAED] flex items-center justify-center text-[#033F4F]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <span className="text-base font-extrabold">Water Reminder</span>
        </div>
        
        {/* User Menu */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#055F78] hidden sm:block">
            Halo, {profile.name}!
          </span>
          <button
            onClick={signOut}
            className="px-3 py-1.5 bg-white hover:bg-rose-50 border-2 border-rose-300 hover:border-rose-500 text-rose-700 text-xs font-bold rounded-xl transition-all"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 pb-24 pt-2">
        {activeTab === 'dashboard' && (
          <Dashboard currentGoal={profile.target_water} scheduleActive={scheduleActive} />
        )}
        {activeTab === 'calculator' && (
          <div className="max-w-2xl mx-auto">
            <Calculator onSaveGoal={() => {}} profile={profile} />
          </div>
        )}
        {activeTab === 'schedule' && (
          <div className="max-w-2xl mx-auto">
            <ScheduleSetup onScheduleChange={(active, list) => { setScheduleActive(active); setIntervalsList(list); }} />
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar (Fixed) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#BFE9F5] shadow-2xl z-50">
        <div className="w-full grid grid-cols-3 gap-1 px-2 py-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-[#09BAED] text-[#033F4F]' 
                : 'text-[#055F78] hover:bg-slate-50'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-bold">Hari ini</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl transition-all ${
              activeTab === 'calculator' 
                ? 'bg-[#09BAED] text-[#033F4F]' 
                : 'text-[#055F78] hover:bg-slate-50'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold">Hitung</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl transition-all ${
              activeTab === 'schedule' 
                ? 'bg-[#09BAED] text-[#033F4F]' 
                : 'text-[#055F78] hover:bg-slate-50'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-bold">Jadwal</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
