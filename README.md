# PDF RAG Chatbot

A full-stack web application for chatting with one or more PDF documents. Upload PDFs, let the app build a searchable knowledge base, and ask grounded questions through a chat interface.

## Features

- Upload up to 10 PDF documents at once
- Extract PDF text and split it into searchable chunks
- Create embeddings with `sentence-transformers/all-MiniLM-L6-v2`
- Retrieve relevant text with FAISS
- Generate answers with Google Gemini
- React frontend, Express API, and Python RAG engine
- Session-specific PDF indexes and an auto-growing chat input

## How it works

```text
Upload PDFs → Express saves files → Python extracts text
    → chunks (size 100 / overlap 100) → embeddings + FAISS index
    → question → relevant chunks → Gemini answer
```

The original RAG settings are preserved: chunk settings, embedding model, FAISS retrieval, grounding prompt, and Gemini temperature (`0.3`).

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, CSS |
| Backend | Node.js, Express, Multer |
| RAG engine | Python, LangChain, FAISS, Hugging Face |
| PDF parsing | PyPDF2 |
| LLM | Google Gemini `gemini-3.6-flash` |

## Project structure

```text
rag-pdf-chatbot/
├── client/                 # React frontend
├── server/                 # Express API and upload handling
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── .env                # Local-only API key configuration
├── rag/                    # Python RAG pipeline
│   ├── main.py
│   ├── rag_pipeline.py
│   └── requirements.txt
├── .gitignore
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- Python 3.11 or later
- A [Gemini API key](https://aistudio.google.com/apikey)

## Run locally on Windows / VS Code

Open the `rag-pdf-chatbot` folder in VS Code, then select **Terminal → New Terminal**.

### 1. Set up Python

From the project root, run:

```powershell
cd rag
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
pip install langchain-text-splitters langchain-classic
cd ..
```

If PowerShell blocks activation, run the following in that terminal, then activate the environment again:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

For current LangChain releases, `rag/rag_pipeline.py` must contain these imports:

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_classic.chains.question_answering import load_qa_chain
from langchain_core.prompts import PromptTemplate
```

### 2. Configure Gemini

Create the server environment file:

```powershell
Copy-Item server/.env.example server/.env
```

Open `server/.env` and enter your real Gemini key:

```env
PORT=5000
GOOGLE_API_KEY=AIzaYourGeminiApiKeyHere
PYTHON_COMMAND=python
```

Never commit or share this file.

### 3. Start the backend

Open a new terminal. Make sure the Python environment is active, then run:

```powershell
cd server
npm install
npm run dev
```

Expected output:

```text
RAG API listening on http://localhost:5000
```

### 4. Start the frontend

Open a second new terminal:

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL displayed in the terminal, usually `http://localhost:5173`.

## Use the website

1. Enter a Gemini API key in the sidebar only if one is not configured in `server/.env`.
2. Select one or more PDF files.
3. Click **Submit & Process** and wait for the indexed-chunk confirmation.
4. Ask a question and press **Send**.
5. Select **Reset chat** to clear the active conversation and document session.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Checks whether Express is running |
| `POST` | `/api/pdfs` | Uploads PDFs and creates the FAISS index |
| `POST` | `/api/chat` | Sends a question to the active document session |

## Troubleshooting

### `ModuleNotFoundError: langchain.text_splitter`

Install `langchain-text-splitters` and `langchain-classic`, then use the imports in Step 1.

### Gemini model 404

If the error says `gemini-2.0-flash is no longer available`, use this model in `rag/rag_pipeline.py`:

```python
model = ChatGoogleGenerativeAI(model="gemini-3.6-flash", temperature=0.3, google_api_key=api_key)
```

### `EADDRINUSE: address already in use :::5000`

Stop the older backend process, then start the server again:

```powershell
Get-NetTCPConnection -LocalPort 5000 -State Listen | Select-Object OwningProcess
Stop-Process -Id <process-id>
```

### The PDF produces no answer

The app requires PDFs with selectable text. Use OCR first for image-only scanned PDFs.

## Security

- Do not commit `server/.env`, `node_modules`, `.venv`, uploaded PDFs, or generated FAISS indexes.
- Private documents are stored below `server/uploads`.
- Prefer `server/.env` rather than entering an API key in the browser sidebar.

## License

MIT License.
