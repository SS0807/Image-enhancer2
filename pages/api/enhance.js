// pages/api/enhance.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body;
    const image = body.image; // data URL (data:image/...)
    if (!image) return res.status(400).json({ error: "Missing image in request body" });

    // MODEL_VERSION must be set in Vercel env
    const MODEL_VERSION = process.env.MODEL_VERSION;
    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(500).json({ error: "REPLICATE_API_TOKEN not configured" });
    }
    if (!MODEL_VERSION) {
      return res.status(500).json({ error: "MODEL_VERSION not configured. See README." });
    }

    // Create a prediction
    const createResp = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          // Real-ESRGAN expects an image (URL or data URL). We always 4x upscale.
          image: image,
          scale: "4",           // fixed 4x
          face_enhance: true    // enable face enhancement if supported
        }
      })
    });

    if (!createResp.ok) {
      const txt = await createResp.text();
      return res.status(500).json({ error: "Replicate create failed", details: txt });
    }

    const prediction = await createResp.json();

    // Poll for completion
    let status = prediction.status;
    let pred = prediction;
    const poll = async (id) => {
      while (true) {
        await new Promise(r => setTimeout(r, 1000));
        const getResp = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
          headers: { "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}` }
        });
        const data = await getResp.json();
        status = data.status;
        pred = data;
        if (status === "succeeded" || status === "failed") return data;
      }
    };

    const final = await poll(prediction.id);

    if (final.status === "failed") {
      return res.status(500).json({ error: "Model prediction failed", details: final.error || final });
    }

    // final.output is usually an array of urls; return it to client
    return res.status(200).json({ output: final.output });
  } catch (err) {
    console.error("Enhance API error:", err);
    return res.status(500).json({ error: String(err) });
  }
}
