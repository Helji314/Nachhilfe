import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

let redCount = 0;
let blueCount = 0;
const target = 10;
const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");
const closePopup = document.getElementById("closePopup");

// === i18next Initialisierung ===
i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'de',
    debug: false,
    backend: {
      loadPath: '/locales/{{lng}}.json'
    }
  }, () => {
    updateContent();
  });

// === Sprachwechsel-Buttons ===
document.getElementById("lang-de").addEventListener("click", () => changeLanguage("de"));
document.getElementById("lang-en").addEventListener("click", () => changeLanguage("en"));
document.getElementById("lang-fr").addEventListener("click", () => changeLanguage("fr"));

function changeLanguage(lng) {
  i18next.changeLanguage(lng, updateContent);
}

function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.innerText = i18next.t(key);
  });
}

// === Drag & Drop: Bälle erstellen ===
function createBall(color) {
  const ball = document.createElement("div");
  ball.classList.add("ball", color);
  ball.setAttribute("draggable", "true");

  ball.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", color);
    e.dataTransfer.setData("ball-id", e.target.id);
  });

  return ball;
}

function makeContainerDroppable(container) {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  container.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggedBall = document.querySelector(".dragging");
    if (draggedBall) {
      container.appendChild(draggedBall);
    }
  });
}

// === Game-Start Funktion ===
export function startGame() {
  const redContainer = document.getElementById("red-container");
  const blueContainer = document.getElementById("blue-container");
  const targetContainer = document.getElementById("target-container");

  redContainer.innerHTML = `<h2 class="rot" data-i18n="redBalls">${i18next.t("redBalls")}</h2>`;
  blueContainer.innerHTML = `<h2 class="blau" data-i18n="blueBalls">${i18next.t("blueBalls")}</h2>`;
  targetContainer.innerHTML = `<h2 data-i18n="targetTitle">${i18next.t("targetTitle")}</h2>`;

  redCount = Math.floor(Math.random() * 9) + 1;
  blueCount = target - redCount;

  for (let i = 0; i < redCount; i++) {
    redContainer.appendChild(createBall("red"));
  }

  for (let i = 0; i < blueCount; i++) {
    blueContainer.appendChild(createBall("blue"));
  }

  popup.style.display = "block";
  overlay.style.display = "block";
  updateContent();
}

// === Drag Events global ===
document.addEventListener("DOMContentLoaded", () => {
  const containers = [
    document.getElementById("target-container"),
    document.getElementById("red-container"),
    document.getElementById("blue-container")
  ];

  containers.forEach(makeContainerDroppable);

  document.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging");
  });

  document.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
  });
});

// === Popup schließen ===
closePopup.addEventListener("click", () => {
  popup.style.display = "none";
  overlay.style.display = "none";
});

// === Kugeln im Ziel zählen ===
function countBallsInTarget() {
  return document.querySelectorAll("#target-container .ball").length;
}

// === Feedback-Funktionen ===
function showMessage(type, text) {
  const container = document.querySelector("main");
  const message = document.createElement("div");
  message.classList.add(`${type}-message`);
  message.innerHTML = text;
  container.appendChild(message);

  setTimeout(() => message.remove(), 5000);
}

function showSuccess() {
  showMessage("success", i18next.t("success", { count: 10 }));
}

function showFailure() {
  const missingBalls = target - countBallsInTarget();
  showMessage("failure", i18next.t("failure", { count: missingBalls }));
}

function showTooManyBalls() {
  const total = countBallsInTarget();
  showMessage("too-many", i18next.t("tooMany", { count: total }));
}

// === Ergebnis prüfen ===
document.getElementById("submit-button").addEventListener("click", () => {
  const totalInTarget = countBallsInTarget();
  if (totalInTarget === 10) {
    const blueLeft = document.querySelectorAll("#blue-container .blue").length;
    showSuccess();
    askForFinalResult(blueLeft);
  } else if (totalInTarget > 10) {
    showTooManyBalls();
  } else {
    showFailure();
  }
});

function askForFinalResult(remainingBlues) {
  const container = document.querySelector("main");
  const form = document.createElement("div");
  form.classList.add("result-form");

  const total = 10 + remainingBlues;

  form.innerHTML = `
    <p>${i18next.t("finalQuestion")}</p>
    <input type="number" id="final-result-input" />
    <button class="button" id="check-final-result">${i18next.t("checkResult")}</button>
  `;

  container.appendChild(form);

  form.querySelector("#check-final-result").addEventListener("click", () => {
    const answer = parseInt(form.querySelector("#final-result-input").value, 10);
    form.innerHTML = answer === total
      ? `<p>${i18next.t("correct", { red: 10, blue: remainingBlues, total })}</p>`
      : `<p>${i18next.t("wrong", { red: 10, blue: remainingBlues, total })}</p>`;
    
    setTimeout(() => form.remove(), 5000);
  });
}
