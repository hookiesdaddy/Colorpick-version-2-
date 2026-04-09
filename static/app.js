// ── DOM refs ──────────────────────────────────────────────────────────────────
const tabs              = document.querySelectorAll('.tab');
const uploadMode        = document.getElementById('upload-mode');
const urlMode           = document.getElementById('url-mode');
const dropzone          = document.getElementById('dropzone');
const fileInput         = document.getElementById('file-input');
const fileLabelText     = document.getElementById('file-label-text');
const urlInput          = document.getElementById('url-input');
const form              = document.getElementById('form');
const submitBtn         = form.querySelector('.submit-btn');
const btnText           = submitBtn.querySelector('.btn-text');
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
const clearBtn          = document.getElementById('clear-btn');
const optionsBtn        = document.getElementById('options-btn');
const optionsPanel      = document.getElementById('options-panel');
const reloadHint        = document.getElementById('reload-hint');
const reloadHintBtn     = document.getElementById('reload-hint-btn');
const lightsProgress    = document.getElementById('lights-progress');

// Settings
const mainView          = document.getElementById('main-view');
const settingsView      = document.getElementById('settings-view');
const settingsBtn       = document.getElementById('settings-btn');
const settingsBack      = document.getElementById('settings-back');

// Mode tabs
const modeMusicBtn      = document.getElementById('mode-music-btn');
const modePhotosBtn     = document.getElementById('mode-photos-btn');

// Photo hero
const photoHero         = document.getElementById('photo-hero');
const photoArtWrap      = document.getElementById('photo-art-wrap');
const photoPreview      = document.getElementById('photo-preview');
const photoFilename     = document.getElementById('photo-filename');
const photoFilesize     = document.getElementById('photo-filesize');

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
const npTitle           = document.getElementById('np-title');
const npArtist          = document.getElementById('np-artist');
const npSyncLabel       = document.getElementById('np-sync-label');
const uploadSheet       = document.getElementById('upload-sheet');
const sheetCloseBtn     = document.getElementById('sheet-close-btn');
const autoBtn           = document.getElementById('auto-btn');
const npActionRow       = document.getElementById('np-action-row');
const extractArea       = document.getElementById('extract-area');
const mainUrlInput      = document.getElementById('main-url-input');
const mainExtractBtn    = document.getElementById('main-extract-btn');
const npSyncBadge       = document.getElementById('np-sync-badge');
const mainUrlWrap       = document.getElementById('main-url-wrap');
const colorGradientBox  = document.getElementById('color-gradient-box');

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

// ── State ─────────────────────────────────────────────────────────────────────
let activeMode     = 'upload';
let appMode        = 'music'; // 'music' | 'photos'
let lastPrimary    = null;
let lastSecondary  = null;
let manualOverride = null; // 'primary' | 'secondary' | null

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

function updateActiveChip() {
  if (!lastPrimary) return;
  const useSec  = isUsingSecondary();
  const activeHex = useSec ? (lastSecondary?.hex ?? lastPrimary.hex) : lastPrimary.hex;

  primaryChip.classList.toggle('active', !useSec);
  primaryChip.style.setProperty('--chip-color', lastPrimary.hex);

  secondaryChip.classList.toggle('active', useSec);
  secondaryChip.style.setProperty('--chip-color', lastSecondary?.hex ?? lastPrimary.hex);

  document.querySelectorAll('.toggle-switch').forEach(sw => {
    sw.style.setProperty('--toggle-active-color', activeHex);
  });
  setLightsBtn.style.setProperty('--active-color', activeHex);
  autoBtn.style.setProperty('--active-color', activeHex);
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeMode = tab.dataset.mode;
    uploadMode.classList.toggle('hidden', activeMode !== 'upload');
    urlMode.classList.toggle('hidden', activeMode !== 'url');
    hideResult(); hideError();
  });
});

// ── File / URL ────────────────────────────────────────────────────────────────
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) { fileLabelText.textContent = file.name; dropzone.classList.add('has-file'); }
  resetButton();
  updateClearBtn();
  // Photos mode: update hero preview
  if (appMode === 'photos' && file) {
    photoFilename.textContent = file.name;
    photoFilesize.textContent = formatSize(file.size) || '';
    const reader = new FileReader();
    reader.onload = ev => { photoPreview.src = ev.target.result; };
    reader.readAsDataURL(file);
    closeUploadSheet();
  }
});
urlInput.addEventListener('input', () => { resetButton(); updateClearBtn(); });

['dragenter','dragover'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.add('dragging'); }));
['dragleave','drop'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.remove('dragging'); }));
dropzone.addEventListener('drop', e => {
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    fileInput.files = e.dataTransfer.files;
    fileLabelText.textContent = file.name;
    dropzone.classList.add('has-file');
    resetButton();
    updateClearBtn();
  }
});

// ── Form submit ───────────────────────────────────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (submitBtn.classList.contains('color-revealed')) return;
  hideResult(); hideError();
  submitBtn.disabled = true;
  btnText.textContent = 'Extracting…';

  try {
    let response;
    const headers = {};
    const apiKey = loadApiKey();
    if (apiKey) headers['X-Govee-Api-Key'] = apiKey;

    const skipNeutrals = loadSkipNeutrals();
    if (activeMode === 'upload') {
      if (!fileInput.files[0]) { showError('Please select an image file.'); return; }
      const fd = new FormData();
      fd.append('file', fileInput.files[0]);
      fd.append('skip_neutrals', skipNeutrals ? '1' : '0');
      response = await fetch('/extract', { method: 'POST', body: fd, headers });
    } else {
      const url = urlInput.value.trim();
      if (!url) { showError('Please enter an image URL.'); return; }
      response = await fetch('/extract/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ url, skip_neutrals: skipNeutrals }),
      });
    }

    const data = await response.json();
    if (!response.ok) { showError(data.detail || 'Extraction failed.'); return; }
    const histName = activeMode === 'upload' && fileInput.files[0]
      ? fileInput.files[0].name
      : (urlInput.value.trim() || 'Image URL');
    const histSize = activeMode === 'upload' && fileInput.files[0] ? fileInput.files[0].size : null;
    showResult(data, { name: histName, size: histSize });
  } catch {
    showError('Network error — is the server running?');
  } finally {
    submitBtn.disabled = false;
    if (!submitBtn.classList.contains('color-revealed')) btnText.textContent = 'Extract Color';
  }
});

// ── Reload / Clear ────────────────────────────────────────────────────────────
reloadBtn.addEventListener('click', async () => {
  reloadHint.classList.add('hidden');
  reloadBtn.classList.remove('needs-reload');
  hideError();

  if (appMode === 'music') {
    // Re-extract from current Last.fm art
    const user = localStorage.getItem(LS_LFM_USER) || '';
    const key  = localStorage.getItem(LS_LFM_KEY)  || '';
    if (!user || !key) return;
    reloadBtn.disabled = true;
    try {
      const track = await lfmGetNowPlaying(user, key);
      if (track) {
        npTitle.textContent  = track.title;
        npArtist.textContent = track.artist;
        if (track.art) npArt.src = track.art;
        await extractFromArt(track.art, `${track.title} — ${track.artist}`);
      }
    } catch (e) { /* silent */ }
    finally { reloadBtn.disabled = false; }
  } else {
    // Photos mode: re-run the upload form
    submitBtn.classList.remove('color-revealed');
    btnText.textContent = 'Extract Color';
    hideResult();
    form.requestSubmit();
  }
});

clearBtn.addEventListener('click', () => {
  reloadHint.classList.add('hidden');
  reloadBtn.classList.remove('needs-reload');
  resetButton();
  fileInput.value = '';
  fileLabelText.textContent = 'Drop an image or click to browse';
  dropzone.classList.remove('has-file');
  urlInput.value = '';
  updateClearBtn();
});

function updateClearBtn() {
  const syncOn = localStorage.getItem(LS_LFM_SYNC) === 'true';
  const hasContent = dropzone.classList.contains('has-file') || urlInput.value.trim() || lastPrimary;
  clearBtn.style.display = (!syncOn && hasContent) ? '' : 'none';
}

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
  dropzone.style.setProperty('--dropzone-color', lastPrimary.hex);
  bgOrb1.style.background = `radial-gradient(circle, ${lastPrimary.hex}, transparent 70%)`;
  bgOrb2.style.background = `radial-gradient(circle, ${lastSecondary.hex}, transparent 70%)`;
  if (!fromSync) submitBtn.classList.add('color-revealed');

  hexPrimaryText.textContent   = lastPrimary.hex.toUpperCase();
  rgbPrimary.textContent       = `${data.rgb.r}, ${data.rgb.g}, ${data.rgb.b}`;
  hexSecondaryText.textContent = lastSecondary.hex.toUpperCase();
  rgbSecondary.textContent     = `${lastSecondary.rgb.r}, ${lastSecondary.rgb.g}, ${lastSecondary.rgb.b}`;

  lightsStatus.classList.add('hidden');
  closeUploadSheet();
  setTimeout(() => { result.classList.remove('hidden'); updateActiveChip(); updateClearBtn(); }, 350);
}

function hideResult() {
  result.classList.add('hidden');
  lastPrimary = lastSecondary = null;
  manualOverride = null;
  primaryChip.classList.remove('active');
  secondaryChip.classList.remove('active');
  dropzone.style.removeProperty('--dropzone-color');
  bgOrb1.style.removeProperty('background');
  bgOrb2.style.removeProperty('background');
}

function resetButton() {
  submitBtn.classList.remove('color-revealed');
  btnText.textContent = 'Extract Color';
  hideResult(); hideError();
}

function showError(msg) { errorDiv.textContent = msg; errorDiv.classList.remove('hidden'); }
function hideError()    { errorDiv.classList.add('hidden'); }

const root = document.documentElement;

// ── Mode switching ────────────────────────────────────────────────────────────
function switchMode(mode) {
  if (appMode === mode) return;
  appMode = mode;
  modeMusicBtn.classList.toggle('active', mode === 'music');
  modePhotosBtn.classList.toggle('active', mode === 'photos');
  // Clear colors when switching
  hideResult();
  // Reset photo hero when leaving photos mode
  if (mode === 'music') {
    photoPreview.src = '';
    photoFilename.textContent = '—';
    photoFilesize.textContent = '—';
    fileInput.value = '';
    fileLabelText.textContent = 'Drop an image or click to browse';
    dropzone.classList.remove('has-file');
    // Re-run color extraction for current track
    lfmLastTrackKey = null;
    if (lfmPollTimer) lfmPoll();
  }
  updateMusicUI();
  updateClearBtn();
}

modeMusicBtn.addEventListener('click', () => switchMode('music'));
modePhotosBtn.addEventListener('click', () => switchMode('photos'));

// ── Photo hero upload ─────────────────────────────────────────────────────────
photoArtWrap.addEventListener('click', () => fileInput.click());
photoArtWrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });


// ── Settings panel ────────────────────────────────────────────────────────────
settingsBtn.addEventListener('click', () => { mainView.classList.add('hidden'); settingsView.classList.remove('hidden'); });
settingsBack.addEventListener('click', () => { settingsView.classList.add('hidden'); mainView.classList.remove('hidden'); });

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
  mainView.classList.add('hidden');
  historyView.classList.remove('hidden');
  renderHistory();
});
historyBack.addEventListener('click', () => {
  historyView.classList.add('hidden');
  mainView.classList.remove('hidden');
});
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
    resp.ok
      ? showKeyStatus('ok', `Connected! Found ${data.devices} device${data.devices !== 1 ? 's' : ''}.`)
      : showKeyStatus('error', data.detail || 'Connection failed.');
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
let lfmPollTimer    = null;
let lfmLastTrackKey = null; // "Artist - Title" of last synced track

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
  const isMusic = appMode === 'music';
  const isPhotos = appMode === 'photos';
  const hasTrack = lfmLastTrackKey !== null;
  const hasPhoto = !!(fileInput.files && fileInput.files[0]);

  // noService: always hidden — npHero handles all music states
  noService.classList.add('hidden');

  // npHero: visible whenever in music mode
  npHero.classList.toggle('hidden', !isMusic);
  npSyncBadge.classList.toggle('hidden', !isMusic || !syncOn);

  // ── Photo-mode elements ───────────────────────────────────────────────────
  photoHero.classList.toggle('hidden', !isPhotos);

  // ── Action row ────────────────────────────────────────────────────────────
  npActionRow.classList.toggle('hidden', isMusic && !hasCredentials);

  // Auto button: music only; hidden until a track plays OR sync is already on
  autoBtn.style.display = (isPhotos || (!syncOn && !hasTrack)) ? 'none' : '';
  autoBtn.classList.toggle('active', syncOn);
  autoBtn.title = syncOn ? 'Auto ON — click to turn off' : 'Auto OFF — click to turn on';

  // Reload: music only, not when auto on, only once a track has been detected
  reloadBtn.style.display = (isPhotos || syncOn || (isMusic && !hasTrack)) ? 'none' : '';

  // Clear: hidden by updateClearBtn when no content; force-hide when auto on
  if (syncOn) clearBtn.style.display = 'none';

  // URL wrap: photos mode only
  if (mainUrlWrap) mainUrlWrap.classList.toggle('hidden', isMusic);

  // Extract area: photos only (music uses ↺ reload instead)
  extractArea.classList.toggle('hidden', isMusic);

  // Keep gradient visible when auto is active and has colors
  if (syncOn && lastPrimary) result.classList.remove('hidden');

  updatePlaybackControls();
}

function openUploadSheet() {
  uploadSheet.classList.remove('hidden');
  requestAnimationFrame(() => uploadSheet.classList.add('open'));
}

function closeUploadSheet() {
  if (!uploadSheet.classList.contains('open')) return;
  uploadSheet.classList.remove('open');
  uploadSheet.addEventListener('transitionend', () => uploadSheet.classList.add('hidden'), { once: true });
}

async function lfmPoll() {
  const activeService = localStorage.getItem(LS_ACTIVE_SERVICE) || 'lastfm';
  // Use Spotify only if it's the selected service and connected
  if (activeService === 'spotify' && localStorage.getItem(LS_SPOTIFY_TOKEN)) {
    try {
      const track = await spotifyGetNowPlaying();
      if (track) {
        npTitle.textContent  = track.title;
        npArtist.textContent = track.artist;
        if (track.art) npArt.src = track.art;
        const trackKey = `${track.artist}|||${track.title}`;
        if (trackKey !== lfmLastTrackKey) {
          lfmLastTrackKey = trackKey;
          updateMusicUI();
          document.body.classList.add('extracting');
          npSyncLabel.textContent = 'Syncing…';
          await extractFromArt(track.art, `${track.title} — ${track.artist}`);
        } else {
          npHero.classList.add('syncing');
          npSyncLabel.textContent = 'Synced ✓';
        }
        return;
      } else {
        npHero.classList.remove('syncing');
        npTitle.textContent = 'Nothing playing';
        npArtist.textContent = '';
        npSyncLabel.textContent = 'Waiting…';
        return;
      }
    } catch (e) {
      npSyncLabel.textContent = 'Spotify error';
    }
  }

  const user = localStorage.getItem(LS_LFM_USER) || '';
  const key  = localStorage.getItem(LS_LFM_KEY)  || '';
  if (!user || !key) return;
  try {
    const track = await lfmGetNowPlaying(user, key);
    if (!track) {
      npHero.classList.remove('syncing');
      npTitle.textContent     = 'Nothing playing';
      npArtist.textContent    = 'Is your scrobbler running?';
      npSyncLabel.textContent = 'Waiting…';
      return;
    }

    // Update UI regardless of live/last-played
    npTitle.textContent  = track.title;
    npArtist.textContent = track.artist;
    if (track.art) npArt.src = track.art;

    const trackKey = `${track.artist}|||${track.title}`;

    if (trackKey !== lfmLastTrackKey) {
      // New track (or first load) — extract every time
      lfmLastTrackKey = trackKey;
      updateMusicUI(); // reveal reload/auto buttons now that a track is present
      document.body.classList.add('extracting');
      npHero.classList.remove('syncing');
      npSyncLabel.textContent = track.isLive ? 'Syncing…' : 'Extracting…';
      await extractFromArt(track.art, `${track.title} — ${track.artist}`);
    } else {
      // Same track — just keep badge current
      npHero.classList.toggle('syncing', track.isLive);
      npSyncLabel.textContent = track.isLive ? 'Synced ✓' : 'Last played';
    }
  } catch (e) {
    npHero.classList.remove('syncing');
    npSyncLabel.textContent = 'Last.fm error — check credentials';
  }
}

// ── Extract colors from album art URL ─────────────────────────────────────────
async function extractFromArt(artUrl, name = null) {
  const syncOn = localStorage.getItem(LS_LFM_SYNC) === 'true';
  if (!artUrl) {
    if (syncOn) npSyncLabel.textContent = 'No artwork available';
    return;
  }
  const headers = {};
  const apiKey = loadApiKey();
  if (apiKey) headers['X-Govee-Api-Key'] = apiKey;
  const skipNeutrals = loadSkipNeutrals();

  try {
    // Fetch art in browser to avoid server-side URL access issues
    const artResp = await fetch(artUrl);
    if (!artResp.ok) throw new Error(`Art fetch ${artResp.status}`);
    const artBlob = await artResp.blob();
    const fd = new FormData();
    fd.append('file', artBlob, 'art.jpg');
    fd.append('skip_neutrals', skipNeutrals ? '1' : '0');
    const analyzeResp = await fetch('/extract', { method: 'POST', body: fd, headers });
    if (!analyzeResp.ok) throw new Error(`Extract ${analyzeResp.status}`);
    const colorData = await analyzeResp.json();
    showResult(colorData, { fromSync: true, name });

    if (syncOn) {
      // Auto-set lights
      const useSecondary = loadPreferSec();
      const hexColor = useSecondary && colorData.secondary ? colorData.secondary.hex : colorData.hex;
      await fetch('/set-light-hex', {
        method: 'POST',
        headers,
        body: (() => { const fd2 = new FormData(); fd2.append('hex', hexColor); return fd2; })(),
      });
      npHero.classList.add('syncing');
      npSyncLabel.textContent = 'Synced ✓';
    }
  } catch (e) {
    document.body.classList.remove('extracting');
    if (syncOn) npSyncLabel.textContent = `Sync error: ${e.message || 'failed'}`;
  }
}

function startLfmSync() {
  if (lfmPollTimer) return;
  updateMusicUI();
  lfmPoll();
  lfmPollTimer = setInterval(lfmPoll, 10000);
}

function stopLfmSync() {
  clearInterval(lfmPollTimer);
  lfmPollTimer = null;
  // Keep lfmLastTrackKey so reload/auto buttons remain visible after toggling off
  updateMusicUI();
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

async function spotifyRefresh() {
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
  if (!data?.item || !data.is_playing) return null;
  return {
    title: data.item.name,
    artist: data.item.artists.map(a => a.name).join(', '),
    art: data.item.album.images[0]?.url || '',
    isLive: true,
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
  const isMusic = appMode === 'music';
  playbackControls.classList.toggle('hidden', !(enabled && connected && isMusic));
  if (spotifyPlaybackToggle) spotifyPlaybackToggle.checked = enabled;
}

function setPlaybackIcon(isPlaying) {
  spotifyIsPlaying = isPlaying;
  playbackPlayIcon.classList.toggle('hidden', isPlaying);
  playbackPauseIcon.classList.toggle('hidden', !isPlaying);
}

async function spotifyPlayerAction(endpoint, method = 'POST') {
  const token = await getSpotifyToken();
  if (!token) return;
  await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  });
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
  await spotifyPlayerAction(direction);
  // Wait for Spotify to update then force a fresh poll + re-extract
  lfmLastTrackKey = null;
  setTimeout(lfmPoll, 1200);
}

playbackPrev.addEventListener('click', () => skipAndRefresh('previous'));
playbackNext.addEventListener('click', () => skipAndRefresh('next'));

playbackToggleBtn.addEventListener('click', async () => {
  const token = await getSpotifyToken();
  if (!token) return;
  await spotifyPlayerAction(spotifyIsPlaying ? 'pause' : 'play');
  setPlaybackIcon(!spotifyIsPlaying);
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

sheetCloseBtn.addEventListener('click', closeUploadSheet);

// Main extract button: URL → extract URL; photos+file → extract file; music → Last.fm art
mainExtractBtn.addEventListener('click', async () => {
  const url = mainUrlInput.value.trim();

  if (url) {
    // URL takes priority in both modes
    mainExtractBtn.disabled = true;
    mainExtractBtn.textContent = 'Extracting…';
    try {
      const headers = {};
      const apiKey = loadApiKey();
      if (apiKey) headers['X-Govee-Api-Key'] = apiKey;
      const skipNeutrals = loadSkipNeutrals();
      const resp = await fetch('/extract/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ url, skip_neutrals: skipNeutrals }),
      });
      const data = await resp.json();
      if (!resp.ok) { showError(data.detail || 'Extraction failed.'); return; }
      showResult(data, { name: url });
      mainUrlInput.value = '';
    } catch { showError('Network error.'); }
    finally { mainExtractBtn.disabled = false; mainExtractBtn.textContent = 'Extract Colors'; }
    return;
  }

  if (appMode === 'photos') {
    if (!fileInput.files[0]) { photoArtWrap.click(); return; }
    // Trigger the form which handles file extraction
    mainExtractBtn.disabled = true;
    mainExtractBtn.textContent = 'Extracting…';
    try {
      const fd = new FormData();
      fd.append('file', fileInput.files[0]);
      fd.append('skip_neutrals', loadSkipNeutrals() ? '1' : '0');
      const headers = {};
      const apiKey = loadApiKey();
      if (apiKey) headers['X-Govee-Api-Key'] = apiKey;
      const resp = await fetch('/extract', { method: 'POST', body: fd, headers });
      const data = await resp.json();
      if (!resp.ok) { showError(data.detail || 'Extraction failed.'); return; }
      showResult(data, { name: fileInput.files[0].name, size: fileInput.files[0].size });
    } catch { showError('Network error.'); }
    finally { mainExtractBtn.disabled = false; mainExtractBtn.textContent = 'Extract Colors'; }
    return;
  }

  // Music mode: fetch current Last.fm track art
  const user = localStorage.getItem(LS_LFM_USER) || '';
  const key  = localStorage.getItem(LS_LFM_KEY)  || '';
  if (!user || !key) return;
  mainExtractBtn.disabled = true;
  mainExtractBtn.textContent = 'Extracting…';
  try {
    const track = await lfmGetNowPlaying(user, key);
    if (track) {
      npTitle.textContent  = track.title;
      npArtist.textContent = track.artist;
      if (track.art) npArt.src = track.art;
      await extractFromArt(track.art, `${track.title} — ${track.artist}`);
    }
  } catch (e) { /* silent */ }
  finally { mainExtractBtn.disabled = false; mainExtractBtn.textContent = 'Extract Colors'; }
});

// Auto: toggle sync on/off
autoBtn.addEventListener('click', () => {
  const syncOn = localStorage.getItem(LS_LFM_SYNC) === 'true';
  const newVal = !syncOn;
  localStorage.setItem(LS_LFM_SYNC, String(newVal));
  if (newVal) {
    lfmLastTrackKey = null; // force re-extraction on re-enable
    startLfmSync();
  } else {
    stopLfmSync();
  }
  updateMusicUI();
});

// ── Init ──────────────────────────────────────────────────────────────────────
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
        mainView.classList.add('hidden');
        settingsView.classList.remove('hidden');
        selectService('spotify');
      } else {
        showSpotifyStatus('error', data.error_description || 'Auth failed.');
        mainView.classList.add('hidden');
        settingsView.classList.remove('hidden');
        selectService('spotify');
      }
    } catch (e) {
      showSpotifyStatus('error', 'Auth failed: ' + e.message);
    }
    return;
  }

  if (localStorage.getItem(LS_LFM_SYNC) === 'true') {
    startLfmSync();
  } else if (localStorage.getItem(LS_SPOTIFY_TOKEN) || (localStorage.getItem(LS_LFM_USER) && localStorage.getItem(LS_LFM_KEY))) {
    // Connected but auto off — populate now-playing without extracting
    (async () => {
      try {
        let track = null;
        if (localStorage.getItem(LS_SPOTIFY_TOKEN)) {
          track = await spotifyGetNowPlaying();
        } else {
          track = await lfmGetNowPlaying(localStorage.getItem(LS_LFM_USER), localStorage.getItem(LS_LFM_KEY));
        }
        if (track) {
          npTitle.textContent  = track.title;
          npArtist.textContent = track.artist;
          if (track.art) npArt.src = track.art;
          lfmLastTrackKey = `${track.artist}|||${track.title}`;
          updateMusicUI();
        }
      } catch {}
    })();
  }
})()
