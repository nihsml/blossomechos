const SIZE = 4;
let board = [];
let score = 0;
let over = false;
let won = false;

const boardEl = document.getElementById("board");

function restart() {
  board = Array(16).fill(0);
  score = 0;
  over = false;
  won = false;

  addTile();
  addTile();
  render();
  document.getElementById("message").textContent =
    "Use arrow keys or swipe to play.";
}

function addTile() {
  const empty = board
    .map((v, i) => v === 0 ? i : -1)
    .filter(i => i !== -1);

  if (!empty.length) return;

  const i = empty[Math.floor(Math.random() * empty.length)];
  board[i] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
  boardEl.innerHTML = "";

  board.forEach(value => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = value || "";
    if (value) {
      const colors = {
        2: "#eee4da",
        4: "#ede0c8",
        8: "#f2b179",
        16: "#f59563",
        32: "#f67c5f",
        64: "#f65e3b",
        128: "#edcf72",
        248: "#76c893"
      };
      tile.style.background = colors[value] || "#edc850";
    }
    boardEl.appendChild(tile);
  });

  document.getElementById("score").textContent = score;
}

function slide(line) {
  let arr = line.filter(v => v !== 0);

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr.splice(i + 1, 1);
    }
  }

  while (arr.length < SIZE) arr.push(0);
  return arr;
}

function move(direction) {
  if (over || won) return;

  const old = [...board];

  for (let n = 0; n < SIZE; n++) {
    let indexes = [];

    for (let k = 0; k < SIZE; k++) {
      if (direction === "left")
        indexes.push(n * SIZE + k);
      if (direction === "right")
        indexes.push(n * SIZE + (SIZE - 1 - k));
      if (direction === "up")
        indexes.push(k * SIZE + n);
      if (direction === "down")
        indexes.push((SIZE - 1 - k) * SIZE + n);
    }

    const result = slide(indexes.map(i => board[i]));
    indexes.forEach((i, k) => board[i] = result[k]);
  }

  if (board.every((v, i) => v === old[i])) return;

  addTile();

  if (board.includes(248)) {
    won = true;
    document.getElementById("message").textContent =
      "🎉 You reached 248! You win!";
  } else if (!canMove()) {
    over = true;
    document.getElementById("message").textContent =
      "Game over! Press Restart.";
  }

  render();
}

function canMove() {
  if (board.includes(0)) return true;

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const i = r * SIZE + c;
      if (c < SIZE - 1 && board[i] === board[i + 1]) return true;
      if (r < SIZE - 1 && board[i] === board[i + SIZE]) return true;
    }
  }
  return false;
}

document.addEventListener("keydown", e => {
  const keys = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down"
  };

  if (keys[e.key]) {
    e.preventDefault();
    move(keys[e.key]);
  }
});

// Basic touch swipe support
let startX = 0;
let startY = 0;

boardEl.addEventListener("touchstart", e => {
  startX = e.changedTouches[0].clientX;
  startY = e.changedTouches[0].clientY;
}, { passive: true });

boardEl.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - startX;
  const dy = e.changedTouches[0].clientY - startY;

  if (Math.max(Math.abs(dx), Math.abs(dy)) < 25) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    move(dx > 0 ? "right" : "left");
  } else {
    move(dy > 0 ? "down" : "up");
  }
}, { passive: true });

restart();