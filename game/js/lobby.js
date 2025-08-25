// 탭 전환
document.querySelectorAll(".tabBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tabContent").forEach(sec => sec.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// 시크릿 버튼 → secret.html로 이동
document.getElementById("secretBtn").onclick = () => {
  window.location.href = "secret.html";
};

// 회원가입
document.getElementById("registerBtn").onclick = async () => {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  const res = await fetch("/api/namul", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "register", username, password })
  });
  const data = await res.json();
  alert(data.message || "회원가입 완료");
};

// 로그인
document.getElementById("loginBtn").onclick = async () => {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const res = await fetch("/api/namul", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", username, password })
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem("token", data.token);
    alert("로그인 성공!");
  } else {
    alert("로그인 실패: " + data.message);
  }
};
