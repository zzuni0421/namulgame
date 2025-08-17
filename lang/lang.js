const LANG = {
  ko: { title: "🌱 나물 줍기", score: "점수", time: "시간", restart: "다시 시작", infinite: "무한 모드", start: "게임 시작" },
  en: { title: "🌱 Namul Catcher", score: "Score", time: "Time", restart: "Restart", infinite: "Infinite Mode", start: "Start Game" },
  ja: { title: "🌱 ナムルキャッチ", score: "スコア", time: "時間", restart: "再スタート", infinite: "無限モード", start: "ゲーム開始" },
  zh: { title: "🌱 拾取蔬菜", score: "分数", time: "时间", restart: "重新开始", infinite: "无限模式", start: "开始游戏" }
};

let currentLang = 'ko';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('h1').forEach(h => h.textContent = LANG[lang].title);
  document.querySelectorAll('#restart-btn, #start-btn').forEach(btn => btn.textContent = LANG[lang].restart || LANG[lang].start);
  document.getElementById('infinite-label').textContent = LANG[lang].infinite;
  document.getElementById('score-label').textContent = LANG[lang].score + ":";
  document.getElementById('time-label').textContent = LANG[lang].time + ":";
}
