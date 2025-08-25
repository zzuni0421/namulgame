import { tokenLogin } from "./frontend.js";

let score = 0;
let hardMode = false;
let speed = 1; // 기본 속도

window.addEventListener("DOMContentLoaded", async () => {
  // 하드모드 체크
  const user = await tokenLogin();
  if (user.success && user.hardunlock === true) {
    document.getElementById("hardBtn").style.display = "block";
  }

  document.getElementById("hardBtn").addEventListener("click", () => {
    hardMode = true;
    speed = 2; // 하드모드에서는 2배 빠르게
    alert("나물 줍기 하드모드 활성화!");
  });

  startGame();
});

function startGame() {
  const gameArea = document.getElementById("gameArea");

  function spawnNamul() {
    const namul = document.createElement("div");
    namul.className = "namul";
    namul.style.left = "0px";
    gameArea.appendChild(namul);

    const moveInterval = setInterval(() => {
      const left = parseInt(namul.style.left);
      namul.style.left = left + speed + "px";
      if (left > gameArea.offsetWidth) {
        clearInterval(moveInterval);
        namul.remove();
        score += hardMode ? 2 : 1; // 하드모드 점수 2점
        document.getElementById("scoreDisplay").textContent = `점수: ${score}`;
      }
    }, 20);
  }

  setInterval(spawnNamul, hardMode ? 500 : 1000); // 하드모드에서는 나물이 2배 빠르게 출현
}
