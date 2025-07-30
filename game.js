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
let gameTime = 0;
let timerInterval;
let isEndless = false;

const nicknameInput = document.getElementById("nicknameInput");
const submitBtn = document.getElementById("submitBtn");
const nicknameDisplay = document.getElementById("nicknameDisplay");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("scoreDisplay");
const timerDisplay = document.getElementById("timerDisplay");
const rankingBoard = document.getElementById("rankingBoard");

submitBtn.addEventListener("click", async () => {
  const input = nicknameInput.value.trim();
  if (!input) return alert("닉네임을 입력하세요!");
  const snapshot = await db.collection("nicknames").doc(input).get();
  if (snapshot.exists) {
    alert("이미 사용 중인 닉네임입니다!");
    return;
  }
  nickname = input;
  await db.collection("nicknames").doc(nickname).set({
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  nicknameDisplay.textContent = `어서 와, ${nickname} 🌿`;
});

document.querySelectorAll(".modeBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!nickname) return alert("닉네임부터 저장하세요!");
    const mode = btn.dataset.time;
    startGame(mode);
  });
});

function startGame(mode) {
  gameArea.innerHTML = "";
  score = 0;
  isEndless = (mode === "infinite");
  updateScore();

  if (!isEndless) {
    gameTime = parseInt(mode);
    timerDisplay.textContent = `남은 시간: ${gameTime}초`;
    timerInterval = setInterval(() => {
      gameTime--;
      timerDisplay.textContent = `남은 시간: ${gameTime}초`;
      if (gameTime <= 0) endGame(mode);
    }, 1000);
  } else {
    timerDisplay.textContent = `무한 모드 진행 중...`;
  }

  spawnLeaf();
}

function endGame(mode) {
  clearInterval(timerInterval);
  alert(`게임 종료! 점수: ${score}`);
  if (nickname) {
    const path = isEndless ? "rank_infinite" : `rank_${mode}`;
    db.collection(path).add({
      nickname,
      score,
      playedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  showRanking(mode);
}

function updateScore() {
  scoreDisplay.textContent = `점수: ${score}`;
}

function spawnLeaf() {
  const leaf = document.createElement("div");
  leaf.className = "leaf";
  leaf.style.top = `${Math.random() * 90}%`;
  leaf.style.left = `${Math.random() * 90}%`;
  leaf.addEventListener("click", () => {
    score++;
    updateScore();
    leaf.remove();
    spawnLeaf();
  });
  gameArea.appendChild(leaf);
}

function showRanking(mode) {
  const path = (mode === "infinite") ? "rank_infinite" : `rank_${mode}`;
  db.collection(path)
    .orderBy("score", "desc")
    .limit(5)
    .get()
    .then(snapshot => {
      rankingBoard.innerHTML = `<h3>🏆 [${mode}] 랭킹</h3>`;
      snapshot.forEach(doc => {
        const data = doc.data();
        rankingBoard.innerHTML += `<div>${data.nickname} : ${data.score}</div>`;
      });
    });
}

// 모바일 터치 점프 구현 (아무 곳 터치 시)
gameArea.addEventListener("click", () => {
  // 향후 점프 애니메이션 넣고 싶을 때 확장 가능!
  console.log("점프!");
});
