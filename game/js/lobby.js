const API_URL = "https://script.google.com/macros/s/AKfycbybFbvh-mGhCw2aNZqBwH8LtA1fjbka7uTZ84F6yfHpOCCYzaGqduUAHujHIXzEPlM-Dg/exec";

document.addEventListener("DOMContentLoaded", ()=>{

  const btnOpenLogin = document.getElementById("btnOpenLogin");
  const authModal = document.getElementById("authModal");
  const btnCloseAuth = document.getElementById("btnCloseAuth");

  const registerModal = document.getElementById("registerModal");
  const btnCloseRegister = document.getElementById("btnCloseRegister");
  const linkRegister = document.getElementById("linkRegister");

  const secretModal = document.getElementById("secretModal");
  const btnCloseSecret = document.getElementById("btnCloseSecret");

  const btnSecret = document.getElementById("btnSecret");

  // 로그인 모달 열기
  btnOpenLogin.addEventListener("click", ()=>{
    authModal.style.display = "flex";
    authModal.removeAttribute("aria-hidden");
    authModal.removeAttribute("inert");
  });

  // 로그인 모달 닫기
  btnCloseAuth.addEventListener("click", ()=>{
    authModal.style.display = "none";
    authModal.setAttribute("aria-hidden","true");
    authModal.setAttribute("inert","");
  });

  // 회원가입 모달 열기
  linkRegister.addEventListener("click", (e)=>{
    e.preventDefault();
    authModal.style.display = "none";
    authModal.setAttribute("aria-hidden","true");
    authModal.setAttribute("inert","");
    registerModal.style.display = "flex";
    registerModal.removeAttribute("aria-hidden");
    registerModal.removeAttribute("inert");
  });

  // 회원가입 모달 닫기
  btnCloseRegister.addEventListener("click", ()=>{
    registerModal.style.display = "none";
    registerModal.setAttribute("aria-hidden","true");
    registerModal.setAttribute("inert","");
  });

  // 로그인 요청
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
        btnSecret.style.display = "inline-block";
        authModal.style.display = "none";
      } else alert(data.msg);
    } catch(err){ console.error(err); }
  });

  // 회원가입 요청
  document.getElementById("btnRegister").addEventListener("click", async ()=>{
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const agree = document.getElementById("agreeLicense").checked;
    if(!agree) return alert("라이선스에 동의해야 합니다.");
    try{
      const res = await fetch(API_URL,{
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({action:"register", username, password})
      });
      const data = await res.json();
      if(data.success){
        alert("회원가입 완료! 로그인 해주세요.");
        registerModal.style.display="none";
        registerModal.setAttribute("aria-hidden","true");
        registerModal.setAttribute("inert","");
      } else alert(data.msg);
    } catch(err){ console.error(err); }
  });

  // 시크릿 코드 모달 닫기
  btnCloseSecret.addEventListener("click", ()=>{
    secretModal.style.display="none";
    secretModal.setAttribute("aria-hidden","true");
    secretModal.setAttribute("inert","");
  });

  // 시크릿 코드 열기
  btnSecret.addEventListener("click", ()=>{
    secretModal.style.display="flex";
    secretModal.removeAttribute("aria-hidden");
    secretModal.removeAttribute("inert");
  });

  // 시크릿 코드 확인
  document.getElementById("btnCheckSecret").addEventListener("click", async ()=>{
    const code = document.getElementById("secretCodeInput").value;
    const username = document.getElementById("loginUsername").value;
    try{
      const res = await fetch(API_URL,{
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({action:"checkSecret", username, code})
      });
      const data = await res.json();
      if(data.success) location.href=data.url;
      else alert(data.msg);
    } catch(err){ console.error(err); }
  });
});

// 모달 열기/닫기
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
  modal.style.display="flex";
  modal.removeAttribute("aria-hidden");
  modal.removeAttribute("inert");
}

document.getElementById("btnCloseGenre").addEventListener("click", ()=>{
  const modal = document.getElementById("genreModal");
  modal.style.display="none";
  modal.setAttribute("aria-hidden","true");
  modal.setAttribute("inert","");
});

// 점수 저장
async function saveScore(username, score){
  await fetch(API_URL,{
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({action:"saveScore", username, score})
  });
}
