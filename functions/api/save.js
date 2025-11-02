export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    // Cloudflare D1이나 KV에 저장 가능하지만, 예시는 KV 가정
    const timestamp = Date.now();
    const key = `training:${timestamp}`;
    await env.TRAINING_DATA.put(key, JSON.stringify(data));

    return new Response(
      JSON.stringify({ success: true, message: "데이터 저장 완료" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}
