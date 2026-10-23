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
    document.getElementById("message").textContent = "Use arrow keys or swipe to play.";
}

function addTile() {
    const empty = board.map((value, index) => value === 0 ? index : -1).filter(index => index !== -1);
    if (!empty.length) return;
    const index = empty[Math.floor(Math.random() * empty.length)];
    board[index] = Math.random() < 0.9 ? 2 : 4;
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
    const values = line.filter(value => value !== 0);
    for (let index = 0; index < values.length - 1; index++) {
        if (values[index] === values[index + 1]) {
            values[index] *= 2;
            score += values[index];
            values.splice(index + 1, 1);
        }
    }
    while (values.length < SIZE) values.push(0);
    return values;
}

function move(direction) {
    if (over || won) return;
    const previousBoard = [...board];

    for (let line = 0; line < SIZE; line++) {
        const indexes = [];
        for (let offset = 0; offset < SIZE; offset++) {
            if (direction === "left") indexes.push(line * SIZE + offset);
            if (direction === "right") indexes.push(line * SIZE + (SIZE - 1 - offset));
            if (direction === "up") indexes.push(offset * SIZE + line);
            if (direction === "down") indexes.push((SIZE - 1 - offset) * SIZE + line);
        }
        const result = slide(indexes.map(index => board[index]));
        indexes.forEach((index, offset) => { board[index] = result[offset]; });
    }

    if (board.every((value, index) => value === previousBoard[index])) return;
    addTile();

    if (board.includes(248)) {
        won = true;
        document.getElementById("message").textContent = "🎉 You reached 248! You win!";
    } else if (!canMove()) {
        over = true;
        document.getElementById("message").textContent = "Game over! Press Restart.";
    }
    render();
}

function canMove() {
    if (board.includes(0)) return true;
    for (let row = 0; row < SIZE; row++) {
        for (let column = 0; column < SIZE; column++) {
            const index = row * SIZE + column;
            if (column < SIZE - 1 && board[index] === board[index + 1]) return true;
            if (row < SIZE - 1 && board[index] === board[index + SIZE]) return true;
        }
    }
    return false;
}

document.addEventListener("keydown", event => {
    const keys = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down"
    };
    if (keys[event.key]) {
        event.preventDefault();
        move(keys[event.key]);
    }
});

let startX = 0;
let startY = 0;

boardEl.addEventListener("touchstart", event => {
    startX = event.changedTouches[0].clientX;
    startY = event.changedTouches[0].clientY;
}, { passive: true });

boardEl.addEventListener("touchend", event => {
    const dx = event.changedTouches[0].clientX - startX;
    const dy = event.changedTouches[0].clientY - startY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 25) return;
    if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? "right" : "left");
    } else {
        move(dy > 0 ? "down" : "up");
    }
}, { passive: true });

restart();
