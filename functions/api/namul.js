export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, msg: "POST만 가능" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();

    // GAS URL
    const GAS_URL = "https://script.google.com/macros/s/AKfycbxhv6nJ9slLuWszZGqwU2oZ9E--uSZZdmGo-KRv3uN6JnApXKZcdeul4Ox8x5UNnJRlVQ/exec";

    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // CORS 허용
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, msg: "프록시 에러", err: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
console.log("Body received:", body);
