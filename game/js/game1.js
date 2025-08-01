const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const game = document.getElementById("game");

let jumping = false;
let velocity = 0;
let gravity = 0.6;
let jumpPower = -12;
let isGameOver = false;
let speed = 6;
let speedUpInterval = 20000;

let obstacleX = window.innerWidth;

function jump() {
  if (!jumping) {
    velocity = jumpPower;
    jumping = true;
  }
}

function update() {
  if (isGameOver) return;

  // 점프 물리
  velocity += gravity;
  let newTop = parseFloat(getComputedStyle(player).bottom) + velocity;
  if (newTop <= 60) {
    newTop = 60;
    jumping = false;
    velocity = 0;
  }
  player.style.bottom = `${newTop}px`;

  // 장애물 이동
  obstacleX -= speed;
  if (obstacleX < -50) {
    obstacleX = window.innerWidth + Math.random() * 200;
  }
  obstacle.style.left = `${obstacleX}px`;

  // 충돌 판정
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (
    playerRect.right > obstacleRect.left &&
    playerRect.left < obstacleRect.right &&
    playerRect.bottom > obstacleRect.top
  ) {
    gameOver();
  }

  requestAnimationFrame(update);
}

function gameOver() {
  isGameOver = true;
  alert("Game Over!");
  location.reload();
}

// 점프 입력 (모바일 & 데스크탑 모두)
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") jump();
});
document.addEventListener("touchstart", jump);

// 난이도 상승
setInterval(() => {
  speed += 1;
  console.log(`속도 증가! 현재 속도: ${speed}`);
}, speedUpInterval);

// 시작
obstacle.style.left = `${obstacleX}px`;
update();
