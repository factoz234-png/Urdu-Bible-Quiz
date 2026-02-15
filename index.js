let bibleQuiz = [];

async function loadQuestions() {
  try {
    const response = await fetch("questions.json");

    bibleQuiz = await response.json();

    displayQuestion();
  } catch (error) {
    console.error("سوالات لوڈ کرنے میں غلطی ہوئی:", error);
  }
}

loadQuestions();
let contextIdx = 0;

function displayQuestion() {
  let questionData = bibleQuiz[contextIdx];

  document.getElementById("progress").textContent =
    `سوال ${contextIdx + 1} از ${bibleQuiz.length}`;

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

  if (selectedIndex === questionData.answer) {
    buttons[selectedIndex].style.backgroundColor = "#2ecc71";
    buttons[selectedIndex].style.color = "white";
    scoresNo++;

    scores.textContent = `Scores: ${scoresNo} out of  ${contextIdx + 1} `;
  } else {
    buttons[selectedIndex].style.backgroundColor = "#e74c3c";
    buttons[selectedIndex].style.color = "white";

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

function showFinalResult() {
  let mainBody = document.querySelector(".main-body");
  let passorfail = document.querySelector(".passOrFail");

  mainBody.innerHTML = `
    <div class="mainBody" style="text-align: center; padding: 50px;">
      <h1>کوئز مکمل ہو گیا!</h1>
      <p>آپ نے تمام سوالات کے جوابات دے دیئے ہیں۔</p>
      <button onclick="location.reload()" class="option-btn" style="text-align:center;">دوبارہ شروع کریں</button>
    </div>
  `;

  if (scoresNo < contextIdx / 2) {
    passorfail.textContent = `آپ ناکام  ہوگیے ہیں ، دوبارہ کوشش کریں`;
    passorfail.style.color = "red";
  } else {
    passorfail.textContent = `شاباش ! اپ نے اچھا کیا `;
    passorfail.style.color = "green";
  }
}
