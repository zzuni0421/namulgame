// --- 게임 상태 ---
let coins = 0;
let plants = [];
let startTime = Date.now();
let totalPlaytime = 0;

// --- 나물 목록 (가격·CPS 조정) ---
const plantTypes = [
  { name: "콩나물", baseCost: 50, baseCps: 1 },
  { name: "시금치", baseCost: 200, baseCps: 5 },
  { name: "고사리", baseCost: 1000, baseCps: 20 },
  { name: "두릅", baseCost: 5000, baseCps: 100 },
  { name: "도라지", baseCost: 20000, baseCps: 400 },
  { name: "취나물", baseCost: 100000, baseCps: 1200 },
  { name: "냉이", baseCost: 500000, baseCps: 3000 },
  { name: "달래", baseCost: 2000000, baseCps: 8000 },
  { name: "명이나물", baseCost: 10000000, baseCps: 20000 }
];

// --- DOM 요소 ---
const coinsEl = document.getElementById("coins");
const farmEl = document.getElementById("farm");
const shopEl = document.getElementById("shop");
const achievementsEl = document.getElementById("achievements");
const playtimeEl = document.getElementById("playtime");

// --- 저장/불러오기 ---
function saveGame() {
  const data = { coins, plants, totalPlaytime, lastSave: Date.now() };
  localStorage.setItem("grownamul", JSON.stringify(data));
  alert("게임이 저장되었습니다!");
}

function loadGame() {
  const saved = JSON.parse(localStorage.getItem("grownamul"));
  if (saved) {
    coins = saved.coins || 0;
    plants = saved.plants || [];
    totalPlaytime = saved.totalPlaytime || 0;

    const elapsed = Math.floor((Date.now() - saved.lastSave) / 1000);
    coins += getTotalCps() * elapsed;
    if (elapsed > 0) alert(`오프라인 보상으로 ${getTotalCps() * elapsed} 코인을 받았습니다!`);

    startTime = Date.now();
  } else {
    plantTypes.forEach((p, i) => {
      plants.push({ id:i, name:p.name, level:1, count:0, cps:p.baseCps, cost:p.baseCost });
    });
    startTime = Date.now();
  }
}

// --- CPS 계산 (초반 2분 제한 적용) ---
function getTotalCps() {
  const elapsed = (Date.now() - startTime) / 60000; // 분 단위
  let multiplier = 1;
  if(elapsed < 2) multiplier = 0.3; // 첫 2분은 30%만 적용
  return plants.reduce((sum, p) => sum + (p.cps * p.count * multiplier), 0);
}

// --- UI 갱신 ---
function updateUI() {
  coinsEl.textContent = Math.floor(coins);

  // 농장
  farmEl.innerHTML = "";
  plants.forEach(p => {
    const div = document.createElement("div");
    div.className = "plant";
    div.textContent = `${p.name}\n x${p.count}`;

    div.onclick = () => {
      coins += p.count > 0 ? p.cps : 1; // 최소 1코인
      div.classList.add("clicked");
      setTimeout(() => div.classList.remove("clicked"), 300);
      playSound("coin");
      updateUI();
    };

    farmEl.appendChild(div);
  });

  // 상점
  shopEl.innerHTML = "";
  plants.forEach(p => {
    const btn = document.createElement("button");
    btn.textContent = `${p.name} (보유:${p.count}) | 가격:${p.cost} | CPS:${p.cps}`;
    btn.onclick = () => buyPlant(p);
    shopEl.appendChild(btn);
  });

  // 업적
  achievementsEl.innerHTML = "";
  if (coins>=1000) addAchievement("천 코인 돌파!");
  if (getTotalCps()>=100) addAchievement("초당 100 CPS 달성!");
  if (totalPlaytime>=10) addAchievement("10분 이상 플레이!");
}

function addAchievement(text){
  const li = document.createElement("li");
  li.textContent = text;
  achievementsEl.appendChild(li);
}

// --- 나물 구매 ---
function buyPlant(p) {
  if (coins >= p.cost) {
    coins -= p.cost;
    p.count++;
    p.cost = Math.floor(p.cost * 1.2); // 가격 상승
    animatePurchase(p.name);
    playSound("buy");
    updateUI();
  }
}

// --- 구매 애니메이션 ---
function animatePurchase(name) {
  const effect = document.createElement("div");
  effect.className = "purchase-effect";
  effect.textContent = `+1 ${name}!`;

  const rect = farmEl.getBoundingClientRect();
  effect.style.left = `${rect.left + rect.width/2}px`;
  effect.style.top = `${rect.top + rect.height/2}px`;

  document.body.appendChild(effect);
  setTimeout(() => effect.remove(), 1000);
}

// 코인 애니메이션 함수
function animateCoins(current, target, duration = 500) {
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = current + (target - current) * progress;
    document.getElementById("coinDisplay").textContent = value.toFixed(2);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function addCoins(amount) {
  const oldCoins = coins;
  coins += amount;
  animateCoins(oldCoins, coins, 800); // 0.8초 동안 애니메이션
  showFloatingText(`+${amount}`, "#coinDisplay");
}

// 플로팅 텍스트(파티클 느낌)
function showFloatingText(text, selector) {
  const el = document.querySelector(selector);
  const float = document.createElement("span");
  float.textContent = text;
  float.classList.add("floating-text");
  el.appendChild(float);

  setTimeout(() => float.remove(), 1000);
}

// --- 효과음 ---
function playSound(type) {
  const audio = new Audio();
  if(type === "buy") audio.src = "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg";
  else if(type === "coin") audio.src = "https://actions.google.com/sounds/v1/cartoon/pop.ogg";
  audio.play();
}

// --- 루프 ---
setInterval(() => {
  coins += getTotalCps();
  updateUI();
}, 1000);

setInterval(() => {
  totalPlaytime = Math.floor((Date.now() - startTime) / 60000);
  playtimeEl.textContent = totalPlaytime;
}, 1000);

// --- 이벤트 ---
document.getElementById("saveBtn").onclick = saveGame;

// --- 시작 ---
loadGame();
updateUI();
