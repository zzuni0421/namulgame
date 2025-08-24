export async function onRequest(context) {
  const { request } = context;

  if (request.method === "POST") {
    const data = await request.json();
    console.log("POST data received:", data);

    return new Response(JSON.stringify({ status: "success", received: data }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Namul API - GET Not Allowed", { status: 405 });
}
