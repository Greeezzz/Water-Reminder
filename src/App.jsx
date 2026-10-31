import React from 'react';
import AkmalCalculator from './components/AkmalCalculator';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
          Water Reminder - Fitur 1 (Akmal)
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Form Input Data Diri & Kalkulator Kebutuhan Air Harian
        </p>
      </div>

      <AkmalCalculator />
    </div>
  );
}
