(() => {
  const P = 4;  // size of one art pixel in CSS px
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  function drawScene(canvas) {
    const W = Math.ceil(canvas.clientWidth / P), H = Math.ceil(canvas.clientHeight / P);
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    seed = 7;
    const ground = H - 6;
    const stone = ['#2a2620', '#2f2a23', '#26231e', '#332d25', '#2b2722'];
    const mid = Math.floor(W / 2);
    // Oxford-ish skyline: college ranges with spires, and the Radcliffe Camera dome, kept clear of the centre.
    let x = 0;
    while (x < W) {
      const w = 8 + Math.floor(rnd() * 10), h = 14 + Math.floor(rnd() * 16);
      if (x + w > mid - 22 && x < mid + 22) { x = mid + 22; continue; }
      const col = stone[Math.floor(rnd() * stone.length)];
      ctx.fillStyle = col; ctx.fillRect(x, ground - h, w, h);
      // crenellations or a spire
      if (rnd() < 0.35) {
        const sx = x + Math.floor(w / 2);
        for (let i = 0; i < 9; i++) { ctx.fillRect(sx - Math.floor((9 - i) / 3), ground - h - i, 1 + 2 * Math.floor((9 - i) / 3), 1); }
        ctx.fillRect(sx, ground - h - 12, 1, 3);
      } else {
        for (let cx = x; cx < x + w; cx += 2) ctx.fillRect(cx, ground - h - 1, 1, 1);
      }
      // warm windows, some lit
      for (let wy = ground - h + 3; wy < ground - 3; wy += 4)
        for (let wx = x + 2; wx < x + w - 1; wx += 3) {
          ctx.fillStyle = rnd() < 0.3 ? '#e8c27a' : '#1b1915';
          ctx.fillRect(wx, wy, 1, 2);
        }
      x += w + (rnd() < 0.3 ? 1 : 0);
    }
    // Radcliffe Camera on the left third
    const rc = Math.max(18, Math.floor(W * 0.2));
    if (rc + 10 < mid - 22) {
      ctx.fillStyle = '#3a3229';
      ctx.fillRect(rc - 10, ground - 16, 21, 16);
      for (let i = 0; i < 9; i++) { const half = Math.round(Math.sqrt(81 - i * i)); ctx.fillRect(rc - half, ground - 17 - i, half * 2 + 1, 1); }
      ctx.fillRect(rc - 1, ground - 29, 3, 3); ctx.fillRect(rc, ground - 31, 1, 2);
      ctx.fillStyle = '#e8c27a';
      for (let wx = rc - 8; wx <= rc + 8; wx += 4) ctx.fillRect(wx, ground - 12, 1, 3);
    }
    // Lincoln College Library (All Saints): nave, square tower, columned drum and tall spire, right third
    const lx = Math.max(mid + 30, Math.floor(W * 0.78));
    if (lx + 6 < W) {
      ctx.fillStyle = '#3a3229';
      ctx.fillRect(lx + 4, ground - 14, 16, 14);                       // nave
      for (let cx = lx + 4; cx < lx + 20; cx += 3) ctx.fillRect(cx, ground - 15, 1, 1); // balustrade
      ctx.fillRect(lx - 4, ground - 22, 9, 22);                         // tower
      ctx.fillRect(lx - 5, ground - 22, 11, 1);                         // cornice
      ctx.fillRect(lx - 3, ground - 26, 7, 4);                          // belfry stage
      ctx.fillRect(lx - 4, ground - 24, 1, 2); ctx.fillRect(lx + 4, ground - 24, 1, 2); // urns
      ctx.fillRect(lx - 3, ground - 27, 7, 1);
      for (let cx = lx - 3; cx <= lx + 3; cx += 2) ctx.fillRect(cx, ground - 31, 1, 4); // peristyle columns
      ctx.fillRect(lx - 3, ground - 32, 7, 1);
      for (let i = 0; i < 10; i++) { const half = i < 3 ? 2 : i < 7 ? 1 : 0; ctx.fillRect(lx - half, ground - 33 - i, half * 2 + 1, 1); } // spire
      ctx.fillRect(lx, ground - 45, 1, 2);                              // finial
      ctx.fillStyle = '#e8c27a';
      for (let wx = lx + 6; wx < lx + 19; wx += 4) ctx.fillRect(wx, ground - 11, 2, 6); // tall library windows
      ctx.fillRect(lx, ground - 18, 1, 3);                              // tower window
    }
    // ground line
    ctx.fillStyle = '#1d1d21'; ctx.fillRect(0, ground, W, H - ground);
    // centre: an empty bench with a stack of books and a coffee
    const bx = mid - 12;
    ctx.fillStyle = '#4a3a2c'; ctx.fillRect(bx, ground - 7, 26, 2); ctx.fillRect(bx + 1, ground - 5, 1, 5); ctx.fillRect(bx + 24, ground - 5, 1, 5);
    const books = ['#8c3b3b', '#3d5a80', '#b8894d', '#4f6b4a'];
    books.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(bx - 9 + (i % 2), ground - 3 - i * 2, 8, 2); });
    ctx.fillStyle = '#d9d4cc'; ctx.fillRect(bx + 21, ground - 10, 3, 3); ctx.fillRect(bx + 24, ground - 9, 1, 1);
    ctx.fillStyle = '#6b4a35'; ctx.fillRect(bx + 21, ground - 10, 3, 1);
    ctx.fillStyle = '#5a5a60'; ctx.fillRect(bx + 22, ground - 13, 1, 1); ctx.fillRect(bx + 23, ground - 15, 1, 1);
  }

  function drawSky(canvas) {
    const W = Math.ceil(innerWidth / P), H = Math.ceil(innerHeight / P);
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    seed = 3;
    // sparse stars, kept out of the text column
    const colL = (innerWidth / 2 - 340) / P, colR = (innerWidth / 2 + 340) / P;
    for (let i = 0; i < W * H / 1400; i++) {
      const sx = Math.floor(rnd() * W), sy = Math.floor(rnd() * H), bright = rnd() < 0.25;
      if (sx > colL && sx < colR) continue;
      ctx.fillStyle = bright ? '#5d5d66' : '#2e2e35'; ctx.fillRect(sx, sy, 1, 1);
    }
    // crescent moon, top right
    const mx = W - 12, my = 8;
    ctx.fillStyle = '#d9d4c4';
    for (let y = -5; y <= 5; y++) for (let x = -5; x <= 5; x++)
      if (x * x + y * y <= 25 && (x - 2) * (x - 2) + (y + 1) * (y + 1) > 16) ctx.fillRect(mx + x, my + y, 1, 1);
  }

  const scene = document.querySelector('.scene canvas'), sky = document.querySelector('.sky canvas');
  const render = () => { if (scene) drawScene(scene); if (sky) drawSky(sky); };
  render(); addEventListener('resize', render);
})();
