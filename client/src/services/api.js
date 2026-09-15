async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

export function uploadPdfs(files) {
  const form = new FormData();
  files.forEach((file) => form.append("pdfs", file));
  return request("/api/pdfs", { method: "POST", body: form });
}
export function sendQuestion({ sessionId, question, apiKey }) {
  return request("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, question, apiKey }) });
}
