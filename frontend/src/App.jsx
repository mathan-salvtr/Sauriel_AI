import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- CONFIG ----
const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || "http://127.0.0.1:5000"; // Flask base URL
const BRAND = "Sauriel";

// Utility to generate a stable session id
function getSessionId() {
  const key = "sauriel_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = (crypto as any)?.randomUUID?.() || Math.random().toString(36).slice(2);
    localStorage.setItem(key, id);
  }
  return id;
}

// Message bubble component
function Bubble({ role, text }: { role: "user" | "bot"; text: string }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`max-w-[86%] rounded-2xl px-4 py-3 shadow-xl whitespace-pre-wrap leading-relaxed ${
        isUser
          ? "ml-auto bg-gradient-to-br from-[#7b102a] to-[#c2155a] text-white border border-[#ff4d6d]/40"
          : "mr-auto bg-gradient-to-br from-[#1d1334] to-[#2a184b] text-[#e8d9ff] border border-[#7c3aed]/40"
      }`}
    >
      {text}
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 pl-2">
      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:-0.2s]"></span>
      <span className="w-2 h-2 rounded-full bg-white/50 animate-bounce"></span>
      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:0.2s]"></span>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState<{ id: string; role: "user" | "bot"; text: string }[]>([
    { id: "w", role: "bot", text: `Hi, I’m ${BRAND} 🌌 I’m here to listen, support, and guide you.` },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"lite" | "model">("lite");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const sessionId = useMemo(getSessionId, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, isTyping]);

  async function sendMessage() {
    const content = input.trim();
    if (!content || isTyping) return;

    setMessages((m) => [...m, { id: Math.random().toString(36), role: "user", text: content }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, mode, session_id: sessionId }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { id: Math.random().toString(36), role: "bot", text: data.reply || "(no reply)" }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { id: Math.random().toString(36), role: "bot", text: "Sorry, I had trouble responding. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  async function resetChat() {
    setIsTyping(true);
    try {
      await fetch(`${API_BASE}/api/reset`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sessionId })});
    } catch {}
    setMessages([{ id: "w", role: "bot", text: `Hi, I’m ${BRAND} 🌌 I’m here to listen, support, and guide you.` }]);
    setIsTyping(false);
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(120%_120%_at_0%_100%,#1a001f_0%,#08080f_60%,#07020a_100%)] text-white grid place-items-center p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_20px_80px_rgba(124,58,237,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 bg-gradient-to-r from-[#160f28] via-[#1e1032] to-[#230a1c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#ef4444] shadow-[0_0_35px_rgba(124,58,237,0.6)] grid place-items-center font-bold">S</div>
            <div>
              <div className="font-extrabold tracking-wide text-lg">{BRAND}</div>
              <div className="text-xs text-white/60 -mt-0.5">Your Mental Health Companion</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-white/60">Mode</label>
            <select
              className="bg-[#0c0a12] border border-white/10 rounded-xl text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-[#7c3aed]/40"
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
            >
              <option value="lite">Lite (DialoGPT‑small)</option>
              <option value="model">Model (DialoGPT‑medium)</option>
            </select>
          </div>
        </div>

        {/* Messages */}
        <div ref={listRef} className="h-[60vh] overflow-y-auto px-4 sm:px-6 py-5 space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <Bubble key={m.id} role={m.role} text={m.text} />
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mr-auto flex items-center gap-2 bg-[#1d1334]/70 border border-[#7c3aed]/30 rounded-2xl px-4 py-2">
              <span className="text-[#e8d9ff]">{BRAND} is typing</span>
              <TypingDots />
            </motion.div>
          )}
        </div>

        {/* Composer */}
        <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-white/10 bg-gradient-to-r from-[#0d0b14] to-[#110716]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Type how you feel…"
            className="flex-1 rounded-xl bg-[#0b0912] border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7c3aed]/40"
          />
          <button
            onClick={sendMessage}
            className="rounded-xl px-4 py-3 font-semibold bg-gradient-to-br from-[#7c3aed] to-[#b517ff] hover:brightness-110 active:scale-95 transition shadow-[0_10px_40px_rgba(124,58,237,0.35)]"
          >
            Send
          </button>
          <button
            onClick={resetChat}
            className="rounded-xl px-4 py-3 font-semibold bg-gradient-to-br from-[#7b102a] to-[#ef4444] hover:brightness-110 active:scale-95 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
