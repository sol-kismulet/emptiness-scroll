document.addEventListener('DOMContentLoaded', () => {
  const scroll = document.getElementById('scroll-content');
  const originalHTML = scroll.innerHTML;

  function escapeHTML(str) {
    return str.replace(/[&<>]/g, tag => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[tag]));
  }

  function parseMarkdown(md) {
    const lines = md.split(/\n/);
    let html = '';
    let inList = false;
    const flushList = () => { if (inList) { html += '</ul>'; inList = false; } };

    lines.forEach(line => {
      const trimmed = line.trimEnd();
      let m;
      if (trimmed === '') { flushList(); html += '<br>'; return; }
      if ((m = trimmed.match(/^title:\s*(.+)/i))) { flushList(); html += `<h1>${escapeHTML(m[1])}</h1>`; return; }
      if ((m = trimmed.match(/^subtitle:\s*(.+)/i))) { flushList(); html += `<h2>${escapeHTML(m[1])}</h2>`; return; }
      if (trimmed === '⸻') { flushList(); html += '<hr>'; return; }
      if (/^part\b/i.test(trimmed)) { flushList(); html += `<h3>${escapeHTML(trimmed)}</h3>`; return; }
      if ((m = trimmed.match(/^\u2022\s*(.+)/))) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${escapeHTML(m[1])}</li>`; return;
      }
      if ((m = trimmed.match(/^(\w+):\s*(.+)/))) { flushList(); html += `<p><strong>${escapeHTML(m[1])}:</strong> ${escapeHTML(m[2])}</p>`; return; }
      flushList();
      html += `<p>${escapeHTML(trimmed)}</p>`;
    });
    flushList();
    return html;
  }

  function fadeOut(element, cb) {
    const onEnd = () => { element.removeEventListener('transitionend', onEnd); cb(); };
    element.addEventListener('transitionend', onEnd);
    element.style.opacity = 0;
  }

  function fadeIn(element) {
    requestAnimationFrame(() => { element.style.opacity = 1; });
  }

  function attachShowLink() {
    const link = document.getElementById('toggle-link');
    if (link) {
      link.addEventListener('click', evt => {
        evt.preventDefault();
        fadeOut(scroll, () => {
          fetch('conversation.md')
            .then(resp => resp.text())
            .then(text => {
              scroll.innerHTML = parseMarkdown(text) + `<p><a href="#" id="return-link">return to the scroll</a></p>`;
              fadeIn(scroll);
              attachReturnLink();
            });
        });
      });
    }
  }

  function attachReturnLink() {
    const link = document.getElementById('return-link');
    if (link) {
      link.addEventListener('click', evt => {
        evt.preventDefault();
        fadeOut(scroll, () => {
          scroll.innerHTML = originalHTML;
          fadeIn(scroll);
          attachShowLink();
        });
      });
    }
  }

  attachShowLink();
});

