// IndexedDB 설정
let db;
const request = indexedDB.open("WritingChallengeDB", 1);

request.onupgradeneeded = (e) => {
  db = e.target.result;
  if (!db.objectStoreNames.contains("entries")) {
    db.createObjectStore("entries", { keyPath: "date" });
  }
};

request.onsuccess = (e) => {
  db = e.target.result;
  loadStats();
};

request.onerror = () => alert("IndexedDB 로드 오류");

// 주제 랜덤 생성
const topics = [
  "오늘 가장 기억에 남는 순간은?",
  "나를 웃게 만든 일 한 가지를 써보세요.",
  "요즘 내가 집중하고 있는 것은?",
  "누군가에게 감사했던 일을 써보세요.",
  "최근 본 영화나 드라마에서 인상 깊었던 장면은?"
];

const topicEl = document.getElementById("topic");
topicEl.textContent = "주제: " + topics[Math.floor(Math.random() * topics.length)];

const textArea = document.getElementById("userText");
const charCount = document.getElementById("charCount");
const feedback = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const commentEl = document.getElementById("comment");
const xpEl = document.getElementById("xp");
const streakEl = document.getElementById("streak");

textArea.addEventListener("input", () => {
  charCount.textContent = `${textArea.value.length} / 200자`;
});

document.getElementById("submitBtn").addEventListener("click", () => {
  const text = textArea.value.trim();
  if (text.length < 50) {
    alert("50자 이상 작성해 주세요!");
    return;
  }

  const today = new Date().toLocaleDateString("ko-KR");
  const xpGain = Math.floor(Math.random() * 20) + 10;
  const stars = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
  const rating = stars[Math.floor(Math.random() * stars.length)];
  const comments = [
    "감성이 풍부하네요!",
    "짧지만 임팩트 있어요!",
    "문장 구성이 깔끔해요!",
    "표현력이 좋아요!",
    "진심이 느껴져요!"
  ];
  const comment = comments[Math.floor(Math.random() * comments.length)];

  const entry = { date: today, text, rating, comment, xpGain };

  const tx = db.transaction("entries", "readwrite");
  const store = tx.objectStore("entries");
  store.put(entry);
  tx.oncomplete = () => {
    showFeedback(rating, comment);
    updateStats(xpGain);
  };
});

function showFeedback(rating, comment) {
  feedback.classList.remove("hidden");
  scoreEl.textContent = rating;
  commentEl.textContent = comment;
}

// streak / XP 관리
function loadStats() {
  const tx = db.transaction("entries", "readonly");
  const store = tx.objectStore("entries");
  const request = store.getAll();

  request.onsuccess = () => {
    const entries = request.result;
    const xp = entries.reduce((acc, e) => acc + e.xpGain, 0);
    xpEl.textContent = xp;

    // 연속 streak 계산
    const days = entries.map(e => e.date);
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      if (days.includes(d.toLocaleDateString("ko-KR"))) streak++;
      else break;
    }
    streakEl.textContent = streak;
  };
}

function updateStats(xpGain) {
  loadStats();
  textArea.disabled = true;
  document.getElementById("submitBtn").disabled = true;
}
