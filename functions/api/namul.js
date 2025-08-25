export async function onRequestPost(context) {
  const GAS_URL = "https://script.google.com/macros/s/AKfycb.../exec"; // 네가 만든 GAS 웹앱 URL

  const body = await context.request.json();

  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.text(); // GAS가 textOutput 주니까
  return new Response(data, {
    headers: { "Content-Type": "application/json" }
  });
}
