const character = document.getElementById('character');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const restartButton = document.getElementById('restart');

let isJumping = false;
let gravity = 0.5;
let velocity = 0;
let position = 0;
let score = 0;
let obstacleSpeed = 5;
let intervalId;

function jump() {
  if (isJumping) return;
  isJumping = true;
  velocity = -25;
}

function startGame() {
  position = 0;
  velocity = 0;
  score = 0;
  obstacleSpeed = 5;
  obstacle.style.right = '-50px';
  obstacle.style.display = 'block';
  character.style.bottom = '0px';
  gameOverDisplay.style.display = 'none';
  intervalId = setInterval(updateGame, 20);
}

function updateGame() {
  velocity += gravity;
  position += velocity;
  if (position < 0) {
    position = 0;
    isJumping = false;
  }
  character.style.bottom = position + 'px';

  let obstacleRight = parseInt(obstacle.style.right);
  obstacleRight += obstacleSpeed;
  if (obstacleRight > window.innerWidth + 50) {
    obstacleRight = -50;
    score++;
    scoreDisplay.innerText = `점수: ${score}`;
    if (score % 10 === 0) {
      obstacleSpeed += 1;
    }
  }
  obstacle.style.right = obstacleRight + 'px';

  if (checkCollision()) {
    clearInterval(intervalId);
    gameOverDisplay.style.display = 'block';
    obstacle.style.display = 'none';
  }
}

function checkCollision() {
  const charRect = character.getBoundingClientRect();
  const obsRect = obstacle.getBoundingClientRect();
  return !(charRect.right < obsRect.left ||
           charRect.left > obsRect.right ||
           charRect.bottom < obsRect.top ||
           charRect.top > obsRect.bottom);
}

restartButton.addEventListener('click', startGame);
window.addEventListener('click', jump);

document.addEventListener('DOMContentLoaded', () => {
  startGame();
});
