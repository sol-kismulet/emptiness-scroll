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
  ripple.style.transition = 'opacity 2s ease-in-out, transform 6s ease-out';
  intro.appendChild(ripple);

  setTimeout(() => {
    ripple.style.opacity = 1;
    ripple.style.transform = 'scale(3)';
  }, 800); // slight delay after load

  setTimeout(() => {
    ripple.style.opacity = 0;
  }, 5000); // fade ripple

  setTimeout(() => {
    intro.style.opacity = 0;
    intro.style.transition = 'opacity 2s ease-in-out';
  }, 6000); // fade whole intro

  setTimeout(() => {
    intro.remove();
    // reveal stars.js canvas and scroll content here
    document.getElementById('starfield').style.opacity = 1;
    document.getElementById('scroll-content').style.opacity = 1;
  }, 8000); // complete transition
});
