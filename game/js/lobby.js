// ------------------ 설정 ------------------
const API_URL = "/api"; 

const authModal = document.getElementById("authModal");
const registerModal = document.getElementById("registerModal");
const secretModal = document.getElementById("secretModal");
const genreModal = document.getElementById("genreModal");

const btnOpenLogin = document.getElementById("btnOpenLogin");
const btnCloseAuth = document.getElementById("btnCloseAuth");
const btnCloseRegister = document.getElementById("btnCloseRegister");
const btnCloseSecret = document.getElementById("btnCloseSecret");
const btnCloseGenre = document.getElementById("btnCloseGenre");

const linkRegister = document.getElementById("linkRegister");
const btnLogout = document.getElementById("btnLogout");
const btnSecret = document.getElementById("btnSecret");
const loginStatus = document.getElementById("loginStatus");

// ------------------ 모달 열기/닫기 ------------------
function showModal(modal){
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.removeAttribute("aria-hidden");
  modal.removeAttribute("inert");
}
function hideModal(modal){
  modal.style.display = "none";
  modal.setAttribute("aria-hidden","true");
  modal.setAttribute("inert","");
}

// ------------------ 모달 버튼 연결 ------------------
btnOpenLogin.onclick = ()=>showModal(authModal);
btnCloseAuth.onclick = ()=>hideModal(authModal);
linkRegister.onclick = e=>{
  e.preventDefault();
  hideModal(authModal);
  showModal(registerModal);
};
btnCloseRegister.onclick = ()=>hideModal(registerModal);
btnSecret.onclick = ()=>showModal(secretModal);
btnCloseSecret.onclick = ()=>hideModal(secretModal);
btnCloseGenre.onclick = ()=>hideModal(genreModal);

// ------------------ 게임 목록 모달 ------------------
function openModal(type){
  const gameList = document.getElementById("gameList");
  if(type==="simulation") gameList.innerHTML = `
    <button class="btn" onclick="location.href='/game/html/grownamul.html'">🤣 나물 키우기 방치형</button>
    <button class="btn" onclick="location.href='/game/html/interview.html'">🤣 인터뷰 시뮬레이션</button>`;
  else if(type==="test") gameList.innerHTML = `
    <button class="btn" onclick="location.href='/game/html/likecelab.html'">😁 내가 연예인이라면?</button>
    <button class="btn" onclick="location.href='/game/html/namultest.html'">😁 나물 유형 테스트</button>`;
  else if(type==="game") gameList.innerHTML = `
    <button class="btn" onclick="location.href='/game/html/namulcatch.html'">🎮 나물 줍기</button>
    <button class="btn" onclick="location.href='/game/html/jumpgame.html'">🎮 점프 게임</button>`;
  showModal(genreModal);
}

// ------------------ 공통 fetch 함수 ------------------
async function apiPost(action, payload){
  try{
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload })
    });
    return await res.json();
  } catch(err){
    console.error(`${action} fetch 에러:`, err);
    return { success: false, msg: "서버 요청 실패" };
  }
}

// ------------------ 로그인 ------------------
async function login(username,password){
  const data = await apiPost("login",{ username, password });
  if(data.success){
    loginStatus.textContent = `${username}님 로그인됨`;
    btnLogout.style.display="inline-block";
    btnOpenLogin.style.display="none";
    btnSecret.style.display="inline-block";
    hideModal(authModal);
  } else alert(data.msg);
}
document.getElementById("btnLogin").onclick = ()=>{
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  login(username,password);
};

// ------------------ 로그아웃 ------------------
btnLogout.onclick = ()=>{
  loginStatus.textContent = "";
  btnLogout.style.display="none";
  btnOpenLogin.style.display="inline-block";
  btnSecret.style.display="none";
};

// ------------------ 회원가입 ------------------
async function register(username,password){
  const data = await apiPost("register",{ username, password });
  if(data.success){
    alert("회원가입 성공! 로그인하세요.");
    hideModal(registerModal);
    showModal(authModal);
  } else alert(data.msg);
}
document.getElementById("btnRegister").onclick = ()=>{
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
  register(username,password);
};

// ------------------ 시크릿 코드 확인 ------------------
async function checkSecret(username, code){
  return await apiPost("checkSecret",{ username, code });
}
document.getElementById("btnCheckSecret").onclick = async ()=>{
  const username = document.getElementById("loginUsername").value;
  const code = document.getElementById("secretCodeInput").value;
  const data = await checkSecret(username, code);
  if(data.success) location.href = data.url;
  else alert(data.msg);
};

// ------------------ 점수 저장 ------------------
async function saveScore(username,score){
  await apiPost("saveScore",{ username, score });
}

// ------------------ 메모 저장 ------------------
async function saveMemory(username,memory){
  await apiPost("saveMemory",{ username, memory });
}

// ------------------ sendScore ------------------
async function sendScore(username,score){
  await saveScore(username,score);
}
