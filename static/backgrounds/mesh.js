(function () {
  'use strict';

  const container = document.getElementById('mesh-bg');

  // Orb configs: position %, size vmax, which color, animation duration
  const CONFIGS = [
    { x: 18, y: 22, size: 62, role: 'primary',   dur: 16 },
    { x: 78, y: 68, size: 66, role: 'secondary',  dur: 20 },
    { x: 52, y: 48, size: 48, role: 'primary',    dur: 13 },
    { x: 14, y: 72, size: 54, role: 'secondary',  dur: 18 },
    { x: 82, y: 18, size: 54, role: 'primary',    dur: 22 },
    { x: 45, y: 85, size: 44, role: 'secondary',  dur: 15 },
  ];

  let orbs = [];

  // ── CSS keyframes (injected once) ───────────────────────────────────────────
  (function injectKeyframes() {
    const css = `
      #mesh-bg {
        background: var(--bg);
        transition: background 1.2s ease;
      }
      .mesh-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(90px);
        opacity: 0.65;
        will-change: transform;
        pointer-events: none;
        transition: background-color 1.4s ease;
      }
      @keyframes mesh-drift-0 {
        0%   { transform: translate(-50%,-50%) translate(0px, 0px); }
        33%  { transform: translate(-50%,-50%) translate(40px, -30px); }
        66%  { transform: translate(-50%,-50%) translate(-25px, 35px); }
        100% { transform: translate(-50%,-50%) translate(15px, -15px); }
      }
      @keyframes mesh-drift-1 {
        0%   { transform: translate(-50%,-50%) translate(0px, 0px); }
        40%  { transform: translate(-50%,-50%) translate(-50px, 25px); }
        70%  { transform: translate(-50%,-50%) translate(30px, -40px); }
        100% { transform: translate(-50%,-50%) translate(-10px, 20px); }
      }
      @keyframes mesh-drift-2 {
        0%   { transform: translate(-50%,-50%) translate(0px, 0px); }
        30%  { transform: translate(-50%,-50%) translate(30px, 45px); }
        65%  { transform: translate(-50%,-50%) translate(-40px, -20px); }
        100% { transform: translate(-50%,-50%) translate(20px, 10px); }
      }
      @keyframes mesh-drift-3 {
        0%   { transform: translate(-50%,-50%) translate(0px, 0px); }
        45%  { transform: translate(-50%,-50%) translate(55px, -35px); }
        75%  { transform: translate(-50%,-50%) translate(-20px, 50px); }
        100% { transform: translate(-50%,-50%) translate(35px, -25px); }
      }
      @keyframes mesh-drift-4 {
        0%   { transform: translate(-50%,-50%) translate(0px, 0px); }
        35%  { transform: translate(-50%,-50%) translate(-45px, -45px); }
        68%  { transform: translate(-50%,-50%) translate(35px, 30px); }
        100% { transform: translate(-50%,-50%) translate(-15px, -10px); }
      }
      @keyframes mesh-drift-5 {
        0%   { transform: translate(-50%,-50%) translate(0px, 0px); }
        42%  { transform: translate(-50%,-50%) translate(25px, 55px); }
        72%  { transform: translate(-50%,-50%) translate(-50px, -30px); }
        100% { transform: translate(-50%,-50%) translate(10px, 25px); }
      }
      body.ambient-mesh.mesh-beating #mesh-bg {
        animation: mesh-pulse var(--mesh-beat-dur, 0.5s) ease-out infinite;
      }
      @keyframes mesh-pulse {
        0%   { filter: brightness(1); }
        12%  { filter: brightness(1.22); }
        100% { filter: brightness(1); }
      }
    `;
    const el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
  })();

  // ── Register ─────────────────────────────────────────────────────────────────
  BackgroundManager.register('mesh', {
    element: container,
    init() {
      orbs = CONFIGS.map((cfg, i) => {
        const el = document.createElement('div');
        el.className = 'mesh-orb';
        el.style.cssText = `
          width: ${cfg.size}vmax;
          height: ${cfg.size}vmax;
          left: ${cfg.x}%;
          top: ${cfg.y}%;
          animation: mesh-drift-${i} ${cfg.dur}s ease-in-out infinite alternate;
        `;
        container.appendChild(el);
        return { el, role: cfg.role };
      });
    },
    start() { /* CSS animation runs when body class is present */ },
    stop()  { /* CSS handles pause via body class removal */ },
    updateColors(p, s) {
      orbs.forEach(({ el, role }) => {
        el.style.backgroundColor = role === 'primary' ? p : s;
      });
    },
    updateBpm(b) {
      document.body.style.setProperty('--mesh-beat-dur',
        b > 0 ? (60 / b).toFixed(3) + 's' : '0s');
      document.body.classList.toggle('mesh-beating', b > 0);
    }
  });
})();
