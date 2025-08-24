const API_URL = "https://script.google.com/macros/s/AKfycbwz-8qrTtkc21f28Vnm3Vdfrt4GksWgYIggcPaxdWWjSWqJxeNfy6urL2Fb-V6nXUUPLg/exec";

// ===== 로그인 =====
async function login(username, password){
  try{
    const res = await fetch(API_URL, {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({action:"login", username, password})
    });
    const data = await res.json();
    if(data.success){
      document.getElementById("loginStatus").textContent = username + "님 로그인됨";
      document.getElementById("btnLogout").style.display = "inline-block";
      document.getElementById("btnOpenLogin").style.display = "none";
      document.getElementById("btnSecret").style.display = "inline-block";
    } else {
      alert(data.msg);
    }
  } catch(err){
    console.error("로그인 에러:", err);
  }
}

// ===== 회원가입 =====
async function register(username, password){
  try{
    const res = await fetch(API_URL,{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({action:"register", username, password})
    });
    return await res.json();
  } catch(err){
    console.error("회원가입 에러:", err);
    return {success:false, msg:"회원가입 실패"};
  }
}

// ===== 시크릿 코드 확인 =====
async function checkSecret(username, code){
  try{
    const res = await fetch(API_URL,{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({action:"checkSecret", username, code})
    });
    return await res.json();
  } catch(err){
    console.error("시크릿 코드 확인 에러:", err);
    return {success:false, msg:"시크릿 코드 확인 실패"};
  }
}

// ===== 점수 저장 =====
async function saveScore(username, score){
  try{
    await fetch(API_URL,{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({action:"saveScore", username, score})
    });
  } catch(err){
    console.error("점수 저장 실패:", err);
  }
}

// ===== 메모 저장 =====
async function saveMemory(username, memory){
  try{
    await fetch(API_URL,{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({action:"saveMemory", username, memory})
    });
  } catch(err){
    console.error("메모 저장 실패:", err);
  }
}

// ===== 모달에서 게임 버튼 출력 및 접근성 처리 =====
function openModal(type){
  const gameList = document.getElementById("gameList");
  if(type === "simulation") gameList.innerHTML = `
    <button class="btn" onclick="location.href='/game/html/grownamul.html'">🤣 나물 키우기 방치형</button>
    <button class="btn" onclick="location.href='/game/html/interview.html'">🤣 인터뷰 시뮬레이션</button>`;
  else if(type === "test") gameList.innerHTML = `
    <button class="btn" onclick="location.href='/game/html/likecelab.html'">😁 내가 연예인이라면?</button>
    <button class="btn" onclick="location.href='/game/html/namultest.html'">😁 나물 유형 테스트</button>`;
  else if(type === "game") gameList.innerHTML = `
    <button class="btn" onclick="location.href='/game/html/namulcatch.html'">🎮 나물 줍기</button>
    <button class="btn" onclick="location.href='/game/html/jumpgame.html'">🎮 점프 게임</button>`;

  const modal = document.getElementById("genreModal");
  modal.style.display = "flex";
  modal.removeAttribute("aria-hidden");
  modal.removeAttribute("inert");
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
}

// ===== 모달 닫기 =====
function closeModal() {
  const modal = document.getElementById("genreModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("inert", "");
}

// ===== 시크릿 모달 열기 =====
function openSecretModal() {
  const modal = document.getElementById("secretModal");
  modal.style.display = "flex";
  modal.removeAttribute("aria-hidden");
  modal.removeAttribute("inert");
  document.getElementById("secretCodeInput").focus();
}

// ===== 시크릿 모달 닫기 =====
function closeSecretModal() {
  const modal = document.getElementById("secretModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("inert", "");
}
