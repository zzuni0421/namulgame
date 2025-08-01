document.addEventListener("DOMContentLoaded", () => {
  const character = document.getElementById("character");
  const obstacle = document.getElementById("obstacle");
  const scoreDisplay = document.getElementById("score");
  const gameOverScreen = document.getElementById("game-over");
  const restartBtn = document.getElementById("restart");

  let characterY = 150;
  let velocity = 0;
  let gravity = 0.6;
  let isJumping = false;
  let score = 0;
  let gameInterval;
  let obstacleSpeed = 5;

  function jump() {
    if (!isJumping) {
      velocity = -12;
      isJumping = true;
    }
  }

  function update() {
    // 캐릭터 위치 갱신
    velocity += gravity;
    characterY += velocity;

    // 바닥에 닿았을 때
    if (characterY >= 150) {
      characterY = 150;
      velocity = 0;
      isJumping = false;
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

    // 20초마다 속도 증가
    if (score > 0 && score % 20 === 0) {
      obstacleSpeed += 0.2;
    }
  }

  function startGame() {
    obstacle.style.left = "100vw";
    gameInterval = setInterval(update, 20);
  }

  function endGame() {
    clearInterval(gameInterval);
    gameOverScreen.style.display = "block";
  }

  restartBtn.addEventListener("click", () => {
    characterY = 150;
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
