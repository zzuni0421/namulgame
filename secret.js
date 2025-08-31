const unlockBtn = document.getElementById("unlockBtn");
const secretInput = document.getElementById("secretCodeInput");
const resultMsg = document.getElementById("resultMsg");

// ------------------ 시크릿 코드 제출 ------------------
unlockBtn.onclick = async () => {
  const code = secretInput.value.trim();
  const token = localStorage.getItem("token"); // 로그인 토큰 가져오기

  if (!token) {
    resultMsg.textContent = "⚠ 로그인 후 이용하세요.";
    resultMsg.style.color = "red";
    return;
  }

  if (!code) {
    resultMsg.textContent = "⚠ 코드를 입력하세요.";
    resultMsg.style.color = "red";
    return;
  }

  try {
    const res = await fetch("/api/namul", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "checkSecret", token, code })
    });

    if (!res.ok) throw new Error("서버 응답 오류");
    const data = await res.json();

    if (data.success) {
      resultMsg.textContent = "✅ 시크릿 코드 성공! 하드모드 접근 가능";
      resultMsg.style.color = "green";

      // 시트 업데이트: 하드모드 해금
      await fetch("/api/namul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unlockHard", token })
      });

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      resultMsg.textContent = "❌ 코드가 올바르지 않습니다.";
      resultMsg.style.color = "red";
    }
  } catch (err) {
    console.error("unlock fetch 에러:", err);
    resultMsg.textContent = "⚠ 서버와 연결할 수 없습니다.";
    resultMsg.style.color = "red";
  }
};
