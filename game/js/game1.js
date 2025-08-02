document.addEventListener("DOMContentLoaded", () => {
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const retryBtn = document.getElementById("retryBtn");

let score = 0;
let gameOver = false;
let gravity = 0.6;
let jumpPower = -12;

const player = {
  x: 50,
  y: canvas.height - 30,
  width: 30,
  height: 30,
  dy: 0
};

const obstacle = {
  x: canvas.width,
  y: canvas.height - 50,
  width: 20,
  height: 50,
  speed: 5
};

function drawPlayer() {
  ctx.fillStyle = "#00aaff";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacle() {
  ctx.fillStyle = "#ff4444";
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 중력 적용
  player.dy += gravity;
  player.y += player.dy;

  // 바닥 충돌
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
  }

  // 장애물 이동
  obstacle.x -= obstacle.speed;
  if (obstacle.x + obstacle.width < 0) {
    obstacle.x = canvas.width;
    score++;
    scoreDisplay.textContent = `점수: ${score}`;
  }

  // 충돌 체크
  if (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  ) {
    gameOver = true;
    showGameOver();
  }

  drawPlayer();
  drawObstacle();

  requestAnimationFrame(update);
}

function jump() {
  if (!gameOver && player.y + player.height >= canvas.height) {
    player.dy = jumpPower;
  }
}

function showGameOver() {
  finalScore.textContent = `최종 점수: ${score}`;
  gameOverScreen.classList.remove("hidden");
}

function resetGame() {
  score = 0;
  player.y = canvas.height - player.height;
  player.dy = 0;
  obstacle.x = canvas.width;
  gameOver = false;
  scoreDisplay.textContent = "점수: 0";
  gameOverScreen.classList.add("hidden");
  update();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

canvas.addEventListener("click", jump);
retryBtn.addEventListener("click", resetGame);

// 게임 시작
update();

  const backBtn = document.createElement("button");
backBtn.id = "backToMainBtn";
backBtn.textContent = "↩️ 메인으로";
backBtn.style.position = "fixed";
backBtn.style.top = "10px";
backBtn.style.left = "10px";
backBtn.style.zIndex = "1000";
document.body.appendChild(backBtn);

backBtn.onclick = () => {
  window.location.href = "../../index.html";
};
});
