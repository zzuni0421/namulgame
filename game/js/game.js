document.addEventListener("DOMContentLoaded", () => {
  let nickname = "";
  let score = 0;
  let gameInterval = null;
  let timeLeft = 10;
  let currentMode = "10";
  let gameOver = false;

  const nicknameInput = document.getElementById("nicknameInput");
  const nicknameDisplay = document.getElementById("nicknameDisplay");
  const submitBtn = document.getElementById("submitBtn");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const timerDisplay = document.getElementById("timerDisplay");
  const gameUI = document.getElementById("gameUI");
  const gameArea = document.getElementById("gameArea");
  const bgm = document.getElementById("bgm");
  const replayBtn = document.getElementById("replayBtn");

  submitBtn.onclick = () => {
    const value = nicknameInput.value.trim();
    if (!value) return alert("닉네임을 입력하세요.");
    nickname = value;
    nicknameDisplay.textContent = `안녕하세요, ${nickname}님!`;
    document.getElementById("nicknameSection").style.display = "none";
    gameUI.style.display = "block";
  };

  document.querySelectorAll(".modeBtn").forEach(btn => {
    btn.onclick = () => {
      currentMode = btn.dataset.time;
      startGame(currentMode);
    };
  });

  document.getElementById("bgmToggle").onclick = () => {
    bgm.paused ? bgm.play() : bgm.pause();
  };

  replayBtn.onclick = () => {
    startGame(currentMode);
    replayBtn.style.display = "none";
  };

  gameArea.onclick = (e) => {
    if (!gameInterval) return;
    if (e.target.classList.contains("namul")) {
      score++;
      scoreDisplay.textContent = `${nickname}님의 점수: ${score}점`;
      spawnNamul();
    }
  };

  function startGame(mode) {
    score = 0;
    gameOver = false;
    timeLeft = mode === "infinite" ? Infinity : parseInt(mode);
    scoreDisplay.textContent = `점수: 0점`;
    timerDisplay.textContent = mode === "infinite" ? "∞" : `${timeLeft}초 남음`;
    gameArea.innerHTML = "";
    replayBtn.style.display = "none";

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      if (mode !== "infinite") {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft}초 남음`;
        if (timeLeft <= 0) {
          endGame();
        }
      }
    }, 1000);

    spawnNamul();
  }

  function spawnNamul() {
    gameArea.innerHTML = "";
    const namul = document.createElement("div");
    namul.className = "namul";
    namul.style.left = Math.random() * (gameArea.clientWidth - 50) + "px";
    namul.style.top = Math.random() * (gameArea.clientHeight - 50) + "px";
    gameArea.appendChild(namul);
  }

  function endGame() {
    clearInterval(gameInterval);
    gameInterval = null;
    gameOver = true;
    alert(`게임 종료! 점수: ${score}`);
    replayBtn.style.display = "inline-block";
  }
});
