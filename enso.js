// enso.js
// renders the enso symbol and controls its placement, sizing, and rotation

function renderEnso(container) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  canvas.style.width = "1em";
  canvas.style.height = "1em";
  canvas.style.verticalAlign = "middle";

  container.innerHTML = "";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  let angle = 0;
  const rotationSpeed = Math.PI; // 1 full turn every 2 seconds
  const radius = canvas.width * 0.4;
  const thickness = canvas.width * 0.08;

  function drawRing(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);

    const grad = ctx.createConicGradient(0, 0, 0);
    grad.addColorStop(0, "#f00");
    grad.addColorStop(1/6, "#ff0");
    grad.addColorStop(2/6, "#0f0");
    grad.addColorStop(3/6, "#0ff");
    grad.addColorStop(4/6, "#00f");
    grad.addColorStop(5/6, "#f0f");
    grad.addColorStop(1, "#f00");

    ctx.lineWidth = thickness;
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    angle += rotationSpeed / 60;
    requestAnimationFrame(drawRing);
  }

  requestAnimationFrame(drawRing);
}
