let score = 0;
let hardMode = false;
let speed = 1;
let spawnInterval;

const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const hardBtn = document.getElementById("hardmode-btn");

function startGame() {
  score = 0;
  scoreDisplay.textContent = score;
  clearInterval(spawnInterval);

  spawnInterval = setInterval(spawnNamul, hardMode ? 500 : 1000);
}

function spawnNamul() {
  const namul = document.createElement("div");
  namul.className = "namul";
  namul.style.left = "0px";
  gameArea.appendChild(namul);

  const moveInterval = setInterval(() => {
    let left = parseInt(namul.style.left);
    left += speed;
    namul.style.left = left + "px";

    if (left > gameArea.offsetWidth) {
      clearInterval(moveInterval);
      namul.remove();
      score += hardMode ? 2 : 1;
      scoreDisplay.textContent = score;
    }
  }, 20);
}

// --- 버튼 이벤트 ---
document.querySelectorAll(".time-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    startGame();
  });
});

hardBtn.addEventListener("click", () => {
  hardMode = !hardMode;
  speed = hardMode ? 2 : 1;
  hardBtn.textContent = hardMode ? "🔥 하드모드 중지" : "🔥 하드모드 시작";
  startGame();
});
