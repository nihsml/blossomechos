// 1. Powerpuff Girls Questions Set
const quizData = [
    {
        question: "What accidental ingredient did Professor Utonium knock into the mixture to create the Powerpuff Girls?",
        options: ["Chemical Z", "Radioactive Sugar", "Chemical X", "Element 115"],
        correct: 2
    },
    {
        question: "Which Powerpuff Girl is known as the commander and leader, wearing a signature red bow?",
        options: ["Bubbles", "Buttercup", "Bunny", "Blossom"],
        correct: 3
    },
    {
        question: "Who is the mastermind chimpanzee villain with an exposed brain covered by a dome helmet?",
        options: ["Fuzzy Lumpkins", "Mojo Jojo", "Him", "The Amoeba Boys"],
        correct: 1
    },
    {
        question: "What is the name of the metropolis where the Powerpuff Girls live and fight crime?",
        options: ["Townsville", "Metropolis", "Cityville", "Gotham"],
        correct: 0
    },
    {
        question: "Which Powerpuff Girl can uniquely speak and understand animal languages?",
        options: ["Blossom", "Buttercup", "Bubbles", "Princess Morebucks"],
        correct: 2
    }
];

// 2. Tracking Variables
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 15;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress');
const timerText = document.getElementById('timer');
const scoreText = document.getElementById('score-text');
const feedbackText = document.getElementById('feedback-text');

// 3. Event Listeners
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        showQuestion();
    } else {
        endQuiz();
    }
});

// 4. Game Cycle Logic
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    startScreen.classList.add('hide');
    endScreen.classList.add('hide');
    quizScreen.classList.remove('hide');
    showQuestion();
}

function showQuestion() {
    nextBtn.classList.add('hide');
    optionsContainer.innerHTML = '';
    resetTimer();

    const currentData = quizData[currentQuestionIndex];
    questionText.innerText = currentData.question;
    progressText.innerText = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;

    currentData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(button, index));
        optionsContainer.appendChild(button);
    });

    startTimer();
}

function selectOption(selectedButton, index) {
    clearInterval(timerInterval);
    const currentData = quizData[currentQuestionIndex];
    const allButtons = optionsContainer.querySelectorAll('.option-btn');

    allButtons.forEach(btn => btn.disabled = true);

    if (index === currentData.correct) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('wrong');
        allButtons[currentData.correct].classList.add('correct');
    }
    nextBtn.classList.remove('hide');
}

// 5. Timer System
function startTimer() {
    timeLeft = 15;
    timerText.innerText = `Time: ${timeLeft}s`;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.innerText = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
}

function handleTimeout() {
    const currentData = quizData[currentQuestionIndex];
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.disabled = true);
    allButtons[currentData.correct].classList.add('correct');
    nextBtn.classList.remove('hide');
}

// 6. Finish Screen Logic
function endQuiz() {
    quizScreen.classList.add('hide');
    endScreen.classList.remove('hide');
    scoreText.innerText = `You scored ${score} out of ${quizData.length}`;
    
    if (score === quizData.length) {
        feedbackText.innerText = "Fantastic! You saved Townsville!";
    } else if (score >= 3) {
        feedbackText.innerText = "Great job! Mojo Jojo is on the run!";
    } else {
        feedbackText.innerText = "Oh no! The villains won this round. Try again!";
    }
}
