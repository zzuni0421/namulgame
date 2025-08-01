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
  let scoreInterval;
  let animationFrameId;

  const scoreDisplay = document.createElement("div");
  scoreDisplay.id = "score";
  scoreDisplay.textContent = "점수: 0";
  gameArea.appendChild(scoreDisplay);

  function jump() {
    if (!isJumping && !gameOver) {
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
        obstacle.remove();
        return;
      }

      let currentLeft = parseInt(obstacle.style.left);
      if (isNaN(currentLeft)) currentLeft = window.innerWidth;
      currentLeft -= 5;
      obstacle.style.left = currentLeft + "px";

      const obstacleRect = obstacle.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();

      if (
        playerRect.right > obstacleRect.left &&
        playerRect.left < obstacleRect.right &&
        playerRect.bottom > obstacleRect.top &&
        playerRect.top < obstacleRect.bottom
      ) {
        endGame();
      }

      if (currentLeft < -50) {
        clearInterval(moveInterval);
        obstacle.remove();
      }
    }, 20);
  }

  function endGame() {
    if (gameOver) return;
    gameOver = true;
    clearInterval(scoreInterval);
    cancelAnimationFrame(animationFrameId);
    backButton.style.display = "block";
    alert("💀 게임 오버! 점수: " + score);
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

    if (!gameOver) {
      animationFrameId = requestAnimationFrame(update);
    }
  }

  scoreInterval = setInterval(() => {
    if (!gameOver) {
      score++;
      scoreDisplay.textContent = "점수: " + score;
    }
  }, 1000);

  setInterval(() => {
    if (!gameOver) createObstacle();
  }, 2000);

  document.addEventListener("click", jump);
  document.addEventListener("touchstart", jump);

  update();

  const backButton = document.createElement("button");
  backButton.id = "backButton";
  backButton.textContent = "↩️ 메인으로";
  backButton.style.display = "none";
  gameArea.appendChild(backButton);

  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});

