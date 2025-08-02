import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// === Firebase 초기화 ===
const firebaseConfig = {
  apiKey: "AIzaSyDYd4Q3koWeOOmj6KakUZF4H0f_1dsoWBQ",
  authDomain: "jumpgame-f54ea.firebaseapp.com",
  projectId: "jumpgame-f54ea",
  storageBucket: "jumpgame-f54ea.appspot.com",
  messagingSenderId: "217451717931",
  appId: "1:217451717931:web:9f3cb2c933b76a36e143e7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// === DOM 요소 ===
const nicknameInput = document.getElementById("nicknameInput");
const startGameBtn = document.getElementById("startGameBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const gameSection = document.getElementById("gameSection");
const scoreDisplay = document.getElementById("scoreDisplay");
const restartBtn = document.getElementById("restartBtn");
const rankingList = document.getElementById("rankingList");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// === 전역 변수 ===
let currentUser = null;
let player, obstacle, score, isGameOver, animationId;

// === 로그인 이벤트 ===
googleLoginBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    currentUser = result.user;
    userInfo.textContent = `환영합니다, ${currentUser.displayName}님!`;
    googleLoginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    nicknameInput.style.display = "none";
  } catch (e) {
    alert("구글 로그인 실패: " + e.message);
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth);
  currentUser = null;
  userInfo.textContent = "";
  googleLoginBtn.style.display = "inline-block";
  logoutBtn.style.display = "none";
  nicknameInput.style.display = "inline-block";
});

// 로그인 상태 변화 감지
onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    userInfo.textContent = `환영합니다, ${user.displayName}님!`;
    googleLoginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    nicknameInput.style.display = "none";
  } else {
    currentUser = null;
    userInfo.textContent = "";
    googleLoginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    nicknameInput.style.display = "inline-block";
  }
});

// === 게임 시작 버튼 ===
startGameBtn.addEventListener("click", () => {
  const nickname = nicknameInput.value.trim();
  if (!nickname && !currentUser) {
    alert("닉네임을 입력하거나 구글 로그인 해주세요!");
    return;
  }
  startGame(nickname);
});

// === 게임 초기화 및 시작 함수 ===
function startGame(nickname) {
  player = { x: 50, y: 300, width: 50, height: 50, velocityY: 0, jumping: false };
  obstacle = { x: 800, y: 320, width: 20, height: 50, speed: 5 };
  score = 0;
  isGameOver = false;
  scoreDisplay.textContent = "점수: 0";
  gameSection.style.display = "block";
  restartBtn.style.display = "none";

  document.addEventListener("keydown", jumpHandler);
  animationId = requestAnimationFrame(() => updateGame(nickname));
}

// === 게임 업데이트 루프 ===
function updateGame(nickname) {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 점수 증가
  score++;
  scoreDisplay.textContent = `점수: ${score}`;

  // 중력 및 점프 처리
  player.velocityY += 1.5;
  player.y += player.velocityY;
  if (player.y > 300) {
    player.y = 300;
    player.jumping = false;
  }

  // 장애물 이동
  obstacle.x -= obstacle.speed;
  if (obstacle.x + obstacle.width < 0) {
    obstacle.x = 800;
    obstacle.speed += 0.3; // 난이도 점진 상승
  }

  // 충돌 체크
  if (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  ) {
    gameOver(nickname);
    return;
  }

  drawRect(ctx, player, "#3498db");
  drawRect(ctx, obstacle, "#e74c3c");

  animationId = requestAnimationFrame(() => updateGame(nickname));
}

// === 점프 처리 ===
function jumpHandler(e) {
  if ((e.code === "Space" || e.code === "ArrowUp") && !player.jumping) {
    player.velocityY = -20;
    player.jumping = true;
  }
}

// === 사각형 그리기 함수 ===
function drawRect(ctx, obj, color) {
  ctx.fillStyle = color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

// === 게임 오버 처리 ===
function gameOver(nickname) {
  isGameOver = true;
  cancelAnimationFrame(animationId);
  document.removeEventListener("keydown", jumpHandler);
  restartBtn.style.display = "inline-block";
  saveScore(nickname, score);
  loadRanking();
}

// === 다시하기 버튼 이벤트 ===
restartBtn.addEventListener("click", () => {
  gameSection.style.display = "none";
  restartBtn.style.display = "none";
  nicknameInput.value = "";
  scoreDisplay.textContent = "점수: 0";
});

// === 점수 저장 ===
function saveScore(nickname, score) {
  const userName = currentUser ? currentUser.displayName : nickname;
  addDoc(collection(db, "jump_scores"), {
    nickname: userName,
    score,
    timestamp: Date.now()
  }).catch((e) => {
    console.error("점수 저장 실패:", e);
  });
}

// === 랭킹 불러오기 ===
async function loadRanking() {
  const q = query(collection(db, "jump_scores"), orderBy("score", "desc"), limit(5));
  const querySnapshot = await getDocs(q);
  rankingList.innerHTML = "";
  querySnapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.nickname} - ${data.score}`;
    rankingList.appendChild(li);
  });
}
