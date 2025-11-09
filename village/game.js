// 전체 게임 상태 초기화
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
config: {tickMs:1000}
};


// 초기화: 6개의 밭
function createDefaultPlots(){
const plots = [];
for(let i=0;i<6;i++){ plots.push({id:i, plantId: i===0? 'minari': null, level:1, progress:0, prodRate:0}); }
return plots;
}


function init(){
// load or default
const saved = loadGame();
if(saved){ Game.state = Object.assign(Game.state, saved); }
if(!Game.state.plots || Game.state.plots.length===0) Game.state.plots = createDefaultPlots();


// render
renderAll();
// tick loop
setInterval(tick, Game.config.tickMs);
// periodic event loop
setInterval(periodicEvent, 30*60*1000); // 30분마다(데모에선 테스트용으로 짧게 바꿔도 됨)
}


function renderAll(){
document.getElementById('coin').innerText = Math.floor(Game.state.coin);
document.getElementById('totalProduce').innerText = Math.floor(Game.state.totalProduce);
document.getElementById('resCount').innerText = Game.state.residents.length;
document.getElementById('news').innerText = Game.state.news;
renderMap();
renderBuildList();
renderCodex();
}


function renderMap(){
const map = document.getElementById('map'); map.innerHTML='';
Game.state.plots.forEach(plot=>{
const el = document.createElement('div'); el.className='plot';
const plant = DATA.plants.find(p=>p.id===plot.plantId);
el.innerHTML = `
}

function renderBuildList(){
const wrap = document.getElementById('buildList'); wrap.innerHTML='';
DATA.buildings.forEach(b=>{
const div = document.createElement('div'); div.className='build-item';
div.innerHTML = `<div>${b.name[CURRENT_LANG]} <div class='small-note'>${b.price} 코인</div></div><div><button class='btn' onclick="buyBuilding('${b.id}')">구매</button></div>`;
wrap.appendChild(div);
});
// residents
const resTitle = document.createElement('h4'); resTitle.innerText='주민 고용'; wrap.appendChild(resTitle);
DATA.residents.forEach(r=>{
const div = document.createElement('div'); div.className='build-item';
div.innerHTML = `<div>${r.name[CURRENT_LANG]} <div class='small-note'>${r.price} 코인</div></div><div><button class='btn' onclick="hireResident('${r.id}')">고용</button></div>`;
wrap.appendChild(div);
});
}


function renderCodex(){
const c = document.getElementById('codex'); c.innerHTML='';
DATA.plants.forEach(p=>{
const unlocked = Game.state.unlockedPlants.includes(p.id);
const div = document.createElement('div'); div.style.padding='6px 0';
div.innerHTML = `<b>${p.name[CURRENT_LANG]}</b> ${unlocked? '<span class=small-note>해금</span>': '<span class=small-note>미해금</span>'}<div class='small-note'>${p.description[CURRENT_LANG]||''}</div>`;
c.appendChild(div);
});
}


// 상호작용
function openPlot(id){
const plot = Game.state.plots.find(p=>p.id===id);
const plantOptions = DATA.plants.map(p=>`<option value='${p.id}'>${p.name[CURRENT_LANG]}</option>`).join('');
const html = `
<h3>밭 관리</h3>
<div>현재: ${plot.plantId || '빈 밭'}</div>
<div style='margin-top:8px'>식재: <select id='plantSelect'>${plantOptions}</select></div>
<div style='margin-top:8px'><button class='btn' id='plantBtn'>심기</button> <button class='smallbtn' id='levelUpBtn'>레벨업(50코인)</button></div>
`;
const p = showPopup(html);
p.querySelector('#plantBtn').onclick = ()=>{
const pid = p.querySelector('#plantSelect').value;
plantPlot(plot, pid); closePopup(p);
};
p.querySelector('#levelUpBtn').onclick = ()=>{ levelUpPlot(plot); renderAll(); };
}


function plantPlot(plot, plantId){
plot.plantId = plantId;
if(!Game.state.unlockedPlants.includes(plantId)) Game.state.unlockedPlants.push(plantId);
toast('심었습니다!'); renderAll();
}


function levelUpPlot(plot){
if(Game.state.coin < 50){ toast('코인 부족'); return; }
Game.state.coin -= 50; plot.level++; toast('레벨업 완료'); renderAll();
}

function sellPlot(id) {
  const plot = Game.state.plots.find(p => p.id === id);
  if (!plot.plantId) {
    toast('빈 밭입니다 🌱');
    return;
  }

  const plant = DATA.plants.find(x => x.id === plot.plantId);
  const amount = getPlotProduction(plot); // 생산량 계산 함수
  const coinsEarned = Math.floor(amount * plant.price * 0.8); // 판매 단가 80%로 계산

  Game.state.coins += coinsEarned;
  toast(`${plant.name} ${amount}개를 팔아서 ${coinsEarned}코인을 얻었습니다! 💰`);

  // 밭 초기화
  plot.plantId = null;
  plot.progress = 0;
  plot.production = 0;
  saveGame();
  updateUI();
}

// 생산량 계산 함수 (업그레이드 레벨, 시간, 자동생산 등 고려)
function getPlotProduction(plot) {
  const baseProduction = 1;
  const levelBonus = 1 + (plot.level * 0.2);
  const timeElapsed = (Date.now() - plot.lastHarvest) / 1000;
  const timeFactor = Math.min(timeElapsed / 5, 5); // 5초당 최대 5배까지만 누적 생산

  return Math.floor(baseProduction * levelBonus * timeFactor);
}

// 팝업/알림 표시용
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerText = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

// 저장
function saveGame() {
  localStorage.setItem('namulVillageSave', JSON.stringify(Game.state));
}

// 불러오기
function loadGame() {
  const data = localStorage.getItem('namulVillageSave');
  if (data) {
    Game.state = JSON.parse(data);
  }
  updateUI();
}
