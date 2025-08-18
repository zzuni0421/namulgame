const translations = {
  ko: {
    title: "🌱 나물 줍기",
    timeSelect: "시간 선택",
    backIndexBtn: "메인으로",
    scoreLabel: "점수:",
    restartBtn: "다시 시작",
    backBtn: "처음부터",
    timeLabel: "시간:"
  },
  en: {
    title: "🌱 Namul Picking",
    timeSelect: "Select Time",
    backIndexBtn: "Back to Main",
    scoreLabel: "Score:",
    restartBtn: "Restart",
    backBtn: "Back to Start",
    timeLabel: "Time:"
  },
  ja: {
    title: "🌱 山菜取り",
    timeSelect: "時間を選択",
    backIndexBtn: "メインへ",
    scoreLabel: "スコア:",
    restartBtn: "リスタート",
    backBtn: "最初から",
    timeLabel: "時間:"
  },
  zh: {
    title: "🌱 采野菜游戏",
    timeSelect: "选择时间",
    backIndexBtn: "回到主页",
    scoreLabel: "分数:",
    restartBtn: "重新开始",
    backBtn: "重新开始",
    timeLabel: "时间:"
  }
};

// 언어 적용 함수
function setLang(lang) {
  const dict = translations[lang];
  if (!dict) return;

  // title (h1)
  const titleEl = document.querySelector("#main-menu h1");
  if (titleEl) titleEl.textContent = dict.title;

  // 시간 선택 (h2)
  const timeSelectEl = document.querySelector("#main-menu h2");
  if (timeSelectEl) timeSelectEl.textContent = dict.timeSelect;

  // 메인으로 버튼
  const backIndexBtn = document.getElementById("back-index-btn");
  if (backIndexBtn) backIndexBtn.textContent = dict.backIndexBtn;

  // 점수 라벨
  const scoreLabel = document.getElementById("score-label");
  if (scoreLabel) scoreLabel.textContent = dict.scoreLabel;

  // 시간 라벨
  const timeBox = document.querySelector("#time-box");
  if (timeBox) {
    // 안에 시간 숫자(span#time)는 남겨둬야 함
    timeBox.firstChild.textContent = ` | ${dict.timeLabel} `;
  }

  // 다시 시작 버튼
  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) restartBtn.textContent = dict.restartBtn;

  // 처음부터 버튼
  const backBtn = document.getElementById("back-btn");
  if (backBtn) backBtn.textContent = dict.backBtn;
}

// 언어 선택 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-select");
  if (langSelect) {
    setLang(langSelect.value); // 기본 한국어
    langSelect.addEventListener("change", (e) => {
      setLang(e.target.value);
    });
  }
});
