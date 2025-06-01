// Timing constants
const RIPPLE_START_DELAY = 500;
const RIPPLE_FADE_DELAY = 5800;
const INTRO_FADE_DELAY = 6500;
const INTRO_REMOVE_DELAY = 8000; // final delay for overlay removal
const STARFIELD_FADE_DELAY = 11300;
const CONTENT_FADE_DELAY = 12100;

function startRippleAnimation(canvas) {
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2;
  const ringDelays = [0, 800, 1600];
  const duration = 4000; // breathe longer

  let start;
  function draw(t) {
    if (!start) start = t;
    const elapsed = t - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ringDelays.forEach(delay => {
      const progress = (elapsed - delay) / duration;
      if (progress < 0 || progress > 1) return;
      const radius = 2 + progress * maxRadius;
      const alpha = 1 - Math.pow(progress, 2); // fade more slowly
      ctx.beginPath();
      ctx.filter = `blur(${progress * 2}px)`;
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 2;
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.filter = 'none';
    });

    if (elapsed < duration + ringDelays[ringDelays.length - 1]) {
      requestAnimationFrame(draw);
    }
  }

  requestAnimationFrame(draw);
}

// Chalk text element
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
  rippleCanvas.width = window.innerWidth;
  rippleCanvas.height = window.innerHeight;
  rippleCanvas.style.width = '100vw';
  rippleCanvas.style.height = '100vh';
  rippleCanvas.style.position = 'absolute';
  rippleCanvas.style.top = 0;
  rippleCanvas.style.left = 0;
  rippleCanvas.style.zIndex = 99;
  rippleCanvas.style.pointerEvents = 'none';
  rippleCanvas.style.opacity = 0;
  rippleCanvas.style.transition = 'opacity 1.5s ease-in-out';
  intro.appendChild(rippleCanvas);

  setTimeout(() => {
    rippleCanvas.style.opacity = 1;
    startRippleAnimation(rippleCanvas);
  }, RIPPLE_START_DELAY); // slight delay after load

  setTimeout(() => {
    // clear any residual rings before fading out
    const ctx = rippleCanvas.getContext('2d');
    ctx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);
    const remove = () => {
      rippleCanvas.removeEventListener('transitionend', remove);
      rippleCanvas.remove();
    };
    rippleCanvas.addEventListener('transitionend', remove);
    rippleCanvas.style.opacity = 0;
  }, RIPPLE_FADE_DELAY); // fade ripple gently, later

  setTimeout(() => {
    intro.style.transition = 'opacity 1.5s ease-in-out';
    intro.style.opacity = 0;
  }, INTRO_FADE_DELAY); // fade whole intro slower

  setTimeout(() => {
    intro.remove();
    chalk.style.opacity = 1; // begin chalk fade in
  }, INTRO_REMOVE_DELAY); // remove overlay
});

// Reveal stars and content after chalk fades
setTimeout(() => {
  chalk.style.opacity = 0;
  document.getElementById('starfield').style.opacity = 1;
  const chalkE = document.getElementById('chalk-e');
  if (chalkE) {
    chalkE.style.transition = 'opacity 1s ease-in-out';
    const remove = () => chalkE.remove();
    chalkE.addEventListener('transitionend', remove, { once: true });
    chalkE.style.opacity = 0;
  }
}, STARFIELD_FADE_DELAY);

// launch a single shooting star before the scroll fades in
setTimeout(() => {
  if (window.startShootingStar) {
    window.startShootingStar();
  }
}, 9600);

setTimeout(() => {
  document.getElementById('scroll-content').style.opacity = 1;
}, CONTENT_FADE_DELAY);
