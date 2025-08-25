const API_URL = "/api/namul";

// 공용 POST 요청
async function apiRequest(action, data = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...data })
  });
  return res.json();
}

// 회원가입
export async function register(username, password, sheetid) {
  return apiRequest("register", { username, password, sheetid });
}

// 로그인
export async function login(username, password) {
  const data = await apiRequest("login", { username, password });
  if (data.success) localStorage.setItem("token", data.token);
  return data;
}

// 토큰 로그인
export async function tokenLogin() {
  const token = localStorage.getItem("token");
  if (!token) return { success: false };
  return apiRequest("tokenLogin", { token });
}

// secret 코드 해제
export async function unlockHard(code) {
  const token = localStorage.getItem("token");
  if (!token) return { success: false };
  return apiRequest("secretCheck", { code, token });
}
