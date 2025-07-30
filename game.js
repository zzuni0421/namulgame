document.getElementById("submitBtn").addEventListener("click", async () => {
  const nicknameInput = document.getElementById("nicknameInput");
  const nickname = nicknameInput.value.trim();

  if (!nickname) {
    alert("닉네임을 입력해주세요!");
    return;
  }

  try {
    // 🔍 중복 확인
    const snapshot = await db.collection("nicknameList")
      .where("nickname", "==", nickname)
      .get();

    if (!snapshot.empty) {
      alert("이미 사용 중인 닉네임입니다. 다른 걸로 해주세요.");
      return;
    }

    // ✅ 중복 아니면 저장
    await db.collection("nicknameList").add({ nickname: nickname });

    alert("닉네임이 성공적으로 등록되었습니다!");
    nicknameInput.value = "";

    // 🎮 여기에 게임 시작 로직 연결
    startGame(nickname);

  } catch (error) {
    console.error("닉네임 처리 중 오류:", error);
    alert("오류가 발생했습니다. 콘솔 확인!");
  }
});

// 🎮 게임 시작 함수 - 원하는 게임 시작 로직 여기에
function startGame(nickname) {
  const body = document.body;
  body.innerHTML = `
    <h2>어서 와, ${nickname}!</h2>
    <p>나물게임이 시작됩니다... 🍃</p>
    <button onclick="play()">게임 시작!</button>
  `;
}

// 🎮 실제 게임 플레이 함수 - 자유롭게 수정!
function play() {
  alert("게임이 실행 중입니다... (여기서 진짜 게임 시작!)");
}

