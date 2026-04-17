(function () {
  'use strict';

  function hexToRgb01(hex) {
    hex = (hex || '#6366f1').replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const n = parseInt(hex, 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  }

  const BackgroundManager = {
    _registry: {},
    _current: null,
    _primaryHex: '#6366f1',
    _secondaryHex: '#ec4899',
    _artUrl: null,
    _bpm: 0,

    hexToRgb01,

    register(name, descriptor) {
      this._registry[name] = Object.assign({ _initialized: false }, descriptor);
    },

    activate(name) {
      const desc = this._registry[name];
      if (!desc) return;
      if (this._current && this._current !== desc) {
        this._current.stop();
      }
      this._current = desc;
      if (!desc._initialized) {
        desc.init();
        desc._initialized = true;
      }
      desc.start();
      desc.updateColors(this._primaryHex, this._secondaryHex);
      if (desc.updateArt) desc.updateArt(this._artUrl);
      desc.updateBpm(this._bpm);
    },

    deactivate() {
      if (this._current) {
        this._current.stop();
        this._current = null;
      }
    },

    updateColors(primaryHex, secondaryHex) {
      if (primaryHex)   this._primaryHex   = primaryHex;
      if (secondaryHex) this._secondaryHex = secondaryHex;
      if (this._current && this._current.updateColors) {
        this._current.updateColors(this._primaryHex, this._secondaryHex);
      }
    },

    updateBpm(bpm) {
      this._bpm = bpm || 0;
      if (this._current && this._current.updateBpm) {
        this._current.updateBpm(this._bpm);
      }
    },

    updateArt(url) {
      this._artUrl = url;
      if (this._current && this._current.updateArt) {
        this._current.updateArt(url);
      }
    }
  };

  // Pause/resume on tab visibility
  document.addEventListener('visibilitychange', () => {
    if (!BackgroundManager._current) return;
    if (document.hidden) BackgroundManager._current.stop();
    else                 BackgroundManager._current.start();
  });

  window.BackgroundManager = BackgroundManager;
})();
