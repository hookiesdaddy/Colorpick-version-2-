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
const lfmSyncToggle     = document.getElementById('lfm-sync-toggle');
const connectPromptBtn  = document.getElementById('connect-prompt-btn');
const noService         = document.getElementById('no-service');
const npHero            = document.getElementById('np-hero');
const npArt             = document.getElementById('np-art');
const npTitle           = document.getElementById('np-title');
const npArtist          = document.getElementById('np-artist');
const npSyncLabel       = document.getElementById('np-sync-label');
const uploadSheet       = document.getElementById('upload-sheet');
const uploadSheetBtn    = document.getElementById('upload-sheet-btn');
const sheetCloseBtn     = document.getElementById('sheet-close-btn');

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
let lastPrimary    = null;
let lastSecondary  = null;
let manualOverride = null; // 'primary' | 'secondary' | null

// ── LocalStorage ──────────────────────────────────────────────────────────────
const LS_KEY          = 'colorpick_govee_key';
const LS_PREFS        = 'colorpick_color_prefs';
const LS_PREFER_SEC   = 'colorpick_prefer_secondary';
const LS_SKIP_NEUTRAL = 'colorpick_skip_neutrals';
const LS_LFM_USER     = 'colorpick_lfm_user';
const LS_LFM_KEY      = 'colorpick_lfm_key';
const LS_LFM_SYNC     = 'colorpick_lfm_sync';

const loadApiKey       = () => localStorage.getItem(LS_KEY) || '';
const saveApiKey       = k => localStorage.setItem(LS_KEY, k);
const loadPreferSec    = () => localStorage.getItem(LS_PREFER_SEC) === 'true';
const savePreferSec    = v => localStorage.setItem(LS_PREFER_SEC, String(v));
const loadSkipNeutrals = () => localStorage.getItem(LS_SKIP_NEUTRAL) === 'true';
const saveSkipNeutrals = v => localStorage.setItem(LS_SKIP_NEUTRAL, String(v));

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
  if (fileInput.files[0]) { fileLabelText.textContent = fileInput.files[0].name; dropzone.classList.add('has-file'); }
  resetButton();
  updateClearBtn();
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
    showResult(data);
  } catch {
    showError('Network error — is the server running?');
  } finally {
    submitBtn.disabled = false;
    if (!submitBtn.classList.contains('color-revealed')) btnText.textContent = 'Extract Color';
  }
});

// ── Reload / Clear ────────────────────────────────────────────────────────────
reloadBtn.addEventListener('click', () => {
  reloadHint.classList.add('hidden');
  reloadBtn.classList.remove('needs-reload');
  submitBtn.classList.remove('color-revealed');
  btnText.textContent = 'Extract Color';
  hideResult(); hideError();
  form.requestSubmit();
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
  const hasContent = dropzone.classList.contains('has-file') || urlInput.value.trim() || lastPrimary;
  clearBtn.style.display = hasContent ? '' : 'none';
}

// ── Options panel ─────────────────────────────────────────────────────────────
optionsBtn.addEventListener('click', () => {
  const isOpen = !optionsPanel.classList.contains('hidden');
  optionsPanel.classList.toggle('hidden', isOpen);
  optionsBtn.classList.toggle('open', !isOpen);
});

// ── Toggle listeners ──────────────────────────────────────────────────────────
brighterToggle.addEventListener('change', updateActiveChip);
prefsToggle.addEventListener('change', () => {
  prefsExpand.classList.toggle('hidden', !prefsToggle.checked);
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
function showResult(data) {
  lastPrimary   = { hex: data.hex, rgb: data.rgb };
  lastSecondary = data.secondary ? { hex: data.secondary.hex, rgb: data.secondary.rgb } : lastPrimary;
  manualOverride = null;

  root.style.setProperty('--primary-color', lastPrimary.hex);
  root.style.setProperty('--secondary-color', lastSecondary.hex);
  dropzone.style.setProperty('--dropzone-color', lastPrimary.hex);
  bgOrb1.style.background = `radial-gradient(circle, ${lastPrimary.hex}, transparent 70%)`;
  bgOrb2.style.background = `radial-gradient(circle, ${lastSecondary.hex}, transparent 70%)`;
  submitBtn.classList.add('color-revealed');

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

// ── Settings panel ────────────────────────────────────────────────────────────
settingsBtn.addEventListener('click', () => { mainView.classList.add('hidden'); settingsView.classList.remove('hidden'); });
settingsBack.addEventListener('click', () => { settingsView.classList.add('hidden'); mainView.classList.remove('hidden'); });

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

// Prefer secondary toggle
preferSecToggle.checked = loadPreferSec();
preferSecToggle.addEventListener('change', () => {
  savePreferSec(preferSecToggle.checked);
  if (lastPrimary) updateActiveChip();
});

// Skip neutrals toggle
skipNeutralsToggle.checked = loadSkipNeutrals();
skipNeutralsToggle.addEventListener('change', () => {
  saveSkipNeutrals(skipNeutralsToggle.checked);
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
lfmSyncToggle.checked   = localStorage.getItem(LS_LFM_SYNC) === 'true';

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

lfmSyncToggle.addEventListener('change', () => {
  localStorage.setItem(LS_LFM_SYNC, String(lfmSyncToggle.checked));
  lfmSyncToggle.checked ? startLfmSync() : stopLfmSync();
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
  noService.classList.toggle('hidden', hasCredentials || syncOn);
  npHero.classList.toggle('hidden', !syncOn);
}

function openUploadSheet() {
  uploadSheet.classList.remove('hidden');
  requestAnimationFrame(() => uploadSheet.classList.add('open'));
}

function closeUploadSheet() {
  uploadSheet.classList.remove('open');
  uploadSheet.addEventListener('transitionend', () => uploadSheet.classList.add('hidden'), { once: true });
}

async function lfmPoll() {
  const user = localStorage.getItem(LS_LFM_USER) || '';
  const key  = localStorage.getItem(LS_LFM_KEY)  || '';
  if (!user || !key) return;
  try {
    const track = await lfmGetNowPlaying(user, key);
    if (!track) {
      npHero.classList.remove('syncing');
      npTitle.textContent  = 'Nothing playing';
      npArtist.textContent = 'Is your scrobbler running?';
      npSyncLabel.textContent = 'Waiting…';
      return;
    }
    if (!track.isLive) {
      npHero.classList.remove('syncing');
      npTitle.textContent  = track.title;
      npArtist.textContent = track.artist;
      npSyncLabel.textContent = 'Last played — waiting for new track';
      if (track.art) npArt.src = track.art;
      return;
    }

    const trackKey = `${track.artist}|||${track.title}`;
    npTitle.textContent  = track.title;
    npArtist.textContent = track.artist;
    if (track.art) npArt.src = track.art;

    if (trackKey !== lfmLastTrackKey) {
      lfmLastTrackKey = trackKey;
      npHero.classList.remove('syncing');
      npSyncLabel.textContent = 'Syncing…';
      try {
        const headers = {};
        const apiKey = loadApiKey();
        if (apiKey) headers['X-Govee-Api-Key'] = apiKey;
        const skipNeutrals = loadSkipNeutrals();
        const analyzeResp = await fetch('/extract/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify({ url: track.art, skip_neutrals: skipNeutrals }),
        });
        if (!analyzeResp.ok) return;
        const colorData = await analyzeResp.json();
        showResult(colorData);
        const useSecondary = loadPreferSec();
        const hexColor = useSecondary && colorData.secondary ? colorData.secondary.hex : colorData.hex;
        await fetch('/set-light-hex', {
          method: 'POST',
          headers,
          body: (() => { const fd = new FormData(); fd.append('hex', hexColor); return fd; })(),
        });
        npHero.classList.add('syncing');
        npSyncLabel.textContent = 'Synced ✓';
      } catch { npSyncLabel.textContent = 'Sync failed'; }
    } else {
      npHero.classList.add('syncing');
      npSyncLabel.textContent = 'Synced ✓';
    }
  } catch (e) {
    npHero.classList.remove('syncing');
    npSyncLabel.textContent = 'Last.fm error — check credentials';
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
  lfmLastTrackKey = null;
  updateMusicUI();
}

function showLfmStatus(type, msg) {
  lfmStatus.textContent = msg;
  lfmStatus.className = `key-status ${type}`;
}

connectPromptBtn.addEventListener('click', () => {
  mainView.classList.add('hidden');
  settingsView.classList.remove('hidden');
});

uploadSheetBtn.addEventListener('click', openUploadSheet);
sheetCloseBtn.addEventListener('click', closeUploadSheet);

// ── Init ──────────────────────────────────────────────────────────────────────
buildPrefsList();
updateMusicUI();
if (localStorage.getItem(LS_LFM_SYNC) === 'true') startLfmSync();
