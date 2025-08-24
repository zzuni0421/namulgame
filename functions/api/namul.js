export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, msg: "POST만 가능" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    console.log("Received in CF Function:", body);

    const GAS_URL = "https://script.google.com/macros/s/AKfycbzXrtDcnrSwrqVOnaiIl6Idj1PckOPMUS63QSP0GxATisbvC_QE_wBZdfoj5lNhFvFl0g/exec";

    // GAS로 전달
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("GAS 응답 JSON 파싱 실패:", err);
      return new Response(
        JSON.stringify({ success: false, msg: "GAS 응답 파싱 실패", err: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("GAS Response:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // CORS 허용
      },
    });
  } catch (err) {
    console.error("CF Function 에러:", err);
    return new Response(
      JSON.stringify({ success: false, msg: "CF Function 에러", err: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
