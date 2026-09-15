import ChatMessage from "./ChatMessage";
export default function ChatWindow({ messages, busy }) {
  return <main className="chat-window">
    {messages.length === 0 && <div className="empty"><h2>Ask your PDFs anything</h2><p>Upload documents, process them, then start a grounded conversation.</p></div>}
    {messages.map((message, index) => <ChatMessage key={index} {...message} />)}
    {busy && <div className="thinking">Thinking…</div>}
  </main>;
}
