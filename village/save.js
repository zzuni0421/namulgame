const SAVE_KEY = 'namul_village_v1';
function saveGame(state){
localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
function loadGame(){
const raw = localStorage.getItem(SAVE_KEY);
if(!raw) return null;
try{ return JSON.parse(raw); }catch(e){return null}
}
function resetSave(){ localStorage.removeItem(SAVE_KEY); }
