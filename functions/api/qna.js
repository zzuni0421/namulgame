export async function onRequestPost({ request }) {
  try {
    const body = await request.json();
    const res = await fetch("https://script.google.com/macros/s/AKfycbxEgd6aMoX2xd2SzqOnxIoOKzCXlLvzfGVKGM3AtkSYumK10WPpmnXVx-Agx-E6pTS3/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch(err){
    return new Response(JSON.stringify({success:false, error:err.message}), { status:500, headers:{ "Content-Type": "application/json" }});
  }
}

export async function onRequestGet() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbxEgd6aMoX2xd2SzqOnxIoOKzCXlLvzfGVKGM3AtkSYumK10WPpmnXVx-Agx-E6pTS3/exec");
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch(err){
    return new Response(JSON.stringify({success:false, error:err.message}), { status:500, headers:{ "Content-Type": "application/json" }});
  }
}
