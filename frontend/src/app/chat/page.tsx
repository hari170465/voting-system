"use client";
import { useEffect, useRef, useState } from "react";
import { Chat } from "@/lib/api"; // or AIChat if you named it that

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I’m your voting app helper. Ask about signup, login, vote, results, or admin." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;                   // prevent double submits
    const text = input.trim();
    if (!text) return;

    setInput("");
    setLoading(true);

    // append user message
    setMessages((m) => [...m, { role: "user", content: text }]);

    // local "typing…" placeholder
    const typingPlaceholder: Msg = { role: "assistant", content: "•••" };
    setMessages((m) => [...m, typingPlaceholder]);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const { reply } = await Chat.send(text, history); // if you named it AIChat, use AIChat.send
      // replace the last placeholder with real reply
      setMessages((m) => {
        const copy = m.slice();
        // find last assistant "•••"
        const idx = copy.length - 1;
        copy[idx] = { role: "assistant", content: reply || "No reply." };
        return copy;
      });
    } catch {
      setMessages((m) => {
        const copy = m.slice();
        const idx = copy.length - 1;
        copy[idx] = { role: "assistant", content: "Sorry, I couldn’t reach the server." };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  const bubbleStyle = (m: Msg): React.CSSProperties => ({
    background: m.role === "user" ? "#2563eb" : "#f3f4f6",
    color: m.role === "user" ? "#fff" : "#111",
    padding: "8px 12px",
    borderRadius: 12,
    maxWidth: "75%",
    whiteSpace: "pre-wrap",
  });

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>AI Chat</h1>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          height: 420,
          padding: 10,
          background: "#fff",
          overflowY: "auto",
          marginBottom: 10,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 8,
            }}
          >
            <div style={bubbleStyle(m)}>
              {m.content === "•••" ? (
                <span className="typing-dots" aria-live="polite" aria-label="Assistant is typing">
                  <span className="dot" /> <span className="dot" /> <span className="dot" />
                </span>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={loading ? "Assistant is typing…" : "Type a message…"}
          disabled={loading}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            opacity: loading ? 0.8 : 1,
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.8 : 1,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden /> Thinking…
            </>
          ) : (
            "Send"
          )}
        </button>
      </form>
    </div>
  );
}
