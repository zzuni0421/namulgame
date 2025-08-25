// js/frontend.js
const API_URL = "/api/namul";  // Cloudflare Pages Functions 프록시

// POST 요청 helper
async function apiRequest(action, data = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...data }),
  });
  return res.json();
}

// 회원가입
async function register(username, password) {
  return apiRequest("register", { username, password });
}

// 로그인
async function login(username, password) {
  return apiRequest("login", { username, password });
}

// 토큰 로그인
async function tokenLogin(token) {
  return apiRequest("tokenLogin", { token });
}

// 하드모드 해금
async function unlockHard(token) {
  return apiRequest("unlockHard", { token });
}

// 점수 저장
async function saveScore(token, score) {
  return apiRequest("saveScore", { token, score });
}

// 유저 정보 가져오기
async function getUser(token) {
  return apiRequest("getUser", { token });
}
