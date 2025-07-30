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

// 배경음악 요소
const bgm = document.getElementById("bgm");
const bgmToggle = document.getElementById("bgmToggle");
bgm.volume = 0.2; // 기본 볼륨

bgmToggle.addEventListener("click", () => {
  if (bgm.paused) {
    bgm.play();
    bgmToggle.textContent = "🔊 배경음 켜기/끄기";
  } else {
    bgm.pause();
    bgmToggle.textContent = "🔇 배경음 켜기/끄기";
  }
});

// 다국어 지원
let currentLang = "ko";
const langToggle = document.getElementById("langToggle");

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "ko" ? "en" : "ko";
  langToggle.textContent = `🌐 Language: ${currentLang === "ko" ? "한국어" : "English"}`;
  updateLanguage();
});

const translations = {
  ko: {
    nicknamePrompt: "닉네임을 입력하세요!",
    nicknameTaken: "이미 사용 중인 닉네임입니다!",
    welcome: (name) => `어서 와, ${name} 🌿`,
    timeLeft: (t) => `남은 시간: ${t}초`,
    infinite: "무한 모드 진행 중...",
    gameOver: (s) => `게임 종료! 점수: ${s}`,
    score: (s) => `점수: ${s}`,
    rankingError: "랭킹을 불러오는 중 오류가 발생했습니다.",
  },
  en: {
    nicknamePrompt: "Please enter your nickname!",
    nicknameTaken: "This nickname is already taken!",
    welcome: (name) => `Welcome, ${name} 🌿`,
    timeLeft: (t) => `Time left: ${t}s`,
    infinite: "Endless mode in progress...",
    gameOver: (s) => `Game over! Score: ${s}`,
    score: (s) => `Score: ${s}`,
    rankingError: "An error occurred while loading rankings.",
  }
};

function t(key, ...args) {
  const text = translations[currentLang][key];
  return typeof text === "function" ? text(...args) : text;
}

function updateLanguage() {
  if (nickname) {
    nicknameDisplay.textContent = t("welcome", nickname);
  }
  scoreDisplay.textContent = t("score", score);
  if (!isEndless) {
    timerDisplay.textContent = t("timeLeft", gameTime);
  } else {
    timerDisplay.textContent = t("infinite");
  }
}

submitBtn.addEventListener("click", async () => {
  const input = nicknameInput.value.trim();
  if (!input) return alert(t("nicknamePrompt"));
  const snapshot = await db.collection("nicknames").doc(input).get();
  if (snapshot.exists) {
    alert(t("nicknameTaken"));
    return;
  }
  nickname = input;
  await db.collection("nicknames").doc(nickname).set({
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  nicknameDisplay.textContent = t("welcome", nickname);
});

document.querySelectorAll(".modeBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!nickname) return alert(t("nicknamePrompt"));
    const mode = btn.dataset.time;
    startGame(mode);
  });
});

function startGame(mode) {
  gameArea.innerHTML = "";
  score = 0;
  isEndless = (mode === "infinite");
  updateLanguage();

  if (!isEndless) {
    gameTime = parseInt(mode);
    timerDisplay.textContent = t("timeLeft", gameTime);
    timerInterval = setInterval(() => {
      gameTime--;
      timerDisplay.textContent = t("timeLeft", gameTime);
      if (gameTime <= 0) endGame(mode);
    }, 1000);
  } else {
    timerDisplay.textContent = t("infinite");
  }

  if (bgm.paused) bgm.play();

  spawnLeaf();
}

function endGame(mode) {
  clearInterval(timerInterval);
  alert(t("gameOver", score));
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

document.querySelectorAll(".rankingBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const timeMode = btn.dataset.time;
    showRanking(timeMode);
  });
});

function updateScore() {
  scoreDisplay.textContent = t("score", score);
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
  
  let label = "";
  switch (mode) {
    case "10": label = "⏱ 10초 모드"; break;
    case "20": label = "⏱ 20초 모드"; break;
    case "30": label = "⏱ 30초 모드"; break;
    case "60": label = "⏱ 1분 모드"; break;
    case "infinite": label = "🌲 무한 모드"; break;
    default: label = "랭킹";
  }

  db.collection(path)
    .orderBy("score", "desc")
    .limit(5)
    .get()
    .then(snapshot => {
      rankingBoard.innerHTML = `<h3>🏆 ${label} 랭킹</h3>`;
      snapshot.forEach(doc => {
        const data = doc.data();
        rankingBoard.innerHTML += `<div>${data.nickname} : ${data.score}</div>`;
      });
    })
    .catch(err => {
      console.error("랭킹 불러오기 실패:", err);
      rankingBoard.innerHTML = `<p>${t("rankingError")}</p>`;
    });
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".rankingBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const timeMode = btn.dataset.time;
      showRanking(timeMode);
    });
  });
});

gameArea.addEventListener("click", () => {
  console.log("점프!");
});

function playBackgroundMusic() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioContext();

  const notes = [262, 294, 330, 349, 392, 440, 494]; // C D E F G A B (Hz)
  let index = 0;

  function playNote(freq, duration) {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'square'; // 8비트 느낌 나는 사각파
    osc.frequency.value = freq;

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime); // 볼륨 낮게 시작
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000); // 점점 줄어듬

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  }

  function playLoop() {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    playNote(notes[index], 300);
    index = (index + 1) % notes.length;

    setTimeout(playLoop, 350);
  }

  playLoop();

  // 리턴해서 필요 시 중지 가능하게
  return () => ctx.close();
}

// 실행해서 배경음 재생 시작
const stopBgm = playBackgroundMusic();
