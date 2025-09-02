// lobby.js
const API_URL = "/api/namul";

const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("btnLogin");

const registerForm = document.getElementById("registerForm");
const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const registerBtn = document.getElementById("btnRegister");

const userInfo = document.getElementById("userInfo");
const logoutBtn = document.getElementById("btnLogout");
const btnSecret = document.getElementById("btnSecret");

const gameModal = document.getElementById("gameModal");
const gameList = document.getElementById("gameList");
const btnCloseGameModal = document.getElementById("btnCloseGameModal");

function saveUser(username){ localStorage.setItem("namulUser", username); }
function getUser(){ return localStorage.getItem("namulUser") || null; }
function clearUser(){ localStorage.removeItem("namulUser"); }

function updateUI(){
  const user = getUser();
  if(user){
    loginForm.style.display="none";
    registerForm.style.display="none";
    userInfo.textContent=`어서와요, ${user}님 🌱`;
    userInfo.style.display="block";
    logoutBtn.style.display="inline-block";
    btnSecret.style.display=localStorage.getItem("hardmode")?"inline-block":"none";
  }else{
    loginForm.style.display="block";
    registerForm.style.display="block";
    userInfo.style.display="none";
    logoutBtn.style.display="none";
    btnSecret.style.display="none";
  }
}

async function apiPost(action,payload){
  try{
    const res=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,...payload})});
    return await res.json();
  }catch(e){ console.error(action,e); return {success:false,msg:"서버 요청 실패"}; }
}

async function login(username,password){
  const data = await apiPost("login",{username,password});
  if(data.success){ saveUser(data.username||username); updateUI(); }
  else alert(data.msg);
}

loginBtn.onclick=()=>{ const u=loginUsername.value.trim(); const p=loginPassword.value.trim(); if(u&&p) login(u,p); }

async function register(username,password){
  const data = await apiPost("register",{username,password});
  if(data.success) alert("회원가입 성공! 로그인하세요."); else alert(data.msg);
}
registerBtn.onclick=()=>{ const u=registerUsername.value.trim(); const p=registerPassword.value.trim(); if(u&&p) register(u,p); }

document.addEventListener("DOMContentLoaded",()=>{ updateUI(); });

logoutBtn.onclick=()=>{ clearUser(); updateUI(); }

btnSecret.onclick=()=>{ if(!getUser()){ alert("로그인 후 이용 가능합니다."); return; } window.location.href="../../secret.html"; }

function openGameModal(genre){
  let html="";
  if(genre==="simulation") html=`<button onclick="location.href='/game/html/grownamul.html'">나물 키우기 방치형</button><button onclick="location.href='/game/html/interview.html'">인터뷰 시뮬레이션</button>`;
  else if(genre==="test") html=`<button onclick="location.href='/game/html/likecelab.html'">내가 연예인이라면?</button><button onclick="location.href='/game/html/namultest.html'">나물 유형 테스트</button>`;
  else if(genre==="game") html=`<button onclick="location.href='/game/html/namulcatch.html'">나물 줍기</button><button onclick="location.href='/game/html/jumpgame.html'">점프 게임</button>`;
  gameList.innerHTML=html;
  gameModal.style.display="flex";
}

document.getElementById("btnSimulation").onclick=()=>openGameModal("simulation");
document.getElementById("btnTest").onclick=()=>openGameModal("test");
document.getElementById("btnGame").onclick=()=>openGameModal("game");
btnCloseGameModal.onclick=()=>gameModal.style.display="none";

document.querySelector(".event-banner").onclick=()=>{ window.location.href="../../event"; }
