document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("gameArea");
  const player = document.getElementById("player");

  let isJumping = false;
  let velocity = 0;
  const gravity = 0.5;
  let position = 100;
  const playerX = 50;
  let score = 0;
  let gameOver = false;

  // 점수 표시
  const scoreDisplay = document.createElement("div");
  scoreDisplay.id = "score";
  scoreDisplay.textContent = "점수: 0";
  gameArea.appendChild(scoreDisplay);

  // 메인으로 버튼
  const backButton = document.createElement("button");
  backButton.id = "backButton";
  backButton.textContent = "↩️ 메인으로";
  gameArea.appendChild(backButton);

  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // 점프 함수
  function jump() {
    if (!isJumping && !gameOver) {
      isJumping = true;
      velocity = -12;
    }
  }

  // 장애물 생성
  function createObstacle() {
    if (gameOver) return;

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    const startX = gameArea.clientWidth;
    obstacle.style.left = startX + "px";
    gameArea.appendChild(obstacle);

    const moveInterval = setInterval(() => {
      let left = parseFloat(obstacle.style.left);
      if (isNaN(left)) left = startX;

      if (left < -50) {
        clearInterval(moveInterval);
        obstacle.remove();
      } else {
        obstacle.style.left = (left - 5) + "px";

        // 충돌 판정
        const obstacleRect = obstacle.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
          playerRect.right > obstacleRect.left &&
          playerRect.left < obstacleRect.right &&
          playerRect.bottom > obstacleRect.top
        ) {
          endGame();
        }
      }
    }, 20);
  }

  // 게임 종료
  function endGame() {
    if (gameOver) return;
    gameOver = true;
    clearInterval(scoreInterval);
    clearInterval(obstacleInterval);
    backButton.style.display = "block";
    alert(`💀 게임 오버! 점수: ${score}`);
  }

  // 점수 증가
  const scoreInterval = setInterval(() => {
    if (!gameOver) {
      score++;
      scoreDisplay.textContent = "점수: " + score;
    }
  }, 1000);

  // 장애물 생성 루프
  const obstacleInterval = setInterval(() => {
    createObstacle();
  }, 1500);

  // 애니메이션 루프
  function update() {
    if (gameOver) return;

    velocity += gravity;
    position -= velocity;

    if (position <= 100) {
      position = 100;
      velocity = 0;
      isJumping = false;
    }

    player.style.bottom = position + "px";
    player.style.left = playerX + "px";

    requestAnimationFrame(update);
  }

  // 입력 이벤트
  document.addEventListener("click", jump);
  document.addEventListener("touchstart", jump);

  // 시작!
  update();
});
