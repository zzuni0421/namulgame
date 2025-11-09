// ================== 게임 상태 초기화 ==================
const Game = {
  state: {
    coin: 50,
    plots: [],
    residents: [],
    buildings: [],
    totalProduce: 0,
    unlockedPlants: ['minari'],
    lastTick: Date.now(),
    news: t('welcome')
  },
  config: { tickMs: 1000 }
};

// ================== 초기화: 6개의 밭 ==================
function createDefaultPlots() {
  const plots = [];
  for (let i = 0; i < 6; i++) {
    plots.push({ id: i, plantId: i === 0 ? 'minari' : null, level: 1, progress: 0, production: 0, lastHarvest: Date.now() });
  }
  return plots;
}

// ================== 초기화 함수 ==================
function init() {
  const saved = loadGame();
  if (saved) Game.state = Object.assign(Game.state, saved);
  if (!Game.state.plots || Game.state.plots.length === 0) Game.state.plots = createDefaultPlots();

  renderAll();
  setInterval(tick, Game.config.tickMs);
  setInterval(periodicEvent, 5 * 1000); // 데모용: 5초마다 이벤트
}

// ================== 렌더링 ==================
function renderAll() {
  document.getElementById('coin').innerText = Math.floor(Game.state.coin);
  document.getElementById('totalProduce').innerText = Math.floor(Game.state.totalProduce);
  document.getElementById('resCount').innerText = Game.state.residents.length;
  document.getElementById('news').innerText = Game.state.news;

  renderMap();
  renderBuildList();
  renderCodex();
}

function renderMap() {
  const map = document.getElementById('map');
  map.innerHTML = '';
  Game.state.plots.forEach(plot => {
    const el = document.createElement('div');
    el.className = 'plot';
    const plant = DATA.plants.find(p => p.id === plot.plantId);
    el.innerHTML = `
      <div class="title">${plant ? plant.name[CURRENT_LANG] : '빈 밭'}</div>
      <div class="info">레벨: ${plot.level} <div class="small-note">생산: ${getPlotProduction(plot)}/초</div></div>
      <div class="actions">
        <button class="btn" onclick="openPlot(${plot.id})">관리</button>
        <button class="smallbtn" onclick="sellPlot(${plot.id})">수확 판매</button>
      </div>
    `;
    map.appendChild(el);
  });
}

function renderBuildList() {
  const wrap = document.getElementById('buildList');
  wrap.innerHTML = '';
  DATA.buildings.forEach(b => {
    const div = document.createElement('div');
    div.className = 'build-item';
    div.innerHTML = `<div>${b.name[CURRENT_LANG]} <div class='small-note'>${b.price} 코인</div></div>
      <div><button class='btn' onclick="buyBuilding('${b.id}')">구매</button></div>`;
    wrap.appendChild(div);
  });
  const resTitle = document.createElement('h4'); resTitle.innerText = '주민 고용'; wrap.appendChild(resTitle);
  DATA.residents.forEach(r => {
    const div = document.createElement('div'); div.className = 'build-item';
    div.innerHTML = `<div>${r.name[CURRENT_LANG]} <div class='small-note'>${r.price} 코인</div></div>
      <div><button class='btn' onclick="hireResident('${r.id}')">고용</button></div>`;
    wrap.appendChild(div);
  });
}

function renderCodex() {
  const c = document.getElementById('codex');
  c.innerHTML = '';
  DATA.plants.forEach(p => {
    const unlocked = Game.state.unlockedPlants.includes(p.id);
    const div = document.createElement('div'); div.style.padding = '6px 0';
    div.innerHTML = `<b>${p.name[CURRENT_LANG]}</b> ${unlocked ? '<span class=small-note>해금</span>' : '<span class=small-note>미해금</span>'}
      <div class='small-note'>${p.description[CURRENT_LANG] || ''}</div>`;
    c.appendChild(div);
  });
}

// ================== 밭 상호작용 ==================
function openPlot(id) {
  const plot = Game.state.plots.find(p => p.id === id);
  const plantOptions = DATA.plants.map(p => `<option value='${p.id}'>${p.name[CURRENT_LANG]}</option>`).join('');
  const html = `
    <h3>밭 관리</h3>
    <div>현재: ${plot.plantId || '빈 밭'}</div>
    <div style='margin-top:8px'>식재: <select id='plantSelect'>${plantOptions}</select></div>
    <div style='margin-top:8px'>
      <button class='btn' id='plantBtn'>심기</button>
      <button class='smallbtn' id='levelUpBtn'>레벨업(50코인)</button>
    </div>
  `;
  const p = showPopup(html);
  p.querySelector('#plantBtn').onclick = () => { plantPlot(plot, p.querySelector('#plantSelect').value); closePopup(p); };
  p.querySelector('#levelUpBtn').onclick = () => { levelUpPlot(plot); renderAll(); };
}

function plantPlot(plot, plantId) {
  plot.plantId = plantId;
  if (!Game.state.unlockedPlants.includes(plantId)) Game.state.unlockedPlants.push(plantId);
  toast('심었습니다! 🌱');
  renderAll();
}

function levelUpPlot(plot) {
  if (Game.state.coin < 50) { toast('코인 부족'); return; }
  Game.state.coin -= 50;
  plot.level++;
  toast('레벨업 완료! ⚡');
  renderAll();
}

function sellPlot(id) {
  const plot = Game.state.plots.find(p => p.id === id);
  if (!plot.plantId) { toast('빈 밭입니다 🌱'); return; }

  const plant = DATA.plants.find(x => x.id === plot.plantId);
  const amount = getPlotProduction(plot);
  const coinsEarned = Math.floor(amount * (plant.sell || 1)); // 단가 적용

  Game.state.coin += coinsEarned;
  Game.state.totalProduce += amount;
  toast(`${plant.name[CURRENT_LANG]} ${amount}개 판매! ${coinsEarned}코인 획득 💰`);

  // 밭 초기화
  plot.plantId = null;
  plot.progress = 0;
  plot.production = 0;
  plot.lastHarvest = Date.now();
  saveGame();
  renderAll();
}

// ================== 생산량 계산 ==================
function getPlotProduction(plot) {
  if (!plot.plantId) return 0;
  const plant = DATA.plants.find(p => p.id === plot.plantId);
  let base = plant.baseProduction || 1;
  base *= plot.level;

  Game.state.residents.forEach(rid => {
    const r = DATA.residents.find(x => x.id === rid);
    if (r?.bonus?.prodAdd) base += r.bonus.prodAdd;
    if (r?.bonus?.prodMul) base *= r.bonus.prodMul;
  });

  Game.state.buildings.forEach(bid => {
    const b = DATA.buildings.find(x => x.id === bid);
    if (b?.effect?.prodMultiplier) base *= b.effect.prodMultiplier;
  });

  return Math.floor(base);
}

// ================== 게임 루프 ==================
function tick() {
  const now = Date.now();
  const dt = Math.floor((now - Game.state.lastTick) / 1000);
  if (dt <= 0) return;
  Game.state.lastTick = now;

  let income = 0;
  Game.state.plots.forEach(plot => income += getPlotProduction(plot) * dt);

  let sellMul = 1;
  if (Game.state.buildings.includes('market')) sellMul *= DATA.buildings.find(b => b.id === 'market').effect.sellMultiplier || 1;
  Game.state.coin += income * 0.1 * sellMul;
  Game.state.totalProduce += income;

  renderAll();
  saveGame();
}

function periodicEvent() {
  const ev = DATA.events[Math.floor(Math.random() * DATA.events.length)];
  Game.state.news = `${ev.name[CURRENT_LANG]} 이벤트! ${ev.desc?.[CURRENT_LANG] || ''}`;
  toast(Game.state.news);
  renderAll();
}

// ================== UI 헬퍼 ==================
function showPopup(html) {
  const p = document.createElement('div');
  p.className = 'popup';
  p.innerHTML = html;
  document.body.appendChild(p);
  return p;
}
function closePopup(p) { if (p?.parentNode) p.parentNode.removeChild(p); }
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

// ================== 저장 / 불러오기 ==================
function saveGame() { localStorage.setItem('namulVillageSave', JSON.stringify(Game.state)); }
function loadGame() { const s = localStorage.getItem('namulVillageSave'); return s ? JSON.parse(s) : null; }

// ================== 빌딩 / 주민 ==================
function buyBuilding(id) {
  const b = DATA.buildings.find(x => x.id === id);
  if (Game.state.coin < b.price) { toast('코인 부족'); return; }
  Game.state.coin -= b.price;
  Game.state.buildings.push(b.id);
  toast(`${b.name[CURRENT_LANG]} 구매 완료!`);
  renderAll();
}
function hireResident(id) {
  const r = DATA.residents.find(x => x.id === id);
  if (Game.state.coin < r.price) { toast('코인 부족'); return; }
  Game.state.coin -= r.price;
  Game.state.residents.push(r.id);
  toast(`${r.name[CURRENT_LANG]} 고용 완료!`);
  renderAll();
}

// ================== 초기화 연결 ==================
document.addEventListener('DOMContentLoaded', () => {
  init();
  document.getElementById('btnSave').onclick = () => { saveGame(); toast('저장 완료!'); };
  document.getElementById('btnLoad').onclick = () => { const s = loadGame(); if(s){ Game.state = s; renderAll(); toast('불러오기 완료!'); } else toast('저장된 데이터 없음'); };
  document.getElementById('langSel').onchange = e => { CURRENT_LANG = e.target.value; renderAll(); };
});
