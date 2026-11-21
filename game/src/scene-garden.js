// Scene 3 — Moonlit Garden: a quiet pond garden under a full moon, drawn in
// flat vector shapes on canvas. The right panel applies seven small changes.
export const gardenScene = {
  id: 'garden',
  name: 'Moonlit Garden',
  blurb: 'A frog, a pond and a paper moon. Seven small things changed between the two pictures — find them before midnight.',
  timeLimit: 180,
  diffs: [
    { id: 'frog-eye', label: "The frog's wink", x: 300, y: 330, r: 20 },
    { id: 'lily-flower', label: 'The lily flower', x: 360, y: 360, r: 20 },
    { id: 'firefly', label: 'A firefly', x: 150, y: 120, r: 16 },
    { id: 'lantern-flame', label: 'The flame in the stone lantern', x: 490, y: 250, r: 20 },
    { id: 'plank', label: 'A plank on the bridge', x: 300, y: 180, r: 22 },
    { id: 'moon-pond', label: "The moon's reflection", x: 420, y: 390, r: 22 },
    { id: 'butterfly', label: 'The butterfly', x: 180, y: 220, r: 18 },
  ],

  draw(ctx, w, h, applied) {
    // Night sky.
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0d1233');
    sky.addColorStop(0.6, '#274060');
    sky.addColorStop(1, '#3d6b5a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Big moon and stars.
    ctx.fillStyle = '#ffedbe';
    ctx.beginPath();
    ctx.arc(470, 70, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 237, 190, 0.25)';
    ctx.beginPath();
    ctx.arc(470, 70, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffeecf';
    for (const [sx, sy] of [[60, 50], [150, 36], [260, 70], [350, 40], [540, 130], [90, 140], [410, 120]]) {
      ctx.beginPath();
      ctx.arc(sx, sy, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fireflies: four on the left, three on the right.
    const flies = [[150, 120], [220, 90], [90, 200], [330, 110]];
    for (let i = 0; i < flies.length; i++) {
      if (applied.has('firefly') && i === 0) continue;
      const [fx, fy] = flies[i];
      ctx.fillStyle = 'rgba(190, 255, 120, 0.35)';
      ctx.beginPath();
      ctx.arc(fx, fy, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d8ff7a';
      ctx.beginPath();
      ctx.arc(fx, fy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Willow tree on the left.
    ctx.fillStyle = '#4a2c1a';
    ctx.fillRect(48, 180, 26, 150);
    ctx.fillStyle = '#2e5d43';
    ctx.beginPath();
    ctx.arc(60, 150, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3f7d5a';
    ctx.lineWidth = 3;
    for (const [bx, by, ex, ey] of [[30, 170, 18, 250], [60, 180, 58, 260], [92, 168, 108, 244], [44, 150, 34, 210]]) {
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx - 6, (by + ey) / 2, ex, ey);
      ctx.stroke();
    }

    // Arched bridge across the back of the pond.
    ctx.fillStyle = '#8a2f2f';
    ctx.beginPath();
    ctx.moveTo(200, 210);
    ctx.quadraticCurveTo(300, 130, 400, 210);
    ctx.lineTo(400, 226);
    ctx.quadraticCurveTo(300, 150, 200, 226);
    ctx.closePath();
    ctx.fill();
    // Bridge planks: five on the left, four on the right.
    ctx.fillStyle = '#c9a86a';
    const planks = [[232, 186], [266, 172], [300, 168], [334, 172], [368, 186]];
    for (let i = 0; i < planks.length; i++) {
      if (applied.has('plank') && i === 2) continue;
      ctx.fillRect(planks[i][0] - 12, planks[i][1], 24, 6);
    }

    // A butterfly rests on a leaf — only on the left.
    if (!applied.has('butterfly')) {
      ctx.fillStyle = '#ff9de2';
      ctx.beginPath();
      ctx.ellipse(172, 214, 9, 6, -0.6, 0, Math.PI * 2);
      ctx.ellipse(188, 214, 9, 6, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#5a2a44';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(180, 210);
      ctx.lineTo(180, 222);
      ctx.stroke();
    }

    // Pond.
    ctx.fillStyle = '#1d4e5f';
    ctx.beginPath();
    ctx.ellipse(300, 360, 260, 78, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(160, 220, 230, 0.4)';
    ctx.lineWidth = 2;
    for (const [wy, x0, x1] of [[330, 120, 260], [360, 320, 470], [395, 180, 340]]) {
      ctx.beginPath();
      ctx.moveTo(x0, wy);
      ctx.quadraticCurveTo((x0 + x1) / 2, wy - 6, x1, wy);
      ctx.stroke();
    }
    // The moon's reflection shimmers on the pond — gone on the right.
    if (!applied.has('moon-pond')) {
      ctx.fillStyle = 'rgba(255, 237, 190, 0.55)';
      for (const [rx, ry, rl] of [[410, 372, 36], [418, 388, 24], [408, 404, 30]]) {
        ctx.fillRect(rx, ry, rl, 4);
      }
    }

    // Lily pads and the flower: pink on the left, white on the right.
    ctx.fillStyle = '#2e7d43';
    for (const [lx, ly, lr] of [[210, 350, 26], [360, 360, 24], [450, 340, 20], [140, 380, 18]]) {
      ctx.beginPath();
      ctx.arc(lx, ly, lr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = applied.has('lily-flower') ? '#fdf6e3' : '#ff7fb0';
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.ellipse(360 + Math.cos(a) * 9, 352 + Math.sin(a) * 9, 7, 4, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffd76a';
    ctx.beginPath();
    ctx.arc(360, 352, 4, 0, Math.PI * 2);
    ctx.fill();

    // The frog on its pad: both eyes open on the left, winking on the right.
    ctx.fillStyle = '#58b368';
    ctx.beginPath();
    ctx.ellipse(300, 336, 26, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(288, 318, 9, 0, Math.PI * 2);
    ctx.arc(312, 318, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1d1d24';
    ctx.beginPath();
    ctx.arc(288, 318, 3.5, 0, Math.PI * 2);
    ctx.fill();
    if (applied.has('frog-eye')) {
      // Wink: a closed curve instead of an open eye.
      ctx.strokeStyle = '#1d1d24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(312, 318, 5, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(312, 318, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#1d1d24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(300, 334, 10, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    // Stone lantern on the right bank: flame lit on the left, out on the right.
    ctx.fillStyle = '#6b6b72';
    ctx.fillRect(478, 268, 24, 60);
    ctx.fillRect(470, 252, 40, 16);
    ctx.beginPath();
    ctx.moveTo(466, 252);
    ctx.lineTo(490, 228);
    ctx.lineTo(514, 252);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#3a3a42';
    ctx.fillRect(482, 270, 16, 26);
    if (!applied.has('lantern-flame')) {
      ctx.fillStyle = '#ffb347';
      ctx.beginPath();
      ctx.ellipse(490, 282, 5, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 179, 71, 0.35)';
      ctx.beginPath();
      ctx.arc(490, 282, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // Garden grass and flowers along the bottom.
    ctx.fillStyle = '#1d3a2a';
    ctx.fillRect(0, 420, w, 30);
    for (const [fx, fy, fc] of [[80, 428, '#ff7fb0'], [160, 432, '#ffd76a'], [520, 428, '#ff7fb0'], [560, 434, '#9fd8e8'], [40, 436, '#ffd76a']]) {
      ctx.fillStyle = fc;
      ctx.beginPath();
      ctx.arc(fx, fy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd76a';
      ctx.beginPath();
      ctx.arc(fx, fy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};
