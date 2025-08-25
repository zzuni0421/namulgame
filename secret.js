const unlockBtn = document.getElementById("unlockBtn");
const secretInput = document.getElementById("secretCode");
const resultMsg = document.getElementById("resultMsg");

unlockBtn.onclick = async () => {
  const code = secretInput.value.trim();

  if (!code) {
    resultMsg.textContent = "⚠ 코드를 입력하세요.";
    resultMsg.style.color = "red";
    return;
  }

  try {
    const res = await fetch("/api/namul", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unlock", code })
    });

    if (!res.ok) throw new Error("서버 응답 오류");
    const data = await res.json();

    if (data.success) {
      localStorage.setItem("hardunlock", "true");
      resultMsg.textContent = "✅ 하드 모드가 열렸습니다!";
      resultMsg.style.color = "green";

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
