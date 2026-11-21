// Lantern Lane — Spot the Difference: bootstrap and HUD wiring.
// Owns the menu, level flow, score tally and overlays; SpotEngine owns play.
import { SCENES } from './scenes.js';
import { SpotEngine } from './engine.js';

const $ = (id) => document.getElementById(id);

const leftCanvas = $('panel-left');
const rightCanvas = $('panel-right');
const overlay = $('overlay');
const overlayCard = $('overlay-card');
const messageEl = $('message');

const totalScore = { value: 0 };
let levelIndex = 0;
let levelResults = [];

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function showOverlay(html) {
  overlayCard.innerHTML = html;
  overlay.classList.add('show');
}

function hideOverlay() {
  overlay.classList.remove('show');
  overlayCard.innerHTML = '';
}

function renderDots(engine) {
  const dots = $('progress-dots');
  dots.innerHTML = '';
  for (const diff of engine.scene.diffs) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (engine.found.has(diff.id) ? ' found' : '');
    dot.title = engine.found.has(diff.id) ? diff.label : 'Not found yet';
    dots.appendChild(dot);
  }
}

function renderHud(engine) {
  const scene = engine.scene;
  $('hud-level').textContent = `${levelIndex + 1} / ${SCENES.length}`;
  $('hud-found').textContent = `${engine.found.size} / ${scene.diffs.length}`;
  $('hud-left').textContent = `${scene.diffs.length - engine.found.size} left`;
  $('hud-score').textContent = String(engine.score);
  const timeEl = $('hud-time');
  timeEl.textContent = formatTime(engine.timeLeft);
  timeEl.classList.toggle('low', engine.timeLeft <= 15);
  $('hud-hints').textContent = String(engine.hintsLeft);
  $('scene-name').textContent = scene.name;
  $('scene-blurb').textContent = scene.blurb;
  $('btn-hint').disabled = engine.hintsLeft <= 0 || engine.state !== 'playing';
  renderDots(engine);
}

function flashMessage(text) {
  messageEl.textContent = text;
  window.clearTimeout(flashMessage.timer);
  flashMessage.timer = window.setTimeout(() => { messageEl.textContent = ''; }, 2600);
}

const engine = new SpotEngine(leftCanvas, rightCanvas, {
  onLevelStart(scene) {
    renderHud(engine);
    hideOverlay();
    flashMessage(`Find ${scene.diffs.length} differences — click either picture!`);
  },
  onTick() {
    renderHud(engine);
  },
  onFound(diff, gained) {
    renderHud(engine);
    flashMessage(`Found: ${diff.label}! +${gained} points`);
  },
  onMiss() {
    renderHud(engine);
    flashMessage('Not quite — minus 3 seconds. Look closer!');
  },
  onHint(diff) {
    renderHud(engine);
    flashMessage(`Hint: something hides near ${diff.label.toLowerCase()}… (−50 points)`);
  },
  onTimeout() {
    renderHud(engine);
    const found = engine.found.size;
    const total = engine.scene.diffs.length;
    showOverlay(`
      <h2>Time's up!</h2>
      <p class="big">You found ${found} of ${total} differences.</p>
      <p>The lanterns burned out before the hunt was done. The unfound ones are still hiding in the pictures — try again?</p>
      <button id="ov-retry" type="button">Try this level again</button>
      <button id="ov-menu2" class="secondary" type="button">Back to levels</button>
    `);
    $('ov-retry').addEventListener('click', () => startLevel(levelIndex, totalScore.value));
    $('ov-menu2').addEventListener('click', showMenu);
  },
  onLevelComplete(eng, bonus) {
    totalScore.value = eng.score;
    const accuracy = eng.scene.diffs.length + eng.wrongClicks === 0
      ? 100
      : Math.round((eng.scene.diffs.length / (eng.scene.diffs.length + eng.wrongClicks)) * 100);
    levelResults[levelIndex] = { scene: eng.scene.name, score: eng.score, timeLeft: eng.timeLeft, accuracy };
    renderHud(eng);
    const isLast = levelIndex === SCENES.length - 1;
    showOverlay(isLast ? resultsHtml() : `
      <h2>Level complete!</h2>
      <p class="big">All ${eng.scene.diffs.length} differences found in ${eng.scene.name}.</p>
      <p>Time bonus +${bonus} &middot; accuracy ${accuracy}% &middot; total score ${eng.score}</p>
      <button id="ov-next" type="button">Next level: ${SCENES[levelIndex + 1].name}</button>
      <button id="ov-replay" class="secondary" type="button">Replay this level</button>
    `);
    if (!isLast) {
      $('ov-next').addEventListener('click', () => startLevel(levelIndex + 1, eng.score));
      $('ov-replay').addEventListener('click', () => startLevel(levelIndex, eng.score));
    } else {
      wireResultsButtons();
    }
  },
});

function resultsHtml() {
  const rows = levelResults.map((r) => `<p>${r.scene}: ${r.score} points &middot; ${formatTime(r.timeLeft)} to spare &middot; ${r.accuracy}% accuracy</p>`).join('');
  return `
    <h2>You found them all!</h2>
    <p class="big">Lantern Lane is clear — every difference in all three scenes, found.</p>
    ${rows}
    <p class="big">Final score: ${totalScore.value}</p>
    <button id="ov-again" type="button">Play again from level 1</button>
    <button id="ov-menu3" class="secondary" type="button">Choose a level</button>
  `;
}

function wireResultsButtons() {
  const again = $('ov-again');
  if (again) again.addEventListener('click', () => { totalScore.value = 0; levelResults = []; startLevel(0, 0); });
  const menu = $('ov-menu3');
  if (menu) menu.addEventListener('click', showMenu);
}

function startLevel(index, carriedScore) {
  levelIndex = index;
  engine.startLevel(SCENES[index], carriedScore);
}

function showMenu() {
  engine.state = 'menu';
  const cards = SCENES.map((scene, i) => `
    <button type="button" data-level="${i}">${i + 1}. ${scene.name} &middot; ${scene.diffs.length} differences &middot; ${formatTime(scene.timeLimit)}</button>
  `).join('');
  showOverlay(`
    <h2>Lantern Lane</h2>
    <p>Two pictures hang side by side. They look identical — but <b>seven small things</b> changed in the second one. Click a difference on either picture to mark it. Find them all before the clock runs out.</p>
    <p>Wrong clicks cost 3 seconds. A hint costs 50 points. Chains of finds build a combo bonus.</p>
    <div class="level-pick">${cards}</div>
    <p class="keys">Mouse: click a difference &middot; H: hint &middot; R: restart level &middot; M: sound</p>
  `);
  overlayCard.querySelectorAll('[data-level]').forEach((btn) => {
    btn.addEventListener('click', () => startLevel(Number(btn.dataset.level), totalScore.value));
  });
}

$('btn-hint').addEventListener('click', () => engine.useHint());
$('btn-restart').addEventListener('click', () => {
  if (engine.scene) startLevel(levelIndex, totalScore.value);
});
$('btn-sound').addEventListener('click', () => {
  const on = engine.sounds.toggle();
  $('btn-sound').textContent = `Sound: ${on ? 'on' : 'off'}`;
});
$('btn-menu').addEventListener('click', showMenu);

document.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') engine.useHint();
  if (event.key === 'r' || event.key === 'R') {
    if (engine.scene && engine.state !== 'menu') startLevel(levelIndex, totalScore.value);
  }
  if (event.key === 'm' || event.key === 'M') $('btn-sound').click();
  if (event.key === 'Enter' && overlay.classList.contains('show')) {
    const first = overlayCard.querySelector('button');
    if (first) first.click();
  }
});

// Debug hook for automated play-testing: exposes the live engine only.
window.__spot = { engine, SCENES };

showMenu();
