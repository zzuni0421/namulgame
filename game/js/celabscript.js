const results = {
  INTJ: { cool: "현빈", funny: "이경규", kind: "이수근", romantic: "이정재" },
  ENFP: { cool: "제니", funny: "유재석", kind: "수지", romantic: "뷔" },
  ISFJ: { cool: "송중기", funny: "박보영", kind: "아이유", romantic: "박서준" },
  // 필요한 만큼 추가 가능
};

document.getElementById('submitBtn').addEventListener('click', () => {
  const mbti = document.getElementById('mbti').value;
  const taste = document.getElementById('taste').value;

  if (!mbti || !taste) {
    alert("MBTI와 취향을 모두 선택해주세요!");
    return;
  }

  const celeb = results[mbti]?.[taste] || "알 수 없음";
  const resultTitle = `${celeb}님과 닮았어요!`;
  const resultDesc = `${mbti} 유형에 ${taste} 취향을 가진 당신, ${celeb}과 닮았어요!`;

  document.getElementById('resultTitle').textContent = resultTitle;
  document.getElementById('resultDescription').textContent = resultDesc;
  document.getElementById('celebImage').src = `images/${celeb}.jpg`;
  document.getElementById('resultSection').style.display = 'block';

  // 공유 링크 설정
  const shareURL = encodeURIComponent(window.location.href + `?mbti=${mbti}&taste=${taste}`);
  document.getElementById('twitterBtn').href = `https://twitter.com/intent/tweet?text=${resultTitle}&url=${shareURL}`;
  document.getElementById('facebookBtn').href = `https://www.facebook.com/sharer/sharer.php?u=${shareURL}`;
  document.getElementById('threadsBtn').href = `https://www.threads.net/share?text=${resultTitle}&url=${shareURL}`;
});

function copyToClipboard() {
  const temp = document.createElement('textarea');
  temp.value = window.location.href;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
  alert("링크가 복사되었습니다!");
}
