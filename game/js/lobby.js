const API_URL = "https://script.google.com/macros/s/AKfycbybFbvh-mGhCw2aNZqBwH8LtA1fjbka7uTZ84F6yfHpOCCYzaGqduUAHujHIXzEPlM-Dg/exec";

// DOM 로드 후 이벤트 연결
document.addEventListener("DOMContentLoaded", ()=>{
  const btnOpenLogin = document.getElementById("btnOpenLogin");
  const btnCloseAuth = document.getElementById("btnCloseAuth");
  const authModal = document.getElementById("authModal");

  btnOpenLogin.addEventListener("click", ()=>{
    authModal.style.display = "flex";
    authModal.removeAttribute("aria-hidden");
    authModal.removeAttribute("inert");
  });

  btnCloseAuth.addEventListener("click", ()=>{
    authModal.style.display = "none";
    authModal.setAttribute("aria-hidden","true");
    authModal.setAttribute("inert","");
  });

  // 로그인 버튼
  document.getElementById("btnLogin").addEventListener("click", async ()=>{
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    try{
      const res = await fetch(API_URL,{
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({action:"login", username, password})
      });
      const data = await res.json();
      if(data.success){
        document.getElementById("loginStatus").textContent = username + "님 로그인됨";
        document.getElementById("btnLogout").style.display = "inline-block";
        btnOpenLogin.style.display = "none";
        authModal.style.display = "none";
      } else alert(data.msg);
    } catch(err){ console.error(err); }
  });

  // 모달 닫기
  document.getElementById("btnCloseGenre").addEventListener("click", ()=>{
    closeModal();
  });
});

// ===== 모달 열기 =====
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

  const modal = document.getElementById("genreModal");
  modal.style.display = "flex";
  modal.removeAttribute("aria-hidden");
  modal.removeAttribute("inert");
}

function closeModal(){
  const modal = document.getElementById("genreModal");
  modal.style.display="none";
  modal.setAttribute("aria-hidden","true");
  modal.setAttribute("inert","");
}
