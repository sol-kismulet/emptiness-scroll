(function(){
  const debugParam = new URLSearchParams(window.location.search).get('debug');
  if (!debugParam) return;
  const sticky = debugParam === 'sticky';

  let style;
  let overlays = [];

  function ensureStyle() {
    if (style) return;
    style = document.createElement('style');
    style.textContent = `
      .debug-overlay { position:absolute; border:2px dashed red; box-sizing:border-box; pointer-events:none; z-index:9999; transition:opacity 0.5s; }
      .debug-overlay-unknown { border-color:magenta; }
      .debug-overlay-mystery { border-color:cyan; }
      .debug-overlay-label { position:absolute; top:-1.2em; left:0; background:rgba(255,0,0,0.7); color:#fff; font-size:10px; padding:1px 4px; font-family:sans-serif; white-space:nowrap; }
    `;
    document.head.appendChild(style);
  }

  function clearOverlays() {
    overlays.forEach(o => o.remove());
    overlays = [];
  }

  function createOverlay(el, type) {
    const rect = el.getBoundingClientRect();
    const overlay = document.createElement('div');
    overlay.className = 'debug-overlay' +
      (type === 'unknown' ? ' debug-overlay-unknown' : '') +
      (type === 'mystery' ? ' debug-overlay-mystery' : '');
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;

    const label = document.createElement('div');
    label.className = 'debug-overlay-label';
    if (type === 'unknown') {
      label.textContent = 'UNKNOWN';
    } else if (type === 'mystery') {
      label.textContent = 'MYSTERY';
    } else if (el.classList.contains('ripple')) {
      label.textContent = 'ripple';
    } else if (el.classList.contains('chalk')) {
      label.textContent = 'chalk';
    } else if (el.tagName.toLowerCase() === 'canvas') {
      label.textContent = 'canvas';
    } else {
      label.textContent = el.tagName.toLowerCase();
    }
    overlay.appendChild(label);
    document.body.appendChild(overlay);
    overlays.push(overlay);
  }

  function scan() {
    clearOverlays();
    ensureStyle();
    const all = Array.from(document.querySelectorAll('*'));
    const unknownElements = [];
    const knownElements = [];
    all.forEach(el => {
      if (el.offsetWidth <= 0) return;
      if (el.classList.contains('ripple') || el.classList.contains('chalk') || el.tagName.toLowerCase() === 'canvas') {
        knownElements.push(el);
      } else {
        unknownElements.push(el);
      }
    });

    console.log('[debug overlay] unknown elements:', unknownElements.map(e => ({
      tag: e.tagName.toLowerCase(),
      classes: Array.from(e.classList).join(' '),
      rect: e.getBoundingClientRect()
    })));

    knownElements.forEach(el => createOverlay(el));
    unknownElements.forEach(el => createOverlay(el, 'unknown'));
  }

  function findMysteries() {
    clearOverlays();
    ensureStyle();
    const all = Array.from(document.querySelectorAll('*'));
    const mysteries = [];
    all.forEach(el => {
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (rect.width <= 0 || rect.height <= 0) return;
      if (parseFloat(cs.opacity) > 0 && cs.visibility !== 'hidden' && cs.display !== 'none') {
        mysteries.push(el);
      }
    });
    console.log('[debug overlay] MYSTERY elements:', mysteries.map(e => ({
      tag: e.tagName.toLowerCase(),
      classes: Array.from(e.classList).join(' '),
      rect: e.getBoundingClientRect()
    })));
    mysteries.forEach(el => createOverlay(el, 'mystery'));
  }

  function startScanning() {
    let count = 10; // 5 seconds at 500ms intervals
    scan();
    const interval = setInterval(() => {
      scan();
      if (--count <= 0) {
        clearInterval(interval);
        if (!sticky) {
          setTimeout(() => {
            overlays.forEach(o => o.style.opacity = '0');
            setTimeout(() => {
              clearOverlays();
              if (style) style.remove();
              style = null;
            }, 500);
          }, 0);
        }
      }
    }, 500);

    // After the intro sequence should be gone, check remaining children
    setTimeout(() => {
      const intro = document.getElementById('intro-sequence');
      if (intro) {
        console.log('[debug overlay] post-animation children:', Array.from(intro.children));
        Array.from(intro.children).forEach(el => {
          if (!el.classList.contains('ripple')) return;
          el.remove();
          console.log('[debug overlay] removed lingering element', el);
        });
      }
    }, 8000);

    // One to two seconds after the intro fades, hunt for visible elements
    setTimeout(findMysteries, 9500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startScanning);
  } else {
    startScanning();
  }
})();
