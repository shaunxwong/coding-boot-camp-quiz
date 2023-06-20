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
let timeLeft = 30;
let initials = "";

// Function to start the quiz
function startQuiz() {
  timeLeft = 30;
  score = 0;
  initials = document.getElementById("initials").value.trim();

  if (initials === "") {
    alert("Please enter your initials.");
    return;
  }

  // Hide the start container and restart button
  document.getElementById("start-container").style.display = "none";
  document.getElementById("restart-button").style.display = "none";

  startTimer();
  showQuestion();
}

// Add an event listener to the start button
document.getElementById("start-button").addEventListener("click", startQuiz);

// Function to start the timer
function startTimer() {
  timer = setInterval(function() {
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
  const questionContainer = document.getElementById("question-container");
  const optionsContainer = document.getElementById("options-container");

  questionContainer.textContent = quizQuestions[currentQuestionIndex].question;
  optionsContainer.innerHTML = "";

  for (let i = 0; i < quizQuestions[currentQuestionIndex].options.length; i++) {
    const option = document.createElement("div");
    option.textContent = quizQuestions[currentQuestionIndex].options[i];
    option.className = "option";
    option.addEventListener("click", checkAnswer);
    optionsContainer.appendChild(option);
  }
}

// Function to check the selected answer
function checkAnswer(event) {
  const selectedOption = event.target.textContent;

  if (selectedOption === quizQuestions[currentQuestionIndex].answer) {
    score += 5; // Multiply the score by 5 for correct answers
  } else {
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

  const questionContainer = document.getElementById("question-container");
  const optionsContainer = document.getElementById("options-container");
  const resultContainer = document.getElementById("result-container");
  const restartButton = document.getElementById("restart-button");

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
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

// Function to display the high scores
function displayHighScores() {
  const highScoreList = document.getElementById("high-score-list");
  highScoreList.innerHTML = "";

  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  highScores.sort((a, b) => b.score - a.score);

  highScores.forEach((highScore, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span>${index + 1}. ${highScore.initials}</span><span class="score">${highScore.score}</span>`;
    highScoreList.appendChild(listItem);
  });
}

// Function to restart the quiz
function restartQuiz() {
  document.getElementById("result-container").textContent = "";
  document.getElementById("restart-button").style.display = "none";
  currentQuestionIndex = 0;
  startQuiz();
}

// Add an event listener to the restart button
document.getElementById("restart-button").addEventListener("click", restartQuiz);

// Start the quiz when the page is loaded
window.addEventListener("load", displayHighScores);
