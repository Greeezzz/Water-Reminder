/**
 * Audio Utility for Water Reminder Notifications
 * Menyediakan pemutaran suara tetesan air (water drop) dan dering (beep)
 * menggunakan Web Audio API (tanpa delay & bebas kendala path) dan file audio .wav.
 */

// Cache AudioContext instance
let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Memutar suara tetesan air segar alami menggunakan Web Audio API
 */
export function playWaterDropSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return playSoundFile('/sounds/water-drop.wav');

    const now = ctx.currentTime;

    // Oscillator 1: Tetesan utama (pitch drop cepat)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1400, now);
    osc1.frequency.exponentialRampToValueAtTime(550, now + 0.12);
    osc1.frequency.exponentialRampToValueAtTime(400, now + 0.28);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.6, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Oscillator 2: Resonansi air (ripple / echo lembut)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(800, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(650, now + 0.3);

    gain2.gain.setValueAtTime(0.001, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.25, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.36);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.46);

    return true;
  } catch (err) {
    console.warn('Gagal memutar Web Audio sintetis, beralih ke file:', err);
    return playSoundFile('/sounds/water-drop.wav');
  }
}

/**
 * Memutar nada dering lonceng/beep lembut (dua nada harmonis)
 */
export function playChimeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [587.33, 880]; // D5 and A5

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);

      gain.gain.setValueAtTime(0.001, now + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.35, now + index * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 0.45);
    });
    return true;
  } catch (err) {
    console.warn('Gagal memutar chime sound:', err);
  }
}

/**
 * Memutar file audio eksternal (fallback / opsi file suara)
 */
export function playSoundFile(url = '/sounds/water-drop.wav') {
  try {
    const audio = new Audio(url);
    audio.volume = 0.8;
    return audio.play().catch(err => {
      console.warn('Autoplay terblokir oleh browser atau file tidak ditemukan:', err);
    });
  } catch (err) {
    console.warn('Gagal memutar file audio:', err);
  }
}
