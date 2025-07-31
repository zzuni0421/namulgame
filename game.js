document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");
  const nicknameSection = document.getElementById("nicknameSection");

  submitBtn.onclick = async () => {
    nicknameSection.style.display = "none";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyBIrOc0np-DUSdv2Fb7T8RZudMBVlmiyEk",
  authDomain: "namulgame-1f0b0.firebaseapp.com",
  projectId: "namulgame-1f0b0",
  storageBucket: "namulgame-1f0b0.appspot.com",
  messagingSenderId: "530134238906",
  appId: "1:530134238906:web:286bef2d6144441ddee483",
  measurementId: "G-WTWH1LG6SM"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let nickname = "";
let score = 0;
let gameInterval;
let timeLeft = 10;
let currentMode = "10";

const nicknameInput = document.getElementById("nicknameInput");
const submitBtn = document.getElementById("submitBtn");
const nicknameDisplay = document.getElementById("nicknameDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const timerDisplay = document.getElementById("timerDisplay");
const gameUI = document.getElementById("gameUI");
const gameArea = document.getElementById("gameArea");
const bgm = document.getElementById("bgm");

submitBtn.onclick = async () => {
  const value = nicknameInput.value.trim();
  if (!value) return alert("nickname의 값은 필수입니다.");

  const snapshot = await db.collection("players").doc(value).get();
  if (snapshot.exists) return alert("이미 사용 중인 닉네임입니다.");

  nickname = value;
  db.collection("players").doc(nickname).set({});

  nicknameDisplay.textContent = `좋은 하루, ${nickname}`;
  document.getElementById("nicknameSection").style.display = "none";
  gameUI.style.display = "block";
};

document.querySelectorAll(".modeBtn").forEach(btn => {
  btn.onclick = () => {
    const mode = btn.dataset.time;
    currentMode = mode;
    startGame(mode);
  };
});

document.querySelectorAll(".rankingBtn").forEach(btn => {
  btn.onclick = () => showRanking(btn.dataset.time);
});

document.getElementById("bgmToggle").onclick = () => {
  if (bgm.paused) {
    bgm.play();
  } else {
    bgm.pause();
  }
};

gameArea.onclick = () => {
  if (!gameInterval) return;
  score++;
  scoreDisplay.textContent = `현재 ${nickname}님의 점수는 ${score}점입니다.`;
  spawnNamul();
};

function startGame(mode) {
  score = 0;
  scoreDisplay.textContent = `점수 : 0점점`;
  timeLeft = mode === "infinite" ? Infinity : parseInt(mode);
  timerDisplay.textContent = mode === "infinite" ? "∞" : `${timeLeft}초`;
  gameInterval = setInterval(() => {
    if (mode !== "infinite") {
      timeLeft--;
      timerDisplay.textContent = `${timeLeft}초 남았어요!`;
      if (timeLeft <= 0) {
        endGame();
      }
    }
  }, 1000);
  spawnNamul();
}

function spawnNamul() {
  const namul = document.createElement("div");
  namul.className = "namul";
  namul.style.left = Math.random() * (gameArea.clientWidth - 50) + "px";
  namul.style.top = Math.random() * (gameArea.clientHeight - 50) + "px";
  gameArea.innerHTML = "";
  gameArea.appendChild(namul);
}

function endGame() {
  clearInterval(gameInterval);
  gameInterval = null;
  alert(`게임 종료! 점수: ${score}`);
  gameArea.innerHTML = "";

  const rankRef = db.collection("rankings").doc(currentMode);
  rankRef.get().then(doc => {
    let data = doc.exists ? doc.data() : {};
    data[nickname] = Math.max(score, data[nickname] || 0);
    rankRef.set(data);
  });
}

function showRanking(mode) {
  const board = document.getElementById("rankingBoard");
  board.innerHTML = `<h3>${mode}초 랭킹</h3>`;
  db.collection("rankings").doc(mode).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      const sorted = Object.entries(data).sort((a,b)=>b[1]-a[1]);
      sorted.forEach(([name, score]) => {
        board.innerHTML += `<div>${name}: ${score}</div>`;
      });
    } else {
      board.innerHTML += `<div>랭킹 없음</div>`;
    }
  });
}
  };
});
