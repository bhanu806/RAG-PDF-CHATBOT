# PDF RAG Chatbot

React and Express implementation of the supplied Streamlit app. Its RAG behavior is preserved: PDFs are text-extracted, split with a `RecursiveCharacterTextSplitter` using size/overlap `100/100`, embedded with `sentence-transformers/all-MiniLM-L6-v2`, retrieved from a FAISS store, and answered by `gemini-2.0-flash` at temperature `0.3` using the original grounding prompt.

## Run it

1. Install Python dependencies: `cd rag` then `pip install -r requirements.txt`.
2. Copy `server/.env.example` to `server/.env`, add `GOOGLE_API_KEY`, and install/run the API: `cd server`, `npm install`, `npm run dev`.
3. In another terminal, install/run the client: `cd client`, `npm install`, `npm run dev`.
4. Open the Vite URL, optionally enter an API key in the sidebar (it overrides the server key), upload PDFs, select **Submit & Process**, then ask questions.

## API

- `POST /api/pdfs` — multipart field `pdfs`; creates an isolated in-memory document session and FAISS index.
- `POST /api/chat` — JSON `{ sessionId, question, apiKey? }`; returns `{ answer }`.
- `GET /api/health` — service status.

Uploaded files and indexes are stored below `server/uploads`. Document sessions are kept in server memory, so re-upload after an API restart.
