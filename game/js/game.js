const gameArea = document.getElementById('game-area');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const infiniteModeCheckbox = document.getElementById('infinite-mode');
const langSelect = document.getElementById('lang-select');

let score = 0;
let time = 30;
let timerInterval;
let namuls = [];
let maxNamuls = 5;
let gameRunning = false;

// 언어 선택
langSelect.addEventListener('change', () => setLang(langSelect.value));

// 나물 생성
function spawnNamul() {
  if (!gameRunning) return;
  if (namuls.length >= maxNamuls) return;

  const namul = document.createElement('img');
  namul.src = '../../assets/namul.png';
  namul.className = 'namul';
  namul.style.left = Math.random() * (gameArea.clientWidth - 60) + 'px';
  namul.style.top = Math.random() * (gameArea.clientHeight - 60) + 'px';
  gameArea.appendChild(namul);
  namuls.push(namul);

  namul.addEventListener('click', () => {
    score += 1;
    updateScore();
    removeNamul(namul);
  });

  // 2~4초 후 사라짐
  setTimeout(() => removeNamul(namul), 2000 + Math.random() * 2000);
}

// 나물 제거
function removeNamul(namul) {
  const index = namuls.indexOf(namul);
  if (index > -1) namuls.splice(index, 1);
  if (namul.parentNode) namul.parentNode.removeChild(namul);
}

// 점수 갱신
function updateScore() {
  scoreEl.textContent = score;
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
  alert(`게임 종료! ${LANG[currentLang].score}: ${score}`);
}

// 게임 시작
function startGame() {
  score = 0;
  time = 30;
  gameRunning = true;
  updateScore();
  startTimer();

  // 나물 생성 반복
  const spawnInterval = setInterval(() => {
    if (!gameRunning && !infiniteModeCheckbox.checked) {
      clearInterval(spawnInterval);
      return;
    }
    spawnNamul();
  }, 800);
}

// 다시 시작 버튼
restartBtn.addEventListener('click', () => {
  // 기존 나물 제거
  namuls.forEach(n => n.parentNode.removeChild(n));
  namuls = [];
  startGame();
});

// 초기화
startGame();
setLang(currentLang);
