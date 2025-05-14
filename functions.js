let redCount = 0;
let target = 10;
let blueCount = 0; // Zähler für blaue Kugeln im Ziel

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
  
  function startGame() {
    // Leere vorherige Bälle
    const redContainer = document.getElementById("red-container");
    const blueContainer  = document.getElementById("blue-container");
    const targetContainer = document.getElementById("target-container");
  
    redContainer.innerHTML = "<h2>Rote Kugeln</h2>";
    blueContainer.innerHTML = "<h2>Blaue Kugeln</h2>";
    targetContainer.innerHTML = "<h2>Ziel (Zehnerfeld)</h2>";

  // Zufällig rote Kugeln: 1–9 (maximal 9, damit mind. 1 blaue nötig ist)
    redCount = Math.floor(Math.random() * 9) + 1;
    const blueCount = 20 - redCount;

    for (let i = 0; i < redCount; i++) {
      const red = createBall("red");
      redContainer.appendChild(red);
    }
    for (let i = 0; i < blueCount; i++) {
      const blue = createBall("blue");
      blueContainer.appendChild(blue);
    }
  }
  
      // Zählen, wie viele Kugeln im Zielbereich
      function countBallsInTarget() {
      const balls = document.querySelectorAll("#target-container .ball");
      return balls.length;
        }

  // Zielbereich als Drop-Ziel
  document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("target-container");
  
    target.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
  
    target.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggedBall = document.querySelector(".dragging");
      if (draggedBall) {
        target.appendChild(draggedBall);
      }
    });
  // Extra: macht Ball sichtbar als "dragging"
  document.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging");
    });
    document.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");
    });
  });
  function showSuccess() {
    const container = document.querySelector("main");
    const message = document.createElement("div");
    message.classList.add("success-message");
    message.innerHTML = "🎉 Super! Du hast 10 Kugeln zusammengestellt!";
    container.appendChild(message);

  // Animation entfernen nach ein paar Sekunden
  setTimeout(() => {
    message.remove();
  }, 3000);
}  
  
function showFailure() {
  const container = document.querySelector("main");
  const missingBalls = target - countBallsInTarget();
  const message = document.createElement("div"); // <--- Fehlte!
  message.classList.add("failure-message");
  message.innerHTML = `❌ Oops! Dir fehlen noch ${missingBalls} Kugel${missingBalls > 1 ? "n" : ""}. 😅`;
  container.appendChild(message);

  // Animation entfernen nach ein paar Sekunden
  setTimeout(() => {
    message.remove();
  }, 3000);
}

function showTooManyBalls() {
  const container = document.querySelector("main");
  const message = document.createElement("div");
  const totalBallsInTarget = countBallsInTarget();
  message.classList.add("too-many-message");
  message.innerHTML = `❌ Zu viele Kugeln! Du hast bereits ${totalBallsInTarget} Kugeln im Ziel. Versuche es nochmal! 😅`;
  container.appendChild(message);

  // Animation entfernen nach ein paar Sekunden
  setTimeout(() => {
    message.remove();
  }, 3000);
}

// Abgabe-Button: Überprüfen der Aufgabe
document.getElementById("submit-button").addEventListener("click", () => {
  const totalInTarget = countBallsInTarget();
  if (totalInTarget === 10) {
    showSuccess();
  } else if (totalInTarget > 10) {
    showTooManyBalls();
  } else {
    showFailure();
  }
});

