// api/namul.js
const GAS_URL = "https://script.google.com/macros/s/AKfycbxTuwvFpVFcsFjShTwaJ-77WeMbO2cWNZmrCX2ko6b1iHuzWsEBJa6Zpy8OazqIyyiRug/exec";

export async function onRequestPost({ request }) {
  const body = await request.json();
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
}

export async function onRequestGet({ request }) {
  const cf = request.cf || {};
  if (cf.isIntranet || cf.asn === "13335") { 
    return Response.redirect("/error.html", 302);
  }
  return new Response(await fetch("/index.html").then(r => r.text()), {
    headers: { "Content-Type": "text/html" }
  });
}
