// --- DOM
const mainMenu = document.getElementById('main-menu');
const gameContainer = document.getElementById('game-container');
const gameArea = document.getElementById('game-area');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');

const langSelect = document.getElementById('lang-select');
const timeButtons = document.querySelectorAll('.time-btn');
const infiniteModeCheckbox = document.getElementById('infinite-mode');

const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');

// --- State
let score = 0;
let time = 30;
let timerInterval = null;
let spawnInterval = null;
let gameRunning = false;

const maxNamuls = 5;      // 동시 최대
const namuls = [];        // 현재 DOM 참조 저장
const NAMUL_SIZE = 64;    // px

// --- Lang
langSelect.addEventListener('change', () => setLang(langSelect.value));

// --- Time selection
timeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    time = parseInt(btn.dataset.time, 10);
    timerEl.textContent = time;
    // 선택된 버튼 표시(선택감)
    timeButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// --- Menu -> Game
startBtn.addEventListener('click', () => {
  mainMenu.style.display = 'none';
  gameContainer.style.display = 'block';
  startGame();
});

// --- Back to menu
backBtn.addEventListener('click', () => {
  endGame(false); // 점수 알림 없이 종료
  gameContainer.style.display = 'none';
  mainMenu.style.display = 'block';
});

// --- Restart
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
    x: Math.max(0, Math.floor(Math.random() * (maxX + 1))),
    y: Math.max(0, Math.floor(Math.random() * (maxY + 1)))
  };
}

// 겹침 방지: 기존 나물과 56px 이내면 재시도
function spawnOne() {
  if (!gameRunning) return;
  if (namuls.length >= maxNamuls) return;

  let tries = 0;
  let pos;
  do {
    pos = randomPos();
    tries++;
  } while (
    namuls.some(n => Math.abs(n._x - pos.x) < 56 && Math.abs(n._y - pos.y) < 56) &&
    tries < 12
  );

  const el = document.createElement('img');
  el.draggable = false;
  el.src = 'assets/namul.png';
  el.className = 'namul';
  el.style.left = pos.x + 'px';
  el.style.top  = pos.y + 'px';
  el._x = pos.x; el._y = pos.y;

  const clickHandler = () => {
    updateScore(score + 1);
    removeNamul(el);
  };

  el.addEventListener('click', clickHandler, { passive: true });
  el.addEventListener('touchstart', (e)=>{ e.preventDefault(); clickHandler(); }, { passive:false });

  gameArea.appendChild(el);
  namuls.push(el);

  // 수명: 2~4초
  el._ttl = setTimeout(() => removeNamul(el), 2000 + Math.random()*2000);
}

// “항상 5개 유지” 토핑 루프
function spawnTick() {
  if (!gameRunning) return;
  while (namuls.length < maxNamuls) spawnOne();
}

// --- Timer
function startTimer() {
  clearInterval(timerInterval);
  timerEl.textContent = time;
  timerInterval = setInterval(() => {
    if (infiniteModeCheckbox.checked) return;
    time -= 1;
    timerEl.textContent = time;
    if (time <= 0) endGame(true);
  }, 1000);
}

// --- Game lifecycle
function startGame() {
  // 정리
  clearInterval(timerInterval);
  clearInterval(spawnInterval);
  namuls.splice(0).forEach(n => { clearTimeout(n._ttl); removeNamul(n); });

  // 초기화
  updateScore(0);
  if (!infiniteModeCheckbox.checked && !Number.isFinite(time)) time = 30;
  timerEl.textContent = time;

  gameRunning = true;
  startTimer();

  // 300ms마다 검사해서 5개 유지 (짧게 돌려도 부하 적음)
  spawnInterval = setInterval(spawnTick, 300);
  // 즉시 한 번 채워주기
  spawnTick();
}

function endGame(showAlert = true) {
  if (!gameRunning) return;
  gameRunning = false;

  clearInterval(timerInterval);
  clearInterval(spawnInterval);

  // 잔여 나물 제거
  namuls.splice(0).forEach(n => { clearTimeout(n._ttl); removeNamul(n); });

  if (showAlert && !infiniteModeCheckbox.checked) {
    alert(`${LANG[currentLang].score}: ${score} 🎉`);
  }
}

// --- First paint
setLang(currentLang);
timerEl.textContent = time;
