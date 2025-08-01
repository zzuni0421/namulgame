<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>점프 장애물 게임</title>
  <style>
    /* 게임 영역 */
    #gameArea {
      position: relative;
      width: 100vw;
      height: 300px;
      background: linear-gradient(to top, #a2d149, #7ac943); /* 잔디 배경 느낌 */
      overflow: hidden;
      border: 2px solid #333;
      user-select: none;
    }

    /* 플레이어 */
    #player {
      position: absolute;
      bottom: 100px;
      left: 50px;
      width: 50px;
      height: 50px;
      background-color: #ff6347; /* 토마토색 */
      border-radius: 10px;
    }

    /* 장애물 */
    .obstacle {
      position: absolute;
      bottom: 100px; /* 땅 높이와 맞춤 */
      width: 50px;
      height: 50px;
      background-color: #333;
      border-radius: 5px;
    }

    /* 점수판 */
    #score {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 24px;
      font-weight: bold;
      color: #222;
      text-shadow: 1px 1px 1px #fff;
      user-select: none;
    }

    /* 메인으로 버튼 */
    #backButton {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 8px 16px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 8px;
      border: none;
      background-color: #4caf50;
      color: white;
      display: none; /* 게임 오버 시 보여줌 */
      user-select: none;
    }
  </style>
</head>
<body>
  <div id="gameArea">
    <div id="player"></div>
  </div>

  <script>
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

      // 장애물 생성 함수
      function createObstacle() {
        if (gameOver) return;

        const obstacle = document.createElement("div");
        obstacle.classList.add("obstacle");
        const startX = gameArea.clientWidth; // 게임 영역 너비(px)
        obstacle.style.left = startX + "px";
        gameArea.appendChild(obstacle);

        const moveInterval = setInterval(() => {
          let left = parseFloat(obstacle.style.left);

          if (isNaN(left)) left = startX;

          if (left < -50) {
            clearInterval(moveInterval);
            obstacle.remove();
          } else {
            obstacle.style.left = (left - 5) + "px"; // 왼쪽으로 5px 이동

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

      // 게임 종료 함수
      function endGame() {
        if (gameOver) return;
        gameOver = true;
        clearInterval(scoreInterval);
        clearInterval(obstacleSpawner);
        backButton.style.display = "block";
        alert(`💀 게임 오버! 점수: ${score}`);
      }

      // 게임 루프 업데이트 함수
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

      // 점수 증가
      const scoreInterval = setInterval(() => {
        if (!gameOver) {
          score++;
          scoreDisplay.textContent = "점수: " + score;
        }
      }, 1000);

      // 장애물 주기적 생성
      const obstacleSpawner = setInterval(() => {
        createObstacle();
      }, 1500);

      // 입력 이벤트
      document.addEventListener("click", jump);
      document.addEventListener("touchstart", jump);

      // 시작
      update();
    });
  </script>
</body>
</html>
