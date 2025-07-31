document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("gameArea");
  const player = document.getElementById("player");

  let isJumping = false;
  let velocity = 0;
  let gravity = 0.5;
  let position = 100;
  let playerX = 50;
  let score = 0;
  let gameOver = false;
  let scoreInterval;

  // 점수 표시
  const scoreDisplay = document.createElement("div");
  scoreDisplay.id = "score";
  scoreDisplay.textContent = "점수: 0";
  gameArea.appendChild(scoreDisplay);

  // 점프 함수
  function jump() {
    if (!isJumping) {
      isJumping = true;
      velocity = -12;
    }
  }

  // 장애물 생성 함수
  function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = "150vw";
    gameArea.appendChild(obstacle);

    const moveInterval = setInterval(() => {
      let left = parseInt(obstacle.style.left);
      if (left < -50) {
        clearInterval(moveInterval);
        obstacle.remove();
      } else {
        obstacle.style.left = (left - 4) + "px";

        // 충돌 판정
        const obstacleLeft = obstacle.getBoundingClientRect().left;
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
          playerRect.right > obstacleLeft &&
          playerRect.left < obstacleRect.right &&
          playerRect.bottom > obstacleRect.top
        ) {
          endGame();
        }
      }
    }, 20);
  }

  function endGame() {
    if (gameOver) return;
    gameOver = true;
    clearInterval(scoreInterval); // 점수 증가 중단
    alert("💀 게임 오버! 점수: " + score);
    location.reload();
  }

  function update() {
    velocity += gravity;
    position -= velocity;

    if (position <= 100) {
      position = 100;
      velocity = 0;
      isJumping = false;
    }

    player.style.bottom = position + "px";
    player.style.left = playerX + "px";

    if (!gameOver) requestAnimationFrame(update);
  }

  // 점수 주기적으로 증가 (1초에 1점)
  scoreInterval = setInterval(() => {
    if (!gameOver) {
      score++;
      scoreDisplay.textContent = "점수: " + score;
    }
  }, 1000);

  // 장애물 주기적으로 생성
  setInterval(() => {
    if (!gameOver) createObstacle();
  }, 1500);

  document.addEventListener("click", jump);
  document.addEventListener("touchstart", jump);

  update();
});
