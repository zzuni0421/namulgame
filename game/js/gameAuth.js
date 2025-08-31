// ------------------ gameAuth.js ------------------
const API_URL = "/api/namul";
const loginStatus = document.getElementById("loginStatus");
const btnLogout = document.getElementById("btnLogout");
const btnOpenLogin = document.getElementById("btnOpenLogin");
const btnSecret = document.getElementById("btnSecret");

// ------------------ 공통 fetch 함수 ------------------
async function apiPost(action, payload){
  try{
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload })
    });
    const text = await res.text();
    return JSON.parse(text);
  } catch(err){
    console.error(`${action} fetch 에러:`, err);
    return { success: false, msg: "서버 요청 실패" };
  }
}

// ------------------ 로그인 ------------------
async function login(username,password){
  const data = await apiPost("login",{ username, password });
  if(data.success){
    localStorage.setItem("namulToken", data.token); // 토큰 저장
    setLoggedInUI(username);
  } else alert(data.error || data.msg);
}

// ------------------ 토큰 자동 로그인 ------------------
async function autoLogin(){
  const token = localStorage.getItem("namulToken");
  if(token){
    const data = await apiPost("tokenLogin",{ token });
    if(data.success){
      setLoggedInUI(data.username);
    } else {
      localStorage.removeItem("namulToken"); // 실패하면 제거
    }
  }
}

// ------------------ 로그아웃 ------------------
function logout(){
  localStorage.removeItem("namulToken");
  loginStatus.textContent = "";
  btnLogout.style.display="none";
  btnOpenLogin.style.display="inline-block";
  btnSecret.style.display="none";
}

// ------------------ UI 공통 함수 ------------------
function setLoggedInUI(username){
  loginStatus.textContent = `${username}님 로그인됨`;
  btnLogout.style.display="inline-block";
  btnOpenLogin.style.display="none";
  btnSecret.style.display="inline-block";
}

// ------------------ 회원가입 ------------------
async function register(username,password){
  const data = await apiPost("register",{ username, password });
  if(data.success){
    alert("회원가입 성공! 로그인하세요.");
  } else alert(data.error || data.msg);
}

// ------------------ 하드모드 해금 ------------------
async function unlockHard(){
  const token = localStorage.getItem("namulToken");
  if(!token){
    alert("로그인 후 사용 가능합니다.");
    return;
  }
  const data = await apiPost("unlockHard",{ token });
  if(data.success) alert("하드모드 해금 완료!");
  else alert(data.error || data.msg);
}

// ------------------ 이벤트 연결 ------------------
document.getElementById("btnLogin")?.addEventListener("click", ()=>{
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  login(username,password);
});
document.getElementById("btnRegister")?.addEventListener("click", ()=>{
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
  register(username,password);
});
btnLogout?.addEventListener("click", logout);

// ------------------ 페이지 로드 시 자동 로그인 ------------------
document.addEventListener("DOMContentLoaded", autoLogin);
