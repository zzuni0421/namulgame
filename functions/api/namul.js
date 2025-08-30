export async function onRequestPost({ request }) {
  try {
    const body = await request.json();

    const GAS_URL =
      "https://script.google.com/macros/s/AKfycbyVzMNWFVBu-FtHS_yZ_DWL_jljLgTAdBMD5Qs3-KbVz5kPmuufiKNzQBqK2hZybCSm/exec";

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
