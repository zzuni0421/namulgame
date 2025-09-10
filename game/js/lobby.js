const API_URL = "/api/namul";

// 요소
const btnOpenLogin = document.getElementById("btnOpenLogin");
const btnOpenRegister = document.getElementById("btnOpenRegister");
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const closeLogin = document.getElementById("closeLogin");
const closeRegister = document.getElementById("closeRegister");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");
const userInfo = document.getElementById("userInfo");
const btnLogout = document.getElementById("btnLogout");
const btnSecret = document.getElementById("btnSecret");

const btnSimulation = document.getElementById("btnSimulation");
const btnTest = document.getElementById("btnTest");
const btnGame = document.getElementById("btnGame");
const gameModal = document.getElementById("gameModal");
const gameList = document.getElementById("gameList");
const btnCloseGameModal = document.getElementById("btnCloseGameModal");

// 유저 처리
function saveUser(username){ localStorage.setItem("namulUser", username); }
function getUser(){ return localStorage.getItem("namulUser") || "(게스트)"; }
function clearUser(){ localStorage.removeItem("namulUser"); }

function updateUI(){
  const user = getUser();
  if(user && user!=="(게스트)"){
    btnOpenLogin.style.display="none";
    btnOpenRegister.style.display="none";
    userInfo.textContent=`어서와요, ${user}님 🌱`;
    userInfo.style.display="block";
    btnLogout.style.display="inline-block";
    btnSecret.style.display="inline-block";
  }else{
    btnOpenLogin.style.display="inline-block";
    btnOpenRegister.style.display="inline-block";
    userInfo.textContent=`게스트로 플레이 중 🌱`;
    userInfo.style.display="block";
    btnLogout.style.display="none";
    btnSecret.style.display="none";
  }
}

// 모달 열기/닫기
function showModal(modal){ modal.style.display="flex"; }
function hideModal(modal){ modal.style.display="none"; }

btnOpenLogin.onclick=()=>showModal(loginModal);
btnOpenRegister.onclick=()=>showModal(registerModal);
closeLogin.onclick=()=>hideModal(loginModal);
closeRegister.onclick=()=>hideModal(registerModal);

// API
async function apiPost(action,payload){
  try{
    const res=await fetch(API_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({action,...payload})
    });
    return await res.json();
  }catch(e){ console.error(action,e); return {success:false,msg:"서버 요청 실패"}; }
}

// 로그인
btnLogin.onclick=async()=>{
  const u=loginUsername.value.trim();
  const p=loginPassword.value.trim();
  if(!u||!p) return;
  const data=await apiPost("login",{username:u,password:p});
  if(data.success){ saveUser(data.username||u); hideModal(loginModal); updateUI(); }
  else alert(data.msg);
};

// 아이디 유효성 검사 (영문+숫자, 3~15자, 한글/띄어쓰기 불가)
function validateUserId(username) {
  const regex = /^[a-zA-Z0-9]{3,15}$/;
  return regex.test(username);
}

// 아이디 중복 확인
async function checkDuplicate(username) {
  const data = await apiPost("checkDuplicate", { username });
  return data.success; // true면 사용 가능, false면 중복
}

// 회원가입
btnRegister.onclick = async () => {
  const u = registerUsername.value.trim();
  const p = registerPassword.value.trim();

  if (!u || !p) {
    alert("아이디와 비밀번호를 입력하세요.");
    return;
  }

  // 아이디 유효성 검사
  if (!validateUserId(u)) {
    alert("아이디는 영문+숫자 조합으로 3~15자만 가능합니다. (한글/띄어쓰기 불가)");
    return;
  }

  // 중복 확인
  const isAvailable = await checkDuplicate(u);
  if (!isAvailable) {
    alert("이미 존재하는 아이디입니다.");
    return;
  }

  // 서버에 회원가입 요청
  const data = await apiPost("register", { username: u, password: p });
  if (data.success) {
    alert("회원가입 성공! 로그인하세요.");
    hideModal(registerModal);
  } else {
    alert(data.msg);
  }
};

// 로그아웃
btnLogout.onclick=()=>{ clearUser(); updateUI(); }

// 하드모드
btnSecret.onclick=()=>{ window.location.href="../../secret.html"; }

// 게임 모달
function openGameModal(genre){
  let html="";
  if(genre==="simulation") html=`
    <button onclick="location.href='/game/html/grownamul.html'">나물 키우기 방치형</button>
    <button onclick="location.href='/game/html/interview.html'">인터뷰 시뮬레이션</button>`;
  else if(genre==="test") html=`
    <button onclick="location.href='/game/html/likecelab.html'">내가 연예인이라면?</button>
    <button onclick="location.href='/game/html/namultest.html'">나물 유형 테스트</button>`;
  else if(genre==="game") html=`
    <button onclick="location.href='/game/html/namulcatch.html'">나물 줍기</button>
    <button onclick="location.href='/game/html/jumpgame.html'">점프 게임</button>`;
  gameList.innerHTML=html;
  showModal(gameModal);
}

btnSimulation.onclick=()=>openGameModal("simulation");
btnTest.onclick=()=>openGameModal("test");
btnGame.onclick=()=>openGameModal("game");
btnCloseGameModal.onclick=()=>hideModal(gameModal);

// 이벤트 배너 클릭
document.querySelector(".event-banner").onclick=()=>{ window.location.href="../../event"; }

// 초기 UI
document.addEventListener("DOMContentLoaded", updateUI);

function togglePopup(id) {
  const popup = document.getElementById(id);
  popup.style.display = (popup.style.display === "block") ? "none" : "block";
}
