document.addEventListener("DOMContentLoaded", () => {
  const character = document.getElementById("character");
  const obstacle = document.getElementById("obstacle");
  const scoreDisplay = document.getElementById("score");
  const gameOverScreen = document.getElementById("game-over");
  const restartBtn = document.getElementById("restart");

  let characterY = 150; // 캐릭터의 수직 위치
  let velocity = 0;
  const gravity = 0.5;
  let isJumping = false;
  let score = 0;
  let gameInterval;
  let obstacleSpeed = 5;
  const floor = 50;
  let floor = canvas.height - playerHeight;

  window.onload = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  floor = canvas.height - playerHeight;
  playerY = floor;
};

  function jump() {
    if (!isJumping) {
      velocity = -10;
      isJumping = true;
    }
  }

  function update() {
    velocity += gravity;
    characterY += velocity;

    // 바닥에 닿았을 때
    if (characterY >= floor) {
      characterY = floor;
      velocity = 0;
      isJumping = false;
    }

    // 천장에 닿았을 때 튕기지 않도록
    if (characterY < 0) {
      characterY = 0;
      velocity = 0;
    }

    character.style.top = characterY + "px";

    // 장애물 이동
    const obstacleLeft = parseInt(getComputedStyle(obstacle).left);
    if (obstacleLeft <= -20) {
      obstacle.style.left = "100vw";
      score++;
      scoreDisplay.textContent = "점수: " + score;
    } else {
      obstacle.style.left = obstacleLeft - obstacleSpeed + "px";
    }

    // 충돌 체크
    const characterRect = character.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    if (
      characterRect.right > obstacleRect.left &&
      characterRect.left < obstacleRect.right &&
      characterRect.bottom > obstacleRect.top
    ) {
      endGame();
    }

    // 난이도 증가
    if (score > 0 && score % 20 === 0) {
      obstacleSpeed += 0.2;
    }
  }

  function startGame() {
    obstacle.style.left = "100vw";
    characterY = floor;
    velocity = 0;
    gameInterval = setInterval(update, 20);
  }

  function endGame() {
    clearInterval(gameInterval);
    gameOverScreen.style.display = "block";
  }

  restartBtn.addEventListener("click", () => {
    characterY = floor;
    velocity = 0;
    isJumping = false;
    score = 0;
    obstacleSpeed = 5;
    scoreDisplay.textContent = "점수: 0";
    gameOverScreen.style.display = "none";
    startGame();
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") jump();
  });

  document.addEventListener("click", jump);

  startGame();
});
