'use strict';
/* Liquid Glass — WebGL raymarching background
   Morphing blob that reacts to the current album's primary/secondary colors. */
(function () {
  const canvas = document.getElementById('liquid-glass-bg');
  if (!canvas) return;

  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) { canvas.style.display = 'none'; return; }

  const SCALE = 1.0; // full native res — no upscaling blur

  function resize() {
    canvas.width  = Math.round(window.innerWidth  * SCALE * devicePixelRatio);
    canvas.height = Math.round(window.innerHeight * SCALE * devicePixelRatio);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  // ── Fullscreen quad ───────────────────────────────────────────────
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  function mkShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(s)); return null;
    }
    return s;
  }

  const vert = mkShader(gl.VERTEX_SHADER, `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `);

  const frag = mkShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    uniform float u_time;
    uniform vec2  u_res;
    uniform vec3  u_primary;
    uniform vec3  u_secondary;
    uniform float u_bpm;
    uniform float u_light; /* 1.0 = light mode, 0.0 = dark */

    /* ── Value noise ─────────────────────────────────────────────── */
    float hash(vec3 p) {
      p = fract(p * vec3(127.1, 311.7, 74.7));
      p += dot(p, p.yxz + 19.19);
      return fract((p.x + p.y) * p.z);
    }
    float vnoise(vec3 p) {
      vec3 i = floor(p), f = fract(p);
      f = f*f*(3.0 - 2.0*f);
      return mix(
        mix(mix(hash(i),            hash(i+vec3(1,0,0)), f.x),
            mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)), f.x),
            mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)), f.x), f.y), f.z);
    }
    /* ── Smooth-min (polynomial) ─────────────────────────────────── */
    float smin(float a, float b, float k) {
      float h = max(k - abs(a - b), 0.0) / k;
      return min(a, b) - h * h * k * 0.25;
    }

    /* ── Blob SDF — smooth-min of orbiting spheres ───────────────── */
    /* True SDF: never self-intersects, no fold-through artifacts.   */
    float sdf(vec3 p) {
      float t = u_time;
      /* Central sphere */
      float d = length(p) - 0.88;
      /* Three satellite lobes orbiting at different speeds/axes */
      d = smin(d, length(p - vec3(sin(t*0.11)*0.52, cos(t*0.13)*0.48, sin(t*0.09)*0.44)) - 0.62, 0.44);
      d = smin(d, length(p - vec3(cos(t*0.07)*0.58, sin(t*0.15)*0.52, cos(t*0.12)*0.48)) - 0.58, 0.44);
      d = smin(d, length(p - vec3(sin(t*0.14)*0.44, cos(t*0.08)*0.56, sin(t*0.17)*0.50)) - 0.54, 0.40);
      /* Mild surface texture — small enough to never cause folds    */
      d += (vnoise(p * 2.8 + t * 0.05) - 0.5) * 0.055;
      return d;
    }

    /* ── Sphere-trace ────────────────────────────────────────────── */
    /* True SDF: can use aggressive step size, fewer iterations.     */
    float march(vec3 ro, vec3 rd) {
      float t = 0.4;
      for (int i = 0; i < 64; i++) {
        float d = sdf(ro + rd * t);
        if (d < 0.002) return t;
        if (t > 4.5)   return -1.0;
        t += d * 0.88;
      }
      return -1.0;
    }

    /* ── Normal ──────────────────────────────────────────────────── */
    vec3 calcNormal(vec3 p) {
      const float e = 0.003;
      return normalize(vec3(
        sdf(p+vec3(e,0,0)) - sdf(p-vec3(e,0,0)),
        sdf(p+vec3(0,e,0)) - sdf(p-vec3(0,e,0)),
        sdf(p+vec3(0,0,e)) - sdf(p-vec3(0,0,e))
      ));
    }

    /* ── Album-reactive palette ──────────────────────────────────── */
    /* Blends primary↔secondary with a mild iridescent shimmer.      */
    vec3 palette(float t) {
      float blend = sin(t * 6.2832) * 0.5 + 0.5;
      vec3 col = mix(u_primary, u_secondary, blend);

      /* Restrained brightness — preserve hue, avoid blowout */
      col = clamp(col * 1.08, 0.0, 1.0);
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(vec3(lum), col, 1.4); /* push saturation without lifting brightness */

      /* Very subtle shimmer — just a hint, not a white wash */
      float shimmer = pow(max(sin(t * 6.2832 * 1.5 + 0.9), 0.0), 8.0);
      col = mix(col, vec3(1.0, 0.97, 0.94), shimmer * 0.10);

      return clamp(col, 0.0, 1.0);
    }

    /* ── Single-sample render at a given fragment coord ─────────── */
    vec3 render(vec2 fc) {
      vec2 uv = (fc * 2.0 - u_res) / min(u_res.x, u_res.y);

      vec3 ro = vec3(0.0, 0.0, 3.2);
      vec3 rd = normalize(vec3(uv.x, uv.y, -2.0));

      /* Atmospheric background */
      float bgD    = length(uv);
      vec3  midCol = mix(u_primary, u_secondary, 0.5);
      /* Base: near-black in dark mode, light lavender in light mode  */
      vec3  bg     = mix(vec3(0.007, 0.007, 0.010), vec3(0.847, 0.847, 0.910), u_light);
      /* Reduced glow — just enough to show the orb colors bleed out  */
      bg += midCol    * mix(0.12, 0.05, u_light) * exp(-bgD * 1.3);
      bg += u_primary * mix(0.05, 0.02, u_light) * exp(-bgD * 0.6);

      vec3 col = bg;

      float hit = march(ro, rd);

      if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = calcNormal(p);
        vec3 v = -rd;
        vec3 r = reflect(rd, n);

        float fr  = pow(1.0 - max(dot(n, v), 0.0), 2.2);

        float hue = dot(n, vec3(0.55, 0.80, 0.30))
                  + vnoise(p * 2.0 + u_time * 0.03) * 0.40;
        hue = fract(hue * 0.65 + u_time * 0.018);

        vec3 surf = palette(hue) * 1.05;

        float s1 = pow(max(dot(r, normalize(vec3( 1.6, 2.2, 1.3))), 0.0), 160.0);
        float s2 = pow(max(dot(r, normalize(vec3(-1.3,-0.9, 1.0))), 0.0),  48.0);
        float s3 = pow(max(dot(r, normalize(vec3( 0.4,-1.9, 0.9))), 0.0),  36.0);
        float rim = pow(1.0 - max(dot(n, v), 0.0), 5.0);

        col  = surf * mix(0.60, 0.92, fr);
        col += vec3(1.00, 0.98, 0.95)           * s1 * 0.9;
        col += mix(u_secondary, vec3(1.0), 0.4) * s2 * 0.6;
        col += mix(u_primary,   vec3(1.0), 0.3) * s3 * 0.5;
        col += u_secondary * 1.0                * rim * 0.4;

        float edgeFade = 1.0 - smoothstep(0.0, 0.18, fr);
        col = mix(col, bg * 2.5, (1.0 - edgeFade) * fr * 0.3);
      }

      /* Vignette (pre-gamma, shared across samples) */
      vec2 uvv = (fc * 2.0 - u_res) / min(u_res.x, u_res.y);
      col *= 1.0 - 0.28 * dot(uvv * 0.5, uvv * 0.5);

      return col;
    }

    void main() {
      /* 2-sample rotated-grid SSAA — smooth sub-pixel edges cheaply */
      vec3 col  = render(gl_FragCoord.xy + vec2( 0.25,  0.25));
           col += render(gl_FragCoord.xy + vec2(-0.25, -0.25));
      col *= 0.5;

      /* Beat brightness flash (applied once, after averaging) */
      if (u_bpm > 0.0) {
        float beat = pow(max(sin(u_time * u_bpm / 60.0 * 6.2832), 0.0), 3.0);
        col *= 1.0 + beat * 0.50;
      }

      col = pow(max(col, 0.0), vec3(0.4545));
      gl_FragColor = vec4(col, 1.0);
    }
  `);

  if (!vert || !frag) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vert); gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(prog));
    canvas.style.display = 'none'; return;
  }
  gl.useProgram(prog);

  const aPos      = gl.getAttribLocation(prog,  'a_pos');
  const uTime     = gl.getUniformLocation(prog, 'u_time');
  const uRes      = gl.getUniformLocation(prog, 'u_res');
  const uPrimary  = gl.getUniformLocation(prog, 'u_primary');
  const uSecondary= gl.getUniformLocation(prog, 'u_secondary');
  const uBpm      = gl.getUniformLocation(prog, 'u_bpm');
  const uLight    = gl.getUniformLocation(prog, 'u_light');

  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // ── Color helpers ─────────────────────────────────────────────────
  function hexToRgb(hex) {
    if (!hex || hex.length < 7) return null;
    hex = hex.trim();
    return [
      parseInt(hex.slice(1,3), 16) / 255,
      parseInt(hex.slice(3,5), 16) / 255,
      parseInt(hex.slice(5,7), 16) / 255,
    ];
  }

  // Ensure BPM is always 0 until a track explicitly sets it
  window._trackBpm = 0;

  const DEFAULT_PRIMARY   = [0.388, 0.400, 0.945]; /* logo purple #6366f1 */
  const DEFAULT_SECONDARY = [0.925, 0.282, 0.600]; /* logo pink  #ec4899 */

  let curPrimary   = DEFAULT_PRIMARY.slice();
  let curSecondary = DEFAULT_SECONDARY.slice();
  let tgtPrimary   = DEFAULT_PRIMARY.slice();
  let tgtSecondary = DEFAULT_SECONDARY.slice();

  function updateTargets() {
    const style = getComputedStyle(document.documentElement);
    const p = hexToRgb(style.getPropertyValue('--accent').trim());
    const s = hexToRgb(style.getPropertyValue('--secondary-color').trim());
    if (p) tgtPrimary   = p;
    if (s) tgtSecondary = s;
  }

  updateTargets();

  // ── Render loop ───────────────────────────────────────────────────
  let startMs    = performance.now();
  let rafId      = null;
  let frameCount = 0;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function draw() {
    if (window._bgTheme === 'orbs') { rafId = requestAnimationFrame(draw); return; }

    if (frameCount++ % 30 === 0) updateTargets();

    const k = 0.04;
    for (let i = 0; i < 3; i++) {
      curPrimary[i]   = lerp(curPrimary[i],   tgtPrimary[i],   k);
      curSecondary[i] = lerp(curSecondary[i], tgtSecondary[i], k);
    }

    gl.uniform1f(uTime,      (performance.now() - startMs) / 1000);
    gl.uniform2f(uRes,       canvas.width, canvas.height);
    gl.uniform3fv(uPrimary,  curPrimary);
    gl.uniform3fv(uSecondary,curSecondary);
    gl.uniform1f(uBpm,       window._trackBpm || 0);
    gl.uniform1f(uLight,     document.body.classList.contains('theme-light') ? 1.0 : 0.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rafId = requestAnimationFrame(draw);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(rafId); rafId = null; }
    else { startMs = performance.now() - startMs; draw(); }
  });

  requestAnimationFrame(() => {
    draw();
    canvas.style.transition = 'opacity 1.4s ease';
    canvas.style.opacity    = '1';
    const orbs = document.querySelector('.bg-orbs');
    if (orbs) orbs.classList.add('spline-ready');
  });
})();
