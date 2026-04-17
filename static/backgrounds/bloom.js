(function () {
  'use strict';

  let canvas     = null;
  let raf        = null;
  let img        = null;
  let imgLoaded  = false;
  let imgSrc     = null;
  let primaryHex = '#6366f1';
  let beatPulse  = 0;
  let bpm        = 0;
  let lastBeat   = 0;
  let zoomStart  = Date.now();
  // Ken Burns: slow pan direction
  let panX = 0, panY = 0;
  let panDX = (Math.random() - 0.5) * 0.3;
  let panDY = (Math.random() - 0.5) * 0.2;

  function render() {
    raf = requestAnimationFrame(render);

    const cvs = canvas;
    const ctx  = cvs.getContext('2d');
    const W    = cvs.clientWidth  || window.innerWidth;
    const H    = cvs.clientHeight || window.innerHeight;
    if (cvs.width !== W || cvs.height !== H) { cvs.width = W; cvs.height = H; }

    // Beat pulse
    if (bpm > 0) {
      const interval = 60000 / bpm;
      if (Date.now() - lastBeat > interval) { lastBeat = Date.now(); beatPulse = 1.0; }
    }
    beatPulse *= 0.92;

    // ── Draw ────────────────────────────────────────────────────────────────────
    if (imgLoaded && img && img.naturalWidth > 0) {
      // Slow zoom (Ken Burns)
      const elapsed  = (Date.now() - zoomStart) / 1000;
      const ZOOM_DUR = 40; // seconds for full zoom cycle
      const zoomT    = (elapsed % (ZOOM_DUR * 2)) / ZOOM_DUR;
      const zoomEase = zoomT < 1
        ? zoomT * zoomT
        : (2 - zoomT) * zoomT - (zoomT - 1) * (zoomT - 1); // ping-pong
      const zoom = 1.12 + zoomEase * 0.10 + beatPulse * 0.018;

      // Gentle pan
      panX += panDX * 0.016;
      panY += panDY * 0.016;
      if (Math.abs(panX) > 20) panDX *= -1;
      if (Math.abs(panY) > 12) panDY *= -1;

      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight) * zoom;
      const dw = img.naturalWidth  * scale;
      const dh = img.naturalHeight * scale;
      const dx = (W - dw) / 2 + panX;
      const dy = (H - dh) / 2 + panY;

      try {
        ctx.drawImage(img, dx, dy, dw, dh);
      } catch (_) {
        // CORS blocked — fall back to color fill
        ctx.fillStyle = primaryHex;
        ctx.fillRect(0, 0, W, H);
      }
    } else {
      // No art yet — fill with primary color
      ctx.fillStyle = primaryHex;
      ctx.fillRect(0, 0, W, H);
    }

    // Dark vignette so text in ambient overlay stays readable
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.15, W / 2, H / 2, H * 0.85);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.60)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }

  BackgroundManager.register('bloom', {
    element: null, // shared canvas2d-bg — CSS class controls visibility
    init() {
      canvas = document.getElementById('canvas2d-bg');
    },
    start() {
      canvas = document.getElementById('canvas2d-bg');
      // Heavy CSS blur — GPU accelerated, free per-frame
      canvas.style.filter = 'blur(55px) saturate(140%) brightness(0.80)';
      if (!raf) raf = requestAnimationFrame(render);
    },
    stop() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (canvas) canvas.style.filter = '';
    },
    updateColors(p) {
      primaryHex = p;
    },
    updateBpm(b) {
      bpm = b;
      if (b > 0) { beatPulse = 0.8; lastBeat = Date.now(); }
    },
    updateArt(url) {
      if (!url || url === imgSrc) return;
      imgSrc = url;
      const newImg = new Image();
      newImg.crossOrigin = 'anonymous';
      newImg.onload = () => {
        img = newImg;
        imgLoaded = true;
        zoomStart = Date.now();
        panX = 0; panY = 0;
        panDX = (Math.random() - 0.5) * 0.3;
        panDY = (Math.random() - 0.5) * 0.2;
      };
      newImg.onerror = () => {
        img = null;
        imgLoaded = false;
      };
      newImg.src = url;
    }
  });
})();
