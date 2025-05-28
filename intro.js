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
    chalk.style.opacity = 1; // begin chalk fade in
  }, 6000); // remove overlay
});

// Chalk text
const chalk = document.createElement('div');
chalk.id = 'chalk-text';
chalk.textContent = 'welcome.';
chalk.style.position = 'absolute';
chalk.style.top = '40%';
chalk.style.left = '50%';
chalk.style.transform = 'translate(-50%, -50%)';
chalk.style.fontFamily = '"Comic Sans MS", cursive';
chalk.style.fontSize = '2.5rem';
chalk.style.color = '#ffffff';
chalk.style.opacity = 0;
chalk.style.transition = 'opacity 2s ease-in-out';
chalk.style.zIndex = 101;
document.body.appendChild(chalk);

// Reveal stars and content after chalk fades
setTimeout(() => {
  chalk.style.opacity = 0;
  document.getElementById('starfield').style.opacity = 1;
}, 9300);

// launch a single shooting star before the scroll fades in
setTimeout(() => {
  if (window.startShootingStar) {
    window.startShootingStar();
  }
}, 9600);

setTimeout(() => {
  document.getElementById('scroll-content').style.opacity = 1;
}, 10100);
