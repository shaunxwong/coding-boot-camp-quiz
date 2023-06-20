// Define the quiz questions and answers
const quizQuestions = [
  {
    question: "Which country hosted the first-ever Winter Olympics snowboarding events?",
    options: ["A) United States", "B) Switzerland", "C) Japan", "D) Canada"],
    answer: "A) United States"
  },
  {
    question: "Which snowboarding trick involves rotating the body horizontally along the length of the board?",
    options: ["A) 180", "B) Backflip", "C) Ollie", "D) Railslide"],
    answer: "A) 180"
  },
  {
    question: "What is the name for the snowboarding competition that combines elements of halfpipe, slopestyle, and big air?",
    options: ["A) Big Air", "B) Freeride", "C) Superpipe", "D) Slopestyle"],
    answer: "D) Slopestyle"
  },
  {
    question: "Which snowboarder won the gold medal in the men's halfpipe event at the 2018 Winter Olympics?",
    options: ["A) Shaun White", "B) Ayumu Hirano", "C) Scotty James", "D) Iouri Podladtchikov"],
    answer: "A) Shaun White"
  },
  {
    question: "What does the term 'goofy' refer to in snowboarding?",
    options: ["A) Riding with the left foot forward", "B) Riding with the right foot forward", "C) Performing tricks while riding switch", "D) Riding with both feet unstrapped"],
    answer: "B) Riding with the right foot forward"
  },
  // Add more questions here
];

// Initialize variables
let currentQuestionIndex = 0;
let timer;
let score = 0;
let timeLeft = 20;
let initials = "";

// Get DOM elements
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const resultContainer = document.getElementById("result-container");
const scoreContainer = document.getElementById("score-container");
const highScoreList = document.getElementById("high-score-list");

// Function to start the quiz
function startQuiz() {
  timeLeft = 20;
  score = 0;
  initials = document.getElementById("initials").value.trim();

  if (initials === "") {
    alert("Please enter your initials.");
    return;
  }

  // Hide the start container and restart button
  document.getElementById("start-container").style.display = "none";
  restartButton.style.display = "none";

  startTimer();
  showQuestion();
}

// Function to start the timer
function startTimer() {
  timer = setInterval(function () {
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timer);
      timeLeft = 0; // Set timeLeft to 0 if it goes below 0
      endQuiz();
    }

    document.getElementById("timer").textContent = timeLeft;
  }, 1000);
}

// Function to show the current question
function showQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];

  questionContainer.textContent = currentQuestion.question;
  optionsContainer.innerHTML = "";

  for (let i = 0; i < currentQuestion.options.length; i++) {
    const option = document.createElement("div");
    option.textContent = currentQuestion.options[i];
    option.className = "option";
    option.addEventListener("click", checkAnswer);
    optionsContainer.appendChild(option);
  }
}

// Function to check the selected answer
function checkAnswer(event) {
  const selectedOption = event.target.textContent;

  if (selectedOption === quizQuestions[currentQuestionIndex].answer) {
    score += 1000; // Multiply the score by 5 for correct answers
  } else {
    // Subtract points for incorrect answer
    score -= 200;

    // Subtract time for incorrect answer (e.g., 5 seconds)
    clearInterval(timer);
    timeLeft -= 5;
    if (timeLeft < 0) {
      timeLeft = 0; // Set timeLeft to 0 if it goes below 0
    }
    startTimer();
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

// Function to end the quiz
function endQuiz() {
  clearInterval(timer);

  questionContainer.textContent = "";
  optionsContainer.innerHTML = "";
  resultContainer.textContent = "Final Score: " + score;
  restartButton.style.display = "block";

  // Save the initials and score
  const highScore = {
    initials: initials,
    score: score
  };

  saveHighScore(highScore);
  displayHighScores();
}

// Function to save the high score to local storage
function saveHighScore(highScore) {
  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  highScores.push(highScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores = highScores.slice(0, 10); // Keep only the top 10 high scores
  localStorage.setItem("highScores", JSON.stringify(highScores));
}
// Function to display the high scores
function displayHighScores() {
  highScoreList.innerHTML = "";

  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  highScores.forEach((highScore, index) => {
    if (index < 10) {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<span>${index + 1}. ${highScore.initials}</span><span class="score">${highScore.score}</span>`;
      highScoreList.appendChild(listItem);
    }
  });
}

// Function to restart the quiz
function restartQuiz() {
  resultContainer.textContent = "";
  restartButton.style.display = "none";
  currentQuestionIndex = 0;
  startQuiz();
}

// Add event listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);
window.addEventListener("load", displayHighScores);
