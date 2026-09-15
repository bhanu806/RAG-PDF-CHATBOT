"""The original RAG pipeline, exposed without Streamlit UI dependencies."""
from pathlib import Path

from PyPDF2 import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_classic.chains.question_answering import load_qa_chain
from langchain_core.prompts import PromptTemplate

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
PROMPT_TEMPLATE = """
Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
Context:\n {context}?\n
Question: \n{question}\n
Answer:
"""


def get_pdf_text(pdf_paths):
    text = ""
    for pdf_path in pdf_paths:
        for page in PdfReader(pdf_path).pages:
            text += page.extract_text() or ""
    return text


def get_text_chunks(text):
    # Kept exactly as in the supplied app: chunk_size=100, chunk_overlap=100.
    return RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=100).split_text(text)


def _embeddings():
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)


def create_vector_store(pdf_paths, index_path):
    chunks = get_text_chunks(get_pdf_text(pdf_paths))
    if not chunks:
        raise ValueError("The uploaded PDF files do not contain extractable text.")
    store = FAISS.from_texts(chunks, embedding=_embeddings())
    store.save_local(str(index_path))
    return len(chunks)


def answer_question(question, api_key, index_path):
    store = FAISS.load_local(str(index_path), _embeddings(), allow_dangerous_deserialization=True)
    docs = store.similarity_search(question)
    model = ChatGoogleGenerativeAI(model="gemini-3.6-flash", temperature=0.3, google_api_key=api_key)
    chain = load_qa_chain(model, chain_type="stuff", prompt=PromptTemplate(
        template=PROMPT_TEMPLATE, input_variables=["context", "question"]
    ))
    response = chain({"input_documents": docs, "question": question}, return_only_outputs=True)
    return response["output_text"]
