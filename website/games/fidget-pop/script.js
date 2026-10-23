const board = document.getElementById("bubble-board");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const bestDisplay = document.getElementById("best");
const message = document.getElementById("message");
const startButton = document.getElementById("start-button");
const soundButton = document.getElementById("sound-button");
const modeSelect = document.getElementById("mode");
const difficultySelect = document.getElementById("difficulty");

let score = 0;
let timeLeft = 30;
let bestScore = 0;
let gameRunning = false;
let soundEnabled = true;
let timerInterval = null;
let audioContext = null;

const colors = ["#c7b5ff", "#ffb8d9", "#a8e9dc", "#ffe09b", "#b5d7ff"];
const bubbleButtons = [];
const difficultySettings = {
    easy: { points: 1, count: 25 },
    medium: { points: 2, count: 25 },
    hard: { points: 3, count: 25 }
};

function createBubbles() {
    board.innerHTML = "";
    bubbleButtons.length = 0;

    for (let i = 0; i < 25; i++) {
        const bubble = document.createElement("button");
        bubble.className = "bubble";
        bubble.style.setProperty("--bubble-color", colors[i % colors.length]);
        bubble.setAttribute("aria-label", "Pop bubble " + (i + 1));
        bubble.setAttribute("aria-pressed", "false");
        bubble.disabled = true;
        bubble.addEventListener("click", () => popBubble(bubble));
        board.appendChild(bubble);
        bubbleButtons.push(bubble);
    }
}

function playSound(frequency = 500, duration = 0.08) {
    if (!soundEnabled) return;

    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (!audioContext) audioContext = new AudioContextClass();
        if (audioContext.state === "suspended") audioContext.resume();

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.12, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
        console.warn("Bubble sound is unavailable.", error);
    }
}

function popBubble(bubble) {
    if (!gameRunning || bubble.classList.contains("popped")) return;

    bubble.classList.add("popped");
    bubble.setAttribute("aria-pressed", "true");
    bubble.disabled = true;

    const settings = difficultySettings[difficultySelect.value];
    score += settings.points;
    scoreDisplay.textContent = score;
    playSound(450 + Math.random() * 350, 0.09);

    const remaining = bubbleButtons.filter(item => !item.classList.contains("popped")).length;
    if (remaining === 0) {
        if (modeSelect.value === "challenge") {
            finishGame("Amazing! You popped every bubble! 🎉");
        } else {
            message.textContent = "Fantastic! New bubbles ready! ✨";
            setTimeout(() => {
                if (gameRunning) resetBubbleBoard();
            }, 350);
        }
    } else {
        message.textContent = "Pop! Keep going! ✨";
    }
}

function resetBubbleBoard() {
    bubbleButtons.forEach((bubble, index) => {
        bubble.classList.remove("popped");
        bubble.setAttribute("aria-pressed", "false");
        bubble.disabled = !gameRunning;
        bubble.style.setProperty(
            "--bubble-color",
            colors[(index + Math.floor(Math.random() * colors.length)) % colors.length]
        );
    });
}

function startGame() {
    clearInterval(timerInterval);
    score = 0;
    timeLeft = 30;
    gameRunning = true;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = modeSelect.value === "relax" ? "∞" : timeLeft;
    message.textContent = modeSelect.value === "relax"
        ? "Relax and pop at your own pace! 🌸"
        : "Ready, set, pop!";
    startButton.textContent = "Restart Game";
    resetBubbleBoard();
    playSound(600, 0.07);

    if (modeSelect.value === "challenge") {
        timerInterval = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            if (timeLeft <= 0) finishGame("Time's up! You scored " + score + " points! 🏆");
        }, 1000);
    }
}

function finishGame(finalMessage) {
    gameRunning = false;
    clearInterval(timerInterval);
    bubbleButtons.forEach(bubble => { bubble.disabled = true; });
    if (score > bestScore) {
        bestScore = score;
        bestDisplay.textContent = bestScore;
    }
    message.textContent = finalMessage;
    startButton.textContent = "Play Again";
    playSound(700, 0.18);
}

startButton.addEventListener("click", startGame);
soundButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundButton.textContent = soundEnabled ? "🔊 Sound On" : "🔇 Sound Off";
    soundButton.setAttribute("aria-pressed", String(soundEnabled));
    if (soundEnabled) playSound(600, 0.08);
});

modeSelect.addEventListener("change", () => {
    if (gameRunning) startGame();
});

difficultySelect.addEventListener("change", () => {
    if (gameRunning) message.textContent = "Difficulty changed! Keep popping! ✨";
});

createBubbles();
