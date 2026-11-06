import React, { useState, useEffect } from 'react';

export default function ScheduleSetup({ onScheduleChange }) {
  const [startTime, setStartTime] = useState(localStorage.getItem('water_start_time') || '08:00');
  const [endTime, setEndTime] = useState(localStorage.getItem('water_end_time') || '22:00');
  const [intervalHours, setIntervalHours] = useState(localStorage.getItem('water_interval') || '2');
  const [isActive, setIsActive] = useState(localStorage.getItem('water_schedule_active') === 'true');
  const [intervals, setIntervals] = useState([]);

  useEffect(() => {
    generateIntervals();
  }, [startTime, endTime, intervalHours]);

  useEffect(() => {
    localStorage.setItem('water_schedule_active', isActive);
    if (onScheduleChange) onScheduleChange(isActive, intervals);
  }, [isActive, intervals]);

  const generateIntervals = () => {
    try {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = semanticTime(endTime);
      const intervalMs = parseFloat(intervalHours) * 3600 * 1000;

      let current = new Date();
      current.setHours(startH, startM, 0, 0);

      let end = new Date();
      end.setHours(endH, endM, 0, 0);

      if (end <= current) {
        end.setDate(end.getDate() + 1); // cross midnight if needed
      }

      const list = [];
      while (current <= end) {
        const timeStr = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        list.push(timeStr);
        current = new Date(current.getTime() + intervalMs);
      }

      setIntervals(list);
      localStorage.setItem('water_start_time', startTime);
      localStorage.setItem('water_end_time', endTime);
      localStorage.setItem('water_interval', intervalHours);
      localStorage.setItem('water_intervals_list', JSON.stringify(list));
    } catch (err) {
      console.error(err);
    }
  };

  const semanticTime = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return [h || 0, m || 0];
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#EAF8FD] text-[#09BAED] rounded-xl border-2 border-[#09BAED]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#033F4F]">Setup Jadwal Fleksibel Minum Air</h2>
          <p className="text-sm text-[#055F78]">Atur jam & interval sesuai gaya hidupmu</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#033F4F] mb-1">Jam Mulai</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#BFE9F5] bg-[#EAF8FD] text-[#033F4F] focus:outline-none focus:ring-2 focus:ring-[#09BAED] focus:border-[#09BAED]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#033F4F] mb-1">Jam Selesai</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#BFE9F5] bg-[#EAF8FD] text-[#033F4F] focus:outline-none focus:ring-2 focus:ring-[#09BAED] focus:border-[#09BAED]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#033F4F] mb-1">Interval Waktu (Jam)</label>
          <select
            value={intervalHours}
            onChange={(e) => setIntervalHours(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-[#BFE9F5] bg-[#EAF8FD] text-[#033F4F] focus:outline-none focus:ring-2 focus:ring-[#09BAED] focus:border-[#09BAED]"
          >
            <option value="1">Setiap 1 Jam</option>
            <option value="1.5">Setiap 1.5 Jam</option>
            <option value="2">Setiap 2 Jam</option>
            <option value="3">Setiap 3 Jam</option>
            <option value="4">Setiap 4 Jam</option>
          </select>
        </div>

        {/* Control Buttons */}
        <div className="pt-2 flex gap-4">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex-1 py-3 bg-[#09BAED] hover:bg-[#08A0C9] text-[#033F4F] font-bold rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mulai Jadwal
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Stop Jadwal
            </button>
          )}
        </div>

        {/* Status Badge */}
        <div className={`p-3 rounded-xl border-2 flex items-center justify-between ${isActive ? 'bg-[#EAF8FD] border-[#09BAED] text-[#033F4F]' : 'bg-slate-50 border-slate-300 text-[#055F78]'}`}>
          <span className="text-sm font-medium">Status Jadwal:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isActive ? 'bg-[#09BAED] text-[#033F4F]' : 'bg-slate-300 text-[#055F78]'}`}>
            {isActive ? 'Aktif (Berjalan)' : 'Non-Aktif'}
          </span>
        </div>

        {/* Generated Intervals Preview */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[#033F4F] mb-2">Jadwal Minum Hari Ini ({intervals.length} Sesi):</h3>
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-[#EAF8FD] rounded-xl border-2 border-[#BFE9F5]">
            {intervals.map((time, idx) => (
              <span key={idx} className="px-3 py-1 bg-white border-2 border-[#09BAED] rounded-lg text-xs font-medium text-[#033F4F] shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#09BAED]"></span>
                {time}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
