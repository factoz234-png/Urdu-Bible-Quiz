let allQuestions = []; // Store everything from JSON
let bibleQuiz = []; // This will be our "filtered" list

async function loadQuestions() {
  try {
    const response = await fetch("questions.json");
    allQuestions = await response.json();
    bibleQuiz = allQuestions; // Start with all questions
    displayQuestion();
  } catch (error) {
    console.error("سوالات لوڈ کرنے میں غلطی ہوئی:", error);
  }
}

document.querySelector(".main-body").style.display = "none";
document.getElementById("progress-bar").style.display = "none";
document.querySelector(".final-scores").style.display = "none";
document.querySelector(".progress-wrapper").style.display = "none";

// Category selection logic
document.querySelectorAll(".difficulty button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const level = e.target.value;
    if (level === "All") {
      bibleQuiz = allQuestions;
    } else {
      bibleQuiz = allQuestions.filter((q) => q.category === level);
    }

    document.querySelector(".difficulty").style.display = "none"; // Hide category selection
    document.querySelector(".main-body").style.display = "flex"; // Show quiz area
    document.getElementById("progress-bar").style.display = "flex";
    document.querySelector(".final-scores").style.display = "flex";
    document.querySelector(".progress-wrapper").style.display = "flex";

    // Show progress bar

    contextIdx = 0; // Restart from first question of new category
    scoresNo = 0; // Reset scores
    document.querySelector(".final-scores").textContent = "";
    displayQuestion();
  });
});
loadQuestions();
let contextIdx = 0;

function displayQuestion() {
  let questionData = bibleQuiz[contextIdx];

  let progressPercent = ((contextIdx + 1) / bibleQuiz.length) * 100;
  document.getElementById("progress-bar").style.width = progressPercent + "%";

  let quiz = document.querySelector(".question");
  quiz.textContent = questionData.question;

  let optionContainer = document.querySelector(".option-container");
  optionContainer.innerHTML = "";

  questionData.options.forEach((optionsText, index) => {
    let button = document.createElement("button");
    button.textContent = optionsText;
    button.classList.add("option-btn");
    button.onclick = () => checkAnswer(index);

    optionContainer.append(button);
  });
}

let scoresNo = 0;

function checkAnswer(selectedIndex) {
  let questionData = bibleQuiz[contextIdx];
  let buttons = document.querySelectorAll(".option-btn");
  let scores = document.querySelector(".final-scores");
  const correctSound = new Audio("sounds/correct.wav");
  const wrongSound = new Audio("sounds/wrong.mp3");

  if (selectedIndex === questionData.answer) {
    buttons[selectedIndex].style.backgroundColor = "#2ecc71";
    buttons[selectedIndex].style.color = "white";
    correctSound.play();
    scoresNo++;

    scores.textContent = `Scores: ${scoresNo} out of  ${contextIdx + 1} `;
  } else {
    buttons[selectedIndex].style.backgroundColor = "#e74c3c";
    buttons[selectedIndex].style.color = "white";
    wrongSound.play();

    buttons[questionData.answer].style.backgroundColor = "#2ecc71";
    buttons[questionData.answer].style.color = "white";

    scores.textContent = `Scores: ${scoresNo} out of ${contextIdx + 1} `;
  }

  buttons.forEach((btn) => (btn.disabled = true));

  setTimeout(() => {
    contextIdx++;

    if (contextIdx < bibleQuiz.length) {
      displayQuestion();
    } else {
      showFinalResult();
    }
  }, 1500);
}

let passorfail = document.querySelector(".passOrFail");
passorfail.style.display = "none";

function showFinalResult() {
  let mainBody = document.querySelector(".main-body");

  // Save High Score
  const currentHighScore = localStorage.getItem("bibleQuizHighScore") || 0;
  if (scoresNo > currentHighScore) {
    localStorage.setItem("bibleQuizHighScore", scoresNo);
  }

  mainBody.innerHTML = `
        <div class="mainBody" style="display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #0c2c55; padding: 10px; border-radius: 30px; color: white;">
            <h1>کوئز مکمل!</h1>
            <p>آپ کا سکور: ${scoresNo}</p>
            <p>Highest Score:  ${localStorage.getItem("bibleQuizHighScore")}</p>
            <button onclick="location.reload()" class="option-btn">دوبارہ کھیلیں</button>
        </div>
    `;

  if (scoresNo < contextIdx / 2) {
    passorfail.textContent = `آپ ناکام  ہوگیے ہیں ، دوبارہ کوشش کریں`;
    passorfail.style.color = "darkred";
  } else {
    passorfail.textContent = `شاباش ! اپ نے اچھا کیا `;
    passorfail.style.color = "darkgreen";
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}
