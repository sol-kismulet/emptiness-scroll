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

  const ripple = document.createElement('img');
  ripple.src = 'assets/ripple.svg';
  ripple.style.width = '100px';
  ripple.style.opacity = 0;
  ripple.style.transition = 'opacity 1.5s ease-in-out, transform 3.5s ease-out';
  intro.appendChild(ripple);

  setTimeout(() => {
    ripple.style.opacity = 1;
    ripple.style.transform = 'scale(3)';
  }, 500); // slight delay after load

  setTimeout(() => {
    ripple.style.opacity = 0;
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
