let money = 0;
let incomePerSecond = 1;
const ADS = [
  "forms.gle/bEL2EeMexCVw4MXWA (나물게임 설문조사!)",
  "https://github.com/zzuni0421/namulgame (나물게임 공식 Github! 개발자들과 토론도 ㄱㄴ!)",
  "https://namulgame.pages.dev/community (나물게임 공식 커뮤니티 (아직 개발중))", "https://youtube.com/@나물게임나물이 (나물게임 개발자 공식 유튜브!)",
  "https://namulgame.pages.dev (나물게임에 구글 로그인이 생겼다?! 지금 당장 ㄱㄱ!)", "https://youtube.com/@나물게임 (나물게임 공식 계정!)",
  "namulgame.kro.kr (나물게임 개발자 공식 사이트!)",
];

// ===== 저장 =====
function saveGame() {
  const data = {
    money,
    incomePerSecond,
    lastSaveTime: Date.now()
  };
  localStorage.setItem("namulData", JSON.stringify(data));
}

// ===== 로드 =====
function loadGame() {
  const saved = localStorage.getItem("namulData");
  if (!saved) return;
  const data = JSON.parse(saved);
  money = data.money;
  incomePerSecond = data.incomePerSecond;

  const offlineSec = (Date.now() - data.lastSaveTime) / 1000;
  const offlineEarnings = calcOfflineEarnings(offlineSec, incomePerSecond);
  if (offlineEarnings > 0) {
    showOfflineRewardPopup(offlineEarnings, offlineSec);
  }
}

// ===== 오프라인 수익 계산 =====
function calcOfflineEarnings(sec, rate) {
  const maxHours = 6;
  const capped = Math.min(sec, maxHours * 3600);
  const decay = capped > 3600 ? 0.7 : 1;
  return rate * capped * decay;
}

// ===== 단위 변환 =====
const units = ["", "만", "억", "조", "경", "해", "자", "양"];
function formatMoney(num) {
  let i = 0;
  while (num >= 10000 && i < units.length - 1) {
    num /= 10000;
    i++;
  }
  return num.toFixed(2) + units[i];
}

// ===== 오프라인 팝업 =====
function showOfflineRewardPopup(amount, time) {
  const hours = (time / 3600).toFixed(1);
  const popup = document.createElement("div");
  popup.className = "offline-popup";
  popup.innerHTML = `
    <div class="popup-content">
      🌿 ${hours}시간 동안 나물이 자랐어요!<br>
      예상 수익: <b>${formatMoney(amount)}</b><br><br>
      <button id="claimReward">보상 받기</button>
      <button id="adReward">광고 보고 룰렛 돌리기 🎡</button>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("claimReward").onclick = () => {
    money += amount;
    popup.remove();
    alert(`보상 수령 완료! 💰 ${formatMoney(amount)} 획득`);
  };

  document.getElementById("adReward").onclick = () => {
    popup.remove();
    showAdPopup(amount);
  };
}

// ===== 광고 창 (랜덤 15개 중 1개, 15초 시청 필수) =====
function showAdPopup(baseAmount) {
  const randomAd = ADS[Math.floor(Math.random() * ADS.length)];
  const adPopup = document.createElement("div");
  adPopup.className = "ad-popup";
  adPopup.innerHTML = `
    <div class="popup-content">
      🎥 광고를 시청 중입니다...<br>
      <iframe src="${randomAd}" class="ad-frame"></iframe><br>
      <p id="adTimer">15초 남음</p>
    </div>
  `;
  document.body.appendChild(adPopup);

  let remaining = 15;
  const timer = setInterval(() => {
    remaining--;
    document.getElementById("adTimer").textContent = `${remaining}초 남음`;
    if (remaining <= 0) {
      clearInterval(timer);
      adPopup.remove();
      showRoulettePopup(baseAmount);
    }
  }, 1000);
}

// ===== 룰렛 =====
function showRoulettePopup(baseAmount) {
  const popup = document.createElement("div");
  popup.className = "roulette-popup";
  popup.innerHTML = `
    <div class="popup-content">
      🎡 룰렛을 돌려 보너스를 획득하세요!<br><br>
      <div class="roulette-wheel">
        <div class="slice">1.2x</div>
        <div class="slice">1.4x</div>
        <div class="slice">1.5x</div>
        <div class="slice">1.8x</div>
        <div class="slice">2.0x</div>
        <div class="slice special">3.0x 🎉</div>
      </div><br>
      <button id="spinBtn">룰렛 돌리기</button>
    </div>
  `;
  document.body.appendChild(popup);

  const multipliers = [1.2, 1.4, 1.5, 1.8, 2.0, 3.0];
  const weights = [0.25, 0.25, 0.2, 0.15, 0.1499, 0.0001]; // 3.0은 0.01%
  document.getElementById("spinBtn").onclick = () => {
    const multiplier = weightedRandom(multipliers, weights);
    const finalReward = baseAmount * multiplier;
    popup.remove();
    money += finalReward;
    alert(`🎉 ${multiplier.toFixed(1)}배 당첨! 총 ${formatMoney(finalReward)} 획득!`);
  };
}

// ===== 가중 랜덤 함수 =====
function weightedRandom(values, weights) {
  let sum = weights.reduce((a,b)=>a+b);
  let rand = Math.random() * sum;
  for (let i = 0; i < values.length; i++) {
    if (rand < weights[i]) return values[i];
    rand -= weights[i];
  }
  return values[values.length - 1];
}

// ===== 자동 저장 & 로드 =====
window.addEventListener("beforeunload", saveGame);
window.addEventListener("DOMContentLoaded", loadGame);
