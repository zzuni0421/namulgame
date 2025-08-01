const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");
const gameOverDiv = document.getElementById("game-over");

let gravity = 0.6;
let isJumping = false;
let velocity = 0;
let position = 0;

let obstacleX = window.innerWidth;
let obstacleSpeed = 6;
let score = 0;
let gameRunning = true;

// 점프 기능
document.body.addEventListener("click", () => {
  if (!isJumping && gameRunning) {
    velocity = -12;
    isJumping = true;
  }
});

function gameLoop() {
  if (!gameRunning) return;

  // 중력 적용
  velocity += gravity;
  position += velocity;
  if (position < 0) {
    position = 0;
    velocity = 0;
    isJumping = false;
  }

  player.style.bottom = `${50 + position}px`;

  // 장애물 이동
  obstacleX -= obstacleSpeed;
  if (obstacleX < -60) {
    obstacleX = window.innerWidth;
    score++;
    scoreDisplay.textContent = `점수: ${score}`;

    // 20점마다 속도 증가
    if (score % 20 === 0) {
      obstacleSpeed += 1;
    }
  }
  obstacle.style.left = `${obstacleX}px`;

  // 충돌 감지
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();
  if (
    playerRect.right > obstacleRect.left &&
    playerRect.left < obstacleRect.right &&
    playerRect.bottom > obstacleRect.top &&
    playerRect.top < obstacleRect.bottom
  ) {
    endGame();
    return;
  }

  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  gameOverDiv.style.display = "block";
}

function restartGame() {
  position = 0;
  velocity = 0;
  score = 0;
  obstacleX = window.innerWidth;
  obstacleSpeed = 6;
  isJumping = false;
  gameRunning = true;
  gameOverDiv.style.display = "none";
  scoreDisplay.textContent = "점수: 0";
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
