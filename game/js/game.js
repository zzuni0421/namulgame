const mainMenu = document.getElementById('main-menu');
const gameContainer = document.getElementById('game-container');
const gameArea = document.getElementById('game-area');

const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');
const backIndexBtn = document.getElementById('back-index-btn');

const langSelect = document.getElementById('lang-select');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const timeBox = document.getElementById('time-box');

let score = 0;
let timeLeft = 0;
let timerInterval = null;
let gameRunning = false;
let infiniteMode = false;

const maxNamuls = 5;
const namuls = [];
const NAMUL_SIZE = 64;

// 언어 선택
langSelect.addEventListener('change', () => setLang(langSelect.value));

// --- 시간 버튼 클릭
document.querySelectorAll('.time-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.time;
    infiniteMode = (mode === "infinite");
    timeLeft = infiniteMode ? 0 : parseInt(mode, 10);

    mainMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    startGame();
  });
});

// --- 메인으로
backBtn.addEventListener('click', () => {
  endGame(false);
  gameContainer.style.display = 'none';
  mainMenu.style.display = 'block';
});

// --- index.html로 돌아가기
backIndexBtn.addEventListener('click', () => {
  window.location.href = "../../index.html";
});

// --- 다시 시작
restartBtn.addEventListener('click', () => startGame());

// --- Helpers
function updateScore(v = score) {
  score = v;
  scoreEl.textContent = score;
}

function removeNamul(el) {
  const idx = namuls.indexOf(el);
  if (idx >= 0) namuls.splice(idx, 1);
  if (el.parentNode) el.parentNode.removeChild(el);
}

function randomPos() {
  const maxX = gameArea.clientWidth  - NAMUL_SIZE;
  const maxY = gameArea.clientHeight - NAMUL_SIZE;
  return {
    x: Math.floor(Math.random() * (maxX + 1)),
    y: Math.floor(Math.random() * (maxY + 1))
  };
}

function spawnOne() {
  if (!gameRunning) return;
  if (namuls.length >= maxNamuls) return;

  let pos = randomPos();
  const el = document.createElement('img');
  el.src = '../../assets/namul.png';
  el.className = 'namul';
  el.style.left = pos.x + 'px';
  el.style.top  = pos.y + 'px';
  el._x = pos.x; el._y = pos.y;

  el.addEventListener('click', () => {
    updateScore(score + 1);
    removeNamul(el);
  });

  gameArea.appendChild(el);
  namuls.push(el);

  // 수명 2~4초
  el._ttl = setTimeout(() => removeNamul(el), 2000 + Math.random()*2000);
}

function spawnTick() {
  if (!gameRunning) return;
  spawnOne();
  setTimeout(spawnTick, 700);
}

function startGame() {
  endGame(false);
  updateScore(0);
  gameRunning = true;
  gameArea.innerHTML = "";
  namuls.length = 0;

  // 시간 표시
  if (infiniteMode) {
    timeBox.style.display = "none";
  } else {
    timeBox.style.display = "inline";
    timeEl.textContent = timeLeft;
    timerInterval = setInterval(() => {
      timeLeft--;
      timeEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        endGame(true);
      }
    }, 1000);
  }

  spawnTick();
}

function endGame(showAlert = true) {
  gameRunning = false;
  clearInterval(timerInterval);
  namuls.forEach(n => clearTimeout(n._ttl));
  namuls.length = 0;

  if (showAlert && !infiniteMode) {
    alert(`게임 종료! 점수: ${score}`);
  }
}

// 닉네임 등록
async function registerNickname(username) {
  const response = await fetch("https://script.google.com/macros/s/AKfycbzXrtDcnrSwrqVOnaiIl6Idj1PckOPMUS63QSP0GxATisbvC_QE_wBZdfoj5lNhFvFl0g/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "register",
      username: username
    })
  });
  return response.json(); // { success: true, message: "..."}
}

// 점수 저장
async function saveScore(username, score) {
  const response = await fetch("https://script.google.com/macros/s/AKfycbzXrtDcnrSwrqVOnaiIl6Idj1PckOPMUS63QSP0GxATisbvC_QE_wBZdfoj5lNhFvFl0g/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "saveScore",
      username: username,
      score: score
    })
  });
  return response.json();
}
