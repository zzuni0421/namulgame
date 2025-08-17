(function () {
  const $ = (sel) => document.querySelector(sel);

  const dict = {
    ko: {
      nicknamePlaceholder: "닉네임 입력",
      start: "시작하기",
      timeLabel: "시간",
      scoreLabel: "점수",
      seconds: "초",
      infinite: "무한",
      mode: { "10": "10초", "20": "20초", "30": "30초", "60": "1분", "infinite": "무한모드" },
      replay: "다시하기",
      bgmPlay: "🔊 BGM",
      bgmPause: "🔈 BGM 일시정지",
      footer: "© cc 나물게임. All rights reserved."
    },
    en: {
      nicknamePlaceholder: "Enter nickname",
      start: "Start",
      timeLabel: "Time",
      scoreLabel: "Score",
      seconds: "s",
      infinite: "∞",
      mode: { "10": "10s", "20": "20s", "30": "30s", "60": "1 min", "infinite": "Infinite" },
      replay: "Replay",
      bgmPlay: "🔊 BGM",
      bgmPause: "🔈 Pause BGM",
      footer: "© cc Namul Game. All rights reserved."
    },
    zh: {
      nicknamePlaceholder: "输入昵称",
      start: "开始",
      timeLabel: "时间",
      scoreLabel: "分数",
      seconds: "秒",
      infinite: "无限",
      mode: { "10": "10秒", "20": "20秒", "30": "30秒", "60": "1分钟", "infinite": "无限模式" },
      replay: "再玩一次",
      bgmPlay: "🔊 背景音乐",
      bgmPause: "🔈 暂停音乐",
      footer: "© cc 野菜游戏. 保留所有权利."
    },
    ja: {
      nicknamePlaceholder: "ニックネームを入力",
      start: "スタート",
      timeLabel: "時間",
      scoreLabel: "スコア",
      seconds: "秒",
      infinite: "無限",
      mode: { "10": "10秒", "20": "20秒", "30": "30秒", "60": "1分", "infinite": "無限モード" },
      replay: "もう一度",
      bgmPlay: "🔊 BGM",
      bgmPause: "🔈 BGM 一時停止",
      footer: "© cc ナムルゲーム. All rights reserved."
    }
  };

  // 현재 언어 상태
  let lang = (localStorage.getItem("lang") || "ko");

  const els = {
    nicknameInput: $("#nicknameInput"),
    submitBtn: $("#submitBtn"),
    timerDisplay: $("#timerDisplay"),
    scoreDisplay: $("#scoreDisplay"),
    modeBtns: document.querySelectorAll(".modeBtn"),
    replayBtn: $("#replayBtn"),
    bgmToggle: $("#bgmToggle"),
    langSelect: $("#langSelect"),
    footerP: document.querySelector("footer p")
  };

  function applyStaticTexts() {
    const t = dict[lang];
    if (!t) return;

    if (els.nicknameInput) els.nicknameInput.placeholder = t.nicknamePlaceholder;
    if (els.submitBtn) els.submitBtn.textContent = t.start;

    // 모드 버튼 라벨
    els.modeBtns.forEach((btn) => {
      const key = btn.dataset.time;
      btn.textContent = t.mode[key] || btn.textContent;
    });

    if (els.replayBtn) els.replayBtn.textContent = t.replay;
    if (els.footerP) els.footerP.textContent = t.footer;

    if (els.bgmToggle) {
      const bgm = document.getElementById("bgm");
      if (bgm && !bgm.paused) {
        els.bgmToggle.textContent = t.bgmPause;
      } else {
        els.bgmToggle.textContent = t.bgmPlay;
      }
    }

    transformHUD();
  }

  function transformHUD() {
    const t = dict[lang];
    if (!t) return;
    if (els.timerDisplay && els.timerDisplay.textContent) {
      let txt = els.timerDisplay.textContent;
      // 시간 변환
      txt = txt
        .replace(/^시간:\s*무한$/g, `${t.timeLabel}: ${t.infinite}`)
        .replace(/^시간:\s*(\d+)\s*초$/g, (_, num) => `${t.timeLabel}: ${num}${t.seconds}`)
        .replace(/^Time:\s*(\d+)s$/g, (_, num) => `${t.timeLabel}: ${num}${t.seconds}`)
        .replace(/^Time:\s*∞$/g, `${t.timeLabel}: ${t.infinite}`);
      els.timerDisplay.textContent = txt;
    }
    if (els.scoreDisplay && els.scoreDisplay.textContent) {
      let txt = els.scoreDisplay.textContent;
      txt = txt
        .replace(/^점수:\s*(\d+)\s*점$/g, (_, num) => `${t.scoreLabel}: ${num}`)
        .replace(/^Score:\s*(\d+)$/g, (_, num) => `${t.scoreLabel}: ${num}`);
      els.scoreDisplay.textContent = txt;
    }
  }

  function observeHUD() {
    const opts = { childList: true, characterData: true, subtree: true };
    const mo = new MutationObserver(() => transformHUD());
    if (els.timerDisplay) mo.observe(els.timerDisplay, opts);
    if (els.scoreDisplay) mo.observe(els.scoreDisplay, opts);
  }

  function bindLanguageSelect() {
    if (!els.langSelect) return;
    els.langSelect.value = lang;
    els.langSelect.addEventListener("change", () => {
      lang = els.langSelect.value || "ko";
      localStorage.setItem("lang", lang);
      applyStaticTexts();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindLanguageSelect();
    applyStaticTexts();
    observeHUD();
  });
})();
