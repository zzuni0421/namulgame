let nickname = "";
let score = 0;

// 닉네임 저장 로직
document.getElementById("submitBtn").addEventListener("click", async () => {
  const inputEl = document.getElementById("nicknameInput");
  const nicknameValue = inputEl.value.trim();

  if (!nicknameValue) {
    alert("닉네임을 입력해주세요!");
    return;
  }

  const snapshot = await db.collection("nicknames").doc(nicknameValue).get();
  if (snapshot.exists) {
    alert("이미 사용 중인 닉네임입니다.");
    return;
  }

  await db.collection("nicknames").doc(nicknameValue).set({
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  nickname = nicknameValue;
  document.getElementById("nicknameDisplay").textContent = `어서 와, ${nickname} 🌿`;
  document.getElementById("startButton").disabled = false;

  inputEl.style.display = "none";
  document.getElementById("submitBtn").style.display = "none";
});

// 게임 시작
document.getElementById("startButton").addEventListener("click", () => {
  startGame();
});

function startGame() {
  score = 0;
  updateScore();
  document.getElementById("gameArea").innerHTML = "";

  spawnLeaves(5);

  // 모바일에서도 점프 감지
  document.getElementById("gameArea").addEventListener("click", () => {
    score += 1;
    updateScore();
  });
}

// 점수 표시
function updateScore() {
  document.getElementById("scoreDisplay").textContent = `점수: ${score}`;
}

// 나물 생성 함수
function spawnLeaves(count = 1) {
  const gameArea = document.getElementById("gameArea");

  for (let i = 0; i < count; i++) {
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.top = `${Math.random() * 80 + 10}%`;
    leaf.style.left = `${Math.random() * 80 + 10}%`;

    leaf.addEventListener("click", (e) => {
      e.stopPropagation(); // 게임판 클릭과 겹치지 않게
      score += 1;
      updateScore();
      leaf.remove();
      spawnLeaves(1);
    });

    gameArea.appendChild(leaf);
  }
}
