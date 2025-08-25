const API_URL = "https://script.google.com/macros/s/AKfycbwLPd6AWjIthmF4v3_3Jr-lHbAiY1NhrHdUiIm1n0bv52CsteDEtNozsxle9WFcY0liqg/exec"; // 웹 앱 배포 URL

// 회원가입
async function register(username, password, sheetid) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "register", username, password, sheetid }),
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

// 로그인
async function login(username, password) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "login", username, password }),
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

// 토큰 로그인 (자동 로그인)
async function tokenLogin() {
  const token = localStorage.getItem("token");
  if (!token) return { success: false };
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "tokenLogin", token }),
  });
  return await res.json();
}

// 하드모드 해제
async function unlockHard() {
  const token = localStorage.getItem("token");
  if (!token) return { success: false };
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "unlockHard", token }),
  });
  return await res.json();
}
