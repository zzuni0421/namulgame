import { tokenLogin } from './gameAuth.js';

const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const hardModeBtn = document.getElementById('hardModeBtn');

let score = 0;
let hardMode = false;
let spawnInterval = 2000;
let namulTimer;

async function initGame() {
    await tokenLogin(); // 자동 로그인 후 시작
    startSpawning();
}

function startSpawning() {
    namulTimer = setInterval(spawnNamul, spawnInterval);
}

function spawnNamul() {
    const namul = document.createElement('div');
    namul.classList.add('namul');

    const boardWidth = gameBoard.clientWidth - 40;
    const boardHeight = gameBoard.clientHeight - 40;

    const x = Math.random() * boardWidth;
    const y = Math.random() * boardHeight;

    namul.style.left = `${x}px`;
    namul.style.top = `${y}px`;

    namul.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = `점수: ${score}`;
        gameBoard.removeChild(namul);
    });

    gameBoard.appendChild(namul);

    // 하드모드에서는 일정 시간 후 자동 제거
    if(hardMode){
        setTimeout(()=> {
            if(gameBoard.contains(namul)) gameBoard.removeChild(namul);
        }, spawnInterval);
    }
}

hardModeBtn.addEventListener('click', ()=>{
    hardMode = !hardMode;
    hardModeBtn.textContent = hardMode ? "하드모드 중지" : "하드모드 시작";
    clearInterval(namulTimer);
    spawnInterval = hardMode ? 1000 : 2000;
    startSpawning();
});

document.addEventListener('DOMContentLoaded', initGame);
