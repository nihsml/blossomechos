
const slime = document.getElementById("slime");
const scoreText = document.getElementById("score");
const comboText = document.getElementById("combo");
const face = document.getElementById("face");

let score = 0;
let combo = 0;
let dragging = false;
let startX = 0;
let startY = 0;
let colorIndex = 0;
let rainbowAnimation = null;

const colors = [
  ["#ff9ff3", "#e040fb", "#8e24aa"],
  ["#80deea", "#00bcd4", "#006064"],
  ["#b9f6ca", "#00e676", "#00895b"],
  ["#fff59d", "#ffca28", "#ff6f00"],
  ["#ffab91", "#ff5252", "#b71c1c"],
  ["#b388ff", "#651fff", "#311b92"]
];

function addScore(points = 1) {
  score += points;
  combo++;

  scoreText.textContent = score;
  comboText.textContent = combo;
}

function createBubble() {
  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const size = 8 + Math.random() * 25;

  bubble.style.width = size + "px";
  bubble.style.height = size + "px";
  bubble.style.left = (25 + Math.random() * 50) + "%";
  bubble.style.top = (25 + Math.random() * 50) + "%";

  slime.appendChild(bubble);

  setTimeout(() => bubble.remove(), 1000);
}

function squish() {
  addScore();

  slime.animate([
    { transform: "scale(1, 1)" },
    { transform: "scale(1.22, .72)" },
    { transform: "scale(.88, 1.15)" },
    { transform: "scale(1, 1)" }
  ], {
    duration: 360,
    easing: "ease-out"
  });

  face.textContent = "◕ᴗ◕";

  setTimeout(() => {
    face.textContent = "◕‿◕";
  }, 400);

  createBubble();
}

slime.addEventListener("pointerdown", event => {
  dragging = true;

  startX = event.clientX;
  startY = event.clientY;

  slime.setPointerCapture(event.pointerId);
  squish();
});

slime.addEventListener("pointermove", event => {
  if (!dragging) return;

  const dx = event.clientX - startX;
  const dy = event.clientY - startY;

  const scaleX = Math.max(0.65, Math.min(1.65, 1 + dx / 180));
  const scaleY = Math.max(0.65, Math.min(1.65, 1 + dy / 180));

  slime.style.animation = "none";
  slime.style.transform = `scale(${scaleX}, ${scaleY})`;
});

function stopDragging() {
  if (!dragging) return;

  dragging = false;

  slime.style.transform = "";
  slime.style.animation = "";

  slime.animate([
    { transform: "scale(1.1, .9)" },
    { transform: "scale(.95, 1.05)" },
    { transform: "scale(1, 1)" }
  ], {
    duration: 400,
    easing: "ease-out"
  });
}

slime.addEventListener("pointerup", stopDragging);
slime.addEventListener("pointercancel", stopDragging);

document.getElementById("popBtn").addEventListener("click", () => {
  addScore(5);

  face.textContent = "😆";

  slime.animate([
    { transform: "scale(1)" },
    { transform: "scale(1.3, .7)" },
    { transform: "scale(.7, 1.3)" },
    { transform: "scale(1)" }
  ], {
    duration: 500,
    easing: "ease-out"
  });

  for (let i = 0; i < 8; i++) {
    createBubble();
  }

  setTimeout(() => {
    face.textContent = "◕‿◕";
  }, 700);
});

document.getElementById("colorBtn").addEventListener("click", () => {
  colorIndex = (colorIndex + 1) % colors.length;

  const color = colors[colorIndex];

  slime.style.background = `
    radial-gradient(ellipse at 30% 22%, #ffffffd9, transparent 27%),
    linear-gradient(135deg, ${color[0]}, ${color[1]}, ${color[2]})
  `;
});

function setMode(mode) {
  if (rainbowAnimation) {
    rainbowAnimation.cancel();
    rainbowAnimation = null;
  }

  slime.style.filter = "";

  if (mode === "soft") {
    slime.style.filter = "saturate(.9)";
  }

  if (mode === "jelly") {
    slime.style.filter = "saturate(1.5) brightness(1.12)";
  }

  if (mode === "rainbow") {
    rainbowAnimation = slime.animate([
      { filter: "hue-rotate(0deg) saturate(1.4)" },
      { filter: "hue-rotate(360deg) saturate(1.4)" }
    ], {
      duration: 2000,
      iterations: Infinity
    });
  }
}

document.querySelectorAll("[data-mode]").forEach(button => {
  button.addEventListener("click", () => {
    setMode(button.dataset.mode);
  });
});

document.getElementById("resetBtn").addEventListener("click", () => {
  score = 0;
  combo = 0;
  colorIndex = 0;

  scoreText.textContent = "0";
  comboText.textContent = "0";
  face.textContent = "◕‿◕";

  slime.style.transform = "";
  slime.style.animation = "";
  slime.style.filter = "";
  slime.style.background = "";

  if (rainbowAnimation) {
    rainbowAnimation.cancel();
    rainbowAnimation = null;
  }
});
