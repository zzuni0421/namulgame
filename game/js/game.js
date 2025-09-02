document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // 캔버스 크기 설정
  canvas.width = 800;
  canvas.height = 400;

  // 플레이어 설정
  const player = {
    x: 50,
    y: 0,
    width: 40,
    height: 40,
    dy: 0,
    gravity: 0.7,
    jumpPower: -12,
    grounded: false,
  };

  // 바닥
  const floor = canvas.height - player.height;

  // 장애물
  let obstacles = [];
  let obstacleTimer = 0;

  // 점수 & 게임 상태
  let score = 0;
  let gameOver = false;
  let gameStarted = false;

  // 점프
  function jump() {
    if (player.grounded) {
      player.dy = player.jumpPower;
      player.grounded = false;
    }
  }

  // 입력 처리 (모바일/PC 둘 다 지원)
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") jump();
  });
  document.addEventListener("click", () => jump());

  // 장애물 생성
  function spawnObstacle() {
    const height = 40;
    obstacles.push({
      x: canvas.width,
      y: floor,
      width: 40,
      height: height,
    });
  }

  // 충돌 체크
  function checkCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  // 게임 루프
  function update() {
    if (gameOver || !gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 플레이어 업데이트
    player.y += player.dy;
    player.dy += player.gravity;

    if (player.y >= floor) {
      player.y = floor;
      player.dy = 0;
      player.grounded = true;
    }

    // 장애물 업데이트
    obstacleTimer++;
    if (obstacleTimer % 120 === 0) spawnObstacle();

    obstacles.forEach((obs, i) => {
      obs.x -= 6;

      if (obs.x + obs.width < 0) {
        obstacles.splice(i, 1);
        score++;
      }

      if (checkCollision(player, obs)) {
        gameOver = true;
      }

      // 장애물 그리기
      ctx.fillStyle = "green";
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // 플레이어 그리기
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 점수
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    if (gameOver) {
      ctx.fillStyle = "red";
      ctx.font = "40px Arial";
      ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    } else {
      requestAnimationFrame(update);
    }
  }

  // 시작 버튼 이벤트
  const startBtn = document.getElementById("startBtn");
  const replayBtn = document.getElementById("replayBtn");

  if (startBtn) {
    startBtn.onclick = () => {
      if (!gameStarted) {
        gameStarted = true;
        gameOver = false;
        obstacles = [];
        score = 0;
        update();
      }
    };
  }

  if (replayBtn) {
    replayBtn.onclick = () => {
      gameOver = false;
      gameStarted = true;
      obstacles = [];
      score = 0;
      player.y = floor;
      player.dy = 0;
      update();
    };
  }
});
