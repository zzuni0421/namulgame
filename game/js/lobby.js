// ------------------ 설정 ------------------
const API_URL = "/api/namul";

const authModal = document.getElementById("authModal");
const registerModal = document.getElementById("registerModal");
const genreModal = document.getElementById("genreModal");

const btnOpenLogin = document.getElementById("btnOpenLogin");
const btnCloseAuth = document.getElementById("btnCloseAuth");
const btnCloseRegister = document.getElementById("btnCloseRegister");
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
    // 디버깅용 로그
    console.log(`${action} fetch status:`, res.status, res.statusText);
    const text = await res.text();
    console.log(`${action} fetch text:`, text);
    return JSON.parse(text);
  } catch(err){
    console.error(`${action} fetch 에러:`, err);
    return { success: false, msg: "서버 요청 실패" };
  }
}

// ------------------ 자동 로그인 ------------------
async function autoLogin(){
  const token = localStorage.getItem("token");
  if(!token) return; // 토큰 없으면 그냥 비로그인 플레이
  const data = await apiPost("tokenLogin", { token });
  if(data.success){
    loginStatus.textContent = `${data.username}님 로그인됨`;
    btnLogout.style.display="inline-block";
    btnOpenLogin.style.display="none";
    btnSecret.style.display="inline-block";
  } else {
    localStorage.removeItem("token"); // 토큰 만료 시 삭제
  }
}
document.addEventListener("DOMContentLoaded", autoLogin);

// ------------------ 로그인 ------------------
async function login(username,password){
  const data = await apiPost("login",{ username, password });
  if(data.success){
    localStorage.setItem("token", data.token); // 자동 로그인용 저장
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
  localStorage.removeItem("token");
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

// ------------------ 하드모드 버튼 ------------------
btnSecret.onclick = () => {
  const token = localStorage.getItem("token");
  if(!token){
    alert("로그인 후 이용 가능합니다.");
    return;
  }
  window.location.href = "../../secret.html";
};
