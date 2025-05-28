const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
let lastScrollY = 0;

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

function drawStars(scrollY = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let star of stars) {
    star.alpha += star.delta;
    if (star.alpha <= 0.3 || star.alpha >= 0.8) {
      star.delta = -star.delta;
    }
    const offsetY = scrollY * star.depth * 0.05;
    ctx.beginPath();
    ctx.arc(star.baseX, star.baseY + offsetY, star.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fill();
  }
}

function animate() {
  const targetScrollY = window.scrollY || window.pageYOffset;
  lastScrollY += (targetScrollY - lastScrollY) * 0.05; // smoothing
  drawStars(lastScrollY);
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createStars(isMobile() ? 100 : 150);
});

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

resizeCanvas();
createStars(isMobile() ? 100 : 150);
animate();
