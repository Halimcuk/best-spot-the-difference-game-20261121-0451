// SpotEngine: runs one picture-hunt level. It pre-renders the scene twice
// (plain on the left canvas, differences applied on the right), then draws
// markers, hint rings and miss flashes over both panels every frame.
import { SoundBank } from './audio.js';

const PANEL_W = 600;
const PANEL_H = 450;

export class SpotEngine {
  constructor(leftCanvas, rightCanvas, hooks) {
    this.left = leftCanvas;
    this.right = rightCanvas;
    this.hooks = hooks;
    this.sounds = new SoundBank();
    this.scene = null;
    this.found = new Set();
    this.hintsLeft = 3;
    this.score = 0;
    this.combo = 0;
    this.wrongClicks = 0;
    this.timeLeft = 0;
    this.state = 'menu';
    this.marks = [];
    this.hintRing = null;
    this.missFlash = null;
    this.lastTickSecond = -1;
    this.leftCtx = leftCanvas.getContext('2d');
    this.rightCtx = rightCanvas.getContext('2d');
    this.offLeft = document.createElement('canvas');
    this.offRight = document.createElement('canvas');
    this.offLeft.width = PANEL_W;
    this.offLeft.height = PANEL_H;
    this.offRight.width = PANEL_W;
    this.offRight.height = PANEL_H;
    this.lastFrame = 0;
    this.raf = 0;
    this.onClick = this.onClick.bind(this);
    leftCanvas.addEventListener('click', this.onClick);
    rightCanvas.addEventListener('click', this.onClick);
  }

  startLevel(scene, carriedScore) {
    this.scene = scene;
    this.score = carriedScore ?? 0;
    this.found = new Set();
    this.hintsLeft = 3;
    this.combo = 0;
    this.wrongClicks = 0;
    this.timeLeft = scene.timeLimit;
    this.state = 'playing';
    this.marks = [];
    this.hintRing = null;
    this.missFlash = null;
    this.lastTickSecond = -1;
    this.scene.draw(this.offLeft.getContext('2d'), PANEL_W, PANEL_H, new Set());
    const all = new Set(scene.diffs.map((d) => d.id));
    this.scene.draw(this.offRight.getContext('2d'), PANEL_W, PANEL_H, all);
    this.hooks.onLevelStart(scene, this);
    cancelAnimationFrame(this.raf);
    this.lastFrame = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.1, (now - this.lastFrame) / 1000);
      this.lastFrame = now;
      if (this.state === 'playing') this.advanceClock(dt);
      this.render(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  advanceClock(dt) {
    this.timeLeft -= dt;
    const whole = Math.ceil(this.timeLeft);
    if (whole <= 10 && whole !== this.lastTickSecond && whole > 0) {
      this.lastTickSecond = whole;
      this.sounds.tick();
    }
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.state = 'timeout';
      this.sounds.timeout();
      this.hooks.onTimeout(this);
    }
    this.hooks.onTick(this);
  }

  onClick(event) {
    if (this.state !== 'playing') return;
    this.sounds.ensure();
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * PANEL_W;
    const y = ((event.clientY - rect.top) / rect.height) * PANEL_H;
    const hit = this.scene.diffs.find((d) => {
      const dx = x - d.x;
      const dy = y - d.y;
      return dx * dx + dy * dy <= d.r * d.r;
    });
    if (hit && !this.found.has(hit.id)) {
      this.found.add(hit.id);
      this.combo += 1;
      const gained = 100 + (this.combo - 1) * 25 + Math.max(0, Math.ceil(this.timeLeft)) ;
      this.score += gained;
      this.marks.push({ x: hit.x, y: hit.y, r: hit.r, born: performance.now(), label: hit.label });
      this.sounds.found();
      this.hooks.onFound(hit, gained, this);
      if (this.found.size === this.scene.diffs.length) {
        this.state = 'levelDone';
        const bonus = Math.ceil(this.timeLeft) * 5;
        this.score += bonus;
        this.sounds.win();
        this.hooks.onLevelComplete(this, bonus);
      }
    } else if (!hit) {
      this.combo = 0;
      this.wrongClicks += 1;
      this.timeLeft = Math.max(0, this.timeLeft - 3);
      this.missFlash = { x, y, born: performance.now() };
      this.sounds.wrong();
      this.hooks.onMiss(this);
    }
  }

  useHint() {
    if (this.state !== 'playing' || this.hintsLeft <= 0) return false;
    const remaining = this.scene.diffs.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return false;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - 50);
    this.hintRing = { x: pick.x, y: pick.y, r: pick.r, born: performance.now() };
    this.sounds.hint();
    this.hooks.onHint(pick, this);
    return true;
  }

  render(now) {
    for (const [ctx, off] of [[this.leftCtx, this.offLeft], [this.rightCtx, this.offRight]]) {
      ctx.clearRect(0, 0, PANEL_W, PANEL_H);
      ctx.drawImage(off, 0, 0);
      for (const mark of this.marks) this.drawMark(ctx, mark, now);
      if (this.hintRing) this.drawHintRing(ctx, this.hintRing, now);
      if (this.missFlash) this.drawMiss(ctx, this.missFlash, now);
    }
    if (this.hintRing && now - this.hintRing.born > 2200) this.hintRing = null;
    if (this.missFlash && now - this.missFlash.born > 450) this.missFlash = null;
  }

  drawMark(ctx, mark, now) {
    const age = (now - mark.born) / 1000;
    const pop = age < 0.25 ? 0.6 + (age / 0.25) * 0.4 : 1;
    const r = mark.r * pop;
    ctx.save();
    ctx.strokeStyle = '#ffc857';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(255, 200, 87, 0.9)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(mark.x, mark.y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = '#fff3d6';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(mark.x - r * 0.45, mark.y);
    ctx.lineTo(mark.x - r * 0.1, mark.y + r * 0.35);
    ctx.lineTo(mark.x + r * 0.5, mark.y - r * 0.35);
    ctx.stroke();
  }

  drawHintRing(ctx, ring, now) {
    const age = (now - ring.born) / 1000;
    const pulse = 1 + 0.12 * Math.sin(age * 8);
    const alpha = age > 1.8 ? Math.max(0, 1 - (age - 1.8) / 0.4) : 1;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.r * pulse + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawMiss(ctx, flash, now) {
    const age = now - flash.born;
    if (age > 450) return;
    ctx.save();
    ctx.globalAlpha = 1 - age / 450;
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    const s = 12;
    ctx.beginPath();
    ctx.moveTo(flash.x - s, flash.y - s);
    ctx.lineTo(flash.x + s, flash.y + s);
    ctx.moveTo(flash.x + s, flash.y - s);
    ctx.lineTo(flash.x - s, flash.y + s);
    ctx.stroke();
    ctx.restore();
  }
}
