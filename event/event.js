fetch('ranking.json')
  .then(response => response.json())
  .then(data => {
    // 점수 기준 내림차순 정렬
    data.sort((a, b) => b.score - a.score);
    const list = document.getElementById('ranking-list');
    list.innerHTML = '';

    data.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.nickname} - ${entry.score}점`;
      list.appendChild(li);
    });
  })
  .catch(err => console.error('랭킹 불러오기 실패:', err));
