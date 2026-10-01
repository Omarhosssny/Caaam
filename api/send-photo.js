export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    console.log("1. Request received");

    const { image } = req.body;

    if (!image) {
      console.log("2. No image");
      return res.status(400).json({
        ok: false,
        error: "No image received"
      });
    }

    console.log("2. Image received");

    if (!image.startsWith("data:image/")) {
      return res.status(400).json({
        ok: false,
        error: "Invalid image format"
      });
    }

    const base64 = image.split(",")[1];

    if (!base64) {
      return res.status(400).json({
        ok: false,
        error: "Base64 data missing"
      });
    }

    console.log("3. Base64 received");

    const buffer = Buffer.from(base64, "base64");

    console.log("4. Image decoded:", buffer.length);

    const token = process.env.BOT_TOKEN;

    if (!token) {
      console.log("5. BOT_TOKEN missing");

      return res.status(500).json({
        ok: false,
        error: "BOT_TOKEN is not configured"
      });
    }

    console.log("5. BOT_TOKEN exists");

    const form = new FormData();

    form.append("chat_id", "7584934530");
    form.append(
      "photo",
      new Blob([buffer], {
        type: "image/jpeg"
      }),
      "camera.jpg"
    );

    console.log("6. Sending to Telegram");

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendPhoto`,
      {
        method: "POST",
        body: form
      }
    );

    console.log(
      "7. Telegram status:",
      response.status
    );

    const result = await response.json();

    console.log(
      "8. Telegram response:",
      JSON.stringify(result)
    );

    return res.status(200).json({
      ok: result.ok,
      telegram_status: response.status,
      telegram_response: result
    });

  } catch (error) {

    console.error(
      "FUNCTION ERROR:",
      error
    );

    return res.status(500).json({
      ok: false,
      error: error.message,
      error_name: error.name
    });
  }
}
