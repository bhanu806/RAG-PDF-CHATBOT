import { useState } from "react";
import { sendQuestion, uploadPdfs } from "../services/api";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [session, setSession] = useState(null);
  const [busy, setBusy] = useState(false);
  const upload = async (files) => {
    setBusy(true);
    try { const next = await uploadPdfs(files); setSession(next); setMessages([]); return next; }
    finally { setBusy(false); }
  };
  const ask = async (question, apiKey) => {
    if (!session) throw new Error("Upload and process PDFs before asking a question.");
    setMessages((items) => [...items, { role: "user", text: question }]);
    setBusy(true);
    try {
      const { answer } = await sendQuestion({ sessionId: session.sessionId, question, apiKey });
      setMessages((items) => [...items, { role: "assistant", text: answer }]);
    } finally { setBusy(false); }
  };
  const reset = () => { setSession(null); setMessages([]); };
  return { messages, session, busy, upload, ask, reset };
}
