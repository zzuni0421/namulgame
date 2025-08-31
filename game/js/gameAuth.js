cconst API_URL = "/api/namul";
const loginStatus = document.getElementById("loginStatus");
const btnLogout = document.getElementById("btnLogout");
const btnOpenLogin = document.getElementById("btnOpenLogin");
const btnSecret = document.getElementById("btnSecret");

// 공통 fetch 함수
async function apiPost(action, payload){
  try{
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload })
    });
    return await res.json();
  } catch(err){
    console.error(`${action} fetch 에러:`, err);
    return { success: false, msg: "서버 요청 실패" };
  }
}

// 로그인
export async function login(username,password){
  const data = await apiPost("login",{ username, password });
  if(data.success){
    localStorage.setItem("namulToken", data.token);
    setLoggedInUI(username);
  } else alert(data.error || data.msg);
}

// 토큰 로그인 (자동 로그인)
export async function tokenLogin(){
  const token = localStorage.getItem("namulToken");
  if(token){
    const data = await apiPost("tokenLogin",{ token });
    if(data.success){
      setLoggedInUI(data.username);
      return data;
    } else {
      localStorage.removeItem("namulToken");
      return { success:false };
    }
  }
  return { success:false };
}

// 로그아웃
function logout(){
  localStorage.removeItem("namulToken");
  if(loginStatus) loginStatus.textContent = "";
  if(btnLogout) btnLogout.style.display="none";
  if(btnOpenLogin) btnOpenLogin.style.display="inline-block";
  if(btnSecret) btnSecret.style.display="none";
}

// UI
function setLoggedInUI(username){
  if(loginStatus) loginStatus.textContent = `${username}님 로그인됨`;
  if(btnLogout) btnLogout.style.display="inline-block";
  if(btnOpenLogin) btnOpenLogin.style.display="none";
  if(btnSecret) btnSecret.style.display="inline-block";
}

btnLogout?.addEventListener("click", logout);
document.addEventListener("DOMContentLoaded", tokenLogin);
