const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const game = document.getElementById("game");

let isGameOver = false;
let isJumping = false;

let velocityY = 0;           // 수직 속도
const gravity = 0.8;         // 중력 (프레임당 깎이는 속도)
const jumpPower = 16;        // 점프 시작 속도 (위로)
const groundLevel = 60;      // 바닥에서의 bottom 기준

let speed = 6;               // 장애물 속도
const speedUpInterval = 20000; // 20초마다 빨라짐

let obstacleX = window.innerWidth + 100; // 초기 장애물 위치

function jump() {
  if (isJumping || isGameOver) return;
  isJumping = true;
  velocityY = jumpPower;
}

function update() {
  if (isGameOver) return;

  // --- 플레이어 점프/중력 ---
  velocityY -= gravity; // 중력은 속도를 줄임 (위쪽이 양수)
  let currentBottom = parseFloat(getComputedStyle(player).bottom);
  currentBottom += velocityY;

  if (currentBottom <= groundLevel) {
    currentBottom = groundLevel;
    velocityY = 0;
    isJumping = false;
  }

  player.style.bottom = `${currentBottom}px`;

  // --- 장애물 이동 ---
  obstacleX -= speed;
  if (obstacleX < -60) {
    obstacleX = window.innerWidth + Math.random() * 300; // 재생성, 간격 약간 랜덤
  }
  obstacle.style.left = `${obstacleX}px`;

  // --- 충돌 판정 ---
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (
    playerRect.right > obstacleRect.left &&
    playerRect.left < obstacleRect.right &&
    playerRect.bottom > obstacleRect.top &&
    playerRect.top < obstacleRect.bottom
  ) {
    gameOver();
    return;
  }

  requestAnimationFrame(update);
}

function gameOver() {
  if (isGameOver) return;
  isGameOver = true;
  alert("Game Over!");
  location.reload();
}

// 입력 (스페이스, 클릭/터치)
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") jump();
});
document.addEventListener("click", jump);
document.addEventListener("touchstart", jump);

// 난이도 상승: 20초마다 장애물 속도 증가, 최대 제한 두면 과도한 속도 방지
setInterval(() => {
  if (!isGameOver && speed < 20) {
    speed += 1;
    console.log(`속도 증가: ${speed}`);
  }
}, speedUpInterval);

// 초기 세팅
player.style.bottom = `${groundLevel}px`;
obstacle.style.left = `${obstacleX}px`;
update();
