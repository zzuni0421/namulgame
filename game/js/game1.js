import { tokenLogin } from "./frontend.js";

let hardMode = false;
let gravity = 1;
let obstacleSpeed = 5;

window.addEventListener("DOMContentLoaded", async () => {
  // 하드모드 체크
  const user = await tokenLogin();
  if (user.success && user.hardunlock === true) {
    document.getElementById("hardBtn").style.display = "block";
  }

  document.getElementById("hardBtn").addEventListener("click", () => {
    hardMode = true;
    gravity = 1.5;         // 더 빠르게 떨어짐
    obstacleSpeed = 8;     // 장애물 속도 증가
    alert("점프 게임 하드모드 활성화!");
  });

  startJumpGame();
});

function startJumpGame() {
  const player = document.getElementById("player");
  const gameArea = document.getElementById("gameArea");
  let playerY = 0;
  let jumping = false;

  function jump() {
    if (!jumping) {
      jumping = true;
      let velocity = -10;
      const jumpInterval = setInterval(() => {
        velocity += gravity;
        playerY += velocity;
        if (playerY >= 0) {
          playerY = 0;
          jumping = false;
          clearInterval(jumpInterval);
        }
        player.style.bottom = playerY + "px";
      }, 20);
    }
  }

  document.addEventListener("click", jump);

  function spawnObstacle() {
    const obs = document.createElement("div");
    obs.className = "obstacle";
    obs.style.left = gameArea.offsetWidth + "px";
    gameArea.appendChild(obs);

    const moveInterval = setInterval(() => {
      const left = parseInt(obs.style.left);
      obs.style.left = left - obstacleSpeed + "px";

      if (left < -50) {
        clearInterval(moveInterval);
        obs.remove();
      }

      // 충돌 체크
      const obsRect = obs.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();
      if (!(playerRect.right < obsRect.left ||
            playerRect.left > obsRect.right ||
            playerRect.bottom < obsRect.top ||
            playerRect.top > obsRect.bottom)) {
        alert("게임 오버!");
        clearInterval(moveInterval);
      }
    }, 20);
  }

  setInterval(spawnObstacle, hardMode ? 800 : 1500);
}
