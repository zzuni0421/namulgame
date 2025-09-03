document.addEventListener("DOMContentLoaded", () => {
  const field = document.getElementById("field");
  const timerEl = document.getElementById("timer");
  const scoreEl = document.getElementById("score");
  const gameOverEl = document.getElementById("game-over");
  const finalScoreEl = document.getElementById("final-score");
  const restartBtn = document.getElementById("restart-btn");
  const usernameEl = document.getElementById("username");
  const hardModeBtn = document.getElementById("hardModeBtn");
  const eventBanner = document.getElementById("eventBanner");

  let lobbyBtn = null;
  let score = 0;
  let timeLeft = 0;
  let timerInterval;
  let spawnInterval;
  let isHard = false;
  const API_URL = "/api/namul";

  // ------------------ 토큰 로그인 ------------------
  const token = localStorage.getItem("token");

  let username = "(게스트)";
  let secretUnlock = "FALSE";

  if (token) {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "tokenLogin", token })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        username = data.username;
        secretUnlock = data.secretUnlock || "FALSE";
        localStorage.setItem("secretUnlock", secretUnlock);
        usernameEl.textContent = username;

        // 하드모드 버튼/이벤트 배너 표시
        if (secretUnlock === "TRUE") {
          hardModeBtn.style.display = "block";
          eventBanner.style.display = "block";
        } else {
          hardModeBtn.style.display = "none";
          eventBanner.style.display = "none";
        }
      } else {
        usernameEl.textContent = "(게스트)";
      }
    })
    .catch(() => { usernameEl.textContent = "(게스트)"; });
  } else {
    usernameEl.textContent = "(게스트)";
  }

  // ------------------ 게임 시작 ------------------
  function startGame(mode) {
    resetGame();

    if (mode === "hard") {
      isHard = true;
      timeLeft = 30;
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
    finalScoreEl.textContent = `최종 점수: ${score} (플레이어: ${username})`;

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

  function resetGame() {
    score = 0;
    clearInterval(timerInterval);
    clearInterval(spawnInterval);
    field.innerHTML = "";
    gameOverEl.classList.add("hidden");
    updateHUD();
  }

  // ------------------ 버튼 이벤트 ------------------
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => startGame(btn.getAttribute("data-time")));
  });

  restartBtn.addEventListener("click", () => {
    gameOverEl.classList.add("hidden");
    scoreEl.textContent = "점수: 0";
    timerEl.textContent = "남은 시간: -";
  });

  hardModeBtn.addEventListener("click", () => {
    startGame("hard");
  });
});
