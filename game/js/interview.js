let questions = [
  "자기소개를 해주세요.",
  "우리 회사에 지원한 이유는?",
  "본인의 장점은 무엇인가요?",
  "팀 프로젝트에서 갈등이 생기면 어떻게 하시나요?",
  "스트레스를 어떻게 해소하시나요?",
  "마지막으로 하고 싶은 말은?"
];

let like = 50;
let stress = 0;
let currentQ = 0;

function showQuestion() {
  if (currentQ >= questions.length) {
    endGame();
    return;
  }
  const chat = document.getElementById("chat");
  chat.innerHTML += `<p class="typewriter">👔 면접관: ${questions[currentQ]}</p>`;
}

function submitAnswer() {
  const ans = document.getElementById("answer").value.trim();
  if (!ans) return;

  const chat = document.getElementById("chat");
  chat.innerHTML += `<p>🧑 나: ${ans}</p>`;
  document.getElementById("answer").value = "";

  // 랜덤 반응
  const face = document.getElementById("face");
  let reaction = Math.random();

  if (ans.includes("나물")) {
    chat.innerHTML += `<p class="typewriter">👔 면접관: ...나물을 좋아한다고요? 저도요! 감동입니다 😭</p>`;
    face.src = "assets/img/crying.png";
    like += 20;
  } else if (reaction > 0.6) {
    chat.innerHTML += `<p class="typewriter">👔 면접관: 좋습니다. 계속 이야기해보죠.</p>`;
    face.src = "assets/img/happy.png";
    like += 10;
  } else if (reaction > 0.3) {
    chat.innerHTML += `<p class="typewriter">👔 면접관: 음... 조금 아쉽군요.</p>`;
    face.src = "assets/img/neutral.png";
    stress += 5;
  } else {
    chat.innerHTML += `<p class="typewriter">👔 면접관: 이런 답변은 별로군요.</p>`;
    face.src = "assets/img/angry.png";
    stress += 15;
    face.classList.add("shake");
    setTimeout(() => face.classList.remove("shake"), 300);
  }

  updateStats();
  currentQ++;
  setTimeout(showQuestion, 1500);
}

function updateStats() {
  document.getElementById("like").value = like;
  document.getElementById("stress").value = stress;

  if (like >= 100) {
    endGame("pass");
  } else if (stress >= 100) {
    endGame("fail");
  }
}

function endGame(result) {
  const chat = document.getElementById("chat");
  const face = document.getElementById("face");

  if (result === "pass") {
    chat.innerHTML += `<h2>🎉 합격! 면접관이 당신을 뽑았습니다!</h2>`;
    face.src = "assets/img/happy.png";
  } else if (result === "fail") {
    chat.innerHTML += `<h2>💀 불합격... 면접관이 화나서 퇴장했습니다.</h2>`;
    face.src = "assets/img/angry.png";
  } else {
    chat.innerHTML += `<h2>📝 면접이 종료되었습니다. 수고하셨습니다!</h2>`;
    face.src = "assets/img/neutral.png";
  }
  document.getElementById("input").style.display = "none";
}

window.onload = showQuestion;
