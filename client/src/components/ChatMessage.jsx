export default function ChatMessage({ role, text }) {
  return (
    <article className={`message ${role}`}>
      <span className="avatar">{role === "user" ? "You" : "AI"}</span>
      <p>{text}</p>
    </article>
  );
}
