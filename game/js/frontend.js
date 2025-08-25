const API_URL = "/api/namul";

async function register(username, password, sheetid) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "register", username, password, sheetid })
  });
  return res.json();
}

async function login(username, password) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", username, password })
  });
  const data = await res.json();
  if (data.success) localStorage.setItem("token", data.token);
  return data;
}

async function tokenLogin() {
  const token = localStorage.getItem("token");
  if (!token) return { success: false };
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "tokenLogin", token })
  });
  return res.json();
}

async function unlockHard(username) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "unlockHard", username })
  });
  return res.json();
}
