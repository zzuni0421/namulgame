const LANG = {
  ko: {
    title: "🌱 나물 줍기",
    score: "점수",
    time: "시간",
    restart: "다시 시작",
    infinite: "무한 모드"
  },
  en: {
    title: "🌱 Namul Catcher",
    score: "Score",
    time: "Time",
    restart: "Restart",
    infinite: "Infinite Mode"
  },
  ja: {
    title: "🌱 ナムルキャッチ",
    score: "スコア",
    time: "時間",
    restart: "再スタート",
    infinite: "無限モード"
  },
  zh: {
    title: "🌱 拾取蔬菜",
    score: "分数",
    time: "时间",
    restart: "重新开始",
    infinite: "无限模式"
  }
};

let currentLang = 'ko';

function setLang(lang) {
  currentLang = lang;
  document.querySelector('h1').textContent = LANG[lang].title;
  document.querySelector('#restart-btn').textContent = LANG[lang].restart;
  document.querySelector('label[for="infinite-mode"]').textContent = LANG[lang].infinite;
  document.querySelector('.scoreboard').innerHTML =
    `${LANG[lang].score}: <span id="score">${score}</span> | ${LANG[lang].time}: <span id="timer">${time}</span>s`;
}
