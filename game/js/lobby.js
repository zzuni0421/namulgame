"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  // Supabase 초기화
  const SUPABASE_URL = "https://uetjeezjqkvpherrpreb.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVldGplZXpqcWt2cGhlcnJwcmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNzYyNjAsImV4cCI6MjA3NTY1MjI2MH0.icCYn-V8ekqk9NKadq7Cls_q8IGtKxZHG7NvDAn7r8w";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: { user } } = await supabase.auth.getUser();
const nickname = user.user_metadata.full_name || user.email.split('@')[0];
document.getElementById("nickname").innerText = nickname;

  // 요소
  const btnOpenLogin = document.getElementById("btnOpenLogin");
  const btnOpenRegister = document.getElementById("btnOpenRegister");
  const btnLogout = document.getElementById("btnLogout");
  const userInfo = document.getElementById("userInfo");

  // 기존 회원가입/로그인 모달은 숨김 (Supabase 로그인만 사용)
  if (btnOpenRegister) btnOpenRegister.style.display = "none";

  // ✅ 로그인 UI 업데이트
  async function updateUserUI() {
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;

    if (user) {
      userInfo.innerHTML = `<p>🌿 ${user.email}님 환영합니다!</p>`;
      btnLogout.style.display = "inline-block";
      btnOpenLogin.style.display = "none";
    } else {
      userInfo.textContent = "로그인되지 않음 🌱";
      btnLogout.style.display = "none";
      btnOpenLogin.style.display = "inline-block";
    }
  }

  // ✅ 구글 로그인 클릭
  btnOpenLogin.addEventListener("click", async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://namulgame.pages.dev", // 반드시 Supabase Auth에 등록된 도메인
      },
    });
    if (error) alert("로그인 실패: " + error.message);
  });

  // ✅ 로그아웃 클릭
  btnLogout.addEventListener("click", async () => {
    await supabase.auth.signOut();
    alert("로그아웃되었습니다 🌿");
    updateUserUI();
  });

  // ✅ 로그인 상태 감지
  supabase.auth.onAuthStateChange((_event, _session) => {
    updateUserUI();
  });

  // ✅ 최초 실행
  updateUserUI();

  // ---- 모달/게임 버튼 로직  ----
  const extraMenuModal = document.getElementById("extraMenuModal");
  const extraMenuBtn = document.getElementById("extraMenuBtn");
  const gameModal = document.getElementById("gameModal");
  const btnCloseGameModal = document.getElementById("btnCloseGameModal");
  const gameList = document.getElementById("gameList");
  const btnSimulation = document.getElementById("btnSimulation");
  const btnTest = document.getElementById("btnTest");
  const btnGame = document.getElementById("btnGame");

  function showModal(modal){ if(modal) modal.style.display = "flex"; }
  function hideModal(modal){ if(modal) modal.style.display = "none"; }

  extraMenuBtn && (extraMenuBtn.onclick = () => showModal(extraMenuModal));
  btnCloseGameModal && (btnCloseGameModal.onclick = () => hideModal(gameModal));

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

  btnSimulation && (btnSimulation.onclick = () => openGameModal("simulation"));
  btnTest && (btnTest.onclick = () => openGameModal("test"));
  btnGame && (btnGame.onclick = () => openGameModal("game"));
});
