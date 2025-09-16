const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const interviewerDiv = document.getElementById("interviewer");
const questionP = document.getElementById("question");
const answersDiv = document.getElementById("answers");
const resultDiv = document.getElementById("result");
const bgm = document.getElementById("bgm");

const interviewers = [
  { name: "짜장면 철학자 🍜", normal: "인생은 면발과 같지… 길고 꼬불꼬불하다.", cute: "삐약삐약 🐤 귀엽지?" },
  { name: "파워포인트 광신도 📊", normal: "이 답변은… 슬라이드 32쪽에 있습니다.", cute: "냐옹~ 🐱 PPT 테마 어때용?" },
  { name: "헬창 면접관 🏋️", normal: "그 답변은 근손실이다!", cute: "사실 초코우유 좋아해요 ☺️" },
  { name: "미니멀리스트 🎨", normal: "…(말없이 응시한다)", cute: "꾸잉💕 낙서 그려왔어!" },
  { name: "개발자 밈 장인 👨‍💻", normal: "그건 버그다. 리팩토링 필요.", cute: ">_< 고생했어여~ ✨✨" }
];

const questions = [
  "자기소개를 해보세요!",
  "당신의 장점은 무엇인가요?",
  "이 회사에 지원한 이유는?",
  "팀워크에서 가장 중요한 건?",
  "마지막으로 하고 싶은 말은?"
];

const options = [
  "진심을 담아 대답한다 😎",
  "허세를 부린다 🤔",
  "웃긴 농담을 한다 🤡",
  "귀여운 척을 한다 🐰"
];

let currentInterviewer;

startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  gameArea.classList.remove("hidden");
  bgm.play();
  nextQuestion();
});

function nextQuestion() {
  currentInterviewer = interviewers[Math.floor(Math.random() * interviewers.length)];
  interviewerDiv.textContent = currentInterviewer.name;

  questionP.textContent = questions[Math.floor(Math.random() * questions.length)];

  answersDiv.innerHTML = "";
  options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => handleAnswer(option);
    answersDiv.appendChild(btn);
  });
}

function handleAnswer(option) {
  resultDiv.classList.remove("hidden");

  if (option.includes("귀여운")) {
    resultDiv.textContent = `${currentInterviewer.cute}`;
    document.body.style.background = "linear-gradient(120deg, #ffe1ff, #cafffb)";
  } else {
    resultDiv.textContent = `${currentInterviewer.normal}`;
    document.body.style.background = "linear-gradient(120deg, #ffd6e0, #ffe8a1)";
  }

  setTimeout(() => {
    resultDiv.classList.add("hidden");
    nextQuestion();
  }, 2500);
}
