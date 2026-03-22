import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const CHAT_API = "http://localhost:5000/api/chat";

export default function ChatPage() {
  const { matchId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const senderDetails = useMemo(() => ({
    senderId: user?.id || user?.email || "guest",
    senderName: user?.name || user?.email || "You",
    senderRole: user?.role || "student"
  }), [user]);

  useEffect(() => {
    fetchConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${CHAT_API}/match/${matchId}`);
      if (!response.ok) throw new Error("Unable to load chat history");
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (event) => {
    event?.preventDefault();
    if (!input.trim()) return;

    try {
      setSending(true);
      setError("");
      const response = await fetch(`${CHAT_API}/match/${matchId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...senderDetails,
          message: input.trim()
        })
      });
      if (!response.ok) throw new Error("Message failed to send");
      const data = await response.json();
      setMessages(data.messages);
      setInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleStarter = async () => {
    const intro = senderDetails.senderRole === "recruiter"
      ? `Hi ${senderDetails.senderName} here — thanks for matching! I'd love to talk about the opportunity.`
      : `Hi, this is ${senderDetails.senderName}. Thanks for matching! I'm excited to discuss the role.`;
    try {
      setSending(true);
      setError("");
      const response = await fetch(`${CHAT_API}/match/${matchId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...senderDetails,
          message: intro
        })
      });
      if (!response.ok) throw new Error("Unable to start conversation");
      const data = await response.json();
      setMessages(data.messages);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const isEmptyThread = !loading && messages.length === 0;

  return (
    <section className="card chat-panel">
      <div className="page-header">
        <div>
          <h2>Conversation</h2>
          <p className="muted">Match ID: {matchId}</p>
        </div>
      </div>

      {error && <p className="error" style={{ marginBottom: "12px" }}>{error}</p>}

      <div className="chat-thread">
        {loading ? (
          <p className="muted">Loading messages…</p>
        ) : isEmptyThread ? (
          <div className="empty-state">
            <h3>No messages yet</h3>
            <p className="muted">Be the first to reach out and introduce yourself.</p>
            <button
              className="button"
              type="button"
              onClick={handleStarter}
              disabled={sending}
            >
              {sending ? "Starting…" : "Send hello"}
            </button>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((msg) => {
              const isSelf = msg.senderId === senderDetails.senderId;
              return (
                <div
                  key={msg.id}
                  className={`chat-bubble ${isSelf ? "self" : "peer"}`}
                >
                  <div className="chat-meta">
                    <strong>{isSelf ? "You" : msg.senderName || "Recruiter"}</strong>
                    <span className="muted">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p>{msg.message}</p>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder={isEmptyThread ? "Introduce yourself to get the conversation going" : "Type a message"}
          value={input}
          disabled={sending}
          onChange={(event) => setInput(event.target.value)}
        />
        <button className="button" type="submit" disabled={sending || !input.trim()}>
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </section>
  );
}
