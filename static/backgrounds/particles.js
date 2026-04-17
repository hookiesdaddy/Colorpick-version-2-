(function () {
  'use strict';

  const COUNT = 85;

  let canvas = null;
  let raf    = null;
  let W = 0, H = 0;
  let particles   = [];
  let primaryRgb  = { r: 99,  g: 102, b: 241 };
  let secondaryRgb = { r: 236, g: 72,  b: 153 };
  let beatPulse   = 0;
  let bpm         = 0;
  let lastBeat    = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function hexToRgb(hex) {
    hex = (hex || '#6366f1').replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const n = parseInt(hex, 16);
    return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 };
  }

  function makeParticle() {
    return {
      x:          rand(0, W),
      y:          rand(0, H),
      vx:         rand(-0.18, 0.18),
      vy:         rand(-0.20, -0.04),
      radius:     rand(2.5, 6.0),
      alpha:      rand(0.25, 0.75),
      alphaDir:   Math.random() < 0.5 ? 1 : -1,
      alphaSpeed: rand(0.0015, 0.005),
      isPrimary:  Math.random() < 0.58
    };
  }

  function render() {
    raf = requestAnimationFrame(render);

    // Resize
    const cw = canvas.clientWidth  || window.innerWidth;
    const ch = canvas.clientHeight || window.innerHeight;
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw; canvas.height = ch;
      W = cw; H = ch;
    }

    const ctx = canvas.getContext('2d');

    // Beat detection
    if (bpm > 0) {
      const interval = 60000 / bpm;
      if (Date.now() - lastBeat > interval) { lastBeat = Date.now(); beatPulse = 1.0; }
    }
    beatPulse *= 0.90;

    // Motion-blur trail instead of hard clear
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, W, H);

    particles.forEach(pt => {
      // Move
      pt.x += pt.vx;
      pt.y += pt.vy;
      if (pt.x < -60)    pt.x = W + 60;
      if (pt.x > W + 60) pt.x = -60;
      if (pt.y < -60)  { pt.x = rand(0, W); pt.y = H + 60; }

      // Breathe
      pt.alpha += pt.alphaDir * pt.alphaSpeed;
      if (pt.alpha > 0.82 || pt.alpha < 0.12) pt.alphaDir *= -1;

      const rgb = pt.isPrimary ? primaryRgb : secondaryRgb;
      const r   = pt.radius * (1 + beatPulse * 0.55);
      const glow = r * 4.5;

      const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, glow);
      g.addColorStop(0,   `rgba(${rgb.r},${rgb.g},${rgb.b},${pt.alpha.toFixed(2)})`);
      g.addColorStop(0.4, `rgba(${rgb.r},${rgb.g},${rgb.b},${(pt.alpha * 0.3).toFixed(2)})`);
      g.addColorStop(1,   `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, glow, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  BackgroundManager.register('particles', {
    element: null, // shared canvas — visibility controlled by CSS class
    init() {
      canvas = document.getElementById('canvas2d-bg');
      W = canvas.clientWidth  || window.innerWidth;
      H = canvas.clientHeight || window.innerHeight;
      particles = Array.from({ length: COUNT }, makeParticle);
    },
    start() {
      canvas = document.getElementById('canvas2d-bg');
      canvas.style.filter = '';
      if (!raf) raf = requestAnimationFrame(render);
    },
    stop() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    },
    updateColors(p, s) {
      primaryRgb   = hexToRgb(p);
      secondaryRgb = hexToRgb(s);
    },
    updateBpm(b) {
      bpm = b;
      if (b > 0) { beatPulse = 1.0; lastBeat = Date.now(); }
    }
  });
})();
