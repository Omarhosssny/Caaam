export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const { image } = req.body;

    if (!image || !image.startsWith("data:image/")) {
      return res.status(400).json({
        ok: false,
        error: "Invalid image"
      });
    }

    const base64 = image.split(",")[1];

    const buffer = Buffer.from(base64, "base64");

    const form = new FormData();

    form.append("chat_id", "8622456642");

    form.append(
      "photo",
      new Blob([buffer], {
        type: "image/jpeg"
      }),
      "camera.jpg"
    );

    const response = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`,
      {
        method: "POST",
        body: form
      }
    );

    const result = await response.json();

    return res.status(200).json({
      telegram_status: response.status,
      telegram_response: result
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
