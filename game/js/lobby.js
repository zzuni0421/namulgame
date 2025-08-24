const API_URL = "https://script.google.com/macros/s/AKfycbwz-8qrTtkc21f28Vnm3Vdfrt4GksWgYIggcPaxdWWjSWqJxeNfy6urL2Fb-V6nXUUPLg/exec";

const authModal = document.getElementById("authModal");
const registerModal = document.getElementById("registerModal");
const secretModal = document.getElementById("secretModal");
const btnOpenLogin = document.getElementById("btnOpenLogin");
const btnCloseAuth = document.getElementById("btnCloseAuth");
const btnCloseRegister = document.getElementById("btnCloseRegister");
const btnCloseSecret = document.getElementById("btnCloseSecret");
const linkRegister = document.getElementById("linkRegister");
const btnLogout = document.getElementById("btnLogout");
const btnSecret = document.getElementById("btnSecret");
const loginStatus = document.getElementById("loginStatus");

// 모달 열기/닫기
function showModal(modal){
  modal.style.display="flex";
  modal.removeAttribute("aria-hidden");
  modal.removeAttribute("inert");
}
function hideModal(modal){
  modal.style.display="none";
  modal.setAttribute("aria-hidden","true");
  modal.setAttribute("inert","");
}

// 로그인 열기/닫기
btnOpenLogin.onclick = ()=>showModal(authModal);
btnCloseAuth.onclick = ()=>hideModal(authModal);

// 회원가입 열기/닫기
linkRegister.onclick = (e)=>{
  e.preventDefault();
  hideModal(authModal);
  showModal(registerModal);
}
btnCloseRegister.onclick = ()=>hideModal(registerModal);

// 시크릿 열기/닫기
btnSecret.onclick = ()=>showModal(secretModal);
btnCloseSecret.onclick = ()=>hideModal(secretModal);

// 게임 목록 모달
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

  showModal(document.getElementById("genreModal"));
}

document.getElementById("btnCloseGenre").onclick = ()=>hideModal(document.getElementById("genreModal"));

// 로그인
async function login(username, password){
  try{
    const res = await fetch(API_URL, {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({action:"login", username, password})
    });
    const data = await res.json();
    if(data.success){
      loginStatus.textContent = username+"님 로그인됨";
      btnLogout.style.display="inline-block";
      btnOpenLogin.style.display="none";
      btnSecret.style.display="inline-block";
      hideModal(authModal);
    } else alert(data.msg);
  } catch(err){ console.error(err);}
}
document.getElementById("btnLogin").onclick = ()=>{
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  login(username,password);
}

// 회원가입
async function register(username, password){
  const res = await fetch(API_URL,{
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({action:"register", username, password})
  });
  const data = await res.json();
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
}

// 시크릿 코드 확인
async function checkSecret(username, code){
  const res = await fetch(API_URL,{
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({action:"checkSecret", username, code})
  });
  return res.json();
}
document.getElementById("btnCheckSecret").onclick = async ()=>{
  const username = document.getElementById("loginUsername").value;
  const code = document.getElementById("secretCodeInput").value;
  const data = await checkSecret(username, code);
  if(data.success) location.href = data.url;
  else alert(data.msg);
}

// 점수 저장
async function saveScore(username, score){
  await fetch(API_URL,{
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({action:"saveScore", username, score})
  });
}
