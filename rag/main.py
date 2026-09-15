"""JSON-lines command interface used by the Express service."""
import json
import sys
from pathlib import Path
from rag_pipeline import create_vector_store, answer_question


def respond(payload):
    action = payload["action"]
    if action == "index":
        count = create_vector_store(payload["pdfPaths"], Path(payload["indexPath"]))
        return {"chunkCount": count}
    if action == "ask":
        return {"answer": answer_question(payload["question"], payload["apiKey"], Path(payload["indexPath"]))}
    raise ValueError("Unknown action")


for line in sys.stdin:
    try:
        print(json.dumps({"ok": True, "data": respond(json.loads(line))}), flush=True)
    except Exception as error:
        print(json.dumps({"ok": False, "error": str(error)}), flush=True)
