const plantsData = [
  { name: '냉이', cost: 0, income: 1, interval: 1000 },
  { name: '씀바귀', cost: 100, income: 2, interval: 1000 },
  { name: '두릅', cost: 300, income: 4, interval: 1000 },
  { name: '고사리', cost: 800, income: 8, interval: 1000 },
  { name: '취나물', cost: 1500, income: 15, interval: 1000 },
];

let unlockedPlants = [];
let score = 0;
let scoreEl = document.getElementById('score');
const plantsContainer = document.getElementById('plants');
const shopPopup = document.getElementById('shopPopup');
const shopItems = document.getElementById('shopItems');

function updateScore(amount) {
  score += amount;
  scoreEl.textContent = `점수: ${score}`;
}

function unlockPlant(index) {
  const data = plantsData[index];
  const plant = {
    ...data,
    level: 1,
    intervalId: setInterval(() => {
      updateScore(plant.income * plant.level);
    }, data.interval)
  };
  unlockedPlants.push(plant);
  renderPlants();
}

function renderPlants() {
  plantsContainer.innerHTML = '';
  unlockedPlants.forEach((plant, i) => {
    const div = document.createElement('div');
    div.className = 'plant';
    div.innerHTML = `
      <div><strong>${plant.name}</strong></div>
      <div>수익: +${plant.income * plant.level}점/초</div>
      <div>레벨: ${plant.level}</div>
      <button onclick="upgradePlant(${i})">업그레이드 (비용: ${plant.level * 100})</button>
    `;
    plantsContainer.appendChild(div);
  });
}

function upgradePlant(i) {
  const plant = unlockedPlants[i];
  const cost = plant.level * 100;
  if (score >= cost) {
    score -= cost;
    plant.level++;
    renderPlants();
    updateScore(0);
  }
}

function openShop() {
  shopItems.innerHTML = '';
  plantsData.forEach((plant, i) => {
    if (!unlockedPlants.find(p => p.name === plant.name) &&
        (i === 0 || unlockedPlants.find(p => p.name === plantsData[i - 1].name))) {
      const div = document.createElement('div');
      div.className = 'shop-item';
      div.innerHTML = `
        ${plant.name} (비용: ${plant.cost})
        <button ${score < plant.cost ? 'disabled' : ''} onclick="buyPlant(${i})">구매</button>
      `;
      shopItems.appendChild(div);
    }
  });
  shopPopup.style.display = 'block';
}

function buyPlant(i) {
  const plant = plantsData[i];
  if (score >= plant.cost) {
    score -= plant.cost;
    unlockPlant(i);
    updateScore(0);
    openShop(); // 새로고침
  }
}

function closeShop() {
  shopPopup.style.display = 'none';
}

document.getElementById('buyBtn').addEventListener('click', openShop);

// 기본 냉이 unlock
unlockPlant(0);
