const player = document.getElementById("player");
const container = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const endBtn = document.getElementById("endBtn");
const gameOverDiv = document.getElementById("game-over");
const finalScoreText = document.getElementById("final-score");
const rankingList = document.getElementById("ranking-list");

let nickname = prompt("닉네임을 입력하세요:");
if (!nickname) nickname = "이름없음";

let playerX = 185;
let playerY = 100;
let velocityY = 0;
let gravity = 0.5;
let isJumping = false;
let score = 0;
let gameRunning = true;

document.addEventListener("keydown", (e) => {
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

function endGame() {
  gameRunning = false;
  gameOverDiv.style.display = "block";
  finalScoreText.textContent = `최종 점수: ${score}`;
  updateRanking(nickname, score);
  showRanking();
}

function restartGame() {
  location.reload(); // 걍 새로고침
}

function updateRanking(name, newScore) {
  let ranking = JSON.parse(localStorage.getItem("namul_ranking")) || [];
  ranking.push({ name, score: newScore });
  ranking.sort((a, b) => b.score - a.score);
  ranking = ranking.slice(0, 5); // 상위 5개만 저장
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

  score = Math.max(score, Math.floor(playerY));
  scoreDisplay.textContent = `Score: ${score}`;

  requestAnimationFrame(gameLoop);
}

gameLoop();
