// Define the quiz questions and answers
const quizQuestions = [
  {
    question: "Which of the following programming languages is primarily used for web development?  ",
    options: ["A) Python", "B) Java", "C) HTML", "D) C++"],
    answer: "C) HTML"
  },
  {
    question: "What is the correct syntax for declaring a variable in JavaScript?",
    options: ["A) var myVariable = 5", "B) variable myVariable = 5;", "C) let myVariable = 5;", "D) const myVariable = 5;"],
    answer: "C) let myVariable = 5;"
  },
  {
    question: "In object-oriented programming, what is the process of creating an instance of a class called?",
    options: ["A) Inheritance", "B) Abstraction", "C) Polymorphism", "D) Instantiation"],
    answer: "D) Instantiation"
  },
  {
    question: "Which data structure follows the 'first-in, first-out' (FIFO) principle?",
    options: ["A) Stack", "B) Queue", "C) Array", "D) Linked list"],
    answer: "B) Queue"
  },
  {
    question: "Which of the following HTML tags is used to define a hyperlink in web development?",
    options: ["A) <link>", "B) <span>", "C) <a>", "D) <img>"],
    answer: "C) <a>"
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
  //Display time duration & Set score
  timeLeft = 20;
  score = 0;
  //Retrieving the values entered in the "initials" input field and assigns it to the initials variable in JS.
  initials = document.getElementById("initials").value.trim();

  //Require Initials to get started (Reverse the order instead of asking it at the end)
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
  const emptyScoreList = document.getElementById("empty-score-list");
  emptyScoreList.innerHTML = "";

  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  const maxHighScores = 10;
  const totalHighScores = Math.min(highScores.length, maxHighScores);

  for (let i = 0; i < totalHighScores; i++) {
    const highScore = highScores[i];
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span>${i + 1}. ${highScore.initials}</span><span class="score">${highScore.score}</span>`;
    highScoreList.appendChild(listItem);
  }

  if (totalHighScores < maxHighScores) {
    const emptyScoreCount = maxHighScores - totalHighScores;
    for (let i = 0; i < emptyScoreCount; i++) {
      const emptyScoreItem = document.createElement("li");
      emptyScoreItem.className = "empty-score";
      emptyScoreItem.textContent = `${totalHighScores + i + 1}. `;
      emptyScoreList.appendChild(emptyScoreItem);
    }
  }
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
