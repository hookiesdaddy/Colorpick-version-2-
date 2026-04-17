(function () {
  'use strict';

  const VERT = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  // Domain-warped fbm noise — organic ink-in-water look
  const FRAG = `
    precision mediump float;
    uniform float u_time;
    uniform vec2  u_res;
    uniform vec3  u_primary;
    uniform vec3  u_secondary;
    uniform float u_bpm;

    // Value noise
    float hash(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p.x + p.y * 57.0) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i),              hash(i + vec2(1,0)), u.x),
        mix(hash(i + vec2(0,1)),  hash(i + vec2(1,1)), u.x),
        u.y);
    }

    // Fractional Brownian motion — 4 octaves
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p  = rot * p * 2.0 + vec2(1.7, 9.2);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;

      // Beat-driven warp speed
      float beat = 0.0;
      if (u_bpm > 0.0) {
        float ph = u_time * u_bpm / 60.0 * 6.28318;
        beat = pow(max(sin(ph), 0.0), 6.0);
      }
      float spd = 0.055 + beat * 0.10;

      vec2 p = uv * 2.8;

      // Two-level domain warp
      vec2 q = vec2(
        fbm(p + u_time * spd),
        fbm(p + vec2(5.2, 1.3) + u_time * spd * 0.75)
      );
      vec2 r = vec2(
        fbm(p + q + vec2(1.7, 9.2)  + u_time * spd * 0.45),
        fbm(p + q + vec2(8.3, 2.8)  + u_time * spd * 0.38)
      );

      float t = fbm(p + r * 1.3);
      t = smoothstep(0.28, 0.72, t);

      // Ink mass — how much ink is here (vs clear water)
      float mass = fbm(uv * 2.0 + q * 0.6 + u_time * 0.025);
      mass = pow(clamp(mass * 1.6, 0.0, 1.0), 1.5);

      vec3 base = vec3(0.007, 0.005, 0.015);
      vec3 inkCol = mix(u_primary, u_secondary, t);

      // Ink bleeds out of dark background
      vec3 col = mix(base, inkCol * 0.9, mass + beat * 0.12);

      // Subtle edge vignette
      vec2 vUV = uv * 2.0 - 1.0;
      float vig = 1.0 - dot(vUV * 0.5, vUV * 0.5);
      col *= 0.55 + clamp(vig, 0.0, 1.0) * 0.45;

      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `;

  // ── WebGL bootstrap ──────────────────────────────────────────────────────────
  function buildGL(canvas) {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return null;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.warn('Ink shader:', gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = {};
    ['u_time','u_res','u_primary','u_secondary','u_bpm'].forEach(
      n => { U[n] = gl.getUniformLocation(prog, n); });
    return { gl, U };
  }

  // ── State ────────────────────────────────────────────────────────────────────
  let ctx = null, raf = null, startTime = null;
  let curP = [0.388,0.4,0.945], curS = [0.925,0.286,0.6];
  let tgtP = curP.slice(), tgtS = curS.slice();
  let curBpm = 0;

  const lerp3 = (c, t) => c.map((v, i) => v + (t[i] - v) * 0.035);

  function render(now) {
    raf = requestAnimationFrame(render);
    if (!startTime) startTime = now;
    const elapsed = (now - startTime) * 0.001;
    const { gl, U } = ctx;

    const W = gl.canvas.clientWidth  || window.innerWidth;
    const H = gl.canvas.clientHeight || window.innerHeight;
    if (gl.canvas.width !== W || gl.canvas.height !== H) {
      gl.canvas.width = W; gl.canvas.height = H;
      gl.viewport(0, 0, W, H);
    }

    curP = lerp3(curP, tgtP);
    curS = lerp3(curS, tgtS);

    gl.uniform1f(U['u_time'], elapsed);
    gl.uniform2f(U['u_res'],  W, H);
    gl.uniform3fv(U['u_primary'],   curP);
    gl.uniform3fv(U['u_secondary'], curS);
    gl.uniform1f(U['u_bpm'], curBpm);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // ── Register ─────────────────────────────────────────────────────────────────
  BackgroundManager.register('ink', {
    element: document.getElementById('ink-bg'),
    init() {
      ctx = buildGL(document.getElementById('ink-bg'));
    },
    start() {
      if (ctx && !raf) raf = requestAnimationFrame(render);
    },
    stop() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    },
    updateColors(p, s) {
      tgtP = BackgroundManager.hexToRgb01(p);
      tgtS = BackgroundManager.hexToRgb01(s);
    },
    updateBpm(b) { curBpm = b; }
  });
})();
