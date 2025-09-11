"use client";

import { useEffect, useRef, useState } from "react";

/* =========================
   ENV & DEFAULTS
   ========================= */
const GEMINI_KEY = (process.env.NEXT_PUBLIC_GEMINI_API_KEY || "").trim();
const SYSTEM_PROMPT =
  (process.env.NEXT_PUBLIC_AI_SYSTEM_PROMPT || "").trim() ||
  "Kamu adalah AI pribadi Andika: santai, ceria, family-friendly, antusias, pendengar yang baik. Bahasa Indonesia rapi, singkat, jelas, suportif.";

const CHAT_RIDDLE =
  "Dekripsi kode 'dnxvxndulvro' menggunakan metode caesar cipher sampai membentuk sebuah kata";
const CHAT_PASSWORD = "akusukarisol";

/* =========================
   Mini Icons
   ========================= */
const IconLock = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
    <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.6" />
    <rect x="5" y="10" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const IconX = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
const IconSend = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
    <path d="M4 12l16-7-6 14-2-6-8-1z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" />
  </svg>
);
const IconEye = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const IconEyeOff = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M2 12s3.5-6 10-6c1.9 0 3.6 .5 5 .1M22 12s-3.5 6-10 6c-1.9 0-3.6-.5-5-.1"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
);
const Spinner = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" className="animate-spin" {...p}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" fill="none" />
    <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" fill="none" />
  </svg>
);

/* =========================
   Helpers
   ========================= */
function cleanText(t = "") {
  return t
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stopGesture(el) {
  if (!el) return () => {};
  const stop = (e) => {
    e.stopPropagation();
    try {
      e.preventDefault();
    } catch {}
  };
  el.addEventListener("touchmove", stop, { passive: false });
  el.addEventListener("pointermove", stop, { passive: false });
  el.addEventListener("wheel", stop, { passive: false });
  return () => {
    el.removeEventListener("touchmove", stop);
    el.removeEventListener("pointermove", stop);
    el.removeEventListener("wheel", stop);
  };
}

/* =========================
   Public Entry (Button)
   ========================= */
export default function ChatTeaser() {
  const [open, setOpen] = useState(false);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    const isModalVisible = showGate || open;
    if (typeof window !== "undefined") {
      window.__PAUSE_DECK__ = isModalVisible;
    }
    return () => {
      if (typeof window !== "undefined") {
        window.__PAUSE_DECK__ = false;
      }
    };
  }, [showGate, open]);

  return (
    <>
      <button
        onClick={() => setShowGate(true)}
        className="px-4 py-2 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:translate-y-[-1px] transition"
      >
        Talk with AI
      </button>

      {(showGate || open) && (
        <>
          <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            {showGate && (
              <PasswordGate
                onCancel={() => setShowGate(false)}
                onSuccess={() => {
                  setShowGate(false);
                  setOpen(true);
                }}
              />
            )}
            {open && <ChatWindow onClose={() => setOpen(false)} />}
          </div>
        </>
      )}
    </>
  );
}


/* ==================================================
   Password Gate (FINAL 3D DARK/MONOCHROME LOOK)
   ================================================== */
function PasswordGate({ onCancel, onSuccess }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const cardRef = useRef(null);

  useEffect(() => stopGesture(cardRef.current), []);

  const submit = () => {
    if (!pw.trim()) return setMsg("Password tidak boleh kosong.");
    if (pw.trim().toLowerCase() === CHAT_PASSWORD) {
      setMsg("");
      onSuccess();
    } else {
      setMsg("Jawaban salah, coba lagi ya!");
    }
  };

  return (
    <div
      ref={cardRef}
      className="
        relative w-[min(420px,95vw)] pointer-events-auto select-none
        rounded-3xl overflow-hidden shadow-2xl text-slate-100
        bg-gradient-to-b from-gray-900 to-black
        border border-white/5
        shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]
      "
    >
      {/* Decorative gradient (lebih subtle) */}
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(40%_80%_at_50%_-10%,rgba(150,150,150,0.1),transparent)] pointer-events-none" />
      
      {/* Header (Tata letak diperbarui) */}
      <div className="p-5 border-b border-white/5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <IconLock className="text-slate-400 mt-1 flex-shrink-0" style={{ width: 22, height: 22 }} />
          <div className="leading-normal">
            <div className="text-base font-semibold text-white">AUTHORIZED ACCESS ONLY</div>
            <div className="text-sm text-slate-400 mt-1">{CHAT_RIDDLE}</div>
          </div>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-white transition flex-shrink-0">
          <IconX />
        </button>
      </div>


      {/* Alert */}
      {msg && (
        <div className="px-4 pt-4">
          <div className="rounded-xl bg-rose-500/80 text-white text-sm px-4 py-2 shadow-lg flex items-center justify-between">
            <span>{msg}</span>
            <button onClick={() => setMsg("")} className="ml-3 text-white/80 hover:text-white text-xs font-bold">X</button>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="p-4">
        <label className="text-xs font-medium text-slate-400">Password</label>
        <div className="relative mt-2 rounded-xl bg-black/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border border-white/10">
          <input
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full rounded-xl bg-transparent px-4 py-3 pr-12 text-[15px] text-white outline-none placeholder-slate-500"
            placeholder="Masukan Hasil Dekripsi Kode"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <IconEyeOff /> : <IconEye />}
          </button>
        </div>

        <button
          onClick={submit}
          className="
            w-full mt-4 rounded-xl text-white py-3 font-medium
            bg-gradient-to-b from-gray-800 to-black
            border border-white/10
            shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_16px_rgba(0,0,0,0.3)]
            hover:from-gray-700 transition active:scale-[0.98] active:shadow-inner
          "
        >
          Continue
        </button>
      </div>
    </div>
  );
}


/* =====================================
   Chat Window (IMPROVED DARK/GLASSY UI)
   ===================================== */
function ChatWindow({ onClose }) {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "Halo! Aku Kael. Ada yang bisa kubantu? :)" },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  const send = async () => {
    const q = text.trim();
    if (!q || loading) return;
    setText("");
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setLoading(true);

    try {
      if (!GEMINI_KEY) {
        setMsgs((m) => [...m, { role: "ai", text: "Kunci API belum diset di .env.local" }]);
      } else {
        const reply = await callGemini([...msgs, { role: "user", text: q }]);
        setMsgs((m) => [...m, { role: "ai", text: cleanText(reply || "(kosong)") }]);
      }
    } catch {
      setMsgs((m) => [...m, { role: "ai", text: "Maaf, ada kendala jaringan. Coba lagi ya." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[95] flex flex-col
        bg-slate-900
        bg-[radial-gradient(circle_at_20%_-10%,rgba(120,81,255,0.25),transparent_40%),radial-gradient(circle_at_80%_110%,rgba(56,189,248,0.2),transparent_40%)]
      "
      style={{ overscrollBehaviorY: "contain" }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <div className="text-sm font-medium text-white/90">Kael</div>
        <button onClick={onClose} className="ml-auto text-white/70 hover:text-white transition">
          <IconX />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {msgs.map((m, i) => (
          <Bubble key={i} me={m.role === "user"}>
            {m.text}
          </Bubble>
        ))}
        {loading && (
          <div className="flex gap-2.5 items-center text-white/70 text-sm pl-1">
            <Spinner /> AI is typing…
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <input
            className="
              flex-1 rounded-xl px-4 py-3 outline-none
              text-white placeholder-white/50
              bg-white/10 border border-white/15 
              shadow-[inset_0_1px_0_rgba(255,255,255,.1)]
              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50 transition
            "
            placeholder="Tulis pesan…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            disabled={loading}
            className="
              px-4 py-3 rounded-xl text-white
              bg-gradient-to-r from-sky-500 to-violet-500
              shadow-[0_10px_20px_rgba(56,189,248,.25)]
              hover:shadow-[0_14px_28px_rgba(139,92,246,.35)]
              disabled:opacity-60 transition active:scale-[0.98]
            "
            aria-label="Kirim"
          >
            <IconSend />
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ me, children }) {
  return (
    <div className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed
          ${me
            ? "bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-[0_10px_25px_rgba(56,189,248,.25)] rounded-br-lg"
            : "bg-black/20 text-slate-200 backdrop-blur-md border border-white/10 shadow-lg rounded-bl-lg"
          }`}
        style={{ whiteSpace: "pre-wrap" }}
      >
        {children}
      </div>
    </div>
  );
}


/* =========================
   Gemini REST (Client-side)
   ========================= */
async function callGemini(history) {
  const contents = [
    { role: "user", parts: [{ text: `SISTEM: ${SYSTEM_PROMPT}` }] },
    ...history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
  ];

  // ==========================================================
  // PERBAIKAN: URL typo "generativelace" diubah menjadi "generativelanguage"
  // ==========================================================
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${encodeURIComponent(
      GEMINI_KEY
    )}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    }
  );
  if (!res.ok) throw new Error("Gemini error");
  const data = await res.json();
  return (
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    ""
  );
}