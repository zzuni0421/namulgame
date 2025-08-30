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

    console.log(`${action} fetch status:`, res.status, res.statusText);
    const text = await res.text(); // JSON이 안오면 HTML 확인 가능
    console.log(`${action} fetch text:`, text);

    return JSON.parse(text); // JSON이면 정상 파싱
  } catch(err){
    console.error(`${action} fetch 에러:`, err);
    return { success: false, msg: "서버 요청 실패" };
  }
}

// ------------------ 로그인 ------------------
async function login(username, password){
  const data = await apiPost("login", { username, password });
  console.log("login data:", data); // 실제 응답 확인용
  if(data.success){
    loginStatus.textContent = `${username}님 로그인됨`;
    btnLogout.style.display="inline-block";
    btnOpenLogin.style.display="none";
    btnSecret.style.display="inline-block";
  } else alert(data.error || data.msg);
}

document.getElementById("btnLogin").onclick = ()=>{
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  login(username, password);
};

// ------------------ 회원가입 ------------------
async function register(username, password){
  const data = await apiPost("register",{ username, password });
  console.log("register data:", data);
  if(data.success){
    alert("회원가입 성공! 로그인하세요.");
  } else alert(data.error || data.msg);
}

document.getElementById("btnRegister").onclick = ()=>{
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
  register(username,password);
};

// ------------------ 하드모드 해금 ------------------
async function unlockHard(token){
  const data = await apiPost("unlockHard", { token });
  console.log("unlockHard data:", data);
  if(data.success) alert("하드모드 해금 완료!");
  else alert(data.error || data.msg);
}
