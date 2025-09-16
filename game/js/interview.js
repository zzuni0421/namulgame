const questions = [
  {
    text: "첫 번째 질문! 🌱 점심 메뉴로 뭘 고를래?",
    options: [
      { text: "나물 비빔밥", mood: "happy" },
      { text: "햄버거", mood: "angry" },
      { text: "라면", mood: "neutral" },
      { text: "초밥", mood: "crying" }
    ]
  },
  {
    text: "두 번째 질문! 😎 나물이 제일 좋아하는 계절은?",
    options: [
      { text: "봄 (쑥, 냉이 파티)", mood: "happy" },
      { text: "여름 (더워 죽겠음)", mood: "angry" },
      { text: "가을 (고사리 국밥 ㄱㄱ)", mood: "neutral" },
      { text: "겨울 (동치미 나물)", mood: "crying" }
    ]
  },
  {
    text: "마지막 질문! 🔥 면접에 임하는 각오는?",
    options: [
      { text: "나물왕 되겠습니다!", mood: "happy" },
      { text: "집에 가고 싶습니다", mood: "crying" },
      { text: "밥 먹으러 왔는데요", mood: "angry" },
      { text: "저 그냥 게스트인데요?", mood: "neutral" }
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
