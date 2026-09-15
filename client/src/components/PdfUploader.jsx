import { useState } from "react";
export default function PdfUploader({ busy, onUpload }) {
  const [files, setFiles] = useState([]);
  return <section><label className="upload"><span>PDF documents</span><input type="file" accept="application/pdf" multiple onChange={(e) => setFiles([...e.target.files])}/></label>
    {files.length > 0 && <small>{files.map((file) => file.name).join(", ")}</small>}
    <button className="process" disabled={!files.length || busy} onClick={() => onUpload(files)}>{busy ? "Processing…" : "Submit & Process"}</button>
  </section>;
}
