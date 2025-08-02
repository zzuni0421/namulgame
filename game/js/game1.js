import { db, collection, addDoc, getDocs, query, orderBy, limit } from "./firebase-config.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const retryBtn = document.getElementById("retryBtn");
const submitBtn = document.getElementById("submitScore");
const nicknameInput = document.getElementById("nicknameInput");
const rankingList = document.getElementById("rankingList");

let score = 0;
let gameOver = false;
const gravity = 0.6;
const jumpPower = -10;
const player = { x: 50, y: canvas.height - 30, width: 30, height: 30, dy: 0 };
const obstacle = { x: canvas.width, y: canvas.height - 50, width: 20, height: 50, speed: 4 };

function drawPlayer() {
  ctx.fillStyle = "#007acc";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacle() {
  ctx.fillStyle = "#ff4d4d";
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gameOver) return;

  player.dy += gravity;
  player.y += player.dy;

  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
  }

  obstacle.x -= obstacle.speed;
  if (obstacle.x + obstacle.width < 0) {
    obstacle.x = canvas.width;
    score++;
    scoreDisplay.innerText = `점수: ${score}`;
  }

  // 충돌 체크
  if (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  ) {
    gameOver = true;
    endGame();
  }

  drawPlayer();
  drawObstacle();
  requestAnimationFrame(update);
}

function endGame() {
  gameOverScreen.classList.remove("hidden");
  finalScore.innerText = `최종 점수: ${score}`;
  showRanking();
}

function resetGame() {
  score = 0;
  player.y = canvas.height - player.height;
  player.dy = 0;
  obstacle.x = canvas.width;
  gameOver = false;
  gameOverScreen.classList.add("hidden");
  scoreDisplay.innerText = "점수: 0";
  update();
}

function jump() {
  if (!gameOver && player.y + player.height >= canvas.height - 1) {
    player.dy = jumpPower;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

canvas.addEventListener("click", jump);
retryBtn.addEventListener("click", resetGame);

submitBtn.addEventListener("click", async () => {
  const nickname = nicknameInput.value.trim();
  if (nickname === "") {
    alert("닉네임을 입력하세요!");
    return;
  }

  try {
    await addDoc(collection(db, "jump_scores"), {
      nickname: nickname,
      score: score,
      timestamp: Date.now(),
    });
    alert("점수가 저장되었습니다!");
    showRanking();
  } catch (e) {
    alert("점수 저장에 실패했습니다.");
    console.error(e);
  }
});

async function showRanking() {
  rankingList.innerHTML = "";
  const q = query(collection(db, "jump_scores"), orderBy("score", "desc"), limit(5));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerText = `${data.nickname} - ${data.score}`;
    rankingList.appendChild(li);
  });
}

// 시작 시 랭킹 불러오기
showRanking();
update();
