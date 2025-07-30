const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const helpBtn = document.getElementById('help-btn');
const rankBtn = document.getElementById('rank-btn');
const gameContainer = document.getElementById('game-container');

// 모달 엘리먼트
const tutorialModal = document.getElementById('tutorial-modal');
const tutorialClose = document.getElementById('tutorial-close');
const rankingModal = document.getElementById('ranking-modal');
const rankingClose = document.getElementById('ranking-close');
const rankingList = document.getElementById('ranking-list');

// 모달 열기/닫기 함수
function openModal(modal) { modal.style.display = 'flex'; }
function closeModal(modal) { modal.style.display = 'none'; }

tutorialClose.onclick = () => closeModal(tutorialModal);
rankingClose.onclick = () => closeModal(rankingModal);
window.onclick = e => {
if (e.target === tutorialModal) closeModal(tutorialModal);
if (e.target === rankingModal) closeModal(rankingModal);
};

helpBtn.addEventListener('click', () => openModal(tutorialModal));
rankBtn.addEventListener('click', () => {
updateRankingList();
openModal(rankingModal);
});

// 게임 상태 변수
let gameInterval;
let score = 0;

startBtn.addEventListener('click', () => {
resetGame();
startGame();
});
resetBtn.addEventListener('click', () => resetGame());

function startGame() {
score = 0;
gameInterval = setInterval(() => {
// TODO: 실제 게임 로직 추가 (블록 이동/충돌 등)
score++;
gameContainer.textContent = Score: ${score};
}, 500);
}

function resetGame() {
clearInterval(gameInterval);
gameContainer.textContent = '';
}

// 게임 종료 후 점수 저장 및 랭킹 업데이트
function endGame() {
clearInterval(gameInterval);
const name = prompt('게임이 종료되었습니다. 닉네임을 입력하세요.');
if (!name) return;
saveScore(name, score);
}

function saveScore(name, score) {
const data = JSON.parse(localStorage.getItem('wsx-rank') || '[]');
data.push({ name, score });
data.sort((a, b) => b.score - a.score);
localStorage.setItem('wsx-rank', JSON.stringify(data.slice(0, 10))); // 상위 10명 저장
}

function updateRankingList() {
const data = JSON.parse(localStorage.getItem('wsx-rank') || '[]');
rankingList.innerHTML = '';
data.forEach(entry => {
const li = document.createElement('li');
li.textContent = ${entry.name}: ${entry.score};
rankingList.appendChild(li);
});
}

// 일정 조건에서 게임 종료 호출 (임시)
setTimeout(() => endGame(), 10000); // 10초 후 자동 종료
