import { tokenLogin } from "../js/gameAuth.js";

let score = 0;
let hardMode = false;
let speed = 1; // 기본 속도

window.addEventListener("DOMContentLoaded", async () => {
  // 로그인 확인
  const user = await tokenLogin();
  if (user.success && user.hardunlock === true) {
    document.getElementById("hardmode-btn").style.display = "block";
  }

  document.getElementById("hardmode-btn").addEventListener("click", () => {
    hardMode = true;
    speed = 2;
    alert("나물 줍기 하드모드 활성화!");
  });

  startGame();
});

function startGame() {
  const gameArea = document.getElementById("game-area");
  const scoreDisplay = document.getElementById("score");

  function spawnNamul() {
    const namul = document.createElement("div");
    namul.className = "namul";
    namul.style.left = "0px";
    namul.style.top = Math.random() * (gameArea.offsetHeight - 40) + "px";
    gameArea.appendChild(namul);

    const moveInterval = setInterval(() => {
      const left = parseInt(namul.style.left);
      namul.style.left = left + speed + "px";

      if (left > gameArea.offsetWidth) {
        clearInterval(moveInterval);
        namul.remove();
        score += hardMode ? 2 : 1;
        scoreDisplay.textContent = score;
      }
    }, 20);
  }

  setInterval(spawnNamul, hardMode ? 500 : 1000);
}
