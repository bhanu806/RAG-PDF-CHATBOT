import { useRef, useState } from "react";

export default function ChatInput({ disabled, onSubmit }) {
  const [question, setQuestion] = useState("");
  const textareaRef = useRef(null);

  const resize = (element) => {
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
  };

  const handleChange = (event) => {
    setQuestion(event.target.value);
    resize(event.target);
  };

  const submit = (event) => {
    event.preventDefault();

    if (question.trim() && !disabled) {
      onSubmit(question.trim());
      setQuestion("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  return (
    <form className="chat-input" onSubmit={submit}>
      <textarea
        ref={textareaRef}
        rows="1"
        value={question}
        onChange={handleChange}
        placeholder="Ask a question about the uploaded PDFs"
        disabled={disabled}
      />
      <button disabled={disabled}>Send</button>
    </form>
  );
}