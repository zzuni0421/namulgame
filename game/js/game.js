const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const hardModeBtn = document.getElementById('hardModeBtn');
const timeButtons = document.querySelectorAll('.timeBtn');

let score = 0;
let hardMode = false;
let spawnInterval = 2000;
let namulTimer;
let gameTime = 0;
let countdownTimer;

// 시작할 때 시간 선택
timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        gameTime = parseInt(btn.dataset.time);
        startGame();
    });
});

function startGame(){
    score = 0;
    scoreDisplay.textContent = `점수: ${score}`;
    clearBoard();
    clearInterval(namulTimer);
    clearInterval(countdownTimer);
    spawnInterval = hardMode ? 1000 : 2000;
    startSpawning();

    let remaining = gameTime;
    countdownTimer = setInterval(() => {
        remaining--;
        if(remaining <= 0){
            clearInterval(namulTimer);
            clearInterval(countdownTimer);
            alert(`시간 종료! 최종 점수: ${score}`);
        }
    }, 1000);
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

function clearBoard(){
    while(gameBoard.firstChild){
        gameBoard.removeChild(gameBoard.firstChild);
    }
}

hardModeBtn.addEventListener('click', ()=>{
    hardMode = !hardMode;
    hardModeBtn.textContent = hardMode ? "하드모드 중지" : "하드모드 시작";
    clearInterval(namulTimer);
    spawnInterval = hardMode ? 1000 : 2000;
    startSpawning();
});
