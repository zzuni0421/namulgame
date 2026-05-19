import { createClient }
from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://uetjeezjqkvpherrpreb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVldGplZXpqcWt2cGhlcnJwcmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNzYyNjAsImV4cCI6MjA3NTY1MjI2MH0.icCYn-V8ekqk9NKadq7Cls_q8IGtKxZHG7NvDAn7r8w'
);

// =========================
// 버튼 생성
// =========================

const loginBtn = document.createElement('button');

loginBtn.innerText = 'GitHub 로그인';

loginBtn.style.position = 'fixed';
loginBtn.style.top = '10px';
loginBtn.style.right = '10px';
loginBtn.style.zIndex = '9999';
loginBtn.style.padding = '10px 16px';
loginBtn.style.border = 'none';
loginBtn.style.borderRadius = '12px';
loginBtn.style.background = '#24292f';
loginBtn.style.color = 'white';
loginBtn.style.cursor = 'pointer';

document.body.appendChild(loginBtn);

// =========================
// 프로필 영역
// =========================

const profile = document.createElement('div');

profile.style.position = 'fixed';
profile.style.top = '10px';
profile.style.left = '10px';
profile.style.zIndex = '9999';
profile.style.display = 'flex';
profile.style.alignItems = 'center';
profile.style.gap = '10px';
profile.style.background = 'rgba(255,255,255,0.8)';
profile.style.padding = '8px 12px';
profile.style.borderRadius = '14px';

document.body.appendChild(profile);

// =========================
// 로그인
// =========================

loginBtn.onclick = async () => {

  const { error } =
  await supabase.auth.signInWithOAuth({

    provider: 'github',

    options: {
      redirectTo: location.origin
    }

  });

  if(error){

    console.error(error);
    alert('로그인 실패');

  }

};

// =========================
// 유저 불러오기
// =========================

async function loadUser(){

  const {
    data: { user }
  } = await supabase.auth.getUser();

  // 로그인 안됨
  if(!user){

    profile.innerHTML = `
      <span>게스트</span>
    `;

    loginBtn.style.display = 'block';

    return;
  }

  // 로그인 됨
  loginBtn.style.display = 'none';

  profile.innerHTML = `
    <img 
      src="${user.user_metadata.avatar_url}"
      width="45"
      height="45"
      style="
        border-radius:50%;
        border:2px solid #8ddf75;
      "
    >

    <div>
      <div style="font-weight:bold;">
        ${user.user_metadata.user_name}
      </div>

      <button id="logoutBtn">
        로그아웃
      </button>
    </div>
  `;

  document
  .getElementById('logoutBtn')
  .onclick = async () => {

    await supabase.auth.signOut();

    location.reload();

  };

}

loadUser();

// =========================
// 로그인 상태 변화 감지
// =========================

supabase.auth.onAuthStateChange((event, session) => {

  console.log(event);

  loadUser();

});
