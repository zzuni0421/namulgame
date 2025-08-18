// lang.js

const translations = {
  ko: {
    eventBanner: "🌱 이 게임에서 이벤트 진행 중! 참여하러 가기 🌱",
    title: "🌱 나물 줍기",
    timeSelect: "시간 선택",
    backIndexBtn: "메인으로",
    time30: "30초",
    time60: "60초",
    time90: "90초",
    timeInfinite: "∞ 무한",
    scoreLabel: "점수:",
    timeLabel: "시간:",
    restartBtn: "다시 시작",
    backBtn: "처음부터",
    gameOver: "게임 종료!"
  },
  en: {
    eventBanner: "🌱 Event in progress in this game! Join now 🌱",
    title: "🌱 Namul Picking",
    timeSelect: "Select Time",
    backIndexBtn: "Back to Main",
    time30: "30s",
    time60: "60s",
    time90: "90s",
    timeInfinite: "∞ Infinite",
    scoreLabel: "Score:",
    timeLabel: "Time:",
    restartBtn: "Restart",
    backBtn: "Back to Start",
    gameOver: "Game Over!"
  },
  ja: {
    eventBanner: "🌱 このゲームでイベント開催中！ 参加しよう 🌱",
    title: "🌱 山菜取り",
    timeSelect: "時間を選択",
    backIndexBtn: "メインへ",
    time30: "30秒",
    time60: "60秒",
    time90: "90秒",
    timeInfinite: "∞ 無限",
    scoreLabel: "スコア:",
    timeLabel: "時間:",
    restartBtn: "リスタート",
    backBtn: "最初から",
    gameOver: "ゲーム終了!"
  },
  zh: {
    eventBanner: "🌱 本游戏正在进行活动！快来参加 🌱",
    title: "🌱 采野菜游戏",
    timeSelect: "选择时间",
    backIndexBtn: "回到主页",
    time30: "30秒",
    time60: "60秒",
    time90: "90秒",
    timeInfinite: "∞ 无限",
    scoreLabel: "分数:",
    timeLabel: "时间:",
    restartBtn: "重新开始",
    backBtn: "重新开始",
    gameOver: "游戏结束!"
  }
};


// 언어 적용 함수
function setLang(lang) {
  const dict = translations[lang];
  if (!dict) return;

  // 이벤트 배너
  const banner = document.getElementById("namul-event-banner");
  if (banner) banner.textContent = dict.eventBanner;

  // 제목
  const titleEl = document.querySelector("#main-menu h1");
  if (titleEl) titleEl.textContent = dict.title;

  // 시간 선택
  const timeSelectEl = document.querySelector("#main-menu h2");
  if (timeSelectEl) timeSelectEl.textContent = dict.timeSelect;

  // 시간 버튼들
  const timeBtns = document.querySelectorAll(".time-btn");
  if (timeBtns.length === 4) {
    timeBtns[0].textContent = dict.time30;
    timeBtns[1].textContent = dict.time60;
    timeBtns[2].textContent = dict.time90;
    timeBtns[3].textContent = dict.timeInfinite;
  }

  // 메인으로 버튼
  const backIndexBtn = document.getElementById("back-index-btn");
  if (backIndexBtn) backIndexBtn.textContent = dict.backIndexBtn;

  // 점수 라벨
  const scoreLabel = document.getElementById("score-label");
  if (scoreLabel) scoreLabel.textContent = dict.scoreLabel;

  // 시간 라벨
  const timeBox = document.querySelector("#time-box");
  if (timeBox) {
    timeBox.firstChild.textContent = ` | ${dict.timeLabel} `;
  }

  // 다시 시작 버튼
  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) restartBtn.textContent = dict.restartBtn;

  // 처음부터 버튼
  const backBtn = document.getElementById("back-btn");
  if (backBtn) backBtn.textContent = dict.backBtn;

  // 게임 종료 메시지 (게임 끝날 때 game.js에서 호출하도록)
  const gameOverEl = document.getElementById("game-over-msg");
  if (gameOverEl) gameOverEl.textContent = dict.gameOver;
}


// 언어 선택 이벤트
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-select");
  if (langSelect) {
    setLang(langSelect.value); // 기본 한국어
    langSelect.addEventListener("change", (e) => {
      setLang(e.target.value);
    });
  }
});
