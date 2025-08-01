const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerWidth = 50;
const playerHeight = 50;
const gravity = 0.5;
const jumpStrength = 12;

const floor = canvas.height - playerHeight;

let player = {
  x: 100,
  y: floor,
  vy: 0,
  jumping: false
};

let obstacles = [];
let obstacleSpeed = 6;
let spawnInterval = 2000;
let lastSpawnTime = 0;
let score = 0;
let gameOver = false;
let startTime = Date.now();

const scoreDisplay = document.getElementById("scoreDisplay");
const restartButton = document.getElementById("restartButton");

function spawnObstacle() {
  obstacles.push({
    x: canvas.width,
    y: floor,
    width: 40,
    height: 50
  });
}

function resetGame() {
  player.y = floor;
  player.vy = 0;
  player.jumping = false;
  obstacles = [];
  obstacleSpeed = 6;
  score = 0;
  gameOver = false;
  lastSpawnTime = 0;
  startTime = Date.now();
  restartButton.style.display = "none";
  animate();
}

function drawPlayer() {
  ctx.fillStyle = "#3498db";
  ctx.fillRect(player.x, player.y, playerWidth, playerHeight);
}

function drawObstacles() {
  ctx.fillStyle = "#e74c3c";
  for (let obs of obstacles) {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  }
}

function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + playerWidth > b.x &&
    a.y < b.y + b.height &&
    a.y + playerHeight > b.y
  );
}

function update() {
  // 중력 적용
  player.vy += gravity;
  player.y += player.vy;

  if (player.y >= floor) {
    player.y = floor;
    player.vy = 0;
    player.jumping = false;
  }

  // 장애물 업데이트
  for (let obs of obstacles) {
    obs.x -= obstacleSpeed;
    if (checkCollision(player, obs)) {
      gameOver = true;
    }
  }

  // 지나간 장애물 제거
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  // 점수 증가
  score += 1;
  scoreDisplay.innerText = `점수: ${score}`;

  // 난이도 증가
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  if (elapsed % 20 === 0 && elapsed !== 0) {
    obstacleSpeed += 0.03; // 천천히 빨라짐
  }

  // 장애물 생성
  if (Date.now() - lastSpawnTime > spawnInterval) {
    spawnObstacle();
    lastSpawnTime = Date.now();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObstacles();
}

function animate() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(animate);
  } else {
    scoreDisplay.innerText = `게임 오버! 점수: ${score}`;
    restartButton.style.display = "block";
  }
}

window.addEventListener("mousedown", () => {
  if (!player.jumping && !gameOver) {
    player.vy = -jumpStrength;
    player.jumping = true;
  }
});

restartButton.addEventListener("click", resetGame);

resetGame();
