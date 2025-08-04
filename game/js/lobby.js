const genres = {
  game: [
    { name: "🕹️ 점프 게임", link: "../html/jumpgame.html" },
    { name: "🌿 나물 줍기 게임", link: "../html/namulcatch.html" },
    { name: "🪴 나물 키우기 방치형", link: "../html/grownamul.html" },
  ],
  test: [
    { name: "🍀 나물 유형 테스트", link: "../html/namultest.html" },
    { name: "🎭 내가 연예인이라면?", link: "../html/likecelab.html" },
  ],
  simulation: [
    { name: "🎬 인터뷰 시뮬레이터", link: "../html/interview.html" },
  ],
};

const modal = document.getElementById("genreModal");
const modalTitle = document.getElementById("modalTitle");
const gameList = document.getElementById("gameList");
const closeModalBtn = document.getElementById("closeModal");

document.querySelectorAll(".genre-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const genreKey = btn.dataset.genre;
    modalTitle.textContent = `${btn.textContent} 게임 목록`;
    gameList.innerHTML = "";
    genres[genreKey].forEach(game => {
      const gameBtn = document.createElement("button");
      gameBtn.textContent = game.name;
      gameBtn.onclick = () => {
        window.location.href = game.link;
      };
      gameList.appendChild(gameBtn);
    });
    modal.style.display = "flex";
  });
});

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modal.style.display === "flex") {
    modal.style.display = "none";
  }
});
