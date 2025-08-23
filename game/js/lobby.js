const gameData = {
  simulation: {
    title: "시뮬레이션",
    games: [
      { name: "🌱 나물 키우기 방치형", url: "game/html/grownamul.html" },
      { name: "🎤 인터뷰 시뮬레이터", url: "game/html/interview.html" },
    ]
  },
  test: {
    title: "테스트",
    games: [
      { name: "🍀 나물 유형 테스트", url: "game/html/namultest.html" },
      { name: "✨ 내가 연예인이라면?", url: "game/html/likecelab.html" },
    ]
  },
  game: {
    title: "게임",
    games: [
      { name: "🕹️ 점프 게임", url: "game/html/jumpgame.html" },
      { name: "🌿 나물 줍기 게임", url: "game/html/namulcatch.html" },
    ]
  }
};

function openModal(genre) {
  const modal = document.getElementById("genreModal");
  const title = document.getElementById("modalTitle");
  const list = document.getElementById("gameList");

  const { title: genreTitle, games } = gameData[genre];
  title.textContent = genreTitle;
  list.innerHTML = "";

  games.forEach(game => {
    const btn = document.createElement("button");
    btn.textContent = game.name;
    btn.onclick = () => window.location.href = game.url;
    list.appendChild(btn);
  });

  modal.classList.add("show");
}

function closeModal(e) {
  document.getElementById("genreModal").classList.remove("show");
}
