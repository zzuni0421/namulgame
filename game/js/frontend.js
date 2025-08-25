const API_URL = "https://script.google.com/macros/s/AKfycbyPuutCk4YCw55e5ptkBHlWcbXEallQbgCQhiz4F_muZ0YXtgMxVNLVNDi4Ryel0MPeBQ/exec"; 
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
