// Firebase 초기화
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

// 전역 변수
let nickname = "";
let score = 0;

// 닉네임 중복 검사 및 저장
async function handleNickname() {
  nickname = prompt("닉네임을 입력하세요:");
  if (!nickname) return alert("닉네임이 필요해요!");

  const snapshot = await db.collection("nicknames").doc(nickname).get();
  if (snapshot.exists) {
    alert("이미 사용 중인 닉네임입니다. 다른 걸 써주세요!");
    return handleNickname(); // 재귀로 다시 받음
  }

  // 저장
  await db.collection("nicknames").doc(nickname).set({
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  document.getElementById("nicknameDisplay").textContent = `어서 와, ${nickname} 🌿`;
  document.getElementById("startButton").disabled = false;
}

// 게임 시작
function startGame() {
  document.getElementById("gameArea").innerHTML = "";
  score = 0;
  updateScore();

  spawnLeaves();
}

// 점수 업데이트
function updateScore() {
  document.getElementById("scoreDisplay").textContent = `점수: ${score}`;
}

// 나물 생성
function spawnLeaves() {
  const gameArea = document.getElementById("gameArea");

  for (let i = 0; i < 5; i++) {
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.top = `${Math.random() * 80 + 10}%`;
    leaf.style.left = `${Math.random() * 80 + 10}%`;

    leaf.addEventListener("click", () => {
      score += 1;
      updateScore();
      leaf.remove();

      // 새 나물 하나 추가
      setTimeout(() => {
        spawnLeaves(1);
      }, 500);
    });

    gameArea.appendChild(leaf);
  }
}

window.onload = () => {
  handleNickname();
  document.getElementById("startButton").addEventListener("click", () => {
    alert("게임이 실행 중입니다... (여기서 진짜 게임 시작!)");
    startGame();
  });
};
