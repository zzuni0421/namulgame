document.addEventListener("DOMContentLoaded", () => {
  const field = document.getElementById("field");
  const timerEl = document.getElementById("timer");
  const scoreEl = document.getElementById("score");
  const gameOverEl = document.getElementById("game-over");
  const finalScoreEl = document.getElementById("final-score");
  const restartBtn = document.getElementById("restart-btn");

  let score = 0;
  let timeLeft = 0;
  let gameInterval, spawnInterval;
  let isInfinite = false;

  const isLoggedIn = false;
  const username = isLoggedIn ? "사용자아이디" : "(게스트)";
  document.getElementById("username").textContent = username;

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.time;
      startGame(mode);
    });
  });

  restartBtn.addEventListener("click", () => {
    gameOverEl.classList.add("hidden");
    score = 0;
    scoreEl.textContent = "점수: 0";
    timerEl.textContent = "남은 시간: -";
  });

  function startGame(mode) {
    score = 0;
    scoreEl.textContent = "점수: 0";
    gameOverEl.classList.add("hidden");

    if (mode === "infinite") {
      isInfinite = true;
      timeLeft = 0;
      timerEl.textContent = "무한 모드";
    } else if (mode === "hard") {
      isInfinite = false;
      timeLeft = 30; // 하드모드 고정 30초
      timerEl.textContent = `남은 시간: ${timeLeft}`;
    } else {
      isInfinite = false;
      timeLeft = parseInt(mode);
      timerEl.textContent = `남은 시간: ${timeLeft}`;
    }

    clearInterval(gameInterval);
    clearInterval(spawnInterval);

    if (!isInfinite) {
      gameInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `남은 시간: ${timeLeft}`;
        if (timeLeft <= 0) {
          endGame();
        }
      }, 1000);
    }

    spawnInterval = setInterval(spawnNamul, 1000);
  }

  function spawnNamul() {
    field.innerHTML = "";

    const count = Math.floor(Math.random() * 2) + 5; // 5~6개
    for (let i = 0; i < count; i++) {
      const namul = document.createElement("img");
      namul.src = "../../assets/namul.png";
      namul.classList.add("namul");

      const x = Math.random() * (field.clientWidth - 50);
      const y = Math.random() * (field.clientHeight - 50);
      namul.style.left = `${x}px`;
      namul.style.top = `${y}px`;

      namul.addEventListener("click", () => {
        score++;
        scoreEl.textContent = `점수: ${score}`;
        namul.remove();
      });

      field.appendChild(namul);
    }
  }

  function endGame() {
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    field.innerHTML = "";
    gameOverEl.classList.remove("hidden");
    finalScoreEl.textContent = `${username} 님의 점수: ${score}`;
  }
});
