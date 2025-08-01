document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("gameArea");
  const player = document.getElementById("player");

  let isJumping = false;
  let velocity = 0;
  let gravity = 0.5;
  let position = 100;
  let score = 0;
  let gameOver = false;

  const scoreDisplay = document.createElement("div");
  scoreDisplay.id = "score";
  scoreDisplay.textContent = "점수: 0";
  gameArea.appendChild(scoreDisplay);

  const backButton = document.createElement("button");
  backButton.id = "backButton";
  backButton.textContent = "↩️ 메인으로";
  gameArea.appendChild(backButton);
  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  function jump() {
    if (!isJumping && !gameOver) {
      isJumping = true;
      velocity = -10;
    }
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

  function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.right = "-60px";
    gameArea.appendChild(obstacle);

    const moveInterval = setInterval(() => {
      const playerRect = player.getBoundingClientRect();
      const obsRect = obstacle.getBoundingClientRect();

      // 충돌 판정
      if (
        playerRect.right > obsRect.left &&
        playerRect.left < obsRect.right &&
        playerRect.bottom > obsRect.top &&
        playerRect.top < obsRect.bottom
      ) {
        endGame();
      }

      // 밖으로 나가면 제거
      if (obsRect.right < 0) {
        clearInterval(moveInterval);
        obstacle.remove();
      }
    }, 50);
  }

  function endGame() {
    if (gameOver) return;
    gameOver = true;
    alert("💀 게임 오버! 점수: " + score);
    backButton.style.display = "block";
  }

  // 점수 증가
  const scoreInterval = setInterval(() => {
    if (!gameOver) {
      score++;
      scoreDisplay.textContent = "점수: " + score;
    }
  }, 1000);

  // 장애물 생성
  const obstacleInterval = setInterval(() => {
    if (!gameOver) createObstacle();
  }, 2000);

  document.addEventListener("click", jump);
  document.addEventListener("touchstart", jump);

  update();
});
