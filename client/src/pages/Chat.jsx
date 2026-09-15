import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import { useChat } from "../hooks/useChat";

export default function Chat() {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const chat = useChat();
  const safely = (action) => async (...args) => { setError(""); try { await action(...args); } catch (e) { setError(e.message); } };
  return <div className="app-shell"><Sidebar apiKey={apiKey} setApiKey={setApiKey} session={chat.session} busy={chat.busy} onUpload={safely(chat.upload)} onReset={chat.reset}/><div className="conversation">{error && <div className="error">{error}</div>}<ChatWindow messages={chat.messages} busy={chat.busy}/><ChatInput disabled={!chat.session || chat.busy} onSubmit={safely((question) => chat.ask(question, apiKey))}/></div></div>;
}
