document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("player");
  const ground = document.getElementById("ground");
  const game = document.getElementById("game");
  const scoreDisplay = document.getElementById("score");

  let isJumping = false;
  let gravity = 2;
  let velocity = 0;
  let isGameOver = false;
  let score = 0;
  let obstacleSpeed = 5;
  let lastObstacleTime = 0;
  let speedIncreaseInterval = 20000; // 20초마다 속도 증가

  function jump() {
    if (isJumping || isGameOver) return;
    isJumping = true;
    let jumpHeight = 0;
    let jumpInterval = setInterval(() => {
      if (jumpHeight >= 100) {
        clearInterval(jumpInterval);
        let fallInterval = setInterval(() => {
          if (jumpHeight <= 0) {
            clearInterval(fallInterval);
            isJumping = false;
          } else {
            jumpHeight -= 5;
            player.style.bottom = jumpHeight + "px";
          }
        }, 20);
      } else {
        jumpHeight += 5;
        player.style.bottom = jumpHeight + "px";
      }
    }, 20);
  }

  function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    game.appendChild(obstacle);
    obstacle.style.left = "100vw";

    let obstacleLeft = game.offsetWidth;
    const moveObstacle = setInterval(() => {
      if (isGameOver) {
        clearInterval(moveObstacle);
        return;
      }

      obstacleLeft -= obstacleSpeed;
      obstacle.style.left = obstacleLeft + "px";

      // 충돌 판정
      const playerRect = player.getBoundingClientRect();
      const obstacleRect = obstacle.getBoundingClientRect();

      if (
        playerRect.left < obstacleRect.right &&
        playerRect.right > obstacleRect.left &&
        playerRect.bottom > obstacleRect.top
      ) {
        clearInterval(moveObstacle);
        gameOver();
      }

      if (obstacleLeft <= -60) {
        clearInterval(moveObstacle);
        game.removeChild(obstacle);
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
      }
    }, 20);
  }

  function gameOver() {
    isGameOver = true;
    alert("Game Over! Your score: " + score);
    location.reload();
  }

  function startSpawningObstacles() {
    setInterval(() => {
      if (!isGameOver) createObstacle();
    }, 1500); // 기본 장애물 생성 간격
  }

  function increaseSpeedOverTime() {
    setInterval(() => {
      if (!isGameOver) {
        obstacleSpeed += 1;
        console.log("속도 증가! 현재 속도:", obstacleSpeed);
      }
    }, speedIncreaseInterval);
  }

  // 시작
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") jump();
  });

  document.addEventListener("click", jump); // 모바일 대응

  startSpawningObstacles();
  increaseSpeedOverTime();
});
