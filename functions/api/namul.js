export async function onRequestPost(context) {
  const data = await context.request.json();
  const GAS_URL = "https://script.google.com/macros/s/AKfycbyPuutCk4YCw55e5ptkBHlWcbXEallQbgCQhiz4F_muZ0YXtgMxVNLVNDi4Ryel0MPeBQ/exec"; 

  // secret 코드 검증용
  if (data.action === "secretCheck") {
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "checkSecret", code: data.code, token: data.token })
    });
    const result = await res.json();
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // 일반 요청: register/login/tokenLogin/unlockHard 등
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" }
  });
}
