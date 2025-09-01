document.addEventListener("DOMContentLoaded", () => {
  const namul = document.getElementById("namul");
  const scoreDisplay = document.getElementById("score");
  const timeDisplay = document.getElementById("time");
  const restartBtn = document.getElementById("restart-btn");
  const buttons = document.querySelectorAll(".mode-btn");
  const playerNameDisplay = document.getElementById("player-name");

  // 로그인 여부 확인 
  const playerId = localStorage.getItem("id");
  const playerName = playerId ? playerId : "(게스트)";
  playerNameDisplay.textContent = `플레이어: ${playerName}`;

  let score = 0;
  let timeLeft = 0;
  let gameInterval;
  let namulTimeout;
  let infiniteMode = false;

  function startGame(mode) {
    score = 0;
    scoreDisplay.textContent = score;
    infiniteMode = mode === "infinite";
    timeLeft = infiniteMode ? 9999 : parseInt(mode, 10);
    timeDisplay.textContent = infiniteMode ? "∞" : timeLeft;

    restartBtn.classList.add("hidden");

    // 시간 줄이기
    if (!infiniteMode) {
      gameInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
          endGame();
        }
      }, 1000);
    }

    spawnNamul();
  }

  function spawnNamul() {
    const gameArea = document.getElementById("game-area");
    const areaWidth = gameArea.offsetWidth - 80;
    const areaHeight = gameArea.offsetHeight - 80;

    const x = Math.random() * areaWidth;
    const y = Math.random() * areaHeight;

    namul.style.left = `${x}px`;
    namul.style.top = `${y}px`;
    namul.classList.remove("hidden");

    // 일정 시간 후 사라졌다가 다시 등장
    namulTimeout = setTimeout(() => {
      namul.classList.add("hidden");
      if ((timeLeft > 0 || infiniteMode) && !gameOver) {
        setTimeout(spawnNamul, 500 + Math.random() * 1000); // 랜덤 간격
      }
    }, 800);
  }

  function endGame() {
    clearInterval(gameInterval);
    clearTimeout(namulTimeout);
    namul.classList.add("hidden");
    restartBtn.classList.remove("hidden");
  }

  let gameOver = false;

  namul.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = score;
    namul.classList.add("hidden");
  });

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      clearInterval(gameInterval);
      clearTimeout(namulTimeout);
      gameOver = false;
      startGame(btn.dataset.time);
    });
  });

  restartBtn.addEventListener("click", () => {
    location.reload();
  });
});
