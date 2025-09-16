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

let currentQ = 0;
const intro = document.getElementById("intro");
const questionScreen = document.getElementById("question");
const resultScreen = document.getElementById("result");

const qText = document.getElementById("qText");
const options = document.getElementById("options");
const face = document.getElementById("face");
const rText = document.getElementById("rText");

const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");

startBtn.onclick = () => {
  intro.classList.remove("active");
  questionScreen.classList.add("active");
  showQuestion();
};

retryBtn.onclick = () => {
  currentQ = 0;
  resultScreen.classList.remove("active");
  questionScreen.classList.add("active");
  showQuestion();
};

function showQuestion() {
  const q = questions[currentQ];
  qText.textContent = q.text;
  options.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.text;
    btn.onclick = () => handleAnswer(opt.mood);
    options.appendChild(btn);
  });
}

function handleAnswer(mood) {
  // 표정 바꾸기
  face.src = `../../assets/${mood}.png`;

  // 애니메이션
  face.style.animation = "popIn 0.5s ease";
  setTimeout(() => (face.style.animation = ""), 500);

  // 다음 질문 or 결과
  currentQ++;
  if (currentQ < questions.length) {
    setTimeout(showQuestion, 800);
  } else {
    setTimeout(() => {
      questionScreen.classList.remove("active");
      resultScreen.classList.add("active");
      rText.textContent = "🎉 합격입니다! 나물 회사에 어서 오세요 🌱";
    }, 1000);
  }
}
