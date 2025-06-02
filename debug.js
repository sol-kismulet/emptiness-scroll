(function(){
  const debugParam = new URLSearchParams(window.location.search).get('debug');
  if (!debugParam) return;
  const sticky = debugParam === 'sticky';

  function showOverlay() {
    const elements = Array.from(document.querySelectorAll('.ripple, .chalk, canvas'));
    console.log('[debug overlay] matched elements:', elements);
    if (!elements.length) return;

    const style = document.createElement('style');
    style.textContent = `
      .debug-overlay { position:absolute; border:2px dashed red; box-sizing:border-box; pointer-events:none; z-index:9999; transition:opacity 0.5s; }
      .debug-overlay-label { position:absolute; top:-1.2em; left:0; background:rgba(255,0,0,0.7); color:#fff; font-size:10px; padding:1px 4px; font-family:sans-serif; white-space:nowrap; }
    `;
    document.head.appendChild(style);

    const overlays = [];
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const overlay = document.createElement('div');
      overlay.className = 'debug-overlay';
      overlay.style.top = `${rect.top + window.scrollY}px`;
      overlay.style.left = `${rect.left + window.scrollX}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;

      const label = document.createElement('div');
      label.className = 'debug-overlay-label';
      if (el.classList.contains('ripple')) label.textContent = 'ripple';
      else if (el.classList.contains('chalk')) label.textContent = 'chalk';
      else if (el.tagName.toLowerCase() === 'canvas') label.textContent = 'canvas';
      else label.textContent = el.tagName.toLowerCase();
      overlay.appendChild(label);
      document.body.appendChild(overlay);
      overlays.push(overlay);
    });

    if (!sticky) {
      setTimeout(() => {
        overlays.forEach(o => o.style.opacity = '0');
        setTimeout(() => {
          overlays.forEach(o => o.remove());
          style.remove();
        }, 500);
      }, 5000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showOverlay);
  } else {
    showOverlay();
  }
})();
