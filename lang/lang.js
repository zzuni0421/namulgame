const translations = {
  ko: {
    nicknamePlaceholder: "닉네임을 입력하세요",
    submit: "닉네임 저장",
    replay: "다시하기",
  },
  en: {
    nicknamePlaceholder: "Enter your nickname",
    submit: "Save nickname",
    replay: "Replay",
  }
};

function applyLang(lang) {
  const t = translations[lang];
  document.getElementById("nicknameInput").placeholder = t.nicknamePlaceholder;
  document.getElementById("submitBtn").textContent = t.submit;
  document.getElementById("replayBtn").textContent = t.replay;
}
