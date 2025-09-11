// src/app/api/auth-check/route.js
export async function POST(req) {
  try {
    const { password } = await req.json();

    // >>> versi termudah: password langsung di sini <<<
    const EXPECTED_PASSWORD = "akusukarisol"; // ganti sesukamu

    const ok = typeof password === "string" && password === EXPECTED_PASSWORD;

    // Selalu 200 agar UI tidak menampilkan "server bermasalah"
    return new Response(JSON.stringify({ ok }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch {
    // Tetap 200: UI akan menampilkan pesan ramah lewat ok:false
    return new Response(JSON.stringify({ ok: false }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
}