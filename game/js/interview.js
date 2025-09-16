const startBtn = document.getElementById("start-btn");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");

let currentQuestion = 0;

const questions = [
  {
    q: "🧐 면접관: 자기소개 좀 해보세요!",
    a: [
      "저는 맨날 라면만 먹는 라면 학자입니다 🍜",
      "저는 하루 25시간 일하는 노예형 인간입니다 😭",
      "저는 사실 이 자리에 올 줄 몰랐습니다 😅"
    ]
  },
  {
    q: "💼 면접관: 우리 회사 지원 이유는?",
    a: [
      "솔직히 월급 때문이죠 💸",
      "저희 엄마가 하라고 했습니다 🙃",
      "제가 여기 CEO 될 거거든요 😎"
    ]
  },
  {
    q: "🔥 면접관: 스트레스는 어떻게 푸나요?",
    a: [
      "벽보고 소리 지릅니다 🧱",
      "게임에서 9999콤보를 찍습니다 🎮",
      "면접관님께 지금 풀고 있습니다 😏"
    ]
  },
  {
    q: "🥗 면접관: 점심 메뉴는 뭘 좋아하시나요?",
    a: [
      "사실 점심보다 야식이 더 중요합니다 🌙",
      "치킨 없인 못 삽니다 🍗",
      "밥 말고 나물 주세요 🌿"
    ]
  },
  {
    q: "⏰ 면접관: 지각을 하면 뭐라고 변명하시나요?",
    a: [
      "지구 자전이 빨라졌습니다 🌍",
      "버스랑 저랑 숨바꼭질 중이었습니다 🚌",
      "면접관님도 늦으셨잖아요? 😏"
    ]
  },
  {
    q: "📱 면접관: 스마트폰 배터리 1% 남았다면?",
    a: [
      "밈 저장하고 꺼집니다 😂",
      "배터리보다 제 인생이 먼저 꺼져요 🔋",
      "충전기 찾다가 면접 늦습니다 🤯"
    ]
  }
];

function showQuestion() {
  let q = questions[currentQuestion];
  questionEl.textContent = q.q;
  optionsEl.innerHTML = "";

  q.a.forEach(answer => {
    let btn = document.createElement("button");
    btn.textContent = answer;
    btn.classList.add("btn");
    btn.onclick = () => nextQuestion(answer);
    optionsEl.appendChild(btn);
  });
}

function nextQuestion(answer) {
  console.log("선택됨:", answer);

  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    endGame(answer);
  }
}

function endGame(lastAnswer) {
  questionEl.textContent = "🎉 인터뷰 끝!";
  optionsEl.innerHTML = `
    <p>당신의 마지막 멘트: <b>${lastAnswer}</b></p>
    <p>👉 결과: <b>${getFunnyResult()}</b></p>
  `;
  startBtn.style.display = "block";
  startBtn.textContent = "🔄 다시하기";
  currentQuestion = 0;
}

function getFunnyResult() {
  const results = [
    "축하합니다! 합격인데 출근은 내일 새벽 3시부터예요 ⏰",
    "불합격입니다! 하지만 저희 밴드 동아리 들어오실래요? 🎸",
    "합격 여부는 면접관이 점심 뭐 먹는지에 달렸습니다 🍔",
    "사실 이건 면접이 아니라 몰래카메라였습니다 📹",
    "합격! 근데 월급은 '밈 코인'으로 드립니다 💰😂"
  ];
  return results[Math.floor(Math.random() * results.length)];
}

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  showQuestion();
});
