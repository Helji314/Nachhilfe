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
    document.getElementById("red-container").innerHTML = "<h2>Rote Kugeln</h2>";
    document.getElementById("blue-container").innerHTML = "<h2>Blaue Kugeln</h2>";
    document.getElementById("target-container").innerHTML = "<h2>Ziel (Zehnerfeld)</h2>";
  
    // Beispiel: 6 rote, 4 blaue Kugeln (ergibt 10)
    for (let i = 0; i < 6; i++) {
      const red = createBall("red");
      document.getElementById("red-container").appendChild(red);
    }
    for (let i = 0; i < 4; i++) {
      const blue = createBall("blue");
      document.getElementById("blue-container").appendChild(blue);
    }
  }
  
  // Zielbereich als Drop-Ziel
  document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("target-container");
  
    target.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
  
    target.addEventListener("drop", (e) => {
      e.preventDefault();
      const color = e.dataTransfer.getData("text/plain");
      const draggedBall = document.querySelector(`.ball.${color}`);
      if (draggedBall) {
        target.appendChild(draggedBall);
      }
    });
  });
  