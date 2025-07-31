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

const nicknameInput = document.getElementById("nicknameInput");
const submitBtn = document.getElementById("submitBtn");
const nicknameDisplay = document.getElementById("nicknameDisplay");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("scoreDisplay");
const timerDisplay = document.getElementById("timerDisplay");
const bgm = document.getElementById("bgm");
const bgmToggle = document.getElementById("bgmToggle");
const rankingBoard = document.getElementById("rankingBoard");
let currentNickname = "";

bgm.volume = 0.2;
bgmToggle.addEventListener("click", () => {
  bgm.muted = !bgm.muted;
});

submitBtn.addEventListener("click", () => {
  const nick = nicknameInput.value.trim();
  if (nick) {
    currentNickname = nick;
    nicknameDisplay.textContent = `안녕, ${nick}`;
    document.getElementById("nicknameSection").style.display = "none";
  }
});

const modeButtons = document.querySelectorAll(".modeBtn");
modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const timeMode = btn.getAttribute("data-time");
    startGame(timeMode);
  });
});

const rankingButtons = document.querySelectorAll(".rankingBtn");
rankingButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const time = btn.getAttribute("data-time");
    showRanking(time);
  });
});

let score = 0;
let timer;
function startGame(mode) {
  score = 0;
  scoreDisplay.textContent = "점수: 0";
  timerDisplay.textContent = mode === "infinite" ? "무한" : `${mode}초`;
  gameArea.innerHTML = "";
  if (mode !== "infinite") {
    let seconds = parseInt(mode);
    timer = setInterval(() => {
      seconds--;
      timerDisplay.textContent = `${seconds}초`;
      if (seconds <= 0) {
        clearInterval(timer);
        endGame(mode);
      }
    }, 1000);
  }

  document.addEventListener("click", jump);
  spawnNamul();
}

function spawnNamul() {
  const namul = document.createElement("div");
  namul.className = "namul";
  namul.style.left = Math.random() * 90 + "%";
  namul.style.top = "90%";
  gameArea.appendChild(namul);
  namul.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = `점수: ${score}`;
    namul.remove();
    spawnNamul();
  });
}

function jump() {
  gameArea.style.transform = "translateY(-20px)";
  setTimeout(() => {
    gameArea.style.transform = "translateY(0)";
  }, 200);
}

function endGame(mode) {
  document.removeEventListener("click", jump);
  saveScore(mode);
}

function saveScore(mode) {
  if (!currentNickname) return;
  db.collection("rankings").add({
    nickname: currentNickname,
    score: score,
    timeMode: mode,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function showRanking(mode) {
  db.collection("rankings")
    .where("timeMode", "==", mode)
    .orderBy("score", "desc")
    .limit(10)
    .get()
    .then(snapshot => {
      rankingBoard.innerHTML = `<h3>${mode === "infinite" ? "무한" : mode + "초"} 랭킹</h3>`;
      snapshot.forEach(doc => {
        const data = doc.data();
        const entry = document.createElement("div");
        entry.textContent = `${data.nickname}: ${data.score}`;
        rankingBoard.appendChild(entry);
      });
    });
}
