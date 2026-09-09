type SoundType =
  | 'button'
  | 'money'
  | 'moneyDown'
  | 'error'
  | 'success'
  | 'event'
  | 'achievement'
  | 'win'
  | 'lose'
  | 'month';

let audioContext: AudioContext | null = null;
let enabled = true;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      return null;
    }
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15) {
  const ctx = getContext();
  if (!ctx || !enabled) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silent fail
  }
}

function playSequence(notes: { freq: number; duration: number; type?: OscillatorType; volume?: number }[]) {
  const ctx = getContext();
  if (!ctx || !enabled) return;

  let delay = 0;
  for (const note of notes) {
    setTimeout(() => playTone(note.freq, note.duration, note.type || 'sine', note.volume || 0.15), delay);
    delay += note.duration * 1000 * 0.8;
  }
}

export function playSound(type: SoundType) {
  switch (type) {
    case 'button':
      playTone(800, 0.05, 'square', 0.08);
      break;
    case 'money':
      playSequence([
        { freq: 523, duration: 0.08, type: 'sine' },
        { freq: 659, duration: 0.08, type: 'sine' },
        { freq: 784, duration: 0.12, type: 'sine' },
      ]);
      break;
    case 'moneyDown':
      playSequence([
        { freq: 400, duration: 0.08, type: 'sawtooth', volume: 0.1 },
        { freq: 300, duration: 0.08, type: 'sawtooth', volume: 0.1 },
        { freq: 200, duration: 0.12, type: 'sawtooth', volume: 0.1 },
      ]);
      break;
    case 'error':
      playTone(150, 0.2, 'sawtooth', 0.12);
      break;
    case 'success':
      playSequence([
        { freq: 523, duration: 0.1, type: 'sine' },
        { freq: 784, duration: 0.15, type: 'sine' },
      ]);
      break;
    case 'event':
      playTone(440, 0.1, 'triangle', 0.1);
      setTimeout(() => playTone(550, 0.1, 'triangle', 0.1), 100);
      break;
    case 'achievement':
      playSequence([
        { freq: 659, duration: 0.08, type: 'sine' },
        { freq: 784, duration: 0.08, type: 'sine' },
        { freq: 988, duration: 0.08, type: 'sine' },
        { freq: 1319, duration: 0.2, type: 'sine' },
      ]);
      break;
    case 'win':
      playSequence([
        { freq: 523, duration: 0.15, type: 'sine' },
        { freq: 659, duration: 0.15, type: 'sine' },
        { freq: 784, duration: 0.15, type: 'sine' },
        { freq: 1047, duration: 0.3, type: 'sine' },
      ]);
      break;
    case 'lose':
      playSequence([
        { freq: 400, duration: 0.2, type: 'sawtooth', volume: 0.1 },
        { freq: 300, duration: 0.2, type: 'sawtooth', volume: 0.1 },
        { freq: 200, duration: 0.4, type: 'sawtooth', volume: 0.1 },
      ]);
      break;
    case 'month':
      playTone(300, 0.15, 'sine', 0.1);
      setTimeout(() => playTone(400, 0.15, 'sine', 0.1), 150);
      break;
  }
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

export function isSoundEnabled(): boolean {
  return enabled;
}
