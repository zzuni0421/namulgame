// functions/namul.js
export async function onRequest(context) {
  const { request } = context;

  if (request.method === "POST") {
    const data = await request.json(); // { action, username, score 등 }
    console.log("데이터 수신:", data);

    // 예시: 로그인/회원가입/점수 저장 처리 가능
    if(data.action === "saveScore"){
      console.log(`${data.username} 점수 저장: ${data.score}`);
    }

    return new Response(JSON.stringify({ success: true, received: data }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("GET not allowed", { status: 405 });
}
