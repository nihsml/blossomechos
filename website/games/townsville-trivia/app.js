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
    },
    {
        question: "What color is Blossom's dress?",
        options: ["Blue", "Green", "Pink", "Purple"],
        correct: 2
    },
    {
        question: "What color is Bubbles' dress?",
        options: ["Blue", "Red", "Yellow", "Green"],
        correct: 0
    },
    {
        question: "What color is Buttercup's dress?",
        options: ["Pink", "Green", "Orange", "Blue"],
        correct: 1
    },
    {
        question: "Which girl wears a signature bow in her hair?",
        options: ["Bubbles", "Buttercup", "Blossom", "The Mayor"],
        correct: 2
    },
    {
        question: "Which Powerpuff Girl is the oldest sister?",
        options: ["Blossom", "Bubbles", "Buttercup", "They are not sisters"],
        correct: 0
    },
    {
        question: "Which Powerpuff Girl is the middle sister?",
        options: ["Bubbles", "Buttercup", "Blossom", "Princess"],
        correct: 1
    },
    {
        question: "Which Powerpuff Girl is the youngest sister?",
        options: ["Buttercup", "Blossom", "Bubbles", "Ms. Bellum"],
        correct: 2
    },
    {
        question: "What is the name of Bubbles' stuffed octopus?",
        options: ["Octi", "Squishy", "Inky", "Wiggles"],
        correct: 0
    },
    {
        question: "Who created and raises the Powerpuff Girls?",
        options: ["The Mayor", "Professor Utonium", "Mojo Jojo", "Fuzzy Lumpkins"],
        correct: 1
    },
    {
        question: "What is Ms. Bellum's job in Townsville?",
        options: ["She is the Mayor's assistant", "She is the girls' teacher", "She runs the bank", "She is a reporter"],
        correct: 0
    },
    {
        question: "Which rich girl villain wants to become a Powerpuff Girl?",
        options: ["Bunny", "Princess Morbucks", "Ms. Bellum", "Sedusa"],
        correct: 1
    },
    {
        question: "Which fuzzy, pink troublemaker is one of Townsville's villains?",
        options: ["Mojo Jojo", "The Mayor", "Fuzzy Lumpkins", "Professor Utonium"],
        correct: 2
    },
    {
        question: "What is the name of the trio of amoeba villains?",
        options: ["The Amoeba Boys", "The Rowdyruff Boys", "The Bubble Buddies", "The Townsville Trio"],
        correct: 0
    },
    {
        question: "Which mysterious villain is known simply as HIM?",
        options: ["A friendly teacher", "The Mayor's assistant", "A Townsville reporter", "A powerful, mysterious villain"],
        correct: 3
    },
    {
        question: "Which special ability helps the girls zoom through the sky?",
        options: ["Invisibility", "Flight", "Time travel", "Talking to plants"],
        correct: 1
    },
    {
        question: "Which girl is known for her short black hair?",
        options: ["Blossom", "Bubbles", "Buttercup", "Princess Morbucks"],
        correct: 2
    },
    {
        question: "Which icy ability is Blossom especially known for?",
        options: ["Ice breath", "Freezing time", "Making snowstorms with her hands", "Turning into ice"],
        correct: 0
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 15;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("timer");
const scoreText = document.getElementById("score-text");
const feedbackText = document.getElementById("feedback-text");

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        showQuestion();
    } else {
        endQuiz();
    }
});

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    startScreen.classList.add("hide");
    endScreen.classList.add("hide");
    quizScreen.classList.remove("hide");
    showQuestion();
}

function showQuestion() {
    nextBtn.classList.add("hide");
    optionsContainer.innerHTML = "";
    resetTimer();

    const currentData = quizData[currentQuestionIndex];
    questionText.textContent = currentData.question;
    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    currentData.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option-btn");
        button.addEventListener("click", () => selectOption(button, index));
        optionsContainer.appendChild(button);
    });
    startTimer();
}

function selectOption(selectedButton, index) {
    clearInterval(timerInterval);
    const currentData = quizData[currentQuestionIndex];
    const allButtons = optionsContainer.querySelectorAll(".option-btn");
    allButtons.forEach(button => { button.disabled = true; });

    if (index === currentData.correct) {
        selectedButton.classList.add("correct");
        score++;
    } else {
        selectedButton.classList.add("wrong");
        allButtons[currentData.correct].classList.add("correct");
    }
    nextBtn.classList.remove("hide");
}

function startTimer() {
    timeLeft = 15;
    timerText.textContent = `Time: ${timeLeft}s`;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.textContent = `Time: ${timeLeft}s`;
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
    const allButtons = optionsContainer.querySelectorAll(".option-btn");
    allButtons.forEach(button => { button.disabled = true; });
    allButtons[currentData.correct].classList.add("correct");
    nextBtn.classList.remove("hide");
}

function endQuiz() {
    clearInterval(timerInterval);
    quizScreen.classList.add("hide");
    endScreen.classList.remove("hide");
    scoreText.textContent = `You scored ${score} out of ${quizData.length}`;

    if (score === quizData.length) {
        feedbackText.textContent = "Fantastic! You saved Townsville!";
    } else if (score >= 3) {
        feedbackText.textContent = "Great job! Mojo Jojo is on the run!";
    } else {
        feedbackText.textContent = "Oh no! The villains won this round. Try again!";
    }
}
