// SoundBank: every sound in Lantern Lane is synthesised live with WebAudio.
// No audio files are shipped; each effect is a short oscillator phrase.
export class SoundBank {
  constructor() {
    this.context = null;
    this.enabled = true;
    this.master = null;
  }

  ensure() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.22;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') void this.context.resume();
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  note(freq, startAt, length, type = 'sine', volume = 1) {
    if (!this.context || !this.enabled) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t = this.context.currentTime + startAt;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.5 * volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + length + 0.05);
  }

  // A bright two-note chime when a difference is found.
  found() {
    this.ensure();
    this.note(880, 0, 0.22, 'sine');
    this.note(1318.5, 0.09, 0.34, 'sine');
    this.note(1760, 0.18, 0.3, 'triangle', 0.6);
  }

  // A soft low buzz for a wrong click.
  wrong() {
    this.ensure();
    this.note(160, 0, 0.18, 'sawtooth', 0.5);
    this.note(110, 0.1, 0.22, 'sawtooth', 0.5);
  }

  // A shimmering arpeggio for a finished level.
  win() {
    this.ensure();
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
      this.note(f, i * 0.11, 0.4, 'triangle', 0.8);
    });
  }

  // A gentle pluck for a hint.
  hint() {
    this.ensure();
    this.note(659.25, 0, 0.18, 'triangle', 0.7);
    this.note(987.77, 0.08, 0.26, 'triangle', 0.6);
  }

  // A single tick when the clock runs low.
  tick() {
    this.ensure();
    this.note(1200, 0, 0.06, 'square', 0.25);
  }

  // A sad descending pair when time runs out.
  timeout() {
    this.ensure();
    this.note(392, 0, 0.3, 'triangle', 0.7);
    this.note(261.63, 0.22, 0.5, 'triangle', 0.7);
  }
}
