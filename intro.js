function startRippleAnimation(canvas) {
  const ctx = canvas.getContext('2d');
  const size = Math.min(canvas.width, canvas.height);
  const maxRadius = size / 2 - 2;
  const ringDelays = [0, 600, 1200];
  const duration = 2500;

  let start;
  function draw(t) {
    if (!start) start = t;
    const elapsed = t - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ringDelays.forEach(delay => {
      const progress = (elapsed - delay) / duration;
      if (progress < 0 || progress > 1) return;
      const radius = 2 + progress * maxRadius;
      const alpha = 1 - progress;
      ctx.beginPath();
      ctx.filter = `blur(${progress * 2}px)`;
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 2;
      ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.filter = 'none';
    });

    if (elapsed < duration + ringDelays[ringDelays.length - 1]) {
      requestAnimationFrame(draw);
    }
  }

  requestAnimationFrame(draw);
}

window.addEventListener('DOMContentLoaded', () => {
  const intro = document.createElement('div');
  intro.id = 'intro-sequence';
  intro.style.position = 'fixed';
  intro.style.top = 0;
  intro.style.left = 0;
  intro.style.width = '100vw';
  intro.style.height = '100vh';
  intro.style.backgroundColor = 'black';
  intro.style.zIndex = 100;
  intro.style.display = 'flex';
  intro.style.alignItems = 'center';
  intro.style.justifyContent = 'center';
  intro.style.flexDirection = 'column';
  document.body.appendChild(intro);

  const rippleCanvas = document.createElement('canvas');
  rippleCanvas.width = 200;
  rippleCanvas.height = 200;
  rippleCanvas.style.width = '120px';
  rippleCanvas.style.height = '120px';
  rippleCanvas.style.opacity = 0;
  rippleCanvas.style.transition = 'opacity 1.5s ease-in-out';
  intro.appendChild(rippleCanvas);

  setTimeout(() => {
    rippleCanvas.style.opacity = 1;
    startRippleAnimation(rippleCanvas);
  }, 500); // slight delay after load

  setTimeout(() => {
    rippleCanvas.style.opacity = 0;
  }, 3800); // fade ripple gently

  setTimeout(() => {
    intro.style.transition = 'opacity 1.5s ease-in-out';
    intro.style.opacity = 0;
  }, 4500); // fade whole intro slower

  setTimeout(() => {
    intro.remove();
    chalkWriting.style.opacity = 1; // begin chalk fade in
  }, 6000); // remove overlay
});

// Chalk text
const chalkWriting = document.createElement('div');
chalkWriting.id = 'chalk-writing';
chalkWriting.textContent = 'welcome.';
chalkWriting.style.position = 'absolute';
chalkWriting.style.top = '40%';
chalkWriting.style.left = '50%';
chalkWriting.style.transform = 'translate(-50%, -50%)';
chalkWriting.style.fontFamily = '"Comic Sans MS", cursive';
chalkWriting.style.fontSize = '2.5rem';
chalkWriting.style.color = '#ffffff';
chalkWriting.style.opacity = 0;
chalkWriting.style.transition = 'opacity 2s ease-in-out';
chalkWriting.style.zIndex = 101;
document.body.appendChild(chalkWriting);

// Reveal stars and content after chalk fades
setTimeout(() => {
  chalkWriting.style.opacity = 0;
  document.getElementById('starfield').style.opacity = 1;
}, 9300);

// Remove the chalk element once fully faded
setTimeout(() => {
  chalkWriting.remove();
}, 11300);

// Allow a moment of stillness before revealing the scroll
setTimeout(() => {
  document.getElementById('scroll-content').style.opacity = 1;
}, 13300);
