const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
let lastScrollY = 0;
let parallaxOffset = 0;
let smoothParallax = 0;
let shootingStar = null;
let tiltX = 0, tiltY = 0;
let targetTiltX = 0, targetTiltY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars(count) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      baseX: Math.random() * canvas.width,
      baseY: Math.random() * canvas.height,
      radius: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.5 + 0.3,
      delta: Math.random() * 0.005,
      depth: Math.random() * 0.5 + 0.5 // controls parallax sensitivity
    });
  }
}

// create a single shooting star that travels once across the sky
window.startShootingStar = function() {
  if (shootingStar) return;
  shootingStar = {
    startX: -50,
    startY: canvas.height * 0.25,
    endX: canvas.width + 50,
    endY: canvas.height * 0.75,
    duration: 2500,
    startTime: null
  };
};

function drawShootingStar(time) {
  if (!shootingStar) return;
  if (!shootingStar.startTime) shootingStar.startTime = time;
  const p = (time - shootingStar.startTime) / shootingStar.duration;
  if (p >= 1) {
    // fade into a quiet star at the end position
    stars.push({
      baseX: shootingStar.endX,
      baseY: shootingStar.endY,
      radius: 1,
      alpha: 0.7,
      delta: Math.random() * 0.005,
      depth: Math.random() * 0.5 + 0.5
    });
    shootingStar = null;
    return;
  }
  const x = shootingStar.startX + (shootingStar.endX - shootingStar.startX) * p;
  const y = shootingStar.startY + (shootingStar.endY - shootingStar.startY) * p;
  ctx.strokeStyle = `rgba(255,255,255,${1 - p})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 60, y - 60);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function drawStars(offsetY = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let star of stars) {
    star.alpha += star.delta;
    if (star.alpha <= 0.3 || star.alpha >= 0.8) {
      star.delta = -star.delta;
    }
    const y = star.baseY + offsetY * star.depth;
    ctx.beginPath();
    ctx.arc(star.baseX, y, star.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fill();
  }
}

function animate(time) {
  const currentY = window.scrollY || window.pageYOffset;
  const delta = currentY - lastScrollY;
  parallaxOffset += delta * 0.5;
  parallaxOffset = Math.max(-15, Math.min(15, parallaxOffset));
  parallaxOffset *= 0.95; // gentle return
  lastScrollY = currentY;
  smoothParallax += (parallaxOffset - smoothParallax) * 0.1;
  tiltX += (targetTiltX - tiltX) * 0.1;
  tiltY += (targetTiltY - tiltY) * 0.1;
  canvas.style.transform = `translate3d(${tiltX}px, ${tiltY}px, 0)`;
  drawStars(smoothParallax);
  drawShootingStar(time);
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createStars(isMobile() ? 80 : 150);
});

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', e => {
    targetTiltX = (e.gamma || 0) * 0.5;
    targetTiltY = (e.beta || 0) * 0.5;
  });
}

resizeCanvas();
createStars(isMobile() ? 80 : 150);
animate();
