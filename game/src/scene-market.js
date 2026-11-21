// Scene 1 — Night Market Lane: a lantern-lit street stall at dusk, drawn in
// flat vector shapes on canvas. The right panel applies seven small changes.
export const marketScene = {
  id: 'market',
  name: 'Night Market Lane',
  blurb: 'Seven small things changed between the two pictures. Find them all before the lanterns burn out.',
  timeLimit: 150,
  diffs: [
    { id: 'lantern-red', label: 'The middle red lantern', x: 300, y: 96, r: 26 },
    { id: 'moon-crater', label: 'The crater on the moon', x: 498, y: 62, r: 18 },
    { id: 'cat-ear', label: "The cat's ear", x: 468, y: 330, r: 20 },
    { id: 'apple-count', label: 'An apple on the stall', x: 182, y: 298, r: 24 },
    { id: 'awning-stripe', label: 'A stripe on the awning', x: 232, y: 178, r: 22 },
    { id: 'window-light', label: 'The lit window', x: 92, y: 150, r: 20 },
    { id: 'sign-star', label: 'The star on the sign', x: 332, y: 148, r: 18 },
  ],

  draw(ctx, w, h, applied) {
    // Dusk sky.
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#241a4d');
    sky.addColorStop(0.55, '#6b3a6e');
    sky.addColorStop(1, '#e8834a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Stars.
    ctx.fillStyle = '#ffeecf';
    const stars = [[40, 40], [120, 70], [210, 36], [330, 52], [430, 30], [560, 110], [70, 110], [250, 90]];
    for (const [sx, sy] of stars) {
      ctx.beginPath();
      ctx.arc(sx, sy, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Moon with a crater that vanishes on the right.
    ctx.fillStyle = '#ffedbe';
    ctx.beginPath();
    ctx.arc(498, 62, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 220, 140, 0.35)';
    ctx.beginPath();
    ctx.arc(498, 62, 38, 0, Math.PI * 2);
    ctx.fill();
    if (!applied.has('moon-crater')) {
      ctx.fillStyle = '#d9b96a';
      ctx.beginPath();
      ctx.arc(490, 56, 6, 0, Math.PI * 2);
      ctx.arc(508, 70, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rooftops and one window whose light goes out on the right.
    ctx.fillStyle = '#1c1233';
    ctx.fillRect(0, 150, 150, 130);
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(75, 118);
    ctx.lineTo(150, 150);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = applied.has('window-light') ? '#241a3e' : '#ffd76a';
    ctx.fillRect(82, 140, 20, 22);
    ctx.fillStyle = '#1c1233';
    ctx.fillRect(450, 170, 150, 110);
    ctx.beginPath();
    ctx.moveTo(450, 170);
    ctx.lineTo(525, 140);
    ctx.lineTo(600, 170);
    ctx.closePath();
    ctx.fill();

    // Lantern strings across the lane.
    ctx.strokeStyle = '#3a2a55';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 60);
    ctx.quadraticCurveTo(300, 110, 600, 55);
    ctx.stroke();
    drawLantern(ctx, 120, 82, '#ff5a4e', applied, 'lantern-red', false);
    drawLantern(ctx, 210, 92, '#ffb347', applied, 'lantern-red', false);
    drawLantern(ctx, 300, 96, '#ff5a4e', applied, 'lantern-red', true);
    drawLantern(ctx, 390, 90, '#ffd76a', applied, 'lantern-red', false);
    drawLantern(ctx, 480, 78, '#ff5a4e', applied, 'lantern-red', false);

    // Stall awning: one stripe swaps red for teal on the right.
    const stripeColors = ['#d94f3d', '#f5ead6', '#d94f3d', '#f5ead6', '#d94f3d', '#f5ead6'];
    if (applied.has('awning-stripe')) stripeColors[2] = '#2fa8a0';
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = stripeColors[i];
      ctx.fillRect(130 + i * 42, 168, 42, 34);
      ctx.beginPath();
      ctx.moveTo(130 + i * 42, 202);
      ctx.lineTo(130 + i * 42 + 21, 214);
      ctx.lineTo(130 + i * 42 + 42, 202);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = '#5a3a22';
    ctx.fillRect(126, 202, 260, 8);

    // Hanging sign with a star that disappears on the right.
    ctx.fillStyle = '#3a2417';
    ctx.fillRect(300, 128, 64, 34);
    ctx.strokeStyle = '#c9a86a';
    ctx.lineWidth = 2;
    ctx.strokeRect(300, 128, 64, 34);
    ctx.fillStyle = '#ffd76a';
    ctx.font = 'bold 11px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LANTERN', 332, 143);
    ctx.fillText('LANE', 332, 156);
    if (!applied.has('sign-star')) drawStar(ctx, 356, 136, 5, '#ffd76a');

    // Stall counter and fruit.
    ctx.fillStyle = '#7a4a28';
    ctx.fillRect(140, 300, 240, 90);
    ctx.fillStyle = '#8f5a32';
    ctx.fillRect(140, 300, 240, 12);
    // Apples: four on the left, three on the right.
    const apples = [[168, 292], [192, 286], [214, 292], [182, 298]];
    const appleCount = applied.has('apple-count') ? 3 : 4;
    ctx.fillStyle = '#e23b3b';
    for (let i = 0; i < appleCount; i++) {
      ctx.beginPath();
      ctx.arc(apples[i][0], apples[i][1], 11, 0, Math.PI * 2);
      ctx.fill();
    }
    // Oranges.
    ctx.fillStyle = '#ff9f2e';
    for (const [ox, oy] of [[252, 292], [276, 286], [298, 292]]) {
      ctx.beginPath();
      ctx.arc(ox, oy, 11, 0, Math.PI * 2);
      ctx.fill();
    }
    // Jars.
    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(330, 268, 20, 32);
    ctx.fillStyle = '#ff6b9d';
    ctx.fillRect(356, 268, 20, 32);

    // Cobblestones.
    ctx.fillStyle = '#4a3560';
    ctx.fillRect(0, 390, w, 60);
    ctx.fillStyle = '#5d4470';
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 8; col++) {
        ctx.beginPath();
        ctx.ellipse(40 + col * 75 + (row % 2) * 30, 408 + row * 26, 30, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // The stall cat: one ear folds on the right.
    drawCat(ctx, 468, 352, applied.has('cat-ear'));

    // Crate under the cat.
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(430, 372, 76, 26);
    ctx.strokeStyle = '#4a2c14';
    ctx.lineWidth = 2;
    ctx.strokeRect(430, 372, 76, 26);
    ctx.beginPath();
    ctx.moveTo(430, 372);
    ctx.lineTo(506, 398);
    ctx.moveTo(506, 372);
    ctx.lineTo(430, 398);
    ctx.stroke();
  },
};

function drawLantern(ctx, x, y, color, applied, diffId, isTarget) {
  if (isTarget && applied.has(diffId)) return;
  ctx.strokeStyle = '#3a2a55';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 14);
  ctx.lineTo(x, y - 8);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(x - 5, y - 6, 5, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd76a';
  ctx.fillRect(x - 6, y - 24, 12, 5);
  ctx.fillRect(x - 6, y + 19, 12, 5);
}

function drawStar(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawCat(ctx, x, y, earFolded) {
  // Body.
  ctx.fillStyle = '#2f2a33';
  ctx.beginPath();
  ctx.ellipse(x, y, 26, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head.
  ctx.beginPath();
  ctx.arc(x, y - 22, 16, 0, Math.PI * 2);
  ctx.fill();
  // Ears: the left one folds flat on the right panel.
  ctx.beginPath();
  if (earFolded) {
    ctx.moveTo(x - 12, y - 32);
    ctx.lineTo(x - 22, y - 26);
    ctx.lineTo(x - 8, y - 26);
  } else {
    ctx.moveTo(x - 12, y - 32);
    ctx.lineTo(x - 16, y - 46);
    ctx.lineTo(x - 4, y - 36);
  }
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 12, y - 32);
  ctx.lineTo(x + 16, y - 46);
  ctx.lineTo(x + 4, y - 36);
  ctx.closePath();
  ctx.fill();
  // Eyes.
  ctx.fillStyle = '#ffd76a';
  ctx.beginPath();
  ctx.arc(x - 6, y - 24, 2.5, 0, Math.PI * 2);
  ctx.arc(x + 6, y - 24, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // Tail curled up.
  ctx.strokeStyle = '#2f2a33';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x + 24, y + 8);
  ctx.quadraticCurveTo(x + 44, y - 2, x + 38, y - 22);
  ctx.stroke();
}
