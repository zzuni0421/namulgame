export async function onRequestPost({ request }) {
  const body = await request.json();
  const code = body.code;

  // Google Apps Script Web App으로 전달
  const GAS_URL = "https://script.google.com/macros/s/AKfycbwwiCpfDX2-Jc3f2HyVa_x2jNM61JE1jnwg4ToXHPKPIFmT3kmab-qLR1gTEmE--ErLow/exec";

  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "checkSecret", code })
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
