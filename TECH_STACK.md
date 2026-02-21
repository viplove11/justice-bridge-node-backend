# Backend Tech Stack (Source of Truth)

This document is generated from the code under `Backend/src` and `Backend/package.json`.
If something is not imported or referenced in `Backend/src`, it is marked as **unused** even if it exists in dependencies.

## Runtime and App Framework
- **Node.js (ESM)**
  - `package.json` has `"type": "module"`.
- **Express 5**
  - API server and routing in `Backend/src/app.js` and `Backend/src/server.js`.
- **CORS**
  - `cors` middleware enabled for all origins in `Backend/src/app.js`.
- **dotenv**
  - Environment variable loading in `Backend/src/server.js`.

## API Endpoints (Express Routes)
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`
  - Routes in `Backend/src/routes/auth.routes.js`
- **Law Simplifier**: `POST /api/law/simplify`
  - Routes in `Backend/src/routes/law.routes.js`
- **Judgement Simplifier**: `POST /api/judgement/simplify`
  - Routes in `Backend/src/routes/judgement.routes.js`
- **Chat (RAG)**: `POST /api/chat/`
  - Routes in `Backend/src/routes/chat.routes.js` → `rag_chat.controller.js`
- **Law Question Suggestions**: `GET /api/chat/lawQuestionSuggestion`
  - Routes in `Backend/src/routes/chat.routes.js` → `chat.controller.js`
- **Dashboard**
  - `GET /api/dashboard/user/:userId/stats`
  - `GET /api/dashboard/user/:userId/law-simplifications`
  - `GET /api/dashboard/user/:userId/judgement-simplifications`

## Databases and Persistence
- **MongoDB (via Mongoose)**
  - Connection uses `process.env.MONGO_URI` in `Backend/src/config/db.js`.
  - Models in `Backend/src/models/*`.
- **Collections / Schemas**
  - `User`: auth users
  - `LawSimplifier`: law simplification history
  - `JudgementSimplifier`: judgement simplification history
  - `ChatMessage`: chat history (user + assistant)
  - `FileEmbedding`: per-chunk embedding storage for uploaded files

## File Upload and Parsing
- **Multer** for multipart file upload
  - Used in `law.routes.js`, `judgement.routes.js`, `chat.routes.js`.
- **pdf-parse-fixed** for PDF text extraction
  - Used in `Backend/src/utils/extractText.js`.

## AI / ML Stack
### LLM Provider
- **Groq OpenAI-compatible API**
  - Endpoint: `https://api.groq.com/openai/v1/chat/completions`
  - Key: `process.env.GROQ_API_KEY`
  - Used in:
    - `Backend/src/controllers/law.controller.js`
    - `Backend/src/controllers/judgement.controller.js`
    - `Backend/src/controllers/chat.controller.js`
    - `Backend/src/controllers/rag_chat.controller.js`

### LLM Model Usage (explicit in code)
- **Model: `llama-3.1-8b-instant`**
  - **Law simplification** (`law.controller.js`)
  - **Judgement simplification** (`judgement.controller.js`)
  - **Chat (non-RAG)** (`chat.controller.js`, not currently wired for POST route)
  - **RAG chat** (`rag_chat.controller.js`, active route)
  - **Law question generation** (`chat.controller.js`, `getLawSuggestion`)
  - **Why this model**: The code does not document a rationale. Based on the model name and provider, it is *likely* chosen for low-latency, low-cost responses on Groq. This is an inference, not a stated reason.

### Embeddings
- **`@xenova/transformers` (local JS inference)**
  - **Embedding model: `Xenova/all-MiniLM-L6-v2`**
  - Used for:
    - PDF chunk embeddings in RAG (`Backend/src/rag/embedder.js`)
    - Query embeddings for RAG retrieval (`rag_chat.controller.js`)
  - **Why this model**: The code does not document a rationale. The model is a small, fast, 384‑dimensional embedding model commonly used for semantic search; that matches the `384` dimension used in the vector store. This is an inference, not a stated reason.

### Retrieval / Vector Store
- **HNSW (Approximate Nearest Neighbor)** via `hnswlib-node`
  - **In-memory vector store** in `Backend/src/rag/vectorStore.js`
  - Config: cosine distance, dimension 384
  - Used for: similarity search across chunk embeddings in the RAG chat flow

### RAG Pipeline (Active)
1. PDF upload → extract text (`extractTextFromPDF`)
2. Chunk text (`chunkText`, 500 words per chunk)
3. Generate embeddings with `Xenova/all-MiniLM-L6-v2`
4. Store embeddings in MongoDB (`FileEmbedding`) and HNSW index
5. Embed user query and retrieve top‑k chunks
6. Compose prompt + chat history + retrieved context
7. Call Groq LLM (`llama-3.1-8b-instant`)
8. Persist conversation to `ChatMessage`

## Auth and Security
- **bcryptjs** for password hashing
- **jsonwebtoken (JWT)** for token issuance
  - Token uses `process.env.JWT_SECRET` and `expiresIn: "30d"`.

## Guardrails / Validation
- **Document heuristics**
  - `Backend/src/utils/documentGuards.js`
  - `looksLikeIndianLaw` and `looksLikeIndianJudgement`
  - Used to enforce that law/judgement endpoints only accept Indian legal texts

## Environment Variables (Used in Code)
- `PORT` (optional, default 8080)
- `MONGO_URI`
- `GROQ_API_KEY`
- `JWT_SECRET`

## Dependencies Present But Not Used In `Backend/src`
These packages exist in `Backend/package.json` but have **no imports in `Backend/src`**.
- `bullmq` (job queue)
- `ioredis` (Redis client)
- `langchain`
- `morgan` (HTTP logger)
- `express-rate-limit`
- `tesseract.js` (OCR)
- `uuid`

## Internal Modules Present But Not Used In Code Paths
- `Backend/src/utils/embedText.js` (alternate embedding helper)
- `Backend/src/utils/vectorStore.js` (save/load HNSW index to disk)

## Notes
- The README at repo root describes a broader/idealized stack (MySQL, OpenAI, etc.). The **actual backend implementation** uses **MongoDB + Groq + Xenova transformers** as documented above.
