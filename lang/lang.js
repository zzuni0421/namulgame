const translations = {
  ko: {
    eventBannerBefore: "🌱 이 게임에서 이벤트 진행 중! ",
    eventBannerLink: "참여하러 가기",
    eventBannerAfter: " 🌱",
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
    eventBannerBefore: "🌱 Event in progress in this game! ",
    eventBannerLink: "Join Now",
    eventBannerAfter: " 🌱",
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
    eventBannerBefore: "🌱 このゲームでイベント開催中！ ",
    eventBannerLink: "参加しよう",
    eventBannerAfter: " 🌱",
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
    eventBannerBefore: "🌱 本游戏正在进行活动！ ",
    eventBannerLink: "快来参加",
    eventBannerAfter: " 🌱",
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
  const bannerBefore = document.getElementById("banner-text-before");
  const bannerLink = document.getElementById("banner-link");
  const bannerAfter = document.getElementById("banner-text-after");
  if (bannerBefore) bannerBefore.textContent = dict.eventBannerBefore;
  if (bannerLink) bannerLink.textContent = dict.eventBannerLink;
  if (bannerAfter) bannerAfter.textContent = dict.eventBannerAfter;

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

  // 게임 종료 메시지
  const gameOverEl = document.getElementById("game-over-msg");
  if (gameOverEl) gameOverEl.textContent = dict.gameOver;
}


// 언어 선택 이벤트
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-select");
  if (langSelect) {
    setLang(langSelect.value); // 기본 언어
    langSelect.addEventListener("change", (e) => {
      setLang(e.target.value);
    });
  }
});
