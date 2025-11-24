/* K-Meme Rhythm Survival
간단 버전: 5x5 그리드, 리듬 타이밍에 따라 경고->드롭
플레이어 이동: 모바일 터치(좌/우) or 키보드 ← → / A D
*/


const COLS = 5;
const ROWS = 5;
const GRID_SIZE = COLS * ROWS;


const gridEl = document.getElementById('grid');
const playerEl = document.getElementById('player');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('startBtn');
const bpmInput = document.getElementById('bpm');
const volInput = document.getElementById('vol');


const sfxWarn = document.getElementById('sfx-warn');
const sfxDrop = document.getElementById('sfx-drop');
const sfxHit = document.getElementById('sfx-hit');


let tiles = [];
let playerPos = 12; // center index (0..24)
let playing = false;
let score = 0;
let startTime = 0;
let tickInterval = null;
let stepCount = 0;


// basic patterns for rhythm (arrays of indices to drop)
const basePatterns = [
[12], // center
[7,17], // up-down
[0,4,20,24], // corners
[10,11,12,13,14], // row
[2,7,12,17,22] // column-like
];


function createGrid(){
gridEl.innerHTML = '';
tiles = [];
for(let r=0;r<ROWS;r++){
for(let c=0;c<COLS;c++){
const idx = r*COLS + c;
const t = document.createElement('div');
t.className = 'tile';
t.dataset.index = idx;
t.innerHTML = '';
gridEl.appendChild(t);
tiles.push(t);
}
}
placePlayer(playerPos);
}
