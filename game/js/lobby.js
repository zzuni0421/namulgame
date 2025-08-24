const gameData = {
  simulation: {
    title: "시뮬레이션",
    games: [
      { name: "🌱 나물 키우기 방치형", url: "game/html/grownamul.html", id: "grownamul" },
      { name: "🎤 인터뷰 시뮬레이터", url: "game/html/interview.html", id: "interview" },
    ]
  },
  test: {
    title: "테스트",
    games: [
      { name: "🍀 나물 유형 테스트", url: "game/html/namultest.html", id: "namultest" },
      { name: "✨ 내가 연예인이라면?", url: "game/html/likecelab.html", id: "likecelab" },
    ]
  },
  game: {
    title: "게임",
    games: [
      { name: "🕹️ 점프 게임", url: "game/html/jumpgame.html", id: "jumpgame" },
      { name: "🌿 나물 줍기 게임", url: "game/html/namulcatch.html", id: "namulcatch" },
    ]
  }
};

const USERS_KEY = "namul_users";             // { [username]: { password, scores: [{id,score,ts}], memories: string[] } }
const CURRENT_USER_KEY = "namul_current_user";
const SECRET_CODE = "NAMULGAMEOPEN0421SECRETEVENT";
const SECRET_STAGE_URL = "secret-stage.html";

const $ = (sel) => document.querySelector(sel);
const bodyScroll = {
  lock(){ document.documentElement.style.overflow = "hidden"; },
  unlock(){ document.documentElement.style.overflow = ""; }
};
function openModalEl(el){ el.classList.add("show"); el.setAttribute("aria-hidden","false"); bodyScroll.lock(); }
function closeModalEl(el){ el.classList.remove("show"); el.setAttribute("aria-hidden","true"); bodyScroll.unlock(); }

function openModal(genre) {
  const modal = $("#genreModal");
  const title = $("#modalTitle");
  const list = $("#gameList");
  const { title: genreTitle, games } = gameData[genre];

  title.textContent = genreTitle;
  list.innerHTML = "";

  games.forEach(game => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = game.name;
    btn.onclick = () => {
      // 비로그인도 게임 플레이는 허용
      window.location.href = game.url;
    };
    list.appendChild(btn);
  });

  openModalEl(modal);
}
function closeModal(){ closeModalEl($("#genreModal")); }

function getUsers(){ return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
function setUsers(obj){ localStorage.setItem(USERS_KEY, JSON.stringify(obj)); }
function getCurrentUser(){ return localStorage.getItem(CURRENT_USER_KEY); }

function updateLoginUI(){
  const user = getCurrentUser();
  const status = $("#loginStatus");
  const btnOpen = $("#btnOpenLogin");
  const btnLogout = $("#btnLogout");
  const btnSecret = $("#btnSecret");

  if (user){
    status.textContent = `${user} 님 로그인됨`;
    btnOpen.style.display = "none";
    btnLogout.style.display = "inline-block";
    btnSecret.style.display = "inline-block";
    // 이벤트/랭킹 활성
    enableEvent(true);
  } else {
    status.textContent = "비로그인 상태";
    btnOpen.style.display = "inline-block";
    btnLogout.style.display = "none";
    btnSecret.style.display = "none";
    // 이벤트/랭킹 비활성
    enableEvent(false);
  }
}

function enableEvent(isOn){
  const link1 = $("#eventLink");
  const link2 = $("#eventHow");
  const hint = $("#eventHint");
  if (isOn){
    link1.classList.remove("disabled"); link1.removeAttribute("aria-disabled"); link1.removeAttribute("title");
    link2.classList.remove("disabled"); link2.removeAttribute("aria-disabled"); link2.removeAttribute("title");
    hint.textContent = "(이벤트 참여 가능)";
  } else {
    link1.classList.add("disabled"); link1.setAttribute("aria-disabled","true"); link1.setAttribute("title","로그인 필요");
    link2.classList.add("disabled"); link2.setAttribute("aria-disabled","true"); link2.setAttribute("title","로그인 필요");
    hint.textContent = "(로그인하면 이용 가능)";
  }
}

/* 로그인 절차 */
function openAuth(){ openModalEl($("#authModal")); }
function closeAuth(){ closeModalEl($("#authModal")); }
function openRegister(){ closeAuth(); openModalEl($("#registerModal")); }
function closeRegister(){ closeModalEl($("#registerModal")); }
function openSecret(){ 
  if (!getCurrentUser()){ alert("로그인 후 이용 가능합니다."); return; }
  openModalEl($("#secretModal")); 
}
function closeSecret(){ closeModalEl($("#secretModal")); }

function register(){
  const username = $("#registerUsername").value.trim();
  const password = $("#registerPassword").value.trim();
  const agree = $("#agreeLicense").checked;

  if (!username || !password){ alert("아이디/비밀번호를 입력하세요."); return; }
  if (!agree){ alert("라이선스에 동의해야 가입할 수 있습니다."); return; }

  const users = getUsers();
  if (users[username]){ alert("이미 존재하는 아이디입니다."); return; }

  users[username] = { password, scores: [], memories: [] };
  setUsers(users);

  alert("회원가입 성공! 이제 로그인하세요.");
  closeRegister(); openAuth();
}

function login(){
  const username = $("#loginUsername").value.trim();
  const password = $("#loginPassword").value.trim();
  const users = getUsers();

  if (!username || !password){ alert("아이디/비밀번호를 입력하세요."); return; }
  if (!users[username] || users[username].password !== password){
    alert("아이디 또는 비밀번호가 올바르지 않습니다."); return;
  }
  localStorage.setItem(CURRENT_USER_KEY, username);
  closeAuth();
  updateLoginUI();
  alert(`${username} 님 환영합니다!`);
}

function logout(){
  localStorage.removeItem(CURRENT_USER_KEY);
  updateLoginUI();
  alert("로그아웃 되었습니다.");
}

function checkSecretCode(){
  const input = $("#secretCodeInput").value.trim();
  if (!getCurrentUser()){ alert("로그인 후 이용 가능합니다."); return; }
  if (input === SECRET_CODE){
    alert("🎉 시크릿 스테이지로 이동합니다!");
    window.location.href = SECRET_STAGE_URL;
  } else {
    alert("❌ 코드가 틀렸습니다.");
  }
  $("#secretCodeInput").value = "";
  closeSecret();
}

function saveScore(gameId, score){
  const user = getCurrentUser();
  if (!user) return false; // 비로그인은 저장 안 함

  const users = getUsers();
  const u = users[user];
  if (!u) return false;

  u.scores.push({ id: gameId, score: Number(score)||0, ts: Date.now() });
  const best = u.scores.filter(s=>s.id===gameId).reduce((m,s)=>Math.max(m,s.score),0);
  if (best === score){
    u.memories.push(`[${new Date().toLocaleString()}] ${gameId} 최고기록 ${score}점 달성!`);
  }
  setUsers(users);
  return true;
}

function getRanking(gameId, topN=10){
  // 모든 유저의 해당 게임 최고점 TopN
  const users = getUsers();
  const rows = Object.entries(users).map(([name, obj])=>{
    const best = (obj.scores||[])
      .filter(s=>s.id===gameId)
      .reduce((m,s)=>Math.max(m,s.score), -Infinity);
    return { name, best: best===-Infinity? null : best };
  }).filter(r=>r.best!==null);

  rows.sort((a,b)=>b.best - a.best);
  return rows.slice(0, topN);
}

document.addEventListener("DOMContentLoaded", ()=>{
  // 장르 모달 닫기
  $("#btnCloseGenre").addEventListener("click", closeModal);
  $("#genreModal").addEventListener("click", (e)=>{ if(e.target.id==="genreModal") closeModal(); });

  // 로그인/회원가입/시크릿 모달 버튼
  $("#btnOpenLogin").addEventListener("click", openAuth);
  $("#btnCloseAuth").addEventListener("click", closeAuth);
  $("#linkRegister").addEventListener("click", (e)=>{ e.preventDefault(); openRegister(); });

  $("#btnCloseRegister").addEventListener("click", closeRegister);
  $("#btnRegister").addEventListener("click", register);
  $("#btnLogin").addEventListener("click", login);
  $("#btnLogout").addEventListener("click", logout);

  $("#btnSecret").addEventListener("click", openSecret);
  $("#btnCloseSecret").addEventListener("click", closeSecret);
  $("#btnCheckSecret").addEventListener("click", checkSecretCode);

  // ESC 로 모든 모달 닫기
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape"){
      [ "#genreModal", "#authModal", "#registerModal", "#secretModal" ]
        .forEach(sel => { const el = $(sel); if (el.classList.contains("show")) closeModalEl(el); });
    }
  });

  updateLoginUI();
});

// 전역 노출 (필요 시 게임 페이지에서 import 없이 접근)
window.openModal = openModal;
window.closeModal = closeModal;
window.saveScore = saveScore;
window.getRanking = getRanking;
