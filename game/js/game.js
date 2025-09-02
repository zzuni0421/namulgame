document.addEventListener("DOMContentLoaded", () => {
  // ------------------ DOM 요소 ------------------
  const nicknameInput = document.getElementById("nicknameInput");
  const startButton = document.getElementById("startButton");
  const replayButton = document.getElementById("replayButton");
  const gameArea = document.getElementById("gameArea");
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  const message = document.getElementById("message");

  // ------------------ 게임 변수 ------------------
  let score = 0;
  let timeLeft = 30; // 기본 30초
  let gameInterval, timerInterval;
  let nickname = "";

  // ------------------ 게임 시작 ------------------
  startButton.onclick = () => {
    nickname = nicknameInput.value.trim();
    if (!nickname) {
      alert("닉네임을 입력하세요!");
      return;
    }

    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    message.textContent = "";

    gameArea.innerHTML = ""; // 초기화
    spawnNamul();

    gameInterval = setInterval(spawnNamul, 1000);
    timerInterval = setInterval(updateTimer, 1000);

    startButton.style.display = "none";
    replayButton.style.display = "none";
  };

  // ------------------ 나물 생성 ------------------
  function spawnNamul() {
    const namul = document.createElement("div");
    namul.className = "namul";
    namul.style.left = Math.random() * (gameArea.offsetWidth - 40) + "px";
    namul.style.top = Math.random() * (gameArea.offsetHeight - 40) + "px";

    namul.onclick = () => {
      score++;
      scoreDisplay.textContent = score;
      namul.remove();
    };

    gameArea.appendChild(namul);

    // 3초 후 사라짐
    setTimeout(() => {
      if (gameArea.contains(namul)) namul.remove();
    }, 3000);
  }

  // ------------------ 타이머 ------------------
  function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }

  // ------------------ 게임 종료 ------------------
  function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);

    message.textContent = `${nickname}님의 점수: ${score}`;
    replayButton.style.display = "block";
  }

  // ------------------ 다시하기 ------------------
  replayButton.onclick = () => {
    startButton.style.display = "block";
    replayButton.style.display = "none";
    message.textContent = "";
  };
});
