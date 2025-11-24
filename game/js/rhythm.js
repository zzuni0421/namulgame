/* K-Meme Rhythm Survival


// controls
function movePlayer(dir){
const col = playerPos % COLS;
let newCol = col + dir;
if(newCol < 0) newCol = 0;
if(newCol > COLS-1) newCol = COLS-1;
const row = Math.floor(playerPos / COLS);
playerPos = row*COLS + newCol;
placePlayer(playerPos);
}


// keyboard
window.addEventListener('keydown', e=>{
if(e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') movePlayer(-1);
if(e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') movePlayer(1);
});


// mobile touch: tap left/right half
document.getElementById('stage').addEventListener('touchstart', e=>{
const t = e.touches[0];
const rect = gridEl.getBoundingClientRect();
const x = t.clientX - rect.left;
if(x < rect.width/2) movePlayer(-1); else movePlayer(1);
});


startBtn.addEventListener('click', startGame);


// init
createGrid();


// handle window resize to reposition player
window.addEventListener('resize', ()=>placePlayer(playerPos));


// helper: simple autoset audio volume
volInput.addEventListener('input', ()=>{
const v = volInput.value;
[sfxWarn, sfxDrop, sfxHit].forEach(a=>a.volume = v);
});


// optional: developer helper to quickly set sfx via drag & drop onto audio elements
['sfx-warn','sfx-drop','sfx-hit'].forEach(id=>{
const el = document.getElementById(id);
el.addEventListener('dragover', e=>e.preventDefault());
el.addEventListener('drop', e=>{
e.preventDefault();
const file = e.dataTransfer.files[0];
if(file){
el.src = URL.createObjectURL(file);
el.load();
}
});
});
