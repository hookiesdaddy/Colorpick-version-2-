'use strict';
/* Liquid Glass — WebGL raymarching background
   Morphing blob that reacts to the current album's primary/secondary colors. */
(function () {
  const canvas = document.getElementById('liquid-glass-bg');
  if (!canvas) return;

  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) { canvas.style.display = 'none'; return; }

  const SCALE = 0.5; // render at half-res, CSS upscales

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
    uniform vec3  u_primary;    /* album primary color   */
    uniform vec3  u_secondary;  /* album secondary color */

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
    float fbm(vec3 p) {
      return vnoise(p)*0.5 + vnoise(p*2.0)*0.25 + vnoise(p*4.0)*0.125;
    }

    /* ── Blob SDF ────────────────────────────────────────────────── */
    float sdf(vec3 p) {
      float t = u_time;
      vec3 q = p + (fbm(p*1.1 + vec3(t*0.12,t*0.09,t*0.14)) - 0.5) * 0.60;
      q      += (fbm(q*1.7  + vec3(t*0.07,t*0.11,t*0.06)) - 0.5) * 0.22;
      return length(q) - 1.05;
    }

    /* ── Sphere-trace ────────────────────────────────────────────── */
    float march(vec3 ro, vec3 rd) {
      float t = 0.4;
      for (int i = 0; i < 64; i++) {
        float d = sdf(ro + rd * t);
        if (d < 0.004) return t;
        if (t > 4.5)   return -1.0;
        t += d * 0.65;
      }
      return -1.0;
    }

    /* ── Normal ──────────────────────────────────────────────────── */
    vec3 calcNormal(vec3 p) {
      const float e = 0.004;
      return normalize(vec3(
        sdf(p+vec3(e,0,0)) - sdf(p-vec3(e,0,0)),
        sdf(p+vec3(0,e,0)) - sdf(p-vec3(0,e,0)),
        sdf(p+vec3(0,0,e)) - sdf(p-vec3(0,0,e))
      ));
    }

    /* ── Album-reactive iridescent palette ───────────────────────── */
    /* Sweeps between primary and secondary with metallic shimmer.    */
    vec3 palette(float t) {
      /* Smooth blend between primary and secondary */
      float blend = sin(t * 6.2832) * 0.5 + 0.5;
      vec3 col = mix(u_primary, u_secondary, blend);

      /* Boost brightness and punch up saturation */
      col *= 1.8;
      float minC = min(col.r, min(col.g, col.b));
      col -= minC * 0.45; /* deepen shadows between the two colors */

      /* Add an iridescent shimmer highlight (bright near-white flash) */
      float shimmer = pow(max(sin(t * 6.2832 * 1.5 + 0.9), 0.0), 4.0);
      col = mix(col, vec3(1.0, 0.97, 0.92), shimmer * 0.30);

      return clamp(col, 0.0, 1.0);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - u_res) / min(u_res.x, u_res.y);

      vec3 ro = vec3(0.0, 0.15, 3.2);
      vec3 rd = normalize(vec3(uv.x, uv.y, -2.0));

      /* Background: very dark version of the primary color */
      float bgD = length(uv);
      vec3 bg   = mix(u_primary * 0.08 + vec3(0.01), u_primary * 0.02, bgD * 0.7);
      bg       += u_primary * 0.12 * exp(-bgD * 1.6);
      vec3 col  = bg;

      float t = march(ro, rd);

      if (t > 0.0) {
        vec3 p = ro + rd * t;
        vec3 n = calcNormal(p);
        vec3 v = -rd;
        vec3 r = reflect(rd, n);

        /* Fresnel */
        float fr = pow(1.0 - max(dot(n, v), 0.0), 2.5);

        /* Hue position on blob surface drives color sweep */
        float hue = dot(n, vec3(0.55, 0.80, 0.30))
                  + vnoise(p * 2.2 + u_time * 0.07) * 0.45;
        hue = fract(hue * 0.65 + u_time * 0.045);

        vec3 surf = palette(hue) * 2.0;

        /* Three specular lights — white key, secondary-tinted fill, primary-tinted back */
        float s1 = pow(max(dot(r, normalize(vec3( 1.6, 2.2, 1.3))), 0.0), 90.0);
        float s2 = pow(max(dot(r, normalize(vec3(-1.3,-0.9, 1.0))), 0.0), 42.0);
        float s3 = pow(max(dot(r, normalize(vec3( 0.4,-1.9, 0.9))), 0.0), 32.0);

        /* Rim light tinted by secondary */
        float rim = pow(1.0 - max(dot(n, v), 0.0), 4.5);

        col  = surf * mix(0.65, 1.15, fr);
        col += vec3(1.00, 0.97, 0.93)           * s1 * 3.2;  /* white key spec */
        col += mix(u_secondary, vec3(1.0), 0.4) * s2 * 1.2;  /* tinted fill    */
        col += mix(u_primary,   vec3(1.0), 0.3) * s3 * 1.0;  /* tinted back    */
        col += u_secondary * 1.4                * rim * 0.7;  /* secondary rim  */
      }

      /* Vignette + gamma */
      col *= 1.0 - 0.35 * dot(uv*0.55, uv*0.55);
      col  = pow(max(col, 0.0), vec3(0.4545));

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

  // Default colors when no track playing (rich purple / blue)
  const DEFAULT_PRIMARY   = [0.48, 0.23, 0.93];
  const DEFAULT_SECONDARY = [0.08, 0.42, 0.95];

  let curPrimary   = DEFAULT_PRIMARY.slice();
  let curSecondary = DEFAULT_SECONDARY.slice();
  // Smoothly lerp toward target so color transitions are gradual
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
    // Re-read CSS vars every 30 frames (~0.5s) — reliable without MutationObserver
    if (frameCount++ % 30 === 0) updateTargets();

    // Smoothly interpolate toward target colors (~1s transition at 60fps)
    const k = 0.04;
    for (let i = 0; i < 3; i++) {
      curPrimary[i]   = lerp(curPrimary[i],   tgtPrimary[i],   k);
      curSecondary[i] = lerp(curSecondary[i], tgtSecondary[i], k);
    }

    gl.uniform1f(uTime,      (performance.now() - startMs) / 1000);
    gl.uniform2f(uRes,       canvas.width, canvas.height);
    gl.uniform3fv(uPrimary,  curPrimary);
    gl.uniform3fv(uSecondary,curSecondary);
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
