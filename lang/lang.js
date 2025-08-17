const LANG = {
  ko: { title:"🌱 나물 줍기", score:"점수", time:"시간", restart:"다시 시작", infinite:"무한 모드", start:"게임 시작", back:"메인으로" },
  en: { title:"🌱 Namul Catcher", score:"Score", time:"Time", restart:"Restart", infinite:"Infinite Mode", start:"Start Game", back:"Back to Main" },
  ja: { title:"🌱 ナムルキャッチ", score:"スコア", time:"時間", restart:"再スタート", infinite:"無限モード", start:"ゲーム開始", back:"メインへ" },
  zh: { title:"🌱 拾取蔬菜", score:"分数", time:"时间", restart:"重新开始", infinite:"无限模式", start:"开始游戏", back:"返回主界面" }
};

let currentLang = "ko";

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll("h1").forEach(h=>h.textContent = LANG[lang].title);

  const restart = document.getElementById("restart-btn");
  if (restart) restart.textContent = LANG[lang].restart;

  const start = document.getElementById("start-btn");
  if (start) start.textContent = LANG[lang].start;

  const back = document.getElementById("back-btn");
  if (back) back.textContent = LANG[lang].back;

  const infLabel = document.getElementById("infinite-label");
  if (infLabel) infLabel.textContent = LANG[lang].infinite;

  document.getElementById("score-label").textContent = LANG[lang].score + ":";
  document.getElementById("time-label").textContent  = LANG[lang].time  + ":";
}
