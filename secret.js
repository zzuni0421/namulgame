const secretInput = document.getElementById("secretInput");
const checkBtn = document.getElementById("checkBtn");
const status = document.getElementById("status");
const hardButtons = document.getElementById("hardButtons");

const namulBtn = document.getElementById("namulHardBtn");
const jumpBtn = document.getElementById("jumpHardBtn");

const API_URL = "/api/namul";

// 시크릿 코드 확인
checkBtn.addEventListener("click", async () => {
    const code = secretInput.value.trim();
    if(!code){
        status.textContent = "코드를 입력하세요!";
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "checkSecret", code })
        });
        const data = await res.json();

        if(data.success){
            status.textContent = "✅ 시크릿 코드 확인 완료!";
            hardButtons.style.display = "block"; // 버튼 표시
        } else {
            status.textContent = `❌ ${data.msg}`;
        }

    } catch(err){
        status.textContent = "서버 연결 실패";
        console.error(err);
    }
});

// 나물 줍기 하드모드 버튼
namulBtn.addEventListener("click", () => {
    localStorage.setItem("namulHard", "true");
    alert("나물 줍기 하드모드 활성화 완료!");
});

// 점프 게임 하드모드 버튼
jumpBtn.addEventListener("click", () => {
    localStorage.setItem("jumpHard", "true");
    alert("점프 게임 하드모드 활성화 완료!");
});
