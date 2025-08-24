export async function onRequest(context) {
  const { request } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method === "POST") {
    try {
      const body = await request.json();

      const GAS_URL = "https://script.google.com/macros/s/AKfycbxhv6nJ9slLuWszZGqwU2oZ9E--uSZZdmGo-KRv3uN6JnApXKZcdeul4Ox8x5UNnJRlVQ/exec";

      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      return new Response(JSON.stringify(data), {
        headers: { "Access-Control-Allow-Origin": "*" },
      });

    } catch (err) {
      return new Response(JSON.stringify({ success: false, msg: err.message }), {
        headers: { "Access-Control-Allow-Origin": "*" },
        status: 500,
      });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}
