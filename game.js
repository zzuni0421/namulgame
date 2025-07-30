const player = document.getElementById("player");
const container = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const endBtn = document.getElementById("endBtn");
const gameOverDiv = document.getElementById("game-over");
const finalScoreText = document.getElementById("final-score");
const rankingList = document.getElementById("ranking-list");
const nicknameForm = document.getElementById("nickname-form");
const nicknameInput = document.getElementById("nickname-input");
const startBtn = document.getElementById("startBtn");

let nickname = "";
let playerX = 185;
let playerY = 100;
let velocityY = 0;
let gravity = 0.5;
let isJumping = false;
let score = 0;
let gameRunning = false;
let obstacles = [];

startBtn.addEventListener("click", () => {
  nickname = nicknameInput.value.trim() || "이름없음";
  nicknameForm.style.display = "none";
  gameRunning = true;
  requestAnimationFrame(gameLoop);
  setInterval(spawnObstacle, 1500);
});

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowLeft") playerX -= 10;
  if (e.key === "ArrowRight") playerX += 10;
  if (e.key === " " && !isJumping) {
    velocityY = -10;
    isJumping = true;
  }
});

endBtn.addEventListener("click", () => {
  endGame();
});

function spawnObstacle() {
  if (!gameRunning) return;
  const obs = document.createElement("div");
  obs.classList.add("obstacle");
  obs.style.left = `${Math.floor(Math.random() * 360)}px`;
  obs.style.bottom = "0px";
  container.appendChild(obs);
  obstacles.push(obs);
}

function checkCollision(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function endGame() {
  gameRunning = false;
  gameOverDiv.style.display = "block";
  finalScoreText.textContent = `최종 점수: ${score}`;
  updateRanking(nickname, score);
  showRanking();
}

function restartGame() {
  location.reload();
}

function updateRanking(name, newScore) {
  let ranking = JSON.parse(localStorage.getItem("namul_ranking")) || [];
  ranking.push({ name, score: newScore });
  ranking.sort((a, b) => b.score - a.score);
  ranking = ranking.slice(0, 5);
  localStorage.setItem("namul_ranking", JSON.stringify(ranking));
}

function showRanking() {
  const ranking = JSON.parse(localStorage.getItem("namul_ranking")) || [];
  rankingList.innerHTML = "";
  ranking.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${entry.name} - ${entry.score}`;
    rankingList.appendChild(li);
  });
}

function gameLoop() {
  if (!gameRunning) return;

  velocityY += gravity;
  playerY += velocityY;

  if (playerY > 500) {
    playerY = 500;
    velocityY = 0;
    isJumping = false;
  }

  player.style.left = `${playerX}px`;
  player.style.bottom = `${playerY}px`;

  obstacles.forEach((obs, index) => {
    let bottom = parseInt(obs.style.bottom);
    obs.style.bottom = `${bottom + 5}px`;
    if (bottom > 600) {
      obs.remove();
      obstacles.splice(index, 1);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }

    const playerRect = player.getBoundingClientRect();
    const obsRect = obs.getBoundingClientRect();
    if (checkCollision(playerRect, obsRect)) {
      endGame();
    }
  });

  requestAnimationFrame(gameLoop);
}
