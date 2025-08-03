const results = {
  ISTJ: { cool: "정해인", funny: "정형돈", kind: "강호동", romantic: "이준기" },
  ISFJ: { cool: "송중기", funny: "박보영", kind: "아이유", romantic: "박서준" },
  INFJ: { cool: "이도현", funny: "이수근", kind: "박하선", romantic: "공유" },
  INTJ: { cool: "현빈", funny: "이경규", kind: "이수근", romantic: "이정재" },
  ISTP: { cool: "차은우", funny: "하하", kind: "이광수", romantic: "이민호" },
  ISFP: { cool: "박서함", funny: "강호동", kind: "서현", romantic: "지민" },
  INFP: { cool: "이승기", funny: "신동엽", kind: "김고은", romantic: "서강준" },
  INTP: { cool: "김선호", funny: "유병재", kind: "오연서", romantic: "이현우" },
  ESTP: { cool: "김우빈", funny: "장도연", kind: "김종국", romantic: "강다니엘" },
  ESFP: { cool: "이홍기", funny: "이국주", kind: "김세정", romantic: "지수" },
  ENFP: { cool: "제니", funny: "유재석", kind: "수지", romantic: "뷔" },
  ENTP: { cool: "차승원", funny: "김구라", kind: "하니", romantic: "지코" },
  ESTJ: { cool: "이병헌", funny: "이경영", kind: "정유미", romantic: "박해진" },
  ESFJ: { cool: "유승호", funny: "박명수", kind: "장나라", romantic: "김영광" },
  ENFJ: { cool: "도경수", funny: "김숙", kind: "정은지", romantic: "박보검" },
  ENTJ: { cool: "조인성", funny: "문세윤", kind: "김혜윤", romantic: "이제훈" },
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
