// 나물 종류와 기본 성장 속도 설정
const plantsData = [
  { id: 1, name: '두릅', baseSpeed: 0.3 },
  { id: 2, name: '고사리', baseSpeed: 0.2 },
  { id: 3, name: '냉이', baseSpeed: 0.4 },
  { id: 4, name: '씀바귀', baseSpeed: 0.25 },
  { id: 5, name: '취나물', baseSpeed: 0.35 },
];

// 게임 상태
let score = 0;
let upgradeLevel = 1;
const maxUpgrade = 10;

// 업그레이드 비용 공식 (초기 100, 이후마다 2배씩 증가)
function getUpgradeCost(level) {
  return 100 * (2 ** (level - 1));
}

// 각 나물의 현재 성장 상태 관리용 객체
const plantsState = plantsData.map(plant => ({
  ...plant,
  progress: 0,
  level: 1,
}));

// DOM 요소
const plantsContainer = document.getElementById('plants-container');
const scoreDisplay = document.getElementById('score');
const upgradeBtn = document.getElementById('upgrade-btn');
const upgradeLevelDisplay = document.getElementById('upgrade-level');
const upgradeCostDisplay = document.getElementById('upgrade-cost');

// 나물 카드 생성 및 DOM 삽입
function createPlantCard(plant) {
  const card = document.createElement('div');
  card.className = 'plant-card';
  card.dataset.id = plant.id;

  const nameEl = document.createElement('div');
  nameEl.className = 'plant-name';
  nameEl.textContent = plant.name;

  const levelEl = document.createElement('div');
  levelEl.className = 'plant-level';
  levelEl.textContent = `성장 단계: ${plant.level}`;

  const progressBarBg = document.createElement('div');
  progressBarBg.className = 'plant-progress';

  const progressBar = document.createElement('div');
  progressBar.className = 'plant-progress-bar';
  progressBar.style.width = `${plant.progress}%`;

  progressBarBg.appendChild(progressBar);
  card.appendChild(nameEl);
  card.appendChild(levelEl);
  card.appendChild(progressBarBg);

  // 클릭 시 점수 획득 (성장 단계 * 10 점수)
  card.addEventListener('click', () => {
    const gained = plant.level * 10;
    score += gained;
    updateScore();
    // 클릭할 때마다 성장 단계 조금 상승 (유저 액션 보상)
    plant.progress += 5;
    if (plant.progress >= 100) {
      plant.progress = 0;
      plant.level++;
      levelEl.textContent = `성장 단계: ${plant.level}`;
    }
    updateProgressBar(progressBar, plant.progress);
    updateUpgradeButton();
  });

  return { card, progressBar, levelEl };
}

// 점수 UI 업데이트
function updateScore() {
  scoreDisplay.textContent = score.toLocaleString();
}

// 프로그레스바 UI 업데이트
function updateProgressBar(bar, progress) {
  bar.style.width = `${Math.min(progress, 100)}%`;
}

// 업그레이드 버튼 활성화/비활성화 관리
function updateUpgradeButton() {
  const cost = getUpgradeCost(upgradeLevel);
  upgradeCostDisplay.textContent = cost.toLocaleString();
  upgradeLevelDisplay.textContent = upgradeLevel;
  upgradeBtn.disabled = score < cost || upgradeLevel >= maxUpgrade;
}

// 업그레이드 처리
upgradeBtn.addEventListener('click', () => {
  const cost = getUpgradeCost(upgradeLevel);
  if (score >= cost && upgradeLevel < maxUpgrade) {
    score -= cost;
    upgradeLevel++;
    updateScore();
    updateUpgradeButton();
  }
});

// 성장 루프: 나물 성장 진행 (업그레이드 레벨에 따라 속도 상승)
function growthLoop() {
  plantsState.forEach(plant => {
    const speed = plant.baseSpeed * upgradeLevel;
    plant.progress += speed;
    if (plant.progress >= 100) {
      plant.progress = 0;
      plant.level++;
      const plantCard = plantsCardsMap.get(plant.id);
      if (plantCard) {
        plantCard.levelEl.textContent = `성장 단계: ${plant.level}`;
      }
    }
  });
  // UI 반영
  plantsState.forEach(plant => {
    const plantCard = plantsCardsMap.get(plant.id);
    if (plantCard) {
      updateProgressBar(plantCard.progressBar, plant.progress);
    }
  });
  requestAnimationFrame(growthLoop);
}

// 초기 세팅
const plantsCardsMap = new Map();

function init() {
  plantsState.forEach(plant => {
    const { card, progressBar, levelEl } = createPlantCard(plant);
    plantsContainer.appendChild(card);
    plantsCardsMap.set(plant.id, { card, progressBar, levelEl });
  });
  updateScore();
  updateUpgradeButton();
  growthLoop();
}

window.addEventListener('DOMContentLoaded', init);
