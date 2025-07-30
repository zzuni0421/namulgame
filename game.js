document.addEventListener("DOMContentLoaded", () => {
  const ui = document.getElementById("ui");
  const startBtn = document.getElementById("startBtn");
  const endBtn = document.getElementById("endBtn");
  const nicknameInput = document.getElementById("nickname-input");

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let player = { x: 50, y: 300, size: 30, color: "lime", vy: 0 };
  let gravity = 0.6;
  let isJumping = false;

  let obstacles = [];
  let score = 0;
  let nickname = "";
  let isRunning = false;
  let gameInterval;

  if (usedNicknames.has(nicknameInput)) {
        alert("이미 사용 중인 닉네임입니다!");
        return;
    }

    usedNicknames.add(nicknameInput);
  
  function startGame() {
    nickname = nicknameInput.value.trim() || "무명";
    ui.style.display = "none";
    isRunning = true;
    score = 0;
    player.y = 300;
    player.vy = 0;
    obstacles = [];

    gameInterval = setInterval(update, 1000 / 60);
  }

  function endGame() {
    isRunning = false;
    clearInterval(gameInterval);
    alert(`${nickname}님의 점수는 ${score}점입니다!`);
    ui.style.display = "block";
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 플레이어 중력 적용
    player.vy += gravity;
    player.y += player.vy;

    if (player.y > 300) {
      player.y = 300;
      player.vy = 0;
      isJumping = false;
    }

    // 장애물 생성
    if (Math.random() < 0.02) {
      obstacles.push({ x: canvas.width, y: 320, width: 20, height: 30 });
    }

    // 장애물 이동
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= 5;
      if (obstacles[i].x + obstacles[i].width < 0) {
        obstacles.splice(i, 1);
        score++;
      }
    }

    // 충돌 검사
    for (let obs of obstacles) {
      if (
        player.x < obs.x + obs.width &&
        player.x + player.size > obs.x &&
        player.y + player.size > obs.y
      ) {
        endGame();
        return;
      }
    }

    // 그리기
    drawPlayer();
    drawObstacles();
    drawScore();
  }

  function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
  }

  function drawObstacles() {
    ctx.fillStyle = "red";
    for (let obs of obstacles) {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
  }

  function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`닉네임: ${nickname} | 점수: ${score}`, 10, 30);
  }

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !isJumping && isRunning) {
      player.vy = -12;
      isJumping = true;
    }
  });

  startBtn.addEventListener("click", startGame);
  endBtn.addEventListener("click", endGame);
});

