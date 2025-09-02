document.addEventListener("DOMContentLoaded", () => {
  const field = document.getElementById("field");
  const timerEl = document.getElementById("timer");
  const scoreEl = document.getElementById("score");
  const gameOverEl = document.getElementById("game-over");
  const finalScoreEl = document.getElementById("final-score");
  const restartBtn = document.getElementById("restart-btn");

  let lobbyBtn = null;

  let score = 0;
  let timeLeft = 0;
  let timerInterval;
  let spawnInterval;
  let isHard = false;

  function startGame(mode) {
    resetGame();

    if (mode === "hard") {
      isHard = true;
      timeLeft = 30; // 하드모드 기본 30초
    } else if (mode === "infinite") {
      isHard = false;
      timeLeft = Infinity;
    } else {
      isHard = false;
      timeLeft = parseInt(mode, 10);
    }

    updateHUD();
    spawnNamul();
    spawnInterval = setInterval(spawnNamul, isHard ? 500 : 1000);

    if (timeLeft !== Infinity) {
      timerInterval = setInterval(() => {
        timeLeft--;
        updateHUD();
        if (timeLeft <= 0) endGame();
      }, 1000);
    }
  }

  function spawnNamul() {
    field.innerHTML = "";
    const count = isHard ? 6 : 5;
    for (let i = 0; i < count; i++) {
      const namul = document.createElement("div");
      namul.className = "namul";
      namul.style.top = Math.random() * 80 + "%";
      namul.style.left = Math.random() * 80 + "%";
      namul.textContent = "🌱";
      namul.addEventListener("click", () => {
        score++;
        updateHUD();
        namul.remove();
      });
      field.appendChild(namul);
    }
  }

  function updateHUD() {
    timerEl.textContent =
      timeLeft === Infinity ? "남은 시간: ∞" : `남은 시간: ${timeLeft}`;
    scoreEl.textContent = `점수: ${score}`;
  }

  function endGame() {
    clearInterval(timerInterval);
    clearInterval(spawnInterval);
    field.innerHTML = "";
    gameOverEl.classList.remove("hidden");
    finalScoreEl.textContent = `최종 점수: ${score}`;

    if (!lobbyBtn) {
      lobbyBtn = document.createElement("button");
      lobbyBtn.textContent = "로비로 돌아가기";
      lobbyBtn.classList.add("game-over-button", "lobby-btn"); 
      lobbyBtn.addEventListener("click", () => {
        window.location.href = "../../index.html";
      });
      gameOverEl.appendChild(lobbyBtn);
    }
  }

  // ----------------- 게임 리셋 -----------------
  function resetGame() {
    score = 0;
    clearInterval(timerInterval);
    clearInterval(spawnInterval);
    field.innerHTML = "";
    gameOverEl.classList.add("hidden");
    updateHUD();
  }

  // ----------------- 이벤트 바인딩 -----------------
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-time");
      startGame(mode);
    });
  });

  restartBtn.addEventListener("click", () => {
    gameOverEl.classList.add("hidden");
    document.getElementById("score").textContent = "점수: 0";
    document.getElementById("timer").textContent = "남은 시간: -";
  });
});
