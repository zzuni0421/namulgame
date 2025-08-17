const gameArea = document.getElementById('game-area');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const infiniteModeCheckbox = document.getElementById('infinite-mode');
const langSelect = document.getElementById('lang-select');
const infiniteLabel = document.getElementById('infinite-label');
const scoreLabel = document.getElementById('score-label');
const timeLabel = document.getElementById('time-label');
const timeButtons = document.querySelectorAll('.time-btn');

let score = 0;
let time = 30;
let timerInterval;
let namuls = [];
let maxNamuls = 5;
let gameRunning = false;

// 언어 선택
langSelect.addEventListener('change', () => setLang(langSelect.value));

// 시간 버튼 선택
timeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    time = parseInt(btn.dataset.time);
    timerEl.textContent = time;
  });
});

// 점수 갱신
function updateScore() {
  scoreEl.textContent = score;
}

// 나물 생성 (중복 위치 방지)
function spawnNamul() {
  if (!gameRunning) return;
  if (namuls.length >= maxNamuls) return;

  let x, y;
  let tries = 0;
  do {
    x = Math.random() * (gameArea.clientWidth - 60);
    y = Math.random() * (gameArea.clientHeight - 60);
    tries++;
  } while (namuls.some(n => Math.abs(n.x - x) < 60 && Math.abs(n.y - y) < 60) && tries < 10);

  const namul = document.createElement('img');
  namul.src = 'assets/namul.png';
  namul.className = 'namul';
  namul.style.left = x + 'px';
  namul.style.top = y + 'px';
  namul.x = x;
  namul.y = y;

  gameArea.appendChild(namul);
  namuls.push(namul);

  namul.addEventListener('click', () => {
    score += 1;
    updateScore();
    removeNamul(namul);
  });

  setTimeout(() => removeNamul(namul), 2000 + Math.random() * 2000);
}

function removeNamul(namul) {
  const index = namuls.indexOf(namul);
  if (index > -1) namuls.splice(index, 1);
  if (namul.parentNode) namul.parentNode.removeChild(namul);
}

// 타이머
function startTimer() {
  timerEl.textContent = time;
  timerInterval = setInterval(() => {
    if (!infiniteModeCheckbox.checked) {
      time -= 1;
      timerEl.textContent = time;
      if (time <= 0) endGame();
    }
  }, 1000);
}

// 게임 종료
function endGame() {
  gameRunning = false;
  clearInterval(timerInterval);
  alert(`${LANG[currentLang].score}: ${score} 🎉`);
}

// 게임 시작
function startGame() {
  // 기존 나물 제거
  namuls.forEach(n => n.parentNode.removeChild(n));
  namuls = [];

  score = 0;
  updateScore();

  gameRunning = true;
  startTimer();

  const spawnInterval = setInterval(() => {
    if (!gameRunning && !infiniteModeCheckbox.checked) {
      clearInterval(spawnInterval);
      return;
    }
    spawnNamul();
  }, 800);
}

// 다시 시작 버튼
restartBtn.addEventListener('click', startGame);

// 초기화
startGame();
setLang(currentLang);
