
const canvas = document.getElementById("pinBoard");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const movesText = document.getElementById("moves");
const levelText = document.getElementById("level");
const hint = document.getElementById("hint");

const COLS = 39;
const ROWS = 29;

let pins = [];
let score = 0;
let moves = 0;
let level = 1;
let pinHeight = 25;
let isDragging = false;
let lastPoint = null;
let animationId = null;

let colors = [
  "#67e8f9", "#818cf8", "#c084fc",
  "#f0abfc", "#f9a8d4", "#a5f3fc"
];

const colorModes = {
  rainbow: null,
  silver: ["#e2e8f0", "#94a3b8", "#cbd5e1"],
  blue: ["#38bdf8", "#0284c7", "#7dd3fc"],
  pink: ["#f9a8d4", "#ec4899", "#fbcfe8"]
};

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  createPins();
  draw();
}

function createPins() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  pins = [];

  const spacingX = w / (COLS + 1);
  const spacingY = h / (ROWS + 1);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      pins.push({
        x: spacingX * (col + 1),
        y: spacingY * (row + 1),
        z: 0,
        target: 0,
        phase: Math.random() * Math.PI * 2
      });
    }
  }
}

function getPinColor(pin, index) {
  const mode = document.getElementById("pinColor").value;
  const palette = colorModes[mode];

  if (palette) {
    return palette[index % palette.length];
  }

  const hue = (index * 11 + pin.z * 2) % 360;
  return `hsl(${hue}, 85%, 70%)`;
}

function drawPin(pin, index) {
  const depth = Math.max(0, pin.z);
  const x = pin.x;
  const y = pin.y - depth * 0.45;
  const radius = Math.max(2, canvas.clientWidth / 155);

  // Pin shadow
  ctx.beginPath();
  ctx.ellipse(
    x + 1, pin.y + radius * 0.5,
    radius * 1.1, radius * 0.65,
    0, 0, Math.PI * 2
  );
  ctx.fillStyle = "#02061766";
  ctx.fill();

  // Pin body
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.75, pin.y);
  ctx.lineTo(x - radius * 0.65, y);
  ctx.quadraticCurveTo(
    x, y - radius * 0.9,
    x + radius * 0.65, y
  );
  ctx.lineTo(x + radius * 0.75, pin.y);
  ctx.closePath();

  const gradient = ctx.createLinearGradient(
    x - radius, 0, x + radius, 0
  );

  const color = getPinColor(pin, index);
  gradient.addColorStop(0, "#334155");
  gradient.addColorStop(0.35, color);
  gradient.addColorStop(0.8, "#ffffff");
  gradient.addColorStop(1, "#475569");

  ctx.fillStyle = gradient;
  ctx.fill();

  // Rounded pin tip
  ctx.beginPath();
  ctx.ellipse(
    x, y, radius * 0.65, radius * 0.42,
    0, 0, Math.PI * 2
  );
  ctx.fillStyle = color;
  ctx.fill();
}

function draw() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#18243a");
  bg.addColorStop(1, "#0f172a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle grid
  ctx.fillStyle = "#ffffff0b";

  pins.forEach((pin, i) => {
    ctx.beginPath();
    ctx.arc(pin.x, pin.y, 1, 0, Math.PI * 2);
    ctx.fill();

    // Smooth movement toward target
    pin.z += (pin.target - pin.z) * 0.22;

    drawPin(pin, i);
  });

  // Continue animation while pins are moving
  if (pins.some(pin => Math.abs(pin.target - pin.z) > 0.2)) {
    animationId = requestAnimationFrame(draw);
  } else {
    animationId = null;
  }
}

function getPosition(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function pushPins(point, radius = 38, strength = pinHeight) {
  let touched = 0;

  pins.forEach(pin => {
    const dx = pin.x - point.x;
    const dy = pin.y - point.y;
    const distance = Math.hypot(dx, dy);

    if (distance < radius) {
      const force = 1 - distance / radius;

      pin.target = Math.min(
        65,
        pin.target + force * strength
      );

      touched++;
    }
  });

  if (touched > 0) {
    moves++;
    score += touched;
    updateStats();
    draw();
  }
}

function updateStats() {
  scoreText.textContent = score;
  movesText.textContent = moves;
  level = Math.floor(score / 800) + 1;
  levelText.textContent = level;
}

canvas.addEventListener("pointerdown", event => {
  isDragging = true;
  lastPoint = getPosition(event);

  canvas.setPointerCapture(event.pointerId);
  pushPins(lastPoint);
  hint.textContent = "✨ Keep moving to create your shape!";
});

canvas.addEventListener("pointermove", event => {
  if (!isDragging) return;

  const point = getPosition(event);

  if (!lastPoint ||
      Math.hypot(
        point.x - lastPoint.x,
        point.y - lastPoint.y
      ) > 5) {
    pushPins(point, 34, pinHeight * 0.55);
    lastPoint = point;
  }
});

function stopDragging() {
  isDragging = false;
  lastPoint = null;
}

canvas.addEventListener("pointerup", stopDragging);
canvas.addEventListener("pointercancel", stopDragging);

function makePattern(type) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  pins.forEach(pin => {
    const nx = pin.x / w;
    const ny = pin.y / h;

    if (type === "hand") {
      // Palm and five fingers
      const palm = Math.hypot(
        (nx - 0.5) * 1.1,
        (ny - 0.64) * 1.2
      ) < 0.20;

      const fingers = [
        [0.32, 0.38],
        [0.41, 0.29],
        [0.50, 0.26],
        [0.59, 0.30],
        [0.68, 0.39]
      ];

      const finger = fingers.some(([fx, fy]) =>
        Math.hypot((nx - fx) * 1.1, ny - fy) < 0.11
      );

      if (palm || finger) {
        pin.target = 48;
      }
    }

    if (type === "heart") {
      const x = (nx - 0.5) * 3.1;
      const y = (ny - 0.48) * 3.1;

      const heart =
        Math.pow(x * x + y * y - 1, 3) -
        x * x * Math.pow(y, 3) <= 0;

      if (heart) pin.target = 48;
    }

    if (type === "wave") {
      const waveY =
        0.5 + Math.sin(nx * Math.PI * 5) * 0.20;

      if (Math.abs(ny - waveY) < 0.10) {
        pin.target = 48;
      }
    }
  });

  moves++;
  score += 100;
  updateStats();
  hint.textContent = "🎨 Pattern created! Try another one.";
  draw();
}

document.getElementById("handBtn").addEventListener(
  "click", () => makePattern("hand")
);

document.getElementById("heartBtn").addEventListener(
  "click", () => makePattern("heart")
);

document.getElementById("waveBtn").addEventListener(
  "click", () => makePattern("wave")
);

document.getElementById("resetBtn").addEventListener(
  "click", () => {
    pins.forEach(pin => {
      pin.target = 0;
    });

    score = 0;
    moves = 0;
    level = 1;

    updateStats();
    hint.textContent = "👆 Start creating a new pin-art shape!";
    draw();
  }
);

document.getElementById("pinSize").addEventListener(
  "input", event => {
    pinHeight = Number(event.target.value);
  }
);

document.getElementById("pinColor").addEventListener(
  "change", () => draw()
);

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
