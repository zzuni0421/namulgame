document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("player");
  let isJumping = false;
  let velocity = 0;
  let gravity = 0.5;
  let position = 100; // 바닥에서의 시작 높이

  function jump() {
    if (!isJumping) {
      isJumping = true;
      velocity = -12; // 위로 튀는 속도
    }
  }

  function update() {
    velocity += gravity;
    position -= velocity;

    if (position <= 100) {
      position = 100;
      velocity = 0;
      isJumping = false;
    }

    player.style.bottom = position + "px";
    requestAnimationFrame(update);
  }

  document.addEventListener("click", jump);
  document.addEventListener("touchstart", jump);

  update();
});
