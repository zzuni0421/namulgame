export async function onRequestPost({ request }) {
  try {
    const body = await request.json();

    const GAS_URL =
      "https://script.google.com/macros/s/AKfycbwRaNKToEFHa9HMr3sJUn3sQXoH6Z7KYrGYZZsE1xpbyaB-k7RLU3LW8bFHNwKTEd1Dew/exec";

    // body 전체를 그대로 GAS에 전달 (action 포함)
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}
