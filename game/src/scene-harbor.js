// Scene 2 — Harbor at Dawn: a small fishing harbor as the sun comes up, drawn
// in flat vector shapes on canvas. The right panel applies seven small changes.
export const harborScene = {
  id: 'harbor',
  name: 'Harbor at Dawn',
  blurb: 'Dawn over the fishing boats. Seven small things changed between the two pictures — find them before the tide turns.',
  timeLimit: 150,
  diffs: [
    { id: 'beam', label: 'The lighthouse beam', x: 112, y: 118, r: 26 },
    { id: 'sail', label: 'The sailboat sail', x: 300, y: 200, r: 26 },
    { id: 'gull', label: 'A gull in the sky', x: 430, y: 70, r: 18 },
    { id: 'buoy', label: 'The stripe on the buoy', x: 480, y: 330, r: 20 },
    { id: 'crate', label: 'A crate on the dock', x: 120, y: 370, r: 22 },
    { id: 'fish', label: 'The jumping fish', x: 380, y: 300, r: 20 },
    { id: 'rope', label: 'The coiled rope', x: 220, y: 390, r: 20 },
  ],

  draw(ctx, w, h, applied) {
    // Dawn sky.
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#3a5a8c');
    sky.addColorStop(0.45, '#e8a06a');
    sky.addColorStop(0.62, '#f7cf8a');
    sky.addColorStop(0.63, '#3f7d8c');
    sky.addColorStop(1, '#245a6e');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Rising sun and its reflection.
    ctx.fillStyle = '#ffe9a8';
    ctx.beginPath();
    ctx.arc(300, 268, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 233, 168, 0.35)';
    ctx.beginPath();
    ctx.arc(300, 268, 48, 0, Math.PI * 2);
    ctx.fill();

    // Clouds.
    ctx.fillStyle = 'rgba(255, 240, 220, 0.85)';
    drawCloud(ctx, 90, 70);
    drawCloud(ctx, 500, 110);
    drawCloud(ctx, 350, 48);

    // Gulls: three on the left, two on the right.
    ctx.strokeStyle = '#2c2c34';
    ctx.lineWidth = 2.5;
    drawGull(ctx, 250, 60);
    drawGull(ctx, 320, 88);
    if (!applied.has('gull')) drawGull(ctx, 430, 70);

    // Lighthouse on the cliff, left.
    ctx.fillStyle = '#4a3b52';
    ctx.beginPath();
    ctx.moveTo(60, 280);
    ctx.lineTo(90, 180);
    ctx.lineTo(150, 180);
    ctx.lineTo(180, 280);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f5ead6';
    ctx.fillRect(88, 150, 64, 34);
    ctx.fillStyle = '#d94f3d';
    ctx.fillRect(88, 150, 64, 10);
    ctx.fillRect(88, 172, 64, 12);
    ctx.fillStyle = '#ffd76a';
    ctx.beginPath();
    ctx.arc(120, 138, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2c2c34';
    ctx.beginPath();
    ctx.moveTo(104, 126);
    ctx.lineTo(136, 126);
    ctx.lineTo(128, 112);
    ctx.lineTo(112, 112);
    ctx.closePath();
    ctx.fill();
    // The beam sweeps out to sea — off on the right.
    if (!applied.has('beam')) {
      ctx.fillStyle = 'rgba(255, 215, 106, 0.35)';
      ctx.beginPath();
      ctx.moveTo(120, 138);
      ctx.lineTo(330, 96);
      ctx.lineTo(330, 176);
      ctx.closePath();
      ctx.fill();
    }

    // Sea.
    ctx.fillStyle = '#2f7d8c';
    ctx.fillRect(0, 280, w, 170);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    for (const [wy, x0, x1] of [[300, 200, 420], [330, 40, 180], [360, 380, 560], [400, 120, 320], [430, 420, 580]]) {
      ctx.beginPath();
      ctx.moveTo(x0, wy);
      ctx.quadraticCurveTo((x0 + x1) / 2, wy - 8, x1, wy);
      ctx.stroke();
    }
    // Sun glitter on the water.
    ctx.fillStyle = 'rgba(255, 233, 168, 0.5)';
    for (const [gx, gy, gl] of [[280, 300, 40], [270, 320, 60], [290, 345, 34], [275, 372, 52], [300, 400, 30]]) {
      ctx.fillRect(gx, gy, gl, 4);
    }

    // Sailboat: white sail on the left, coral on the right.
    ctx.fillStyle = '#5a3a22';
    ctx.beginPath();
    ctx.moveTo(250, 300);
    ctx.lineTo(350, 300);
    ctx.lineTo(330, 322);
    ctx.lineTo(270, 322);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3a2417';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(300, 300);
    ctx.lineTo(300, 168);
    ctx.stroke();
    ctx.fillStyle = applied.has('sail') ? '#ff7f6b' : '#fdf6e3';
    ctx.beginPath();
    ctx.moveTo(300, 172);
    ctx.lineTo(300, 292);
    ctx.lineTo(344, 292);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = applied.has('sail') ? '#e86a58' : '#efe3c2';
    ctx.beginPath();
    ctx.moveTo(296, 180);
    ctx.lineTo(296, 292);
    ctx.lineTo(258, 292);
    ctx.closePath();
    ctx.fill();

    // Rowboat on the right.
    ctx.fillStyle = '#7a4a28';
    ctx.beginPath();
    ctx.ellipse(480, 372, 46, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8f5a32';
    ctx.beginPath();
    ctx.ellipse(480, 368, 46, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Buoy: red stripe on the left, plain white on the right.
    ctx.fillStyle = '#ff5a4e';
    ctx.beginPath();
    ctx.arc(480, 330, 14, 0, Math.PI * 2);
    ctx.fill();
    if (!applied.has('buoy')) {
      ctx.fillStyle = '#fdf6e3';
      ctx.fillRect(466, 326, 28, 8);
    }
    ctx.fillStyle = '#2c2c34';
    ctx.fillRect(478, 308, 4, 10);

    // A fish jumps clear of the water — only on the left.
    if (!applied.has('fish')) {
      ctx.fillStyle = '#9fd8e8';
      ctx.beginPath();
      ctx.ellipse(380, 296, 16, 7, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(394, 292);
      ctx.lineTo(404, 286);
      ctx.lineTo(402, 298);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(372, 292, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Wooden dock along the bottom, with crates and a rope coil.
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(0, 398, w, 52);
    ctx.fillStyle = '#7d5230';
    for (let x = 0; x < w; x += 60) ctx.fillRect(x, 398, 4, 52);
    // Crates: two on the left, one on the right.
    drawCrate(ctx, 92, 372);
    if (!applied.has('crate')) drawCrate(ctx, 128, 372);
    // Rope coil: present on the left, gone on the right.
    if (!applied.has('rope')) {
      ctx.strokeStyle = '#c9a86a';
      ctx.lineWidth = 4;
      for (const r of [16, 11, 6]) {
        ctx.beginPath();
        ctx.arc(220, 390, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  },
};

function drawCloud(ctx, x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 16, 0, Math.PI * 2);
  ctx.arc(x + 18, y - 6, 20, 0, Math.PI * 2);
  ctx.arc(x + 40, y, 15, 0, Math.PI * 2);
  ctx.fill();
}

function drawGull(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(x - 12, y);
  ctx.quadraticCurveTo(x - 4, y - 8, x, y);
  ctx.quadraticCurveTo(x + 4, y - 8, x + 12, y);
  ctx.stroke();
}

function drawCrate(ctx, x, y) {
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(x, y, 28, 26);
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, 28, 26);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 28, y + 26);
  ctx.moveTo(x + 28, y);
  ctx.lineTo(x, y + 26);
  ctx.stroke();
}
