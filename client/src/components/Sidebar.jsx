import PdfUploader from "./PdfUploader";
export default function Sidebar({ apiKey, setApiKey, session, busy, onUpload, onReset }) {
  return <aside><h1>PDF RAG Chat</h1><p>Chat with multiple PDFs using the supplied Gemini + FAISS pipeline.</p><label>Google AI API key<input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="AIza…"/></label><PdfUploader busy={busy} onUpload={onUpload}/>{session && <div className="status">Ready: {session.fileNames.join(", ")}<br/>{session.chunkCount} chunks indexed.</div>}<button className="reset" onClick={onReset}>Reset chat</button></aside>;
}
