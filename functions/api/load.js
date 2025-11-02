export async function onRequestGet({ env }) {
  const list = await env.TRAINING_DATA.list();
  const data = [];

  for (const item of list.keys) {
    const value = await env.TRAINING_DATA.get(item.name);
    if (value) data.push(JSON.parse(value));
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
