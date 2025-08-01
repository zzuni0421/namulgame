document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("gameArea");
  const player = document.getElementById("player");

  let velocity = 0;
  let gravity = 0.5;
  let isJumping = false;
  let position = 100;
  let gameOver = false;
  let score = 0;

  // 점수
  const scoreDisplay = document.createElement("div");
  scoreDisplay.id = "score";
  scoreDisplay.style.position = "absolute";
  scoreDisplay.style.top = "20px";
  scoreDisplay.style.left = "20px";
  scoreDisplay.style.fontSize = "24px";
  scoreDisplay.textContent = "점수: 0";
  gameArea.appendChild(scoreDisplay);

  function jump() {
    if (!isJumping) {
      velocity = -10;
      isJumping = true;
    }
  }

  function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = "100vw"; // 오른쪽 바깥에서 시작
    gameArea.appendChild(obstacle);

    let obstaclePosition = window.innerWidth;

    const moveInterval = setInterval(() => {
      if (gameOver) {
        clearInterval(moveInterval);
        obstacle.remove();
        return;
      }

      obstaclePosition -= 5;
      obstacle.style.left = obstaclePosition + "px";

      const playerRect = player.getBoundingClientRect();
      const obstacleRect = obstacle.getBoundingClientRect();

      if (
        playerRect.right > obstacleRect.left &&
        playerRect.left < obstacleRect.right &&
        playerRect.bottom > obstacleRect.top
      ) {
        endGame();
      }

      if (obstaclePosition < -50) {
        clearInterval(moveInterval);
        obstacle.remove();
      }
    }, 20);
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

    if (!gameOver) requestAnimationFrame(update);
  }

  function endGame() {
    if (gameOver) return;
    gameOver = true;
    alert("💀 게임 오버! 점수: " + score);
    location.reload();
  }

  // 점수 증가
  setInterval(() => {
    if (!gameOver) {
      score++;
      scoreDisplay.textContent = "점수: " + score;
    }
  }, 1000);

  // 장애물 생성
  setInterval(() => {
    if (!gameOver) createObstacle();
  }, 1500);

  // 입력
  document.addEventListener("click", jump);
  document.addEventListener("touchstart", jump);

  update();
});
