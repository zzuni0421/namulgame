document.addEventListener("DOMContentLoaded", () => {
  // DOM 요소들 잡기
  const nicknameSection = document.getElementById("nicknameSection");
  const nicknameInput = document.getElementById("nicknameInput");
  const submitBtn = document.getElementById("submitBtn");

  const gameUI = document.getElementById("gameUI");
  const timerDisplay = document.getElementById("timerDisplay");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const gameArea = document.getElementById("gameArea");
  const replayBtn = document.getElementById("replayBtn");
  const bgmToggle = document.getElementById("bgmToggle");
  const bgm = document.getElementById("bgm");

  let nickname = "";
  let score = 0;
  let timeLeft = 0;
  let currentMode = null;
  let gameInterval = null;

  // 닉네임 제출
  submitBtn.onclick = () => {
    const val = nicknameInput.value.trim();
    if (!val) {
      alert("닉네임을 입력해주세요!");
      return;
    }
    nickname = val;

    nicknameSection.style.display = "none";
    gameUI.style.display = "block";

    scoreDisplay.textContent = `점수: 0점`;
    timerDisplay.textContent = `시간: 0초`;
  };

  // 모드 버튼들 이벤트
  document.querySelectorAll(".modeBtn").forEach((btn) => {
    btn.onclick = () => {
      if (!nickname) {
        alert("닉네임을 먼저 입력하세요!");
        return;
      }

      currentMode = btn.dataset.time;
      startGame(currentMode);
    };
  });

  // 다시하기 버튼
  replayBtn.onclick = () => {
    if (!currentMode) return;
    startGame(currentMode);
    replayBtn.style.display = "none";
  };

  // BGM 토글
  bgmToggle.onclick = () => {
    if (bgm.paused) {
      bgm.play();
      bgmToggle.textContent = "🔈 BGM 일시정지";
    } else {
      bgm.pause();
      bgmToggle.textContent = "🔊 BGM";
    }
  };

  // 게임 시작 함수
  function startGame(mode) {
    score = 0;
    timeLeft = mode === "infinite" ? Infinity : parseInt(mode, 10);

    gameArea.innerHTML = "";
    scoreDisplay.textContent = `점수: 0점`;
    timerDisplay.textContent = mode === "infinite" ? "시간: 무한" : `시간: ${timeLeft}초`;

    // 나물 생성
    spawnNamul();

    // 타이머 초기화
    if (gameInterval) clearInterval(gameInterval);
    if (mode !== "infinite") {
      gameInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `시간: ${timeLeft}초`;

        if (timeLeft <= 0) {
          clearInterval(gameInterval);
          gameOver();
        }
      }, 1000);
    } else {
      // 무한 모드에선 시간 안 줄임
      gameInterval = null;
    }
  }

  // 나물 생성 함수
  function spawnNamul() {
    gameArea.innerHTML = "";
    const namul = document.createElement("div");
    namul.className = "namul";

    // 위치 랜덤 설정 (gameArea 크기에 맞게)
    const maxX = gameArea.clientWidth - 50;
    const maxY = gameArea.clientHeight - 50;
    namul.style.position = "absolute";
    namul.style.left = Math.random() * maxX + "px";
    namul.style.top = Math.random() * maxY + "px";

    gameArea.appendChild(namul);
  }

  // 게임영역 클릭 - 나물 클릭 시 점수 증가
  gameArea.onclick = (e) => {
    if (!e.target.classList.contains("namul")) return;
    score++;
    scoreDisplay.textContent = `점수: ${score}점`;
    spawnNamul();
  };

  // 게임 종료
  function gameOver() {
    alert(`게임 종료! ${nickname}님의 점수는 ${score}점입니다!`);
    replayBtn.style.display = "inline-block";
  }
});

// DOMContentLoaded 내부
const backBtn = document.createElement("button");
backBtn.id = "backToMainBtn";
backBtn.textContent = "↩️ 메인으로";
backBtn.style.position = "fixed";
backBtn.style.top = "10px";
backBtn.style.left = "10px";
backBtn.style.zIndex = "1000";
document.body.appendChild(backBtn);

backBtn.onclick = () => {
  window.location.href = "../../index.html";
};

};
