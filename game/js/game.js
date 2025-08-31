import { tokenLogin } from "./gameAuth.js";

let score = 0;
let hardMode = false;
let speed = 1; // 기본 속도
let spawnInterval;

const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const hardBtn = document.getElementById("hardmode-btn");

window.addEventListener("DOMContentLoaded", async () => {
  const user = await tokenLogin();
  if (user.success && user.secretUnlock === "o") {
    hardBtn.style.display = "inline-block";
  }

  hardBtn.addEventListener("click", () => {
    hardMode = true;
    speed = 2; // 하드모드 속도 2배
    alert("나물 줍기 하드모드 활성화!");
  });

  startGame();
});

function startGame() {
  score = 0;
  scoreDisplay.textContent = score;
  gameArea.innerHTML = "";

  // 나물 스폰
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
      score += hardMode ? 2 : 1; // 점수 증가
      scoreDisplay.textContent = score;
    }
  }, 20);
}
