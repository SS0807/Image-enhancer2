import { useState } from "react";

export default function Home() {
  const [src, setSrc] = useState(null);
  const [enhanced, setEnhanced] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSrc(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function enhance() {
    if (!src) return alert("Pick an image first");
    setLoading(true);
    setEnhanced(null);

    try {
      const resp = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: src })
      });
      const json = await resp.json();
      setLoading(false);
      if (!resp.ok) throw new Error(json?.error || "Enhance failed");
      // The API returns either a string URL or an array — handle both
      const out = Array.isArray(json.output) ? json.output[0] : json.output;
      setEnhanced(out);
    } catch (err) {
      setLoading(false);
      alert("Error: " + err.message);
      console.error(err);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", textAlign: "center", padding: 16 }}>
      <h1>AI Image Enhancer — 4× Upscale</h1>
      <p>Upload an image and press <b>Enhance</b>. Processing runs on Replicate (Real-ESRGAN).</p>

      <input type="file" accept="image/*" onChange={handleFile} />
      <div style={{ marginTop: 12 }}>
        <button onClick={enhance} disabled={!src || loading} style={{ padding: "8px 18px" }}>
          {loading ? "Enhancing…" : "Enhance (4×)"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 20, justifyContent: "center", flexWrap: "wrap" }}>
        {src && (
          <div style={{ width: 420 }}>
            <h4>Original</h4>
            <img src={src} alt="original" style={{ width: "100%", border: "1px solid #ddd" }} />
          </div>
        )}
        {enhanced && (
          <div style={{ width: 420 }}>
            <h4>Enhanced (4×)</h4>
            <img src={enhanced} alt="enhanced" style={{ width: "100%", border: "2px solid #2ecc71" }} />
            <div style={{ marginTop: 8 }}>
              <a href={enhanced} download="enhanced.png">Download enhanced image</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
