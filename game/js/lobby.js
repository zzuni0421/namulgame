"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "/api/namul";

  // --- 요소 가져오기 ---
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

  const extraMenuModal = document.getElementById("extraMenuModal");
  const extraMenuBtn = document.getElementById("extraMenuBtn");

  // --- 유저 처리 ---
  function saveUser(username){ localStorage.setItem("namulUser", username); }
  function getUser(){ return localStorage.getItem("namulUser") || "(게스트)"; }
  function clearUser(){ localStorage.removeItem("namulUser"); }

  function updateUI(){
    const user = getUser();
    if(user && user !== "(게스트)"){
      btnOpenLogin.style.display="none";
      btnOpenRegister.style.display="none";
      userInfo.textContent=`어서와요, ${user}님 🌱`;
      userInfo.style.display="block";
      btnLogout.style.display="inline-block";
      btnSecret.style.display="inline-block";
    } else {
      btnOpenLogin.style.display="inline-block";
      btnOpenRegister.style.display="inline-block";
      userInfo.textContent=`게스트로 플레이 중 🌱`;
      userInfo.style.display="block";
      btnLogout.style.display="none";
      btnSecret.style.display="none";
    }
  }

  // --- 모달 도우미 ---
  function showModal(modal){
    if(!modal) return;
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden","false");
  }
  function hideModal(modal){
    if(!modal) return;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden","true");
  }

  // --- 각 버튼으로 열기 ---
  btnOpenLogin && (btnOpenLogin.onclick = () => showModal(loginModal));
  btnOpenRegister && (btnOpenRegister.onclick = () => showModal(registerModal));
  btnSimulation && (btnSimulation.onclick = () => openGameModal("simulation"));
  btnTest && (btnTest.onclick = () => openGameModal("test"));
  btnGame && (btnGame.onclick = () => openGameModal("game"));
  btnCloseGameModal && (btnCloseGameModal.onclick = () => hideModal(gameModal));
  extraMenuBtn && (extraMenuBtn.onclick = () => showModal(extraMenuModal));

  // --- 각 모달 내부의 [×] 버튼들에 이벤트 바인딩 (더 안전하게) ---
  document.querySelectorAll('.modal').forEach(modalEl => {
    modalEl.querySelectorAll('.close').forEach(closeEl => {
      closeEl.addEventListener('click', () => hideModal(modalEl));
    });
  });

  // --- 배경 클릭으로 닫기 (클릭 대상이 modal 자체면 닫기) ---
  window.addEventListener('click', (e) => {
    document.querySelectorAll('.modal').forEach(modalEl => {
      if (e.target === modalEl) hideModal(modalEl);
    });
  });

  // --- ESC 키로 닫기 ---
  window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modalEl => hideModal(modalEl));
    }
  });

  // --- API 헬퍼 ---
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

  // --- 로그인 처리 ---
  btnLogin && (btnLogin.onclick = async () => {
    const u = loginUsername.value.trim();
    const p = loginPassword.value.trim();
    if(!u || !p) { alert("아이디와 비밀번호를 입력하세요."); return; }
    const data = await apiPost("login",{username:u,password:p});
    if (data.success) { saveUser(data.username || u); hideModal(loginModal); updateUI(); }
    else alert(data.msg || "로그인 실패");
  });

  // --- 회원가입 유효성 ---
  const idFeedback = document.getElementById("idFeedback");
  function validateUserId() {
    const val = registerUsername ? registerUsername.value.trim() : "";
    const regex = /^[a-zA-Z0-9]{3,15}$/;
    if(!val) { if(idFeedback) idFeedback.textContent = ""; return false; }
    const ok = regex.test(val);
    if(idFeedback) idFeedback.textContent = ok ? "사용 가능한 형식입니다." : "영문+숫자 3~15자만 허용됩니다.";
    return ok;
  }

  // --- 중복 확인 (인라인 버튼에서 값 전달) ---
  async function checkDuplicate(username){
    if(!username) { alert("아이디를 입력하세요."); return false; }
    if(!/^[a-zA-Z0-9]{3,15}$/.test(username)) { alert("아이디 형식이 올바르지 않습니다."); return false; }
    const data = await apiPost("checkDuplicate", { username });
    if(data && data.success){
      alert("사용 가능한 아이디입니다.");
      return true;
    } else {
      alert(data.msg || "이미 존재하는 아이디입니다.");
      return false;
    }
  }
  window.checkDuplicate = checkDuplicate; // 인라인 호출 지원

  // --- 회원가입 버튼 처리 ---
  btnRegister && (btnRegister.onclick = async () => {
    const u = registerUsername.value.trim();
    const p = registerPassword.value.trim();
    if(!u || !p) { alert("아이디와 비밀번호를 입력하세요."); return; }
    if(!validateUserId()) { alert("아이디 형식을 확인하세요."); return; }
    const isAvailable = await checkDuplicate(u);
    if(!isAvailable) return;
    const data = await apiPost("register",{ username:u, password:p });
    if(data.success){ alert("회원가입 성공! 로그인하세요."); hideModal(registerModal); }
    else alert(data.msg || "회원가입 실패");
  });

  // --- 로그아웃 / 하드모드 이동 ---
  btnLogout && (btnLogout.onclick = () => { clearUser(); updateUI(); });
  btnSecret && (btnSecret.onclick = () => { window.location.href = "../../secret.html"; });

  // --- 게임 리스트 모달 생성 ---
  function openGameModal(genre){
    let html = "";
    if(genre==="simulation") html = `
      <button onclick="location.href='/game/html/grownamul.html'">나물 키우기 방치형</button>
      <button onclick="location.href='/game/html/stock.html'">주식왕 도전</button>
      <button onclick="location.href='/solar'">우주 탐험</button>
      <button onclick="location.href='/game/html/interview.html'">인터뷰 시뮬레이션</button>`;
    else if(genre==="test") html = `
      <button onclick="location.href='/game/html/likecelab.html'">내가 연예인이라면?</button>
      <button onclick="location.href='/game/html/namultest.html'">나물 유형 테스트</button>`;
    else if(genre==="game") html = `
      <button onclick="location.href='/game/html/namulcatch.html'">나물 줍기</button>
      <button onclick="location.href='/game/html/jumpgame.html'">점프 게임</button>`;
    gameList.innerHTML = html;
    showModal(gameModal);
  }

  // --- 이벤트 배너 클릭 이동 ---
  const banner = document.querySelector(".event-banner");
  banner && (banner.onclick = () => { window.location.href = "../../event"; });

  // --- 초기화 ---
  updateUI();

  // expose some helpers for inline HTML (validateUserId already inline)
  window.validateUserId = validateUserId;
  window.openGameModal = openGameModal;
});
