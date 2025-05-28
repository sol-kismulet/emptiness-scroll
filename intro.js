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
  }, 3500); // fade ripple

  setTimeout(() => {
    intro.style.transition = 'opacity 1.2s ease-in-out';
    intro.style.opacity = 0;
  }, 4200); // fade whole intro

  setTimeout(() => {
    intro.remove();
    svg.style.opacity = 1; // begin chalk fade in
  }, 5400); // remove overlay
});

// After intro fade, animate the word "welcome."
const svgNS = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(svgNS, 'svg');
svg.setAttribute('id', 'chalk-writing');
svg.setAttribute('width', '600');
svg.setAttribute('height', '100');
svg.setAttribute('viewBox', '0 0 600 100');
svg.style.position = 'absolute';
svg.style.top = '40%';
svg.style.left = '50%';
svg.style.transform = 'translate(-50%, -50%)';
svg.style.zIndex = 101;
svg.style.opacity = 0;
svg.style.transition = 'opacity 1.5s ease-in-out';
document.body.appendChild(svg);

  // Path starts shortly after the svg becomes visible

// Single path for "welcome." – this is a pre-designed curve
const path = document.createElementNS(svgNS, 'path');
path.setAttribute('d',
  'M10 80 Q 40 10, 70 80 T 130 80 T 190 80 T 250 80 T 310 80 T 370 80' +
  ' M390 80 q 15 -30 30 0 M430 80 h 10' // playful ending curve for the dot
);
path.setAttribute('fill', 'none');
path.setAttribute('stroke', '#ffffff');
path.setAttribute('stroke-width', '3');
path.setAttribute('stroke-linecap', 'round');
path.setAttribute('stroke-linejoin', 'round');
path.setAttribute('stroke-dasharray', '1000');
path.setAttribute('stroke-dashoffset', '1000');
svg.appendChild(path);

// Animate stroke drawing
setTimeout(() => {
  path.style.transition = 'stroke-dashoffset 4s ease-out';
  path.setAttribute('stroke-dashoffset', '0');
}, 5600);

window.fadeChalkToStardust = () => {
  const numParticles = 300;
  const length = path.getTotalLength();
  const particleGroup = document.createElementNS(svgNS, 'g');
  svg.appendChild(particleGroup);

  // Create particles at random points along the path
  for (let i = 0; i < numParticles; i++) {
    const offset = Math.random() * length;
    const point = path.getPointAtLength(offset);
    const particle = document.createElementNS(svgNS, 'circle');
    particle.setAttribute('cx', point.x);
    particle.setAttribute('cy', point.y);
    particle.setAttribute('r', Math.random() * 1.5 + 0.5);
    particle.setAttribute('fill', '#ffffff');
    particle.setAttribute('opacity', 1);
    particleGroup.appendChild(particle);

    // Animate each particle to drift and fade
    const dx = (Math.random() - 0.5) * 40;
    const dy = -Math.random() * 40 - 10;
    const duration = 3000 + Math.random() * 2000;

    const animate = particle.animate([
      { transform: 'translate(0,0)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
    ], {
      duration,
      easing: 'ease-out',
      fill: 'forwards'
    });

    animate.onfinish = () => {
      particle.remove();
    };
  }

  // Fade out the original chalk path
  path.style.transition = 'opacity 1.5s ease-in';
  path.style.opacity = 0;

  // Remove the full SVG after particles are done
  setTimeout(() => {
    svg.remove();
  }, 6000);
};

// Trigger chalk dissolution, then reveal stars and content
setTimeout(() => {
  window.fadeChalkToStardust();
  document.getElementById('starfield').style.opacity = 1;
}, 9800);

setTimeout(() => {
  document.getElementById('scroll-content').style.opacity = 1;
}, 10600);
