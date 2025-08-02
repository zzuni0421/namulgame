import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, get, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYd4Q3koWeOOmj6KakUZF4H0f_1dsoWBQ",
  authDomain: "jumpgame-f54ea.firebaseapp.com",
  databaseURL: "https://jumpgame-f54ea-default-rtdb.firebaseio.com",
  projectId: "jumpgame-f54ea",
  storageBucket: "jumpgame-f54ea.appspot.com",
  messagingSenderId: "217451717931",
  appId: "1:217451717931:web:9f3cb2c933b76a36e143e7"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const restartButton = document.getElementById("restartButton");
const rankingList = document.getElementById("rankingList");

let player, obstacle, score, isGameOver, animationId;

function startGame() {
  const nickname = document.getElementById("nickname").value.trim();
  if (!nickname) return alert("닉네임을 입력해주세요!");

  player = { x: 50, y: 300, width: 50, height: 50, velocityY: 0, jumping: false };
  obstacle = { x: 800, y: 320, width: 20, height: 50, speed: 5 };
  score = 0;
  isGameOver = false;
  restartButton.style.display = "none";

  document.addEventListener("keydown", jump);
  requestAnimationFrame(update);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 점수 증가
  score++;
  scoreDisplay.innerText = `점수: ${score}`;

  // 중력 적용
  player.velocityY += 1.5;
  player.y += player.velocityY;
  if (player.y > 300) {
    player.y = 300;
    player.jumping = false;
  }

  // 장애물 이동
  obstacle.x -= obstacle.speed;
  if (obstacle.x + obstacle.width < 0) {
    obstacle.x = 800;
    obstacle.speed += 0.5; // 난이도 증가
  }

  // 충돌 체크
  if (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  ) {
    gameOver();
    return;
  }

  drawRect(player, "#3498db");
  drawRect(obstacle, "#e74c3c");

  animationId = requestAnimationFrame(update);
}

function jump(e) {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (!player.jumping) {
      player.velocityY = -20;
      player.jumping = true;
    }
  }
}

function drawRect(obj, color) {
  ctx.fillStyle = color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function gameOver() {
  cancelAnimationFrame(animationId);
  isGameOver = true;
  document.removeEventListener("keydown", jump);
  restartButton.style.display = "inline-block";

  const nickname = document.getElementById("nickname").value.trim();
  if (nickname) saveScore(nickname, score);
  loadRanking();
}

function restartGame() {
  startGame();
}

function saveScore(nickname, score) {
  const scoresRef = ref(db, "scores");
  const newScoreRef = push(scoresRef);
  set(newScoreRef, { nickname, score });
}

function loadRanking() {
  const scoresRef = query(ref(db, "scores"), orderByChild("score"), limitToLast(5));
  get(scoresRef).then(snapshot => {
    const items = [];
    snapshot.forEach(child => items.push(child.val()));
    items.sort((a, b) => b.score - a.score);
    rankingList.innerHTML = items.map(i => `<li>${i.nickname}: ${i.score}</li>`).join("");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("gameContainer").style.display = "none";
  restartButton.style.display = "none";

  document.querySelector("button").addEventListener("click", () => {
    document.getElementById("gameContainer").style.display = "block";
  });
});
