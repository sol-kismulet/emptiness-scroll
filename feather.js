// feather.js
// renders a lightweight feather symbol with soft presence

function renderFeather(container) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("width", "1em");
  svg.setAttribute("height", "1em");
  svg.style.verticalAlign = "middle";
  svg.innerHTML = `
    <path d="M12 52 C24 48, 36 36, 44 24 C48 18, 50 12, 46 10 C42 8, 34 12, 28 18 C20 26, 16 36, 12 52 Z"
      fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  `;

  container.innerHTML = "";
  container.appendChild(svg);
}
