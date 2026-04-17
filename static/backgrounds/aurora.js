(function () {
  'use strict';

  const VERT = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  const FRAG = `
    precision mediump float;
    uniform float u_time;
    uniform vec2  u_res;
    uniform vec3  u_primary;
    uniform vec3  u_secondary;
    uniform float u_bpm;

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      uv.y = 1.0 - uv.y;

      vec3 sky = vec3(0.006, 0.007, 0.018);
      vec3 col = sky;

      // Beat pulse
      float beat = 0.0;
      if (u_bpm > 0.0) {
        float phase = u_time * u_bpm / 60.0 * 6.28318;
        beat = pow(max(sin(phase), 0.0), 8.0);
      }

      // 5 layered aurora bands
      for (int i = 0; i < 5; i++) {
        float fi     = float(i);
        float phs    = fi * 1.2566; // 2pi/5
        float freq   = 1.0 + fi * 0.6;
        float speed  = 0.10 + fi * 0.055;
        float yBase  = 0.18 + fi * 0.155;

        float cx = sin(uv.x * freq       + u_time * speed        + phs) * 0.09
                 + sin(uv.x * freq * 1.8 + u_time * speed * 0.55 + phs + 1.9) * 0.034;
        float center = yBase + cx;

        float w    = 0.036 + beat * 0.020;
        float band = exp(-pow((uv.y - center) / w, 2.0));

        // Alternate primary / secondary per band
        vec3 bandCol = (mod(fi, 2.0) < 1.0) ? u_primary : u_secondary;
        float bright = (0.50 + fi * 0.065) * (1.0 + beat * 0.38);
        col += bandCol * band * bright;
      }

      // Soft vignette — compress band visibility toward mid-screen
      float vig = smoothstep(0.0, 0.14, uv.y) * smoothstep(1.0, 0.72, uv.y);
      col *= 0.32 + vig * 0.68;
      col += sky * 0.25; // lift the floor slightly

      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `;

  // ── WebGL helpers ────────────────────────────────────────────────────────────
  function buildGLContext(canvas) {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return null;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.warn('Shader error:', gl.getShaderInfoLog(s));
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    // Cache uniform locations
    const U = {};
    ['u_time', 'u_res', 'u_primary', 'u_secondary', 'u_bpm'].forEach(
      name => { U[name] = gl.getUniformLocation(prog, name); }
    );
    return { gl, prog, U };
  }

  // ── State ────────────────────────────────────────────────────────────────────
  let ctx       = null;
  let raf       = null;
  let startTime = null;
  let curPrimary   = [0.388, 0.400, 0.945];
  let curSecondary = [0.925, 0.286, 0.600];
  let tgtPrimary   = curPrimary.slice();
  let tgtSecondary = curSecondary.slice();
  let curBpm    = 0;

  function lerp3(cur, tgt) {
    return cur.map((v, i) => v + (tgt[i] - v) * 0.04);
  }

  function render(now) {
    raf = requestAnimationFrame(render);
    if (!startTime) startTime = now;
    const t = (now - startTime) * 0.001;
    const { gl, U } = ctx;

    // Lazy resize
    const W = gl.canvas.clientWidth  || window.innerWidth;
    const H = gl.canvas.clientHeight || window.innerHeight;
    if (gl.canvas.width !== W || gl.canvas.height !== H) {
      gl.canvas.width = W; gl.canvas.height = H;
      gl.viewport(0, 0, W, H);
    }

    // Smooth color lerp
    curPrimary   = lerp3(curPrimary,   tgtPrimary);
    curSecondary = lerp3(curSecondary, tgtSecondary);

    gl.uniform1f(U['u_time'], t);
    gl.uniform2f(U['u_res'],  W, H);
    gl.uniform3fv(U['u_primary'],   curPrimary);
    gl.uniform3fv(U['u_secondary'], curSecondary);
    gl.uniform1f(U['u_bpm'],  curBpm);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // ── Register ─────────────────────────────────────────────────────────────────
  BackgroundManager.register('aurora', {
    element: document.getElementById('aurora-bg'),
    init() {
      const canvas = document.getElementById('aurora-bg');
      ctx = buildGLContext(canvas);
    },
    start() {
      if (ctx && !raf) raf = requestAnimationFrame(render);
    },
    stop() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    },
    updateColors(p, s) {
      tgtPrimary   = BackgroundManager.hexToRgb01(p);
      tgtSecondary = BackgroundManager.hexToRgb01(s);
    },
    updateBpm(b) { curBpm = b; }
  });
})();
