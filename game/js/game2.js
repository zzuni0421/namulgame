// --- 게임 상태 ---
let coins = 0;
let plants = []; // {id, name, level, count, cps, cost}
let startTime = Date.now();
let totalPlaytime = 0;

// --- 나물 목록 ---
const plantTypes = [
  { name: "콩나물", baseCost: 10, baseCps: 1 },
  { name: "시금치", baseCost: 50, baseCps: 5 },
  { name: "고사리", baseCost: 200, baseCps: 20 },
  { name: "두릅", baseCost: 1000, baseCps: 100 },
  { name: "도라지", baseCost: 5000, baseCps: 300 },
  { name: "취나물", baseCost: 20000, baseCps: 1000 },
  { name: "냉이", baseCost: 100000, baseCps: 1500 },
  { name: "달래", baseCost: 250000, baseCps: 2000 },
  { name: "명이나물", baseCost: 500000, baseCps: 2500 }
];

// --- DOM 요소 ---
const coinsEl = document.getElementById("coins");
const farmEl = document.getElementById("farm");
const shopEl = document.getElementById("shop");
const achievementsEl = document.getElementById("achievements");
const playtimeEl = document.getElementById("playtime");

// --- 저장/불러오기 ---
function saveGame() {
  const data = { coins, plants, startTime, totalPlaytime, lastSave: Date.now() };
  localStorage.setItem("grownamul", JSON.stringify(data));
  alert("게임이 저장되었습니다!");
}

function loadGame() {
  const saved = JSON.parse(localStorage.getItem("grownamul"));
  if (saved) {
    coins = saved.coins || 0;
    plants = saved.plants || [];
    startTime = saved.startTime || Date.now();
    totalPlaytime = saved.totalPlaytime || 0;

    // 오프라인 보상
    const elapsed = Math.floor((Date.now() - saved.lastSave) / 1000);
    const offlineCoins = getTotalCps() * elapsed;
    coins += offlineCoins;
    if (offlineCoins > 0) alert(`오프라인 보상으로 ${offlineCoins}코인을 받았습니다!`);
  } else {
    plantTypes.forEach((p, i) => {
      plants.push({ id: i, name: p.name, level: 1, count: 0, cps: p.baseCps, cost: p.baseCost });
    });
  }
}

// --- CPS 계산 ---
function getTotalCps() {
  return plants.reduce((sum, p) => sum + (p.cps * p.count), 0);
}

// --- UI 갱신 ---
function updateUI() {
  coinsEl.textContent = Math.floor(coins);

  // 농장
  farmEl.innerHTML = "";
  plants.forEach(p => {
    if (p.count > 0) {
      const div = document.createElement("div");
      div.className = "plant";
      div.textContent = `${p.name} x${p.count}`;
      
      // 클릭 애니메이션
      div.onclick = () => {
        coins += p.cps; // 클릭 보상
        animatePlant(div);
        playSound("coin");
        updateUI();
      };

      farmEl.appendChild(div);
    }
  });

  // 상점
  shopEl.innerHTML = "";
  plants.forEach(p => {
    const btn = document.createElement("button");
    btn.textContent = `${p.name} (보유:${p.count}) | 가격: ${p.cost} | CPS:${p.cps}`;
    btn.onclick = () => buyPlant(p);
    shopEl.appendChild(btn);
  });

  // 업적
  achievementsEl.innerHTML = "";
  if (coins >= 1000) addAchievement("천 코인 돌파!");
  if (getTotalCps() >= 100) addAchievement("초당 100 CPS 달성!");
  if (totalPlaytime >= 10) addAchievement("10분 이상 플레이!");
}

function addAchievement(text) {
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
    updateUI();
    playSound("buy");
  }
}

// --- 애니메이션 ---
function animatePlant(div) {
  div.style.transform = "scale(1.2)";
  div.style.transition = "transform 0.2s";
  setTimeout(() => div.style.transform = "scale(1)", 200);
}

function animatePurchase(name) {
  const effect = document.createElement("div");
  effect.textContent = `+1 ${name}!`;
  effect.className = "purchase-effect";
  document.body.appendChild(effect);
  setTimeout(() => effect.remove(), 1000);
}

// --- 효과음 ---
function playSound(type) {
  const audio = new Audio();
  if (type === "buy") audio.src = "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg";
  else if (type === "coin") audio.src = "https://actions.google.com/sounds/v1/cartoon/pop.ogg";
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
}, 5000);

// --- 이벤트 ---
document.getElementById("saveBtn").onclick = saveGame;

// --- 시작 ---
loadGame();
updateUI();
