import React, { useState, useEffect, useRef } from "react";

/* ====================== GLOBAL STYLES (no external libs) ====================== */
const GlobalStyles = () => (
  <style>{`
    :root {
      --bg:#0b0b10; --panel:#161622; --text:#eaeaf0; --muted:#a3a3b2;
      --purple:#a855f7; --pink:#ec4899; --blue:#3b82f6; --green:#22c55e; --yellow:#eab308; --red:#ef4444;
    }
    *{box-sizing:border-box}
    html,body,#root{height:100%}
    body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Helvetica,Arial,sans-serif}
    .page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .stack{width:100%;max-width:680px;margin:0 auto}
    .title{font-size:44px;line-height:1.1;margin:8px 0;background:linear-gradient(90deg,var(--purple),var(--pink));-webkit-background-clip:text;background-clip:text;color:transparent;text-align:center}
    .subtitle{color:var(--muted);text-align:center;margin-top:6px}

    .panel{background:var(--panel);border-radius:18px;padding:18px;box-shadow:0 10px 30px rgba(0,0,0,.35)}
    .grid{display:grid;gap:16px}
    .square{aspect-ratio:1/1;background:#0f0f18;border-radius:14px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
    .square img,.square video{width:100%;height:100%;object-fit:cover}
    .chip{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.45);padding:8px;border-radius:999px}
    .btnrow{display:flex;gap:12px}
    .btn{flex:1;padding:12px 16px;border-radius:999px;border:none;color:white;cursor:pointer;font-weight:700;transition:transform .08s ease,opacity .2s ease}
    .btn:active{transform:scale(.97)}
    .btn-purple{background:var(--purple)}
    .btn-purple:hover{opacity:.95}
    .btn-blue{background:var(--blue)}
    .btn-blue:hover{opacity:.95}
    .btn-grad{background:linear-gradient(90deg,var(--purple),var(--pink));box-shadow:0 14px 40px rgba(168,85,247,.25)}
    .btn-ghost{background:#2a2a40}
    .danger{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.45);color:#fecaca;padding:10px 12px;border-radius:12px}

    .score{font-size:70px;font-weight:800;margin:4px 0}
    .score.green{color:var(--green)}
    .score.yellow{color:var(--yellow)}
    .score.red{color:var(--red)}
    .tips li{margin:8px 0}

    /* icons */
    .icon{width:22px;height:22px;vertical-align:-3px;margin-right:6px}

    /* simple animations */
    @keyframes fadeIn {from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)}}
    @keyframes popIn {from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)}}
    .fade-in{animation:fadeIn .4s ease both}
    .pop-in{animation:popIn .18s ease both}

    /* loading overlay with moving gradient */
    .loading {
      position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(10px);
      display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:50;overflow:hidden
    }
    .loading::before{
      content:"";position:absolute;width:220vmax;height:220vmax;left:50%;top:50%;transform:translate(-50%,-50%);
      background:conic-gradient(from 0deg, var(--purple), var(--pink), var(--blue), var(--purple));
      filter:blur(60px) saturate(130%);opacity:.25;border-radius:50%;
      animation:spin 18s linear infinite
    }
    @keyframes spin {to{transform:translate(-50%,-50%) rotate(1turn)}}
    .loader-card{position:relative;background:rgba(15,15,25,.65);border:1px solid rgba(255,255,255,.08);padding:26px 30px;border-radius:18px;box-shadow:0 10px 30px rgba(0,0,0,.45);text-align:center}
    .buzz{height:32px;overflow:hidden;font-weight:800;letter-spacing:2px}
    .buzz span{display:inline-block;animation:buzzwords 2.1s linear infinite}
    @keyframes buzzwords{
      0%{content:"VIBE CHECK"} 0%,16%{transform:translateY(0)}
      20%,36%{transform:translateY(-32px)}
      40%,56%{transform:translateY(-64px)}
      60%,76%{transform:translateY(-96px)}
      80%,96%{transform:translateY(-128px)}
      100%{transform:translateY(-160px)}
    }
    .buzz span::after{content:"VIBE CHECK\\A AESTHETIC\\A DRIP\\A SLAY\\A FIT CHECK\\A GLOW UP";white-space:pre;line-height:32px}

    /* mirror selfie effect */
    .mirror{transform:scaleX(-1)}
    /* simple tag */
    .tag{display:inline-flex;gap:8px;align-items:center;padding:6px 10px;border-radius:999px;background:rgba(168,85,247,.16);color:#e9d5ff;border:1px solid rgba(168,85,247,.45);font-weight:700}
  `}</style>
);

/* ====================== SIMPLE INLINE ICONS ====================== */
const IconUpload = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);
const IconCam = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);
const IconX = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
);
const IconSpark = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 21l1.9-5.8 5.8-1.9-5.8-1.9L12 3z"/></svg>
);

/* ====================== GEMINI HELPERS ====================== */
// Safely parse JSON text (Gemini sometimes wraps in ```json ... ```)
function safeParseJSON(text) {
  if (!text || typeof text !== "string") return null;
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  try { return JSON.parse(cleaned); } catch { return null; }
}

// Extract mime type from data URL (jpeg/png/webp supported)
function extractMime(dataUrl) {
  const m = /^data:([^;]+);base64,/.exec(dataUrl || "");
  return m ? m[1] : "image/jpeg";
}

/* ====================== AI CORE (Gemini 1.5 Flash) ====================== */
async function getAIAssessment(imageDataUrl, setLoadingText) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) {
    return {
      error: true,
      message:
        "Missing API key. Add REACT_APP_GEMINI_API_KEY to your .env at project root and restart dev server.",
    };
  }

  const mimeType = extractMime(imageDataUrl);
  const base64 = imageDataUrl.split(",")[1];

  // 1) Suitability check — avoid rating cakes, landscapes, etc.
  setLoadingText("Analyzing image…");
  try {
    const res1 = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "You are a strict gatekeeper for a fashion rating app. Determine if the image clearly shows a human wearing a visible outfit (at least waist-up). Reject selfies that only show a face, objects (e.g., cake), pets, landscapes, or blurry/abstract pics. Return ONLY JSON with a single boolean key 'containsOutfit'. No commentary.",
                },
                { inlineData: { mimeType, data: base64 } },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: { containsOutfit: { type: "BOOLEAN" } },
              required: ["containsOutfit"],
            },
          },
        }),
      }
    );

    if (!res1.ok) throw new Error(`Check API error: ${res1.status}`);
    const data1 = await res1.json();
    const raw1 = data1?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed1 = safeParseJSON(raw1);
    if (!parsed1?.containsOutfit) {
      return {
        error: true,
        message:
          "Couldn’t find a person wearing an outfit. Try a clear pic of someone from at least the waist up.",
      };
    }
  } catch (e) {
    console.error("Suitability check failed:", e);
    return { error: true, message: "Could not analyze the image. Please try again." };
  }

  // 2) Rating + actionable style tips, varied & specific
  setLoadingText("Rating your style…");
  try {
    const res2 = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: [
                    "You are a Gen-Z fashion rater. Analyze the outfit in the image and return STRICT JSON with:",
                    "- score: number from 0.0 to 10.0 (one decimal),",
                    "- feedback: short, specific sentence (no generic fluff),",
                    "- suggestions: array of exactly 3 concrete, non-repetitive tips that reference visible colors/garments/silhouette.",
                    "If uncertain, lower the score slightly. No extra commentary.",
                  ].join("\n"),
                },
                { inlineData: { mimeType, data: base64 } },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                score: { type: "NUMBER" },
                feedback: { type: "STRING" },
                suggestions: { type: "ARRAY", items: { type: "STRING" } },
              },
              required: ["score", "feedback", "suggestions"],
            },
          },
        }),
      }
    );

    if (!res2.ok) throw new Error(`Rating API error: ${res2.status}`);
    const data2 = await res2.json();
    const raw2 = data2?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed2 = safeParseJSON(raw2);

    if (!parsed2 || typeof parsed2.score !== "number") {
      throw new Error("Malformed rating response");
    }

    // Normalize result
    const scoreFixed = Math.max(0, Math.min(10, parsed2.score)).toFixed(1);
    const feedback = String(parsed2.feedback || "").slice(0, 240);
    const suggestions = Array.isArray(parsed2.suggestions)
      ? parsed2.suggestions.slice(0, 3).map((s) => ({ item: String(s).slice(0, 120) }))
      : [{ item: "Add a clean accessory to sharpen the fit." }];

    return { score: scoreFixed, feedback, suggestions };
  } catch (e) {
    console.error("Rating step failed:", e);
    return { error: true, message: "Could not generate a style rating. Please try again." };
  }
}

/* ====================== APP ====================== */
export default function App() {
  const [page, setPage] = useState("upload");
  const [lastRatedImage, setLastRatedImage] = useState(null);
  const [lastRating, setLastRating] = useState(null);

  const handleRatingComplete = (image, rating) => {
    setLastRatedImage(image);
    setLastRating(rating);
    setPage("rating");
  };

  return (
    <div className="page">
      <GlobalStyles />
      {page === "upload" && (
        <UploadPage setPage={setPage} onRatingComplete={handleRatingComplete} />
      )}
      {page === "camera" && (
        <CameraPage setPage={setPage} onRatingDone={handleRatingComplete} />
      )}
      {page === "rating" && (
        <RatingPage setPage={setPage} image={lastRatedImage} rating={lastRating} />
      )}
    </div>
  );
}

/* ====================== PAGES ====================== */
function UploadPage({ setPage, onRatingComplete }) {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Thinking about your drip…");
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setError(null);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRateMe = async () => {
    if (!image) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAIAssessment(image, setLoadingText);
      if (result?.error) {
        setError(result.message || "Couldn’t analyze. Try another image.");
      } else {
        onRatingComplete(image, result);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="stack fade-in">
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div className="tag"><IconSpark /> DRIPRATER</div>
        <h1 className="title">Rate My Fit</h1>
        <p className="subtitle">Upload a pic, get a 10/10-style score + tips.</p>
      </div>

      <div className="panel grid">
        <div className="square">
          {image ? (
            <>
              <img src={image} alt="preview" />
              <button
                onClick={() => { setImage(null); setError(null); }}
                className="chip btn btn-ghost"
                title="Clear"
              >
                <IconX /> Clear
              </button>
            </>
          ) : (
            <div style={{ color: "var(--muted)", textAlign: "center" }}>
              <IconUpload /> <div>Upload a photo to get rated</div>
            </div>
          )}
        </div>

        {error && <div className="danger">{error}</div>}

        <div className="btnrow">
          <button className="btn btn-purple" onClick={() => fileInputRef.current.click()}>
            <IconUpload /> Upload
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <button className="btn btn-blue" onClick={() => setPage("camera")}>
            <IconCam /> Live
          </button>
        </div>

        {image && (
          <button className="btn btn-grad" onClick={handleRateMe}>
            Rate My Fit!
          </button>
        )}
      </div>

      {isLoading && <LoaderOverlay text={loadingText} />}
    </div>
  );
}

function CameraPage({ setPage, onRatingDone }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [rating, setRating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Scanning your vibe…");
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      } catch (err) {
        console.error("camera", err);
        setError("Could not access camera. Check permissions and try again.");
      }
    };
    getCamera();
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const snapAndRate = async () => {
    if (!videoRef.current) return;
    setIsLoading(true);
    setError(null);
    setRating(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");

    try {
      const result = await getAIAssessment(dataUrl, setLoadingText);
      if (result?.error) {
        setError(result.message || "Couldn’t analyze. Try again.");
      } else {
        setRating(result);
      }
    } catch (e) {
      setError("Failed to rate. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const finish = () => {
    if (rating) onRatingDone(canvasRef.current.toDataURL("image/jpeg"), rating);
  };

  return (
    <div className="stack fade-in">
      <div className="panel grid">
        <div className="square">
          <video ref={videoRef} autoPlay playsInline muted className="mirror" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        {rating && (
          <div className="panel pop-in" style={{ textAlign: "center" }}>
            <div className={`score ${rating.score >= 8 ? "green" : rating.score >= 5 ? "yellow" : "red"}`}>
              {rating.score}
            </div>
            <div style={{ color: "var(--text)", marginTop: 4 }}>{rating.feedback}</div>
            <ul className="tips" style={{ marginTop: 10 }}>
              {rating.suggestions.map((s, i) => <li key={i}>✨ {s.item}</li>)}
            </ul>
            <div className="btnrow" style={{ marginTop: 14 }}>
              <button className="btn btn-ghost" onClick={() => setPage("upload")}>Back</button>
              <button className="btn btn-grad" onClick={() => setRating(null)}>Try Again</button>
              <button className="btn btn-purple" onClick={finish}>Use This</button>
            </div>
          </div>
        )}

        {!rating && (
          <div className="btnrow">
            <button className="btn btn-ghost" onClick={() => setPage("upload")}>Back to Upload</button>
            <button className="btn btn-grad" onClick={snapAndRate}>
              <IconSpark /> Rate My Fit!
            </button>
          </div>
        )}

        {error && <div className="danger">{error}</div>}
      </div>

      {isLoading && <LoaderOverlay text={loadingText} />}
    </div>
  );
}

function RatingPage({ setPage, image, rating }) {
  if (!image || !rating) {
    return (
      <div className="stack fade-in">
        <div className="panel" style={{ textAlign: "center" }}>
          <div className="danger">Oops! No rating data found.</div>
          <button className="btn btn-purple" style={{ marginTop: 12 }} onClick={() => setPage("upload")}>
            Try Again
          </button>
        </div>
      </div>
    );
  }
  const tone = rating.score >= 8 ? "green" : rating.score >= 5 ? "yellow" : "red";

  return (
    <div className="stack fade-in">
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div className="tag"><IconSpark /> RESULT</div>
        <h2 className="title" style={{ fontSize: 34 }}>Your DripRater Score</h2>
      </div>

      <div className="panel grid">
        <div className="square">
          <img src={image} alt="rated" />
        </div>

        <div className="panel pop-in" style={{ textAlign: "center" }}>
          <div className={`score ${tone}`}>{rating.score}</div>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>{rating.feedback}</div>
          <div style={{ marginTop: 14, textAlign: "left" }}>
            <div style={{ fontWeight: 800, color: "var(--purple)", marginBottom: 6 }}>
              Level-Up Your Look:
            </div>
            <ul className="tips">
              {rating.suggestions.map((s, i) => <li key={i}>→ {s.item}</li>)}
            </ul>
          </div>
          <button className="btn btn-grad" style={{ marginTop: 16 }} onClick={() => setPage("upload")}>
            Rate Another Fit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ====================== LOADER ====================== */
function LoaderOverlay({ text }) {
  return (
    <div className="loading">
      <div className="loader-card pop-in">
        <div className="buzz"><span /></div>
        <div style={{ marginTop: 10, color: "var(--muted)" }}>{text}</div>
      </div>
    </div>
  );
}
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
console.log("API Key:", apiKey);  // temporary check

