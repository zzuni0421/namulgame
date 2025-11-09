const CURRENT_LANG='ko';

const DATA = {
  plants:[
    {id:'p1', name:{ko:'미나리'}, desc:{ko:'초급'}, base:1, sell:1, unlockLab:1},
    {id:'p2', name:{ko:'고사리'}, desc:{ko:'초급'}, base:2, sell:2, unlockLab:1},
    {id:'p3', name:{ko:'두릅'}, desc:{ko:'중급'}, base:3, sell:3, unlockLab:2},
    {id:'p4', name:{ko:'쑥'}, desc:{ko:'중급'}, base:4, sell:4, unlockLab:2},
    {id:'p5', name:{ko:'도라지'}, desc:{ko:'고급'}, base:5, sell:5, unlockLab:3},
    {id:'p6', name:{ko:'삼'}, desc:{ko:'고급'}, base:6, sell:6, unlockLab:3},
    {id:'p7', name:{ko:'우엉'}, desc:{ko:'희귀'}, base:7, sell:7, unlockLab:4},
    {id:'p8', name:{ko:'연근'}, desc:{ko:'희귀'}, base:8, sell:8, unlockLab:4},
    {id:'p9', name:{ko:'도라지2'}, desc:{ko:'희귀'}, base:9, sell:9, unlockLab:5},
    {id:'p10', name:{ko:'칡'}, desc:{ko:'전설'}, base:10, sell:10, unlockLab:6},
    {id:'p11', name:{ko:'민들레'}, desc:{ko:'전설'}, base:11, sell:11, unlockLab:7},
    {id:'p12', name:{ko:'원추리'}, desc:{ko:'전설'}, base:12, sell:12, unlockLab:8},
    {id:'p13', name:{ko:'갓'}, desc:{ko:'전설'}, base:13, sell:13, unlockLab:9},
    {id:'p14', name:{ko:'쑥갓'}, desc:{ko:'전설'}, base:14, sell:14, unlockLab:10},
    {id:'p15', name:{ko:'부추'}, desc:{ko:'전설'}, base:15, sell:15, unlockLab:10}
  ],
  buildings:[
    {id:'market', name:{ko:'시장'}, price:100, effect:{sellMul:1.5}},
    {id:'lab', name:{ko:'연구소'}, price:150, effect:{prodMul:1.5}}
  ],
  residents:[
    {id:'farmer', name:{ko:'농부'}, price:50, bonus:{prodMul:1.2}}
  ],
  events:[
    {name:{ko:'비가 내렸습니다'}, desc:{ko:'모든 밭 생산 2배!'}}
  ]
};

const Game = {
  state:{
    coin:50,
    plots:[],
    residents:[],
    buildings:[],
    totalProduce:0,
    unlockedPlants:['p1','p2','p3'],
    marketLevel:1,
    labLevel:1,
    lastTick:Date.now(),
    news:'게임에 오신 것을 환영합니다!'
  },
  config:{tickMs:1000}
};

function createDefaultPlots(){
  const plots=[];
  for(let i=0;i<20;i++){
    plots.push({id:i, plantId:i<3?`p${i+1}`:null, level:1, lastHarvest:Date.now()});
  }
  return plots;
}

function init(){
  const saved=loadGame();
  if(saved) Game.state=Object.assign(Game.state,saved);
  if(!Game.state.plots || Game.state.plots.length===0) Game.state.plots=createDefaultPlots();
  renderAll();
  setInterval(tick, Game.config.tickMs);
  setInterval(periodicEvent, 30*1000);
}

function renderAll(){
  document.getElementById('coin').innerText=Math.floor(Game.state.coin);
  document.getElementById('totalProduce').innerText=Math.floor(Game.state.totalProduce);
  document.getElementById('resCount').innerText=Game.state.residents.length;
  document.getElementById('marketLevel').innerText=Game.state.marketLevel;
  document.getElementById('labLevel').innerText=Game.state.labLevel;
  document.getElementById('news').innerText=Game.state.news;
  renderMap();
  renderBuildList();
  renderCodex();
}

function renderMap(){
  const map=document.getElementById('map'); map.innerHTML='';
  Game.state.plots.forEach(plot=>{
    const el=document.createElement('div'); el.className='plot';
    const plant=DATA.plants.find(p=>p.id===plot.plantId);
    el.innerHTML=`<b>${plant?plant.name[CURRENT_LANG]:'빈 밭'}</b>
      <div>레벨:${plot.level} 생산:${getPlotProduction(plot)}</div>
      <button class="btn" onclick="openPlot(${plot.id})">관리</button>
      <button class="smallbtn" onclick="sellPlot(${plot.id})">수확 판매</button>`;
    map.appendChild(el);
  });
}

function renderBuildList(){
  const wrap=document.getElementById('buildList'); wrap.innerHTML='';
  DATA.buildings.forEach(b=>{
    const div=document.createElement('div'); div.className='build-item';
    div.innerHTML=`${b.name[CURRENT_LANG]} ${b.price}코인 
      <button class="btn" onclick="buyBuilding('${b.id}')">구매</button>`;
    wrap.appendChild(div);
  });
  DATA.residents.forEach(r=>{
    const div=document.createElement('div'); div.className='build-item';
    div.innerHTML=`${r.name[CURRENT_LANG]} ${r.price}코인 
      <button class="btn" onclick="hireResident('${r.id}')">고용</button>`;
    wrap.appendChild(div);
  });
}

function renderCodex(){
  const c=document.getElementById('codex'); c.innerHTML='';
  DATA.plants.forEach(p=>{
    const unlocked=Game.state.unlockedPlants.includes(p.id);
    const div=document.createElement('div');
    div.innerHTML=`<b>${p.name[CURRENT_LANG]}</b> ${unlocked?'해금':'미해금'} ${p.desc[CURRENT_LANG]}`;
    c.appendChild(div);
  });
}

function openPlot(id){
  const plot=Game.state.plots.find(p=>p.id===id);
  const options=DATA.plants.map(p=>{
    if(Game.state.labLevel>=p.unlockLab) return `<option value='${p.id}'>${p.name[CURRENT_LANG]}</option>`;
    else return '';
  }).join('');
  const html=`<div>현재:${plot.plantId||'빈 밭'}<br>
    식재: <select id='plantSelect'>${options}</select><br>
    <button onclick="plantPlot(${plot.id}, document.getElementById('plantSelect').value)">심기</button>
    <button onclick="levelUpPlot(${plot.id})">레벨업(50코인)</button></div>`;
  const pDiv=document.createElement('div'); pDiv.className='popup'; pDiv.innerHTML=html;
  document.body.appendChild(pDiv);
  pDiv.onclick=e=>{if(e.target===pDiv)pDiv.remove();}
}

function plantPlot(plotId, plantId){
  const plot=Game.state.plots.find(p=>p.id===plotId);
  plot.plantId=plantId;
  if(!Game.state.unlockedPlants.includes(plantId)) Game.state.unlockedPlants.push(plantId);
  toast('심었습니다!');
  renderAll();
}

function levelUpPlot(plotId){
  const plot=Game.state.plots.find(p=>p.id===plotId);
  if(Game.state.coin<50){toast('코인 부족'); return;}
  Game.state.coin-=50; plot.level++;
  toast('레벨업 완료!');
  renderAll();
}

function sellPlot(plotId){
  const plot=Game.state.plots.find(p=>p.id===plotId);
  if(!plot.plantId){toast('빈 밭입니다'); return;}
  const plant=DATA.plants.find(p=>p.id===plot.plantId);
  const amount=getPlotProduction(plot);
  const coins=Math.floor(amount*plant.sell*Game.state.marketLevel);
  Game.state.coin+=coins;
  Game.state.totalProduce+=amount;
  plot.plantId=null;
  plot.lastHarvest=Date.now();
  toast(`${plant.name[CURRENT_LANG]} ${amount}개 판매! ${coins}코인 획득`);
  renderAll();
}

function getPlotProduction(plot){
  if(!plot.plantId) return 0; // 빈 밭
  const plant = DATA.plants.find(p => p.id === plot.plantId);
  if(!plant) return 0; // plant가 없으면 0 반환

  let base = plant.base;
  base *= plot.level * Game.state.labLevel;
  Game.state.residents.forEach(rid => {
    const r = DATA.residents.find(x => x.id === rid);
    if(r?.bonus?.prodMul) base *= r.bonus.prodMul;
  });
  return Math.floor(base);
}

function tick(){
  Game.state.plots.forEach(plot=>{
    const prod=getPlotProduction(plot);
    const autoCoin=prod*0.1*Game.state.marketLevel; // 자동 코인 수익
    Game.state.coin+=autoCoin;
    Game.state.totalProduce+=prod*0.05;
  });
  Game.state.lastTick=Date.now();
  renderAll();
  saveGame();
}

function periodicEvent(){
  const ev=DATA.events[Math.floor(Math.random()*DATA.events.length)];
  Game.state.news=`${ev.name[CURRENT_LANG]}! ${ev.desc[CURRENT_LANG]}`;
  toast(Game.state.news);
  renderAll();
}

function buyBuilding(id){
  const b=DATA.buildings.find(x=>x.id===id);
  if(Game.state.coin<b.price){toast('코인 부족'); return;}
  Game.state.coin-=b.price;
  if(id==='market') Game.state.marketLevel++;
  if(id==='lab') Game.state.labLevel++;
  Game.state.buildings.push(b.id);
  toast(`${b.name[CURRENT_LANG]} 구매 완료!`);
  renderAll();
}

function hireResident(id){
  const r=DATA.residents.find(x=>x.id===id);
  if(Game.state.coin<r.price){toast('코인 부족'); return;}
  Game.state.coin-=r.price;
  Game.state.residents.push(r.id);
  toast(`${r.name[CURRENT_LANG]} 고용 완료!`);
  renderAll();
}

function toast(msg){
  const t=document.createElement('div'); t.className='toast'; t.innerText=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.classList.add('show'),10);
  setTimeout(()=>{t.classList.remove('show'); setTimeout(()=>t.remove(),300)},3000);
}

function saveGame(){localStorage.setItem('namulVillageSave',JSON.stringify(Game.state));}
function loadGame(){const s=localStorage.getItem('namulVillageSave'); return s?JSON.parse(s):null;}

document.addEventListener('DOMContentLoaded',()=>{
  init();
  document.getElementById('btnSave').onclick=()=>{saveGame(); toast('저장 완료');};
  document.getElementById('btnLoad').onclick=()=>{const s=loadGame(); if(s){Game.state=s; renderAll(); toast('불러오기 완료');} else toast('데이터 없음');};
});
