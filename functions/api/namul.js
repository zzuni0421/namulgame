const GAS_URL = "https://script.google.com/macros/s/AKfycbyVlxOFm_L5RUeKSkBDZ69FWPX40ITzU1XQ_5GbBMydJEc3MomXYpbZv3BNTbHt1D3T/exec";

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
    return Response.redirect("../../IDCerror.html", 302);
  }
  return new Response(await fetch("/index.html").then(r => r.text()), {
    headers: { "Content-Type": "text/html" }
  });
}
