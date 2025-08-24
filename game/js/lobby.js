const API_URL = "https://script.google.com/macros/s/AKfycbyedTR5QJOGJJDycqd-Z2uB6Ql-3pwSY8tFq0r9PXYz8JDrJAstLbBbT9pklP5tTAa-Mw/exec";

document.addEventListener("DOMContentLoaded", () => {
  // 모달 요소
  const genreModal = document.getElementById("genreModal");
  const authModal = document.getElementById("authModal");
  const registerModal = document.getElementById("registerModal");
  const secretModal = document.getElementById("secretModal");

  // 버튼 요소
  const btnOpenLogin = document.getElementById("btnOpenLogin");
  const btnLogout = document.getElementById("btnLogout");
  const btnSecret = document.getElementById("btnSecret");
  const btnCloseGenre = document.getElementById("btnCloseGenre");
  const btnCloseAuth = document.getElementById("btnCloseAuth");
  const btnCloseRegister = document.getElementById("btnCloseRegister");
  const btnCloseSecret = document.getElementById("btnCloseSecret");
  const btnLogin = document.getElementById("btnLogin");
  const btnRegister = document.getElementById("btnRegister");
  const btnCheckSecret = document.getElementById("btnCheckSecret");

  const loginStatus = document.getElementById("loginStatus");
  const eventLink = document.getElementById("eventLink");
  const eventHow = document.getElementById("eventHow");
  const eventHint = document.getElementById("eventHint");

  // 로컬 로그인 상태
  let currentUser = localStorage.getItem("nGameUser") || null;
  updateLoginUI();

  // -------------------- 모달 오픈/클로즈 --------------------
  window.openModal = (type) => {
    const modal = genreModal;
    const title = document.getElementById("modalTitle");
    const gameList = document.getElementById("gameList");
    gameList.innerHTML = "";

    if(type === "simulation") gameList.innerHTML = `
  <button class="btn" onclick="location.href='/game/html/grownamul.html'">🤣 나물 키우기 방치형</button>
  <button class="btn" onclick="location.href='/game/html/interview.html'">🤣 인터뷰 시뮬레이션</button>
`;
else if(type === "test") gameList.innerHTML = `
  <button class="btn" onclick="location.href='/game/html/likecelab.html'">😁 내가 연예인이라면?</button>
  <button class="btn" onclick="location.href='/game/html/namultest.html'">😁 나물 유형 테스트</button>
`;
else if(type === "game") gameList.innerHTML = `
  <button class="btn" onclick="location.href='/game/html/namulcatch.html'">🎮 나물 줍기</button>
  <button class="btn" onclick="location.href='/game/html/jumpgame.html'">🎮 점프 게임</button>
`;

    title.textContent = type === "simulation" ? "시뮬레이션" : type === "test" ? "테스트" : "게임";
    modal.setAttribute("aria-hidden", "false");
  };

  btnCloseGenre.onclick = () => genreModal.setAttribute("aria-hidden", "true");
  btnCloseAuth.onclick = () => authModal.setAttribute("aria-hidden", "true");
  btnCloseRegister.onclick = () => registerModal.setAttribute("aria-hidden", "true");
  btnCloseSecret.onclick = () => secretModal.setAttribute("aria-hidden", "true");

  // -------------------- 로그인/로그아웃 --------------------
  btnOpenLogin.onclick = () => authModal.setAttribute("aria-hidden", "false");
  btnLogout.onclick = () => {
    currentUser = null;
    localStorage.removeItem("nGameUser");
    updateLoginUI();
  };

  btnLogin.onclick = async () => {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if(!username || !password) return alert("아이디와 비밀번호를 입력해주세요.");

    try {
      const res = await login(username, password);
      if(res.success){
        currentUser = username;
        localStorage.setItem("nGameUser", currentUser);
        updateLoginUI();
        authModal.setAttribute("aria-hidden", "true");
      } else alert(res.message);
    } catch(e) { alert("로그인 실패. 다시 시도해주세요."); }
  };

  btnRegister.onclick = async () => {
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const agree = document.getElementById("agreeLicense").checked;
    if(!username || !password) return alert("아이디와 비밀번호를 입력해주세요.");
    if(!agree) return alert("라이선스 동의가 필요합니다.");

    try {
      const res = await register(username, password);
      if(res.success){
        alert("회원가입 완료! 로그인해주세요.");
        registerModal.setAttribute("aria-hidden", "true");
      } else alert(res.message);
    } catch(e) { alert("회원가입 실패. 다시 시도해주세요."); }
  };

  btnCheckSecret.onclick = async () => {
    if(!currentUser) return alert("로그인 후 이용 가능합니다.");
    const code = document.getElementById("secretCodeInput").value.trim();
    if(!code) return alert("코드를 입력해주세요.");

    try {
      const res = await checkSecret(currentUser, code);
      if(res.success) alert("시크릿 스테이지 입장 가능!");
      else alert(res.message);
    } catch(e){ alert("시크릿 코드 확인 실패."); }
  };

  // -------------------- UI 업데이트 --------------------
  function updateLoginUI(){
    if(currentUser){
      loginStatus.textContent = `${currentUser}님 환영합니다!`;
      btnOpenLogin.style.display = "none";
      btnLogout.style.display = "inline-block";
      btnSecret.style.display = "inline-block";

      eventLink.classList.remove("disabled");
      eventLink.removeAttribute("aria-disabled");
      eventHint.style.display = "none";
      eventHow.classList.remove("disabled");
      eventHow.removeAttribute("aria-disabled");
    } else {
      loginStatus.textContent = "비로그인 상태";
      btnOpenLogin.style.display = "inline-block";
      btnLogout.style.display = "none";
      btnSecret.style.display = "none";

      eventLink.classList.add("disabled");
      eventLink.setAttribute("aria-disabled","true");
      eventHint.style.display = "inline";
      eventHow.classList.add("disabled");
      eventHow.setAttribute("aria-disabled","true");
    }
  }

});

// -------------------- API 함수 --------------------
async function register(username, password) {
  const res = await fetch(API_URL, { method:"POST", body: JSON.stringify({action:"register", username, password}) });
  return res.json();
}

async function login(username, password) {
  const res = await fetch(API_URL, { method:"POST", body: JSON.stringify({action:"login", username, password}) });
  return res.json();
}

async function checkSecret(username, code){
  const res = await fetch(API_URL,{ method:"POST", body: JSON.stringify({action:"checkSecret", username, code}) });
  return res.json();
}

async function saveScore(username, score){
  await fetch(API_URL,{ method:"POST", body: JSON.stringify({action:"saveScore", username, score}) });
}

async function saveMemory(username, memory){
  await fetch(API_URL,{ method:"POST", body: JSON.stringify({action:"saveMemory", username, memory}) });
}
