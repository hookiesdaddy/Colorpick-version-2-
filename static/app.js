
// ── DOM refs ──────────────────────────────────────────────────────────────────
const result            = document.getElementById('result');
const primaryChip       = document.getElementById('primary-chip');
const secondaryChip     = document.getElementById('secondary-chip');
const hexPrimary        = document.getElementById('hex-primary');
const hexPrimaryText    = document.getElementById('hex-primary-text');
const rgbPrimary        = document.getElementById('rgb-primary');
const hexSecondary      = document.getElementById('hex-secondary');
const hexSecondaryText  = document.getElementById('hex-secondary-text');
const rgbSecondary      = document.getElementById('rgb-secondary');
const brighterToggle    = document.getElementById('brighter-toggle');
const preferSecToggle   = document.getElementById('prefer-secondary-toggle');
const prefsToggle       = document.getElementById('prefs-toggle');
const prefsExpand       = document.getElementById('prefs-expand');
const skipNeutralsToggle= document.getElementById('skip-neutrals-toggle');
const rememberOptsToggle= document.getElementById('remember-opts-toggle');
const setLightsBtn      = document.getElementById('set-lights-btn');
const lightsStatus      = document.getElementById('lights-status');
const errorDiv          = document.getElementById('error');
const logoDot           = document.getElementById('logo-dot');
const colorPrefsList    = document.getElementById('color-prefs-list');
const bgOrb1            = document.querySelector('.orb-1');
const bgOrb2            = document.querySelector('.orb-2');
const reloadBtn         = document.getElementById('reload-btn');
const optionsBtn        = document.getElementById('options-btn');
const optionsPanel      = document.getElementById('options-panel');
const reloadHint        = document.getElementById('reload-hint');
const reloadHintBtn     = document.getElementById('reload-hint-btn');
const lightsProgress    = document.getElementById('lights-progress');
const mainView          = document.getElementById('main-view');
const settingsView      = document.getElementById('settings-view');
const settingsBtn       = document.getElementById('settings-btn');
const settingsBack      = document.getElementById('settings-back');

// History
const historyView       = document.getElementById('history-view');
const historyBtn        = document.getElementById('history-btn');
const historyBack       = document.getElementById('history-back');
const historyList       = document.getElementById('history-list');
const historyClearBtn   = document.getElementById('history-clear-btn');
const apiKeyInput       = document.getElementById('api-key-input');
const apiKeyToggle      = document.getElementById('api-key-toggle');
const saveKeyBtn        = document.getElementById('save-key-btn');
const testKeyBtn        = document.getElementById('test-key-btn');
const keyStatus         = document.getElementById('key-status');

// Last.fm
const lfmUserInput      = document.getElementById('lfm-user-input');
const lfmKeyInput       = document.getElementById('lfm-key-input');
const lfmSaveBtn        = document.getElementById('lfm-save-btn');
const lfmTestBtn        = document.getElementById('lfm-test-btn');
const lfmStatus         = document.getElementById('lfm-status');

// Service rows
const serviceLastfmBtn  = document.getElementById('service-applemusic-btn');
const serviceSpotifyBtn = document.getElementById('service-spotify-btn');
const serviceLastfmRow  = document.getElementById('service-applemusic-row');
const serviceSpotifyRow = document.getElementById('service-spotify-row');
const goveeRow          = document.getElementById('govee-row');
const goveeRowBtn       = document.getElementById('govee-row-btn');
const goveeConfig       = document.getElementById('govee-config');
const goveeBadge        = document.getElementById('govee-badge');
const lastfmConfig      = document.getElementById('lastfm-config');
const spotifyConfig     = document.getElementById('spotify-config');
const lastfmBadge       = document.getElementById('lastfm-badge');
const spotifyBadge      = document.getElementById('spotify-badge');

// Spotify
const spotifyClientIdInput  = document.getElementById('spotify-client-id-input');
const spotifyConnectBtn     = document.getElementById('spotify-connect-btn');
const spotifyDisconnectBtn  = document.getElementById('spotify-disconnect-btn');
const spotifyStatus         = document.getElementById('spotify-status');
const spotifyPlaybackToggle = document.getElementById('spotify-playback-toggle');

// Playback controls
const playbackControls  = document.getElementById('playback-controls');
const playbackPrev      = document.getElementById('playback-prev');
const playbackToggleBtn = document.getElementById('playback-toggle');
const playbackNext      = document.getElementById('playback-next');
const playbackPlayIcon  = document.getElementById('playback-play-icon');
const playbackPauseIcon = document.getElementById('playback-pause-icon');
const connectPromptBtn  = document.getElementById('connect-prompt-btn');
const noService         = document.getElementById('no-service');
const npHero            = document.getElementById('np-hero');
const npArt             = document.getElementById('np-art');
const npArtWrap         = document.querySelector('.np-art-wrap');
const npTitle           = document.getElementById('np-title');
const npArtist          = document.getElementById('np-artist');
const npSyncLabel       = document.getElementById('np-sync-label');
const npSyncBadge       = document.getElementById('np-sync-badge');
const colorGradientBox  = document.getElementById('color-gradient-box');
const allToggleSwitches = document.querySelectorAll('.toggle-switch'); // cached — elements are static
const cacheTog          = document.getElementById('cache-toggle');
const pollSlider        = document.getElementById('poll-rate-slider');
const pollRateVal       = document.getElementById('poll-rate-value');
const brightnessSelect  = document.getElementById('brightness-floor-select');
const satBoostToggle    = document.getElementById('sat-boost-toggle');
const idleBehaviorSel   = document.getElementById('idle-behavior-select');
const deviceChecklist   = document.getElementById('device-checklist');
const govLanToggle      = document.getElementById('govee-lan-toggle');
const govLanSection     = document.getElementById('govee-lan-section');
const govDiscoverBtn    = document.getElementById('govee-discover-btn');
const govLanStatus      = document.getElementById('govee-lan-status');
const govLanChecklist   = document.getElementById('govee-lan-checklist');

// ── Color families ────────────────────────────────────────────────────────────
const DEFAULT_FAMILIES = [
  { name: 'Red',    hue: 0,   color: '#ef4444' },
  { name: 'Orange', hue: 30,  color: '#f97316' },
  { name: 'Yellow', hue: 60,  color: '#eab308' },
  { name: 'Green',  hue: 120, color: '#22c55e' },
  { name: 'Teal',   hue: 180, color: '#14b8a6' },
  { name: 'Blue',   hue: 220, color: '#3b82f6' },
  { name: 'Purple', hue: 270, color: '#a855f7' },
  { name: 'Pink',   hue: 330, color: '#ec4899' },
];

// ── Art cross-fade ────────────────────────────────────────────────────────────
function setArtSrc(src) {
  if (!src) return;
  if (npArt.src === src) {
    npArtWrap.classList.remove('art-loading');
    return;
  }
  npArt.style.opacity = '0';
  setTimeout(() => {
    npArt.src = src;
    npArt.onload = () => {
      npArt.style.opacity = '';
      npArtWrap.classList.remove('art-loading');
    };
  }, 280);
}

// ── In-memory color cache (keyed by art URL) ──────────────────────────────────
// Loaded once from localStorage at startup; lookups are instant Map.get() calls.
// Writes go to both the Map and localStorage so the cache survives page reloads.
const _colorCacheMap = (() => {
  try { return new Map(Object.entries(JSON.parse(localStorage.getItem(LS_COLOR_CACHE) || '{}'))); }
  catch { return new Map(); }
})();

function cacheGet(url) { return _colorCacheMap.get(url) ?? null; }
function cacheSet(url, data) {
  _colorCacheMap.set(url, data);
  if (_colorCacheMap.size > 100) _colorCacheMap.delete(_colorCacheMap.keys().next().value);
  try { localStorage.setItem(LS_COLOR_CACHE, JSON.stringify(Object.fromEntries(_colorCacheMap))); }
  catch {}
}

// ── State ─────────────────────────────────────────────────────────────────────
let lastPrimary    = null;
let lastSecondary  = null;
let manualOverride = null; // 'primary' | 'secondary' | null
let lastSentHex    = null; // last hex sent to Govee — skip if unchanged
let idleActionSent = false; // true after idle behavior fired — reset on track detect
let _goveeOk       = null; // null = never tried, true = last cmd OK, false = last cmd failed

// ── Sync badge status ─────────────────────────────────────────────────────────
// Single source of truth for the dot colour + label.
// status: 'green' | 'orange' | 'grey' | 'red'
function setSyncStatus(status, label) {
  npSyncBadge.classList.remove('status-green', 'status-orange', 'status-grey', 'status-red');
  npSyncBadge.classList.add(`status-${status}`);
  npSyncLabel.textContent = label;
}

// ── LocalStorage ──────────────────────────────────────────────────────────────
const LS_KEY            = 'colorpick_govee_key';
const LS_PREFS          = 'colorpick_color_prefs';
const LS_PREFER_SEC     = 'colorpick_prefer_secondary';
const LS_SKIP_NEUTRAL   = 'colorpick_skip_neutrals';
const LS_LFM_USER       = 'colorpick_lfm_user';
const LS_LFM_KEY        = 'colorpick_lfm_key';
const LS_LFM_SYNC       = 'colorpick_lfm_sync';
const LS_HISTORY        = 'colorpick_history';
const LS_REMEMBER_OPTS      = 'colorpick_remember_opts';
const LS_BRIGHTER           = 'colorpick_brighter';
const LS_USE_PREFS          = 'colorpick_use_prefs';
const LS_SPOTIFY_CLIENT_ID  = 'colorpick_spotify_client_id';
const LS_SPOTIFY_TOKEN      = 'colorpick_spotify_token';
const LS_SPOTIFY_REFRESH    = 'colorpick_spotify_refresh';
const LS_SPOTIFY_EXPIRES    = 'colorpick_spotify_expires';
const LS_SPOTIFY_PLAYBACK   = 'colorpick_spotify_playback';
const LS_ACTIVE_SERVICE     = 'colorpick_active_service'; // 'lastfm' | 'spotify'
const LS_COLOR_CACHE        = 'covercolor_color_cache';
const LS_CACHE_ENABLED      = 'covercolor_cache_enabled';
const LS_POLL_RATE          = 'covercolor_poll_rate';
const LS_BRIGHTNESS_FLOOR   = 'covercolor_brightness_floor'; // 0-100, default 15
const LS_SAT_BOOST          = 'covercolor_sat_boost';        // bool, default false
const LS_IDLE_BEHAVIOR      = 'covercolor_idle_behavior';    // 'keep'|'off'|'white'
const LS_GOVEE_DEVICES      = 'covercolor_govee_devices';      // [{device,model,name}]
const LS_GOVEE_SELECTED     = 'covercolor_govee_selected';     // [{device,model,name}] subset
const LS_LIGHTS_PAUSED      = 'covercolor_lights_paused';       // bool — freeze light updates without stopping polling
const LS_GOVEE_USE_LAN      = 'covercolor_govee_use_lan';      // bool — prefer LAN API
const LS_GOVEE_LAN_DEVICES  = 'covercolor_govee_lan_devices';  // [{ip,device,sku,name}]
const LS_GOVEE_LAN_SELECTED = 'covercolor_govee_lan_selected'; // [{ip,device,sku,name}] subset
const HISTORY_MAX       = 30;

const loadApiKey       = () => localStorage.getItem(LS_KEY) || '';
const saveApiKey       = k => localStorage.setItem(LS_KEY, k);
const loadPreferSec    = () => localStorage.getItem(LS_PREFER_SEC) === 'true';
const savePreferSec    = v => localStorage.setItem(LS_PREFER_SEC, String(v));
const loadSkipNeutrals = () => localStorage.getItem(LS_SKIP_NEUTRAL) === 'true';
const saveSkipNeutrals = v => localStorage.setItem(LS_SKIP_NEUTRAL, String(v));

function getActiveSettings() {
  return {
    brighter:   brighterToggle.checked,
    preferSec:  preferSecToggle.checked,
    skipNeutrals: skipNeutralsToggle.checked,
    usePrefs:   prefsToggle.checked,
  };
}

function saveAllOpts() {
  localStorage.setItem(LS_BRIGHTER,     String(brighterToggle.checked));
  localStorage.setItem(LS_PREFER_SEC,   String(preferSecToggle.checked));
  localStorage.setItem(LS_SKIP_NEUTRAL, String(skipNeutralsToggle.checked));
  localStorage.setItem(LS_USE_PREFS,    String(prefsToggle.checked));
}

function loadPrefs() {
  try { const r = localStorage.getItem(LS_PREFS); if (r) return JSON.parse(r); } catch {}
  return DEFAULT_FAMILIES.map(f => f.name);
}
function savePrefs(order) { localStorage.setItem(LS_PREFS, JSON.stringify(order)); }
function getOrderedFamilies() {
  const order = loadPrefs();
  const ordered = order.map(n => DEFAULT_FAMILIES.find(f => f.name === n)).filter(Boolean);
  DEFAULT_FAMILIES.forEach(f => { if (!ordered.find(x => x.name === f.name)) ordered.push(f); });
  return ordered;
}

// ── Color math ────────────────────────────────────────────────────────────────
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function isVibrant({ r, g, b }) {
  const { s, l } = rgbToHsl(r, g, b);
  return s > 35 && l > 20 && l < 80;
}

function luminance({ r, g, b }) {
  return [r, g, b].reduce((sum, c, i) => {
    const s = c / 255;
    const lin = s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    return sum + lin * [0.2126, 0.7152, 0.0722][i];
  }, 0);
}

function hueDistance(a, b) { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }

function matchFamily(rgb) {
  const { h } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return DEFAULT_FAMILIES.reduce((best, f) =>
    hueDistance(h, f.hue) < hueDistance(h, best.hue) ? f : best
  );
}

function preferredColor(primary, secondary) {
  if (!isVibrant(primary.rgb) || !isVibrant(secondary.rgb)) return null;
  const families = getOrderedFamilies();
  const pFam = matchFamily(primary.rgb);
  const sFam = matchFamily(secondary.rgb);
  const pRank = families.findIndex(f => f.name === pFam.name);
  const sRank = families.findIndex(f => f.name === sFam.name);
  if (sRank !== -1 && (pRank === -1 || sRank < pRank)) return 'secondary';
  return 'primary';
}

// ── Active color logic ────────────────────────────────────────────────────────
function isUsingSecondary() {
  if (!lastPrimary || !lastSecondary) return false;

  // 1. Manual chip selection (non-sticky, resets on next photo)
  if (manualOverride === 'secondary') return true;
  if (manualOverride === 'primary')   return false;

  // 2. Base: prefer-secondary setting
  let useSec = loadPreferSec();

  // 3. Color preferences toggle
  if (prefsToggle.checked) {
    const pref = preferredColor(lastPrimary, lastSecondary);
    if (pref) useSec = (pref === 'secondary');
  }

  // 4. Brighter toggle
  if (brighterToggle.checked) {
    const lumP = luminance(lastPrimary.rgb);
    const lumS = luminance(lastSecondary.rgb);
    if (!useSec && lumS > lumP) useSec = true;
    else if (useSec && lumP > lumS) useSec = false;
  }

  return useSec;
}

function getLightColor() {
  if (!lastPrimary) return null;
  return isUsingSecondary() ? lastSecondary.rgb : lastPrimary.rgb;
}

// ── Color transforms (brightness floor + saturation boost) ───────────────────
function applyColorTransforms(hex) {
  const r = parseInt(hex.slice(1,3), 16) / 255;
  const g = parseInt(hex.slice(3,5), 16) / 255;
  const b = parseInt(hex.slice(5,7), 16) / 255;

  // RGB → HSL
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if      (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else                h = ((r - g) / d + 4) / 6;
  }

  // Apply brightness floor (low=5%, normal=15%, high=35%)
  const floorLevel = localStorage.getItem(LS_BRIGHTNESS_FLOOR) || 'normal';
  const floorMap = { low: 0.05, normal: 0.15, high: 0.35 };
  const floor = floorMap[floorLevel] ?? 0.15;
  l = Math.max(l, floor);

  // Apply saturation boost (+30%, clamped)
  if (satBoostToggle && satBoostToggle.checked) s = Math.min(1, s + 0.30);

  // HSL → RGB
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q-p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q-p) * (2/3-t) * 6;
    return p;
  }
  let r2, g2, b2;
  if (s === 0) { r2 = g2 = b2 = l; }
  else {
    const q = l < 0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
    r2 = hue2rgb(p,q, h+1/3); g2 = hue2rgb(p,q,h); b2 = hue2rgb(p,q, h-1/3);
  }
  const toHex = v => Math.round(v*255).toString(16).padStart(2,'0');
  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
}

// ── Device selection helpers ─────────────────────────────────────────────────
function getSelectedDevices() {
  try {
    const stored = localStorage.getItem(LS_GOVEE_SELECTED);
    if (stored) { const p = JSON.parse(stored); if (Array.isArray(p) && p.length) return p; }
  } catch {}
  return null; // null = use backend default (all devices)
}

function renderDeviceChecklist(devices) {
  if (!deviceChecklist || !devices || !devices.length) return;
  let selected;
  try { selected = new Set((JSON.parse(localStorage.getItem(LS_GOVEE_SELECTED) || '[]')).map(d => d.device)); }
  catch { selected = new Set(devices.map(d => d.device)); } // default: all selected
  if (!selected.size) selected = new Set(devices.map(d => d.device));

  deviceChecklist.innerHTML = '';
  devices.forEach(dev => {
    const label = document.createElement('label');
    label.className = 'device-check-row';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = selected.has(dev.device);
    cb.dataset.device = JSON.stringify(dev);
    cb.addEventListener('change', persistDeviceSelection);
    label.append(cb);
    const name = document.createElement('span');
    name.textContent = dev.name;
    label.append(name);
    deviceChecklist.appendChild(label);
  });
  deviceChecklist.classList.remove('hidden');
}

function persistDeviceSelection() {
  const checks = deviceChecklist.querySelectorAll('input[type="checkbox"]');
  const selected = [...checks].filter(c => c.checked).map(c => JSON.parse(c.dataset.device));
  localStorage.setItem(LS_GOVEE_SELECTED, JSON.stringify(selected));
  lastSentHex = null; // force re-send with new selection
}

// ── LAN device helpers ────────────────────────────────────────────────────────
function getLanSelectedDevices() {
  try {
    const stored = localStorage.getItem(LS_GOVEE_LAN_SELECTED);
    if (stored) { const p = JSON.parse(stored); if (Array.isArray(p) && p.length) return p; }
  } catch {}
  return null;
}

function renderLanChecklist(devices) {
  if (!govLanChecklist || !devices || !devices.length) return;
  let selected;
  try { selected = new Set((JSON.parse(localStorage.getItem(LS_GOVEE_LAN_SELECTED) || '[]')).map(d => d.device)); }
  catch { selected = new Set(devices.map(d => d.device)); }
  if (!selected.size) selected = new Set(devices.map(d => d.device));

  govLanChecklist.innerHTML = '';
  devices.forEach(dev => {
    const label = document.createElement('label');
    label.className = 'device-check-row';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = selected.has(dev.device);
    cb.dataset.device = JSON.stringify(dev);
    cb.addEventListener('change', persistLanSelection);
    label.append(cb);
    const nameSpan = document.createElement('span');
    nameSpan.textContent = dev.name || dev.sku || dev.ip;
    label.append(nameSpan);
    const ipSpan = document.createElement('span');
    ipSpan.textContent = ` — ${dev.ip}`;
    ipSpan.style.opacity = '0.5';
    label.append(ipSpan);
    govLanChecklist.appendChild(label);
  });
  govLanChecklist.classList.remove('hidden');
}

function persistLanSelection() {
  const checks = govLanChecklist.querySelectorAll('input[type="checkbox"]');
  const selected = [...checks].filter(c => c.checked).map(c => JSON.parse(c.dataset.device));
  localStorage.setItem(LS_GOVEE_LAN_SELECTED, JSON.stringify(selected));
  lastSentHex = null;
}

function updateActiveChip() {
  if (!lastPrimary) return;
  const useSec  = isUsingSecondary();
  const activeHex = useSec ? (lastSecondary?.hex ?? lastPrimary.hex) : lastPrimary.hex;

  primaryChip.classList.toggle('active', !useSec);
  primaryChip.style.setProperty('--chip-color', lastPrimary.hex);

  secondaryChip.classList.toggle('active', useSec);
  secondaryChip.style.setProperty('--chip-color', lastSecondary?.hex ?? lastPrimary.hex);

  allToggleSwitches.forEach(sw => {
    sw.style.setProperty('--toggle-active-color', activeHex);
  });
  setLightsBtn.style.setProperty('--active-color', activeHex);
}

// ── Reload ────────────────────────────────────────────────────────────────────
reloadBtn.addEventListener('click', async () => {
  reloadHint.classList.add('hidden');
  reloadBtn.classList.remove('needs-reload');
  hideError();
  const user = localStorage.getItem(LS_LFM_USER) || '';
  const key  = localStorage.getItem(LS_LFM_KEY)  || '';
  if (!user || !key) return;
  reloadBtn.disabled = true;
  try {
    const track = await lfmGetNowPlaying(user, key);
    if (track) {
      npTitle.textContent  = track.title;
      npArtist.textContent = track.artist;
      if (track.art) setArtSrc(track.art);
      await extractFromArt(track.art, `${track.title} — ${track.artist}`);
    }
  } catch (e) { /* silent */ }
  finally { reloadBtn.disabled = false; }
});

// ── Options panel ─────────────────────────────────────────────────────────────
optionsBtn.addEventListener('click', () => {
  const isOpen = !optionsPanel.classList.contains('hidden');
  optionsPanel.classList.toggle('hidden', isOpen);
  optionsBtn.classList.toggle('open', !isOpen);
});

// ── Toggle listeners ──────────────────────────────────────────────────────────
prefsToggle.addEventListener('change', () => {
  prefsExpand.classList.toggle('hidden', !prefsToggle.checked);
  if (rememberOptsToggle.checked) saveAllOpts();
  updateActiveChip();
});

// ── Manual chip selection ─────────────────────────────────────────────────────
primaryChip.addEventListener('click', e => {
  if (e.target.closest('.hex-btn')) return;
  if (!lastPrimary) return;
  manualOverride = manualOverride === 'primary' ? null : 'primary';
  updateActiveChip();
});

secondaryChip.addEventListener('click', e => {
  if (e.target.closest('.hex-btn')) return;
  if (!lastSecondary) return;
  manualOverride = manualOverride === 'secondary' ? null : 'secondary';
  updateActiveChip();
});


// ── Set Lights ────────────────────────────────────────────────────────────────
setLightsBtn.addEventListener('click', async () => {
  if (!lastPrimary) return;
  setLightsBtn.disabled = true;
  lightsStatus.classList.add('hidden');

  const { r, g, b } = getLightColor();
  const activeHex = `rgb(${r},${g},${b})`;
  const apiKey = loadApiKey();

  // Start progress bar
  lightsProgress.className = 'lights-progress';
  lightsProgress.style.setProperty('--active-color', activeHex);
  lightsProgress.style.width = '0';
  // Force reflow then animate
  lightsProgress.getBoundingClientRect();
  lightsProgress.classList.add('running');

  try {
    const fd = new FormData();
    fd.append('r', r); fd.append('g', g); fd.append('b', b);
    const headers = {};
    if (apiKey) headers['X-Govee-Api-Key'] = apiKey;
    const response = await fetch('/set-light', { method: 'POST', body: fd, headers });
    const data = await response.json();

    // Complete the bar
    lightsProgress.classList.remove('running');
    lightsProgress.classList.add('done');
    setTimeout(() => { lightsProgress.className = 'lights-progress'; }, 600);

    if (!response.ok) {
      lightsStatus.textContent = data.detail || 'Failed to set lights.';
      lightsStatus.className = 'lights-status error-status';
    } else {
      lightsStatus.textContent = data.lights.map(l => `${l.name}: ${l.status === 'ok' ? '✓' : l.status}`).join('  ·  ');
      lightsStatus.className = 'lights-status ok-status';
    }
    lightsStatus.classList.remove('hidden');
  } catch {
    lightsProgress.className = 'lights-progress';
    lightsStatus.textContent = 'Network error.';
    lightsStatus.className = 'lights-status error-status';
    lightsStatus.classList.remove('hidden');
  } finally {
    setLightsBtn.disabled = false;
  }
});

// ── Copy hex ──────────────────────────────────────────────────────────────────
hexPrimary.addEventListener('click', () => copyHex('primary'));
hexSecondary.addEventListener('click', () => copyHex('secondary'));
function copyHex(key) {
  const val = key === 'primary' ? lastPrimary?.hex : lastSecondary?.hex;
  if (!val) return;
  const text = val.toUpperCase();
  const showToast = () => {
    const toast = document.querySelector(`.copied-toast[data-for="${key}"]`);
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 1500);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showToast).catch(() => { fallbackCopy(text); showToast(); });
  } else {
    fallbackCopy(text); showToast();
  }
}
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

// ── Show / hide result ────────────────────────────────────────────────────────
function showResult(data, { fromSync = false, name = null, size = null, skipHistory = false } = {}) {
  document.body.classList.remove('extracting');
  lastPrimary   = { hex: data.hex, rgb: data.rgb };
  lastSecondary = data.secondary ? { hex: data.secondary.hex, rgb: data.secondary.rgb } : lastPrimary;
  manualOverride = null;

  // Save to history
  if (!skipHistory) addHistory({ name, size, primary: lastPrimary.hex, secondary: lastSecondary.hex });

  root.style.setProperty('--primary-color', lastPrimary.hex);
  root.style.setProperty('--secondary-color', lastSecondary.hex);
  root.style.setProperty('--accent', lastPrimary.hex);
  root.style.setProperty('--accent-rgb', `${lastPrimary.rgb.r}, ${lastPrimary.rgb.g}, ${lastPrimary.rgb.b}`);
  bgOrb1.style.background = `radial-gradient(circle, ${lastPrimary.hex}, transparent 55%)`;
  bgOrb2.style.background = `radial-gradient(circle, ${lastSecondary.hex}, transparent 55%)`;

  hexPrimaryText.textContent   = lastPrimary.hex.toUpperCase();
  rgbPrimary.textContent       = `${data.rgb.r}, ${data.rgb.g}, ${data.rgb.b}`;
  hexSecondaryText.textContent = lastSecondary.hex.toUpperCase();
  rgbSecondary.textContent     = `${lastSecondary.rgb.r}, ${lastSecondary.rgb.g}, ${lastSecondary.rgb.b}`;

  lightsStatus.classList.add('hidden');
  setTimeout(() => { result.classList.remove('hidden'); updateActiveChip(); }, 350);
}

function hideResult() {
  result.classList.add('hidden');
  lastPrimary = lastSecondary = null;
  manualOverride = null;
  primaryChip.classList.remove('active');
  secondaryChip.classList.remove('active');
  bgOrb1.style.removeProperty('background');
  bgOrb2.style.removeProperty('background');
}

function showError(msg) { errorDiv.textContent = msg; errorDiv.classList.remove('hidden'); }
function hideError()    { errorDiv.classList.add('hidden'); }

const root = document.documentElement;

// ── View transitions ──────────────────────────────────────────────────────────
function showView(incoming, outgoing, direction = 'forward') {
  outgoing.classList.add('hidden');
  incoming.classList.remove('hidden');
  incoming.classList.remove('view-enter-forward', 'view-enter-back');
  void incoming.offsetWidth; // force reflow
  incoming.classList.add(direction === 'forward' ? 'view-enter-forward' : 'view-enter-back');
}

// ── Settings panel ────────────────────────────────────────────────────────────
settingsBtn.addEventListener('click', () => showView(settingsView, mainView, 'forward'));
settingsBack.addEventListener('click', () => showView(mainView, settingsView, 'back'));

// ── History panel ─────────────────────────────────────────────────────────────
function formatSize(bytes) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)  return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY) || '[]'); } catch { return []; }
}

function addHistory(entry) {
  const list = loadHistory();
  list.unshift({ ...entry, ts: Date.now(), settings: getActiveSettings() });
  if (list.length > HISTORY_MAX) list.length = HISTORY_MAX;
  localStorage.setItem(LS_HISTORY, JSON.stringify(list));
}

let historyDedupe = false;

function settingsLabel(s) {
  if (!s) return '';
  const on = [
    s.brighter    && 'Brighter',
    s.preferSec   && 'Prefer secondary',
    s.skipNeutrals && 'Skip dark tones',
    s.usePrefs    && 'Color prefs',
  ].filter(Boolean);
  return on.length ? on.join(' · ') : 'Default settings';
}

function renderHistory() {
  let list = loadHistory();
  if (!list.length) {
    historyList.innerHTML = '<p class="history-empty">No extractions yet.</p>';
    return;
  }
  if (historyDedupe) {
    const seen = new Set();
    list = list.filter(e => {
      const key = `${e.primary}|${e.secondary}`;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
  }
  const dedupBtn = document.getElementById('history-dedup-btn');
  if (dedupBtn) dedupBtn.classList.toggle('active', historyDedupe);

  historyList.innerHTML = list.map((e, i) => `
    <div class="history-item" data-index="${i}">
      <div class="history-item-main">
        <div class="history-swatch" style="background: linear-gradient(135deg, ${e.primary}, ${e.secondary})"></div>
        <div class="history-info">
          <span class="history-name">${e.name || 'Untitled'}</span>
          <span class="history-meta">${[formatSize(e.size), timeAgo(e.ts)].filter(Boolean).join(' · ')}</span>
        </div>
        <div class="history-hex-row">
          <div class="history-hex-dot" style="background:${e.primary}" title="${e.primary}"></div>
          <div class="history-hex-dot" style="background:${e.secondary}" title="${e.secondary}"></div>
        </div>
      </div>
      ${e.settings ? `
      <details class="history-settings">
        <summary>Settings</summary>
        <span>${settingsLabel(e.settings)}</span>
      </details>` : ''}
    </div>
  `).join('');

  historyList.querySelectorAll('.history-item-main').forEach(el => {
    el.addEventListener('click', () => {
      const e = list[+el.closest('.history-item').dataset.index];
      showResult(
        { hex: e.primary, rgb: hexToRgb(e.primary), secondary: { hex: e.secondary, rgb: hexToRgb(e.secondary) } },
        { name: e.name, size: e.size, skipHistory: true }
      );
      historyBack.click();
    });
  });
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

historyBtn.addEventListener('click', () => {
  showView(historyView, mainView, 'forward');
  renderHistory();
});
historyBack.addEventListener('click', () => showView(mainView, historyView, 'back'));
historyClearBtn.addEventListener('click', () => {
  localStorage.removeItem(LS_HISTORY);
  renderHistory();
});

const historyDedupBtn = document.getElementById('history-dedup-btn');
historyDedupBtn.addEventListener('click', () => {
  historyDedupe = !historyDedupe;
  renderHistory();
});

apiKeyInput.value = loadApiKey();
apiKeyToggle.addEventListener('click', () => {
  const show = apiKeyInput.type === 'password';
  apiKeyInput.type = show ? 'text' : 'password';
  apiKeyToggle.querySelector('svg').style.opacity = show ? '1' : '0.5';
});

saveKeyBtn.addEventListener('click', () => {
  saveApiKey(apiKeyInput.value.trim());
  showKeyStatus('ok', apiKeyInput.value.trim() ? 'API key saved.' : 'Key cleared.');
});

testKeyBtn.addEventListener('click', async () => {
  const key = apiKeyInput.value.trim();
  if (!key) { showKeyStatus('error', 'Enter an API key first.'); return; }
  testKeyBtn.disabled = true;
  testKeyBtn.textContent = 'Testing…';
  try {
    const resp = await fetch('/govee/test', { method: 'POST', headers: { 'X-Govee-Api-Key': key } });
    const data = await resp.json();
    if (resp.ok) {
      showKeyStatus('ok', `Connected! Found ${data.devices} device${data.devices !== 1 ? 's' : ''}.`);
      if (data.device_list && data.device_list.length) {
        localStorage.setItem(LS_GOVEE_DEVICES, JSON.stringify(data.device_list));
        renderDeviceChecklist(data.device_list);
      }
    } else {
      showKeyStatus('error', data.detail || 'Connection failed.');
    }
  } catch { showKeyStatus('error', 'Network error.'); }
  finally { testKeyBtn.disabled = false; testKeyBtn.textContent = 'Test Connection'; }
});

function showKeyStatus(type, msg) { keyStatus.textContent = msg; keyStatus.className = `key-status ${type}`; }

// Remember options toggle
rememberOptsToggle.checked = localStorage.getItem(LS_REMEMBER_OPTS) === 'true';
if (rememberOptsToggle.checked) {
  brighterToggle.checked    = localStorage.getItem(LS_BRIGHTER)   === 'true';
  prefsToggle.checked       = localStorage.getItem(LS_USE_PREFS)  === 'true';
  prefsExpand.classList.toggle('hidden', !prefsToggle.checked);
}
rememberOptsToggle.addEventListener('change', () => {
  localStorage.setItem(LS_REMEMBER_OPTS, String(rememberOptsToggle.checked));
  if (rememberOptsToggle.checked) saveAllOpts();
});

// Brighter toggle
brighterToggle.addEventListener('change', () => {
  if (rememberOptsToggle.checked) saveAllOpts();
  updateActiveChip();
});

// Prefer secondary toggle
preferSecToggle.checked = loadPreferSec();
preferSecToggle.addEventListener('change', () => {
  savePreferSec(preferSecToggle.checked);
  if (rememberOptsToggle.checked) saveAllOpts();
  if (lastPrimary) updateActiveChip();
});

// Skip neutrals toggle
skipNeutralsToggle.checked = loadSkipNeutrals();
skipNeutralsToggle.addEventListener('change', () => {
  saveSkipNeutrals(skipNeutralsToggle.checked);
  if (rememberOptsToggle.checked) saveAllOpts();
  if (lastPrimary) {
    const activeHex = getLightColor() ? `rgb(${getLightColor().r},${getLightColor().g},${getLightColor().b})` : null;
    reloadHint.classList.remove('hidden');
    reloadHintBtn.style.setProperty('color', activeHex || '');
    reloadBtn.classList.add('needs-reload');
    reloadBtn.style.setProperty('--active-color', activeHex || '');
  }
});

reloadHintBtn.addEventListener('click', () => {
  reloadBtn.click();
});

// Cache by album toggle
cacheTog.checked = localStorage.getItem(LS_CACHE_ENABLED) !== 'false'; // default true
cacheTog.addEventListener('change', () => {
  localStorage.setItem(LS_CACHE_ENABLED, String(cacheTog.checked));
});

// Brightness floor select (low / normal / high)
if (brightnessSelect) {
  const _validFloor = ['low', 'normal', 'high'];
  const _savedFloor = localStorage.getItem(LS_BRIGHTNESS_FLOOR);
  brightnessSelect.value = _validFloor.includes(_savedFloor) ? _savedFloor : 'normal';
  brightnessSelect.addEventListener('change', () => {
    localStorage.setItem(LS_BRIGHTNESS_FLOOR, brightnessSelect.value);
    lastSentHex = null;
  });
}

// Saturation boost toggle (default off)
if (satBoostToggle) {
  satBoostToggle.checked = localStorage.getItem(LS_SAT_BOOST) === 'true';
  satBoostToggle.addEventListener('change', () => {
    localStorage.setItem(LS_SAT_BOOST, String(satBoostToggle.checked));
    lastSentHex = null;
  });
}

// Idle behavior select (default 'keep')
if (idleBehaviorSel) {
  idleBehaviorSel.value = localStorage.getItem(LS_IDLE_BEHAVIOR) || 'keep';
  idleBehaviorSel.addEventListener('change', () => {
    localStorage.setItem(LS_IDLE_BEHAVIOR, idleBehaviorSel.value);
    idleActionSent = false; // allow immediate re-trigger
  });
}

// Device checklist — render from stored devices
if (deviceChecklist) {
  try {
    const stored = JSON.parse(localStorage.getItem(LS_GOVEE_DEVICES) || '[]');
    if (stored.length) renderDeviceChecklist(stored);
  } catch {}
}

// LAN toggle + discover button
if (govLanToggle) {
  const _lanOn = localStorage.getItem(LS_GOVEE_USE_LAN) === 'true';
  govLanToggle.checked = _lanOn;
  if (govLanSection) govLanSection.classList.toggle('hidden', !_lanOn);

  govLanToggle.addEventListener('change', () => {
    localStorage.setItem(LS_GOVEE_USE_LAN, govLanToggle.checked);
    if (govLanSection) govLanSection.classList.toggle('hidden', !govLanToggle.checked);
    lastSentHex = null; // force re-send via new path
  });

  // Render any previously discovered LAN devices
  try {
    const _lanStored = JSON.parse(localStorage.getItem(LS_GOVEE_LAN_DEVICES) || '[]');
    if (_lanStored.length) renderLanChecklist(_lanStored);
  } catch {}
}

if (govDiscoverBtn) {
  govDiscoverBtn.addEventListener('click', async () => {
    govDiscoverBtn.disabled = true;
    govDiscoverBtn.textContent = 'Discovering…';
    if (govLanStatus) {
      govLanStatus.className = 'key-status';
      govLanStatus.textContent = 'Scanning local network (3 s)…';
      govLanStatus.classList.remove('hidden');
    }
    try {
      const resp = await fetch('/govee/lan/discover', { method: 'POST' });
      const data = await resp.json();
      if (resp.ok && data.device_list?.length) {
        localStorage.setItem(LS_GOVEE_LAN_DEVICES, JSON.stringify(data.device_list));
        renderLanChecklist(data.device_list);
        if (govLanStatus) {
          govLanStatus.className = 'key-status ok';
          govLanStatus.textContent = `Found ${data.devices} device${data.devices !== 1 ? 's' : ''}`;
        }
      } else if (resp.ok) {
        if (govLanStatus) {
          govLanStatus.className = 'key-status error';
          govLanStatus.textContent = 'No devices found — make sure this server is on the same local network as your lights, and that LAN control is enabled in the Govee app.';
        }
      } else {
        if (govLanStatus) {
          govLanStatus.className = 'key-status error';
          govLanStatus.textContent = data.detail || 'Discovery failed';
        }
      }
    } catch (e) {
      if (govLanStatus) {
        govLanStatus.className = 'key-status error';
        govLanStatus.textContent = `Error: ${e.message}`;
      }
    } finally {
      govDiscoverBtn.disabled = false;
      govDiscoverBtn.textContent = 'Discover Devices';
    }
  });
}

// Poll rate slider (snaps to 5 / 10 / 30 seconds)
const POLL_SNAPS = [2, 5, 10, 30];
function pollSnapIndex(secs) {
  const idx = POLL_SNAPS.indexOf(secs);
  return idx >= 0 ? idx : 1; // default to 10s
}
const _savedRate = parseInt(localStorage.getItem(LS_POLL_RATE) || '5', 10);
const _savedIdx = pollSnapIndex(_savedRate);
pollSlider.value = _savedIdx;
pollRateVal.textContent = `${POLL_SNAPS[_savedIdx]}s`;
pollSlider.addEventListener('input', () => {
  const rate = POLL_SNAPS[parseInt(pollSlider.value, 10)];
  pollRateVal.textContent = `${rate}s`;
  localStorage.setItem(LS_POLL_RATE, String(rate));
  if (lfmPollTimer) {
    clearInterval(lfmPollTimer);
    lfmPollTimer = setInterval(lfmPoll, rate * 1000);
  }
});

// ── Color preferences drag list ───────────────────────────────────────────────
function buildPrefsList() {
  const families = getOrderedFamilies();
  colorPrefsList.innerHTML = '';
  families.forEach((fam, idx) => {
    const li = document.createElement('li');
    li.className = 'pref-item';
    li.dataset.name = fam.name;
    li.draggable = true;
    li.innerHTML = `
      <span class="drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" /></svg></span>
      <span class="pref-swatch" style="background:${fam.color}"></span>
      <span class="pref-name">${fam.name}</span>
      <span class="pref-rank">#${idx + 1}</span>
    `;
    colorPrefsList.appendChild(li);
  });
  initDrag();
}

let dragSrc = null;
function initDrag() {
  colorPrefsList.querySelectorAll('.pref-item').forEach(item => {
    item.addEventListener('dragstart', e => { dragSrc = item; item.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    item.addEventListener('dragend',  () => { item.classList.remove('dragging'); colorPrefsList.querySelectorAll('.pref-item').forEach(i => i.classList.remove('drag-over')); persistPrefs(); });
    item.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (item !== dragSrc) { colorPrefsList.querySelectorAll('.pref-item').forEach(i => i.classList.remove('drag-over')); item.classList.add('drag-over'); } });
    item.addEventListener('drop', e => { e.preventDefault(); if (dragSrc && dragSrc !== item) { const items = [...colorPrefsList.querySelectorAll('.pref-item')]; items.indexOf(dragSrc) < items.indexOf(item) ? item.after(dragSrc) : item.before(dragSrc); updateRanks(); } });
  });
}
function updateRanks() { colorPrefsList.querySelectorAll('.pref-item').forEach((item, idx) => { item.querySelector('.pref-rank').textContent = `#${idx + 1}`; }); }
function persistPrefs() { savePrefs([...colorPrefsList.querySelectorAll('.pref-item')].map(i => i.dataset.name)); }

// ── Last.fm integration ───────────────────────────────────────────────────────
let lfmPollTimer      = null;
let lfmLastTrackKey   = null;  // "artist|||title" of last synced track
let lfmPollInFlight   = false; // prevent overlapping polls
let extractGeneration = 0;     // incremented on each new extraction; stale ones self-cancel
let skipDebounceTimer = null;  // debounces rapid prev/next presses

lfmUserInput.value      = localStorage.getItem(LS_LFM_USER) || '';
lfmKeyInput.value       = localStorage.getItem(LS_LFM_KEY)  || '';


lfmSaveBtn.addEventListener('click', () => {
  localStorage.setItem(LS_LFM_USER, lfmUserInput.value.trim());
  localStorage.setItem(LS_LFM_KEY,  lfmKeyInput.value.trim());
  showLfmStatus('ok', 'Saved.');
});

lfmTestBtn.addEventListener('click', async () => {
  const user = lfmUserInput.value.trim();
  const key  = lfmKeyInput.value.trim();
  if (!user || !key) { showLfmStatus('error', 'Enter username and API key first.'); return; }
  lfmTestBtn.disabled = true; lfmTestBtn.textContent = 'Testing…';
  try {
    const track = await lfmGetNowPlaying(user, key);
    if (track) showLfmStatus('ok', `Connected! Now playing: ${track.artist} — ${track.title}`);
    else        showLfmStatus('ok', 'Connected! No track currently playing.');
  } catch (e) { showLfmStatus('error', e.message || 'Failed.'); }
  finally { lfmTestBtn.disabled = false; lfmTestBtn.textContent = 'Test'; }
});


async function lfmGetNowPlaying(user, key) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(user)}&api_key=${encodeURIComponent(key)}&format=json&limit=1`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Last.fm error (${resp.status})`);
  const data = await resp.json();
  if (data.error) throw new Error(data.message || 'Last.fm error');
  const tracks = data.recenttracks?.track;
  if (!tracks || !tracks.length) return null;
  const track = Array.isArray(tracks) ? tracks[0] : tracks;
  const isLive = !!track['@attr']?.nowplaying;
  const art = track.image?.find(i => i.size === 'extralarge')?.['#text'] || '';
  return { title: track.name, artist: track.artist['#text'], art, isLive };
}

function updateMusicUI() {
  const hasCredentials = !!(localStorage.getItem(LS_LFM_USER) && localStorage.getItem(LS_LFM_KEY));
  const syncOn = localStorage.getItem(LS_LFM_SYNC) === 'true';
  const hasTrack = lfmLastTrackKey !== null;
  const paused = localStorage.getItem(LS_LIGHTS_PAUSED) === 'true';

  // npHero: always visible (music-only app now)
  npHero.classList.remove('hidden');

  // Sync badge: visible when syncing is on; shows paused state
  npSyncBadge.classList.toggle('hidden', !syncOn);
  npSyncBadge.classList.toggle('paused', paused);
  if (paused && syncOn) setSyncStatus('grey', '⏸ Paused');

  // Keep gradient visible when syncing and has colors
  if (syncOn && lastPrimary) result.classList.remove('hidden');

  updatePlaybackControls();
}

async function lfmPoll() {
  if (lfmPollInFlight) return;
  lfmPollInFlight = true;
  try { await _lfmPollInner(); } finally { lfmPollInFlight = false; }
}

async function _lfmPollInner() {
  const activeService = localStorage.getItem(LS_ACTIVE_SERVICE) || 'lastfm';
  // Use Spotify only if it's the selected service and connected
  if (activeService === 'spotify' && localStorage.getItem(LS_SPOTIFY_TOKEN)) {
    try {
      const track = await spotifyGetNowPlaying();
      if (track) {
        npTitle.textContent  = track.title;
        npArtist.textContent = track.artist;
        if (track.art) setArtSrc(track.art);
        const trackKey = `${track.artist}|||${track.title}`;
        if (trackKey !== lfmLastTrackKey) {
          lfmLastTrackKey = trackKey;
          idleActionSent = false;
          updateMusicUI();
          document.body.classList.add('extracting');
          setSyncStatus('grey', 'Syncing…');
          await extractFromArt(track.art, `${track.title} — ${track.artist}`);
        } else {
          setSyncStatus(track.isLive ? (_goveeOk === false ? 'orange' : 'green') : 'grey',
                        track.isLive ? (_goveeOk === false ? 'Lights offline' : 'Synced ✓') : 'Paused');
        }
        return;
      } else {
        npTitle.textContent = 'Nothing playing';
        npArtist.textContent = '';
        setSyncStatus('grey', 'Waiting…');
        await triggerIdleBehavior();
        return;
      }
    } catch (e) {
      setSyncStatus('red', 'Spotify error');
    }
  }

  const user = localStorage.getItem(LS_LFM_USER) || '';
  const key  = localStorage.getItem(LS_LFM_KEY)  || '';
  if (!user || !key) return;
  try {
    const track = await lfmGetNowPlaying(user, key);
    if (!track) {
      npTitle.textContent     = 'Nothing playing';
      npArtist.textContent    = 'Is your scrobbler running?';
      setSyncStatus('grey', 'Waiting…');
      await triggerIdleBehavior();
      return;
    }

    // Update UI regardless of live/last-played
    npTitle.textContent  = track.title;
    npArtist.textContent = track.artist;
    if (track.art) setArtSrc(track.art);

    const trackKey = `${track.artist}|||${track.title}`;

    if (trackKey !== lfmLastTrackKey) {
      // New track (or first load) — extract every time
      lfmLastTrackKey = trackKey;
      idleActionSent = false;
      updateMusicUI();
      document.body.classList.add('extracting');
      setSyncStatus('grey', track.isLive ? 'Syncing…' : 'Extracting…');
      await extractFromArt(track.art, `${track.title} — ${track.artist}`);
    } else {
      // Same track — just keep badge current
      setSyncStatus(track.isLive ? (_goveeOk === false ? 'orange' : 'green') : 'grey',
                    track.isLive ? (_goveeOk === false ? 'Lights offline' : 'Synced ✓') : 'Last played');
    }
  } catch (e) {
    npHero.classList.remove('syncing');
    setSyncStatus('red', 'Connection error');
  }
}

// ── Extract colors from album art URL ─────────────────────────────────────────
async function extractFromArt(artUrl, name = null) {
  const syncOn = localStorage.getItem(LS_LFM_SYNC) === 'true';
  if (!artUrl) {
    if (syncOn) setSyncStatus('grey', 'No artwork');
    return;
  }

  // Capture generation — if a newer call starts, this one self-cancels
  const gen = ++extractGeneration;
  const abort = new AbortController();
  const stale = () => gen !== extractGeneration;

  const headers = {};
  const apiKey = loadApiKey();
  if (apiKey) headers['X-Govee-Api-Key'] = apiKey;
  const skipNeutrals = loadSkipNeutrals();
  const cacheEnabled = localStorage.getItem(LS_CACHE_ENABLED) !== 'false';

  // ── Helper: apply transforms + send hex to Govee only if changed ─────────────
  async function maybeSendLight(hexColor) {
    if (!syncOn) return;
    if (localStorage.getItem(LS_LIGHTS_PAUSED) === 'true') return;
    const transformed = applyColorTransforms(hexColor);
    if (transformed === lastSentHex) return;
    lastSentHex = transformed;
    idleActionSent = false; // reset idle flag — we're actively playing

    const useLan = localStorage.getItem(LS_GOVEE_USE_LAN) === 'true';
    if (useLan) {
      let lanDevs = getLanSelectedDevices();
      if (!lanDevs) {
        try { lanDevs = JSON.parse(localStorage.getItem(LS_GOVEE_LAN_DEVICES) || '[]'); } catch { lanDevs = []; }
      }
      if (lanDevs.length) {
        const fd2 = new FormData();
        fd2.append('hex', transformed);
        fd2.append('devices', JSON.stringify(lanDevs));
        try {
          await fetch('/set-light-lan', { method: 'POST', body: fd2, signal: abort.signal });
          _goveeOk = true;
          setSyncStatus('green', 'Synced ✓');
        } catch (e) {
          if (e.name === 'AbortError') return;
          _goveeOk = false;
          setSyncStatus('orange', 'Lights offline');
        }
        return;
      }
      // Fall through to cloud if no LAN devices are configured
    }

    const fd2 = new FormData();
    fd2.append('hex', transformed);
    const sel = getSelectedDevices();
    if (sel) fd2.append('selected_devices', JSON.stringify(sel));
    try {
      await fetch('/set-light-hex', { method: 'POST', headers, body: fd2, signal: abort.signal });
      _goveeOk = true;
      setSyncStatus('green', 'Synced ✓');
    } catch (e) {
      if (e.name === 'AbortError') return;
      _goveeOk = false;
      setSyncStatus('orange', 'Lights offline');
    }
  }

  // ── Album cache lookup ───────────────────────────────────────────────────────
  if (cacheEnabled) {
    const cached = cacheGet(artUrl);
    if (cached) {
      if (stale()) return;
      document.body.classList.remove('extracting');
      showResult(cached, { fromSync: true, name });
      const useSecondary = loadPreferSec();
      await maybeSendLight(useSecondary && cached.secondary ? cached.secondary.hex : cached.hex);
      return;
    }
  }

  try {
    // Fetch art in browser to avoid server-side URL access issues
    const artResp = await fetch(artUrl, { signal: abort.signal });
    if (!artResp.ok) throw new Error(`Art fetch ${artResp.status}`);
    const artBlob = await artResp.blob();
    if (stale()) return;

    // ── Downsample to 64×64 WebP for faster extraction (displayed art unaffected) ──
    let uploadBlob = artBlob;
    try {
      const bmp = await createImageBitmap(artBlob);
      const canvas = Object.assign(document.createElement('canvas'), { width: 64, height: 64 });
      canvas.getContext('2d').drawImage(bmp, 0, 0, 64, 64);
      bmp.close();
      // Prefer WebP (smaller), fall back to JPEG
      const fmt = canvas.toDataURL('image/webp').startsWith('data:image/webp')
        ? 'image/webp' : 'image/jpeg';
      uploadBlob = await new Promise(res => canvas.toBlob(res, fmt, 0.80));
    } catch {}
    if (stale()) return;

    const fd = new FormData();
    fd.append('file', uploadBlob, 'art.webp');
    fd.append('skip_neutrals', skipNeutrals ? '1' : '0');
    const analyzeResp = await fetch('/extract', { method: 'POST', body: fd, headers, signal: abort.signal });
    if (!analyzeResp.ok) throw new Error(`Extract ${analyzeResp.status}`);
    const colorData = await analyzeResp.json();
    if (stale()) return;

    // ── Write to album cache ─────────────────────────────────────────────────────
    if (cacheEnabled) cacheSet(artUrl, colorData);

    showResult(colorData, { fromSync: true, name });
    const useSecondary = loadPreferSec();
    await maybeSendLight(useSecondary && colorData.secondary ? colorData.secondary.hex : colorData.hex);

  } catch (e) {
    if (e.name === 'AbortError') return; // cancelled cleanly — no UI update
    document.body.classList.remove('extracting');
    if (syncOn) setSyncStatus('red', 'Sync error');
  }
}

function startLfmSync() {
  if (lfmPollTimer) return;
  updateMusicUI();
  lfmPoll();
  const _storedRate = parseInt(localStorage.getItem(LS_POLL_RATE) || '5', 10);
  const pollRate = (POLL_SNAPS.includes(_storedRate) ? _storedRate : 5) * 1000;
  lfmPollTimer = setInterval(lfmPoll, pollRate);
}

function stopLfmSync() {
  clearInterval(lfmPollTimer);
  lfmPollTimer = null;
  lastSentHex = null; // force re-send on next Auto-on
  idleActionSent = false;
  // Keep lfmLastTrackKey so reload/auto buttons remain visible after toggling off
  updateMusicUI();
}

async function triggerIdleBehavior() {
  const syncOn = localStorage.getItem(LS_LFM_SYNC) === 'true';
  if (!syncOn || idleActionSent) return;
  if (localStorage.getItem(LS_LIGHTS_PAUSED) === 'true') return;
  const behavior = localStorage.getItem(LS_IDLE_BEHAVIOR) || 'keep';
  if (behavior === 'keep') return;
  idleActionSent = true;
  lastSentHex = null; // allow next track to re-send
  const apiKey = loadApiKey();
  const headers = {};
  if (apiKey) headers['X-Govee-Api-Key'] = apiKey;
  const sel = getSelectedDevices();
  const useLan = localStorage.getItem(LS_GOVEE_USE_LAN) === 'true';
  let lanDevs = null;
  if (useLan) {
    lanDevs = getLanSelectedDevices();
    if (!lanDevs) {
      try { lanDevs = JSON.parse(localStorage.getItem(LS_GOVEE_LAN_DEVICES) || '[]'); } catch { lanDevs = []; }
    }
    if (!lanDevs.length) lanDevs = null; // nothing configured — fall back to cloud
  }

  if (behavior === 'white') {
    if (lanDevs) {
      const fd = new FormData(); fd.append('hex', '#ffffff'); fd.append('devices', JSON.stringify(lanDevs));
      await fetch('/set-light-lan', { method: 'POST', body: fd });
    } else {
      const fd = new FormData(); fd.append('hex', '#ffffff');
      if (sel) fd.append('selected_devices', JSON.stringify(sel));
      await fetch('/set-light-hex', { method: 'POST', headers, body: fd });
    }
  } else if (behavior === 'off') {
    if (lanDevs) {
      const fd = new FormData(); fd.append('state', 'off'); fd.append('devices', JSON.stringify(lanDevs));
      await fetch('/govee/lan/power', { method: 'POST', body: fd });
    } else {
      const fd = new FormData(); fd.append('state', 'off');
      if (sel) fd.append('selected_devices', JSON.stringify(sel));
      await fetch('/govee/power', { method: 'POST', headers, body: fd });
    }
  }
}

function showLfmStatus(type, msg) {
  lfmStatus.textContent = msg;
  lfmStatus.className = `key-status ${type}`;
}

// ── Service picker UI ─────────────────────────────────────────────────────────
function updateServiceCards() {
  const lfmConnected     = !!(localStorage.getItem(LS_LFM_USER) && localStorage.getItem(LS_LFM_KEY));
  const spotifyConnected = !!localStorage.getItem(LS_SPOTIFY_TOKEN);
  const goveeConnected   = !!loadApiKey();
  lastfmBadge.classList.toggle('hidden', !lfmConnected);
  spotifyBadge.classList.toggle('hidden', !spotifyConnected);
  if (goveeBadge) goveeBadge.classList.toggle('hidden', !goveeConnected);
  // Highlight active rows
  if (serviceLastfmRow)  serviceLastfmRow.classList.toggle('active',  !!(localStorage.getItem(LS_ACTIVE_SERVICE) === 'lastfm'  && lastfmConfig && !lastfmConfig.classList.contains('hidden')));
  if (serviceSpotifyRow) serviceSpotifyRow.classList.toggle('active', !!(localStorage.getItem(LS_ACTIVE_SERVICE) === 'spotify' && spotifyConfig && !spotifyConfig.classList.contains('hidden')));
}

function toggleServiceRow(service) {
  const isLastfm = service === 'lastfm';
  const row    = isLastfm ? serviceLastfmRow  : serviceSpotifyRow;
  const config = isLastfm ? lastfmConfig      : spotifyConfig;
  const otherRow    = isLastfm ? serviceSpotifyRow : serviceLastfmRow;
  const otherConfig = isLastfm ? spotifyConfig     : lastfmConfig;

  const isOpen = !config.classList.contains('hidden');

  // If clicking already-open row — just close it (deselect)
  if (isOpen) {
    config.classList.add('hidden');
    row.classList.remove('open', 'active');
    return;
  }

  // Close the other row
  otherConfig.classList.add('hidden');
  otherRow.classList.remove('open', 'active');

  // Open this row and mark it as selected service
  config.classList.remove('hidden');
  row.classList.add('open', 'active');
  localStorage.setItem(LS_ACTIVE_SERVICE, service);
}

function selectService(service) {
  // Used programmatically (e.g. OAuth callback) — force open
  const isLastfm = service === 'lastfm';
  localStorage.setItem(LS_ACTIVE_SERVICE, service);
  const row    = isLastfm ? serviceLastfmRow  : serviceSpotifyRow;
  const config = isLastfm ? lastfmConfig      : spotifyConfig;
  const otherRow    = isLastfm ? serviceSpotifyRow : serviceLastfmRow;
  const otherConfig = isLastfm ? spotifyConfig     : lastfmConfig;
  otherConfig.classList.add('hidden');
  otherRow.classList.remove('open', 'active');
  config.classList.remove('hidden');
  row.classList.add('open', 'active');
}

serviceLastfmBtn.addEventListener('click', () => toggleServiceRow('lastfm'));
serviceSpotifyBtn.addEventListener('click', () => toggleServiceRow('spotify'));

// Govee row toggle
goveeRowBtn.addEventListener('click', () => {
  const isOpen = !goveeConfig.classList.contains('hidden');
  goveeConfig.classList.toggle('hidden', isOpen);
  goveeRow.classList.toggle('open', !isOpen);
});

// ── Spotify OAuth PKCE ────────────────────────────────────────────────────────
function generateVerifier(len = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  return Array.from(crypto.getRandomValues(new Uint8Array(len))).map(b => chars[b % chars.length]).join('');
}

async function generateChallenge(verifier) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}

async function spotifyStartAuth() {
  const clientId = spotifyClientIdInput.value.trim();
  if (!clientId) { showSpotifyStatus('error', 'Enter a Client ID first.'); return; }
  const verifier = generateVerifier();
  const challenge = await generateChallenge(verifier);
  localStorage.setItem('colorpick_spotify_verifier', verifier);
  localStorage.setItem(LS_SPOTIFY_CLIENT_ID, clientId);
  const redirectUri = window.location.origin + window.location.pathname;
  const params = new URLSearchParams({
    client_id: clientId, response_type: 'code', redirect_uri: redirectUri,
    code_challenge_method: 'S256', code_challenge: challenge,
    scope: 'user-read-currently-playing user-read-playback-state user-modify-playback-state',
  });
  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

async function spotifyExchangeCode(code) {
  const verifier = localStorage.getItem('colorpick_spotify_verifier');
  const clientId = localStorage.getItem(LS_SPOTIFY_CLIENT_ID);
  const redirectUri = window.location.origin + window.location.pathname;
  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri, client_id: clientId, code_verifier: verifier }),
  });
  const data = await resp.json();
  if (data.access_token) {
    localStorage.setItem(LS_SPOTIFY_TOKEN, data.access_token);
    localStorage.setItem(LS_SPOTIFY_REFRESH, data.refresh_token || '');
    localStorage.setItem(LS_SPOTIFY_EXPIRES, String(Date.now() + (data.expires_in || 3600) * 1000));
    localStorage.removeItem('colorpick_spotify_verifier');
  }
  return data;
}

let _spotifyRefreshPromise = null; // singleton: concurrent callers share one in-flight request
async function spotifyRefresh() {
  if (_spotifyRefreshPromise) return _spotifyRefreshPromise;
  _spotifyRefreshPromise = _doSpotifyRefresh().finally(() => { _spotifyRefreshPromise = null; });
  return _spotifyRefreshPromise;
}
async function _doSpotifyRefresh() {
  const refresh = localStorage.getItem(LS_SPOTIFY_REFRESH);
  const clientId = localStorage.getItem(LS_SPOTIFY_CLIENT_ID);
  if (!refresh || !clientId) return null;
  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh, client_id: clientId }),
  });
  const data = await resp.json();
  if (data.access_token) {
    localStorage.setItem(LS_SPOTIFY_TOKEN, data.access_token);
    if (data.refresh_token) localStorage.setItem(LS_SPOTIFY_REFRESH, data.refresh_token);
    localStorage.setItem(LS_SPOTIFY_EXPIRES, String(Date.now() + (data.expires_in || 3600) * 1000));
    return data.access_token;
  }
  return null;
}

async function getSpotifyToken() {
  const expires = parseInt(localStorage.getItem(LS_SPOTIFY_EXPIRES) || '0');
  if (Date.now() > expires - 60000) return await spotifyRefresh();
  return localStorage.getItem(LS_SPOTIFY_TOKEN);
}

async function spotifyGetNowPlaying() {
  const token = await getSpotifyToken();
  if (!token) return null;
  const resp = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (resp.status === 204 || resp.status === 401) return null;
  if (!resp.ok) throw new Error(`Spotify ${resp.status}`);
  const data = await resp.json();
  if (!data?.item) return null;
  setPlaybackIcon(data.is_playing);
  return {
    title: data.item.name,
    artist: data.item.artists.map(a => a.name).join(', '),
    art: data.item.album.images[0]?.url || '',
    isLive: data.is_playing,
  };
}

function spotifyDisconnect() {
  [LS_SPOTIFY_TOKEN, LS_SPOTIFY_REFRESH, LS_SPOTIFY_EXPIRES].forEach(k => localStorage.removeItem(k));
  updateServiceCards();
  updateSpotifyUI();
}

function updateSpotifyUI() {
  const connected = !!localStorage.getItem(LS_SPOTIFY_TOKEN);
  spotifyConnectBtn.classList.toggle('hidden', connected);
  spotifyDisconnectBtn.classList.toggle('hidden', !connected);
  if (spotifyClientIdInput) spotifyClientIdInput.value = localStorage.getItem(LS_SPOTIFY_CLIENT_ID) || '';
}

function showSpotifyStatus(type, msg) {
  spotifyStatus.textContent = msg;
  spotifyStatus.className = `key-status ${type}`;
}

spotifyConnectBtn.addEventListener('click', spotifyStartAuth);
spotifyDisconnectBtn.addEventListener('click', spotifyDisconnect);

// ── Spotify playback controls ─────────────────────────────────────────────────
let spotifyIsPlaying = false;

function updatePlaybackControls() {
  const enabled = localStorage.getItem(LS_SPOTIFY_PLAYBACK) === 'true';
  const connected = !!localStorage.getItem(LS_SPOTIFY_TOKEN);
  playbackControls.classList.toggle('hidden', !(enabled && connected));
  if (spotifyPlaybackToggle) spotifyPlaybackToggle.checked = enabled;
}

function setPlaybackIcon(isPlaying) {
  spotifyIsPlaying = isPlaying;
  playbackPlayIcon.classList.toggle('hidden', isPlaying);
  playbackPauseIcon.classList.toggle('hidden', !isPlaying);
}

async function spotifyPlayerAction(endpoint, method = 'POST') {
  const token = await getSpotifyToken();
  if (!token) return false;
  const resp = await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  });
  // 204 = success, 202 = accepted (prev/next)
  if (resp.status === 404) {
    console.warn('Spotify: no active device. Open Spotify on a device first.');
  } else if (resp.status === 403) {
    console.warn('Spotify: missing playback scope. Reconnect Spotify.');
  } else if (!resp.ok && resp.status !== 204 && resp.status !== 202) {
    console.warn('Spotify player action failed:', resp.status);
  }
  return resp.ok || resp.status === 204 || resp.status === 202;
}

async function spotifyFetchPlaybackState() {
  const token = await getSpotifyToken();
  if (!token) return;
  const resp = await fetch('https://api.spotify.com/v1/me/player', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (resp.status === 204 || !resp.ok) return;
  const data = await resp.json();
  setPlaybackIcon(data?.is_playing ?? false);
}

async function skipAndRefresh(direction) {
  // Immediately fade the art and show loading state while we wait for the next track
  npArt.style.opacity = '0';
  npArtWrap.classList.add('art-loading');
  await spotifyPlayerAction(direction);
  // Debounce: only fire one poll even if user skips rapidly
  lfmLastTrackKey = null;
  extractGeneration++; // cancel any in-flight extraction immediately
  clearTimeout(skipDebounceTimer);
  skipDebounceTimer = setTimeout(lfmPoll, 1200);
}

playbackPrev.addEventListener('click', () => skipAndRefresh('previous'));
playbackNext.addEventListener('click', () => skipAndRefresh('next'));

playbackToggleBtn.addEventListener('click', async () => {
  const token = await getSpotifyToken();
  if (!token) return;
  const wasPlaying = spotifyIsPlaying;
  setPlaybackIcon(!wasPlaying); // optimistic update
  const ok = await spotifyPlayerAction(wasPlaying ? 'pause' : 'play', 'PUT');
  if (!ok) setPlaybackIcon(wasPlaying); // revert on failure
  setTimeout(spotifyFetchPlaybackState, 800); // confirm real state
});

spotifyPlaybackToggle.addEventListener('change', () => {
  localStorage.setItem(LS_SPOTIFY_PLAYBACK, spotifyPlaybackToggle.checked ? 'true' : 'false');
  updatePlaybackControls();
  if (spotifyPlaybackToggle.checked) spotifyFetchPlaybackState();
});

connectPromptBtn.addEventListener('click', () => {
  mainView.classList.add('hidden');
  settingsView.classList.remove('hidden');
});

// ── Sync badge: click to pause/resume light updates ───────────────────────────
npSyncBadge.addEventListener('click', () => {
  const paused = localStorage.getItem(LS_LIGHTS_PAUSED) === 'true';
  const newPaused = !paused;
  localStorage.setItem(LS_LIGHTS_PAUSED, String(newPaused));
  if (!newPaused) {
    lastSentHex = null; // force immediate re-send on unpause
    lfmLastTrackKey = null; // trigger re-extraction so colors update right away
    lfmPoll();
  }
  updateMusicUI();
});
npSyncBadge.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') npSyncBadge.click(); });

// ── Init ──────────────────────────────────────────────────────────────────────
// Force GPU recomposite for blurred orbs after first paint — fixes the boxy
// artifact that otherwise only clears when the user scrolls.
requestAnimationFrame(() => requestAnimationFrame(() => {
  bgOrb1.style.transform = 'translateZ(0) scale(1.0001)';
  bgOrb2.style.transform = 'translateZ(0) scale(1.0001)';
  requestAnimationFrame(() => {
    bgOrb1.style.transform = '';
    bgOrb2.style.transform = '';
  });
}));

// Populate version from server so config.py is the single source of truth
fetch('/health').then(r => r.json()).then(d => {
  const el = document.getElementById('app-version');
  if (el && d.version) el.textContent = `covercolor v${d.version}`;
}).catch(() => {});

buildPrefsList();
updateServiceCards();
updateSpotifyUI();
updatePlaybackControls();
// Restore active service — rows start closed, don't auto-open on load
updateMusicUI();

// Handle Spotify OAuth callback
(async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (code) {
    // Clean up URL
    window.history.replaceState({}, '', window.location.pathname);
    try {
      const data = await spotifyExchangeCode(code);
      if (data.access_token) {
        updateServiceCards();
        updateSpotifyUI();
        showSpotifyStatus('ok', 'Spotify connected!');
        // Open settings to show success
        showView(settingsView, mainView, 'forward');
        selectService('spotify');
      } else {
        showSpotifyStatus('error', data.error_description || 'Auth failed.');
        showView(settingsView, mainView, 'forward');
        selectService('spotify');
      }
    } catch (e) {
      showSpotifyStatus('error', 'Auth failed: ' + e.message);
    }
    return;
  }

  // ── Theme toggle ────────────────────────────────────────────────────────────
  const themeIconBtn  = document.getElementById('theme-icon-btn');
  const themeIconSun  = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');
  const LS_THEME = 'colorpick_theme';
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem(LS_THEME);
  // If no saved pref, follow system; otherwise use saved
  let isLightMode = saved ? saved === 'light' : !systemDark;
  function applyTheme(light) {
    isLightMode = light;
    document.body.classList.toggle('theme-light', light);
    document.body.classList.toggle('theme-dark', !light);
    if (themeIconSun)  themeIconSun.classList.toggle('hidden', light);
    if (themeIconMoon) themeIconMoon.classList.toggle('hidden', !light);
  }
  applyTheme(isLightMode);
  if (themeIconBtn) {
    themeIconBtn.addEventListener('click', () => {
      const light = !isLightMode;
      localStorage.setItem(LS_THEME, light ? 'light' : 'dark');
      applyTheme(light);
    });
  }

  // Always start sync when credentials are present — no Auto button gate
  if (localStorage.getItem(LS_SPOTIFY_TOKEN) || (localStorage.getItem(LS_LFM_USER) && localStorage.getItem(LS_LFM_KEY))) {
    localStorage.setItem(LS_LFM_SYNC, 'true');
    startLfmSync();
  }
})()
