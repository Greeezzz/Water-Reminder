import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom Hook: useWaterReminderNotification
 * Memudahkan integrasi notifikasi pop-up & audio di halaman Dashboard
 * Dibuat oleh Salsabila (Fitur 3)
 */
export function useWaterReminderNotification(options = {}) {
  const {
    defaultTitle = 'Waktunya Minum Air!',
    defaultMessage = 'Yuk minum segelas air (250 ml) sekarang agar tubuh tetap segar & fokus!',
    defaultAmount = 250,
    initialSoundEnabled = true,
    initialSoundType = 'water-drop', // 'water-drop' | 'chime' | 'wav-file'
    onDrinkWater,
    onSnoozeWater,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: defaultTitle,
    message: defaultMessage,
    amount: defaultAmount,
  });
  const [soundEnabled, setSoundEnabled] = useState(initialSoundEnabled);
  const [soundType, setSoundType] = useState(initialSoundType);
  const [snoozeUntil, setSnoozeUntil] = useState(null);
  const [history, setHistory] = useState([]);

  const snoozeTimerRef = useRef(null);

  // Bersihkan timer jika unmount
  useEffect(() => {
    return () => {
      if (snoozeTimerRef.current) {
        clearTimeout(snoozeTimerRef.current);
      }
    };
  }, []);

  // Tampilkan notifikasi sekarang
  const showNotification = useCallback((custom = {}) => {
    setConfig({
      title: custom.title || defaultTitle,
      message: custom.message || defaultMessage,
      amount: custom.amount || defaultAmount,
    });
    setIsOpen(true);
  }, [defaultTitle, defaultMessage, defaultAmount]);

  // Tutup notifikasi
  const closeNotification = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handler: Sudah Minum
  const handleDrink = useCallback((amount = config.amount) => {
    setIsOpen(false);
    const logItem = {
      action: 'DRANK',
      amount,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setHistory((prev) => [logItem, ...prev]);

    if (onDrinkWater) {
      onDrinkWater(amount);
    }
  }, [config.amount, onDrinkWater]);

  // Handler: Tunda (Snooze)
  const handleSnooze = useCallback((minutes = 10) => {
    setIsOpen(false);
    const snoozeTime = new Date(Date.now() + minutes * 60 * 1000);
    setSnoozeUntil(snoozeTime);

    const logItem = {
      action: 'SNOOZED',
      minutes,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setHistory((prev) => [logItem, ...prev]);

    if (onSnoozeWater) {
      onSnoozeWater(minutes);
    }

    if (snoozeTimerRef.current) {
      clearTimeout(snoozeTimerRef.current);
    }

    // Jadwalkan kemunculan kembali setelah durasi snooze (dalam demo milidetik dapat disesuaikan)
    snoozeTimerRef.current = setTimeout(() => {
      showNotification({
        title: 'Pengingat Minum (Setelah Ditunda)',
        message: `Waktu tunda ${minutes} menit sudah berakhir. Yuk minum air sekarang!`,
      });
      setSnoozeUntil(null);
    }, minutes * 60 * 1000);
  }, [showNotification, onSnoozeWater]);

  return {
    isOpen,
    notificationConfig: config,
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
  };
}
