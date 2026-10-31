import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Calculator from './components/Calculator';
import ScheduleSetup from './components/ScheduleSetup';
import NotificationToast from './components/NotificationToast';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentGoal, setCurrentGoal] = useState(localStorage.getItem('water_goal') || '2000');
  const [scheduleActive, setScheduleActive] = useState(localStorage.getItem('water_schedule_active') === 'true');
  const [intervalsList, setIntervalsList] = useState([]);

  const handleDrinkAction = (amount) => {
    const current = Number(localStorage.getItem('water_consumed') || 0);
    const updated = current + amount;
    localStorage.setItem('water_consumed', updated);
    // Switch to dashboard to show updated progress
    setActiveTab('dashboard');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center py-10 px-4">
      {/* Header */}
      <header className="max-w-2xl w-full text-center mb-8">
        <div className="inline-block p-3 bg-cyan-100 text-cyan-600 rounded-2xl mb-3 shadow-xs">
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Water Reminder</h1>
        <p className="text-sm text-slate-500 mt-1">Aplikasi Kolaborasi Tim: Akmal, Keysha, Salsabila, & Inyaa</p>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-2xl w-full flex flex-wrap gap-2 justify-center mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          📊 Dashboard (Inyaa)
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition ${activeTab === 'calculator' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          🧮 Kalkulator (Akmal)
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition ${activeTab === 'schedule' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          ⏰ Jadwal (Keysha)
        </button>
        <button
          onClick={() => setActiveTab('notification')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition ${activeTab === 'notification' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          🔔 Notifikasi (Salsabila)
        </button>
      </nav>

      {/* Main Content View */}
      <main className="w-full max-w-2xl">
        {activeTab === 'dashboard' && (
          <Dashboard currentGoal={currentGoal} scheduleActive={scheduleActive} intervalsList={intervalsList} />
        )}
        {activeTab === 'calculator' && (
          <Calculator onSaveGoal={(goal) => setCurrentGoal(goal)} />
        )}
        {activeTab === 'schedule' && (
          <ScheduleSetup onScheduleChange={(active, list) => { setScheduleActive(active); setIntervalsList(list); }} />
        )}
        {activeTab === 'notification' && (
          <NotificationToast onDrinkAction={handleDrinkAction} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-400">
        Water Reminder Project &bull; Dibangun dengan React + Vite + Tailwind CSS
      </footer>
    </div>
  );
}
