document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("gameArea");
  const player = document.getElementById("player");

  let isJumping = false;
  let velocity = 0;
  let gravity = 0.6;
  let position = 100;
  let playerX = 50;
  let score = 0;
  let gameOver = false;
  let obstacleSpeed = 5; // 초기 속도
  let scoreInterval, speedInterval;

  const scoreDisplay = document.createElement("div");
  scoreDisplay.id = "score";
  scoreDisplay.textContent = "점수: 0";
  gameArea.appendChild(scoreDisplay);

  function jump() {
    if (!isJumping) {
      isJumping = true;
      velocity = -12;
    }
  }

  function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = "100vw";
    gameArea.appendChild(obstacle);

    const moveInterval = setInterval(() => {
      if (gameOver) {
        clearInterval(moveInterval);
        return;
      }

      let left = parseFloat(obstacle.style.left);
      if (isNaN(left)) left = window.innerWidth;
      left -= obstacleSpeed;
      obstacle.style.left = `${left}px`;

      const playerRect = player.getBoundingClientRect();
      const obstacleRect = obstacle.getBoundingClientRect();

      // 충돌 판정
      if (
        playerRect.right > obstacleRect.left &&
        playerRect.left < obstacleRect.right &&
        playerRect.bottom > obstacleRect.top &&
        playerRect.top < obstacleRect.bottom
      ) {
        endGame();
      }

      if (left < -50) {
        clearInterval(moveInterval);
        obstacle.remove();
      }
    }, 20);
  }

  function endGame() {
    if (gameOver) return;
    gameOver = true;
    clearInterval(scoreInterval);
    clearInterval(speedInterval);
    alert("💀 게임 오버! 점수: " + score);
    backButton.style.display = "block";
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

  // 점수 증가
  scoreInterval = setInterval(() => {
    if (!gameOver) {
      score++;
      scoreDisplay.textContent = "점수: " + score;
    }
  }, 1000);

  // 장애물 생성
  setInterval(() => {
    if (!gameOver) createObstacle();
  }, 1500);

  // 난이도 상승: 20초마다 장애물 속도 증가
  speedInterval = setInterval(() => {
    if (!gameOver && obstacleSpeed < 15) {
      obstacleSpeed += 1;
    }
  }, 20000);

  document.addEventListener("click", jump);
  document.addEventListener("touchstart", jump);

  update();

  // 메인으로 돌아가기 버튼
  const backButton = document.createElement("button");
  backButton.id = "backButton";
  backButton.textContent = "↩️ 메인으로";
  backButton.style.display = "none";
  gameArea.appendChild(backButton);

  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
