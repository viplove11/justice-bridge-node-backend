# API Reference (Local)

Base URL (default): `http://localhost:8080`

Notes:
- All request/response bodies are JSON unless specified.
- File uploads are `multipart/form-data` with field name `file`.
- The server uses `PORT` from `.env` (defaults to `8080`).

## Health/Test

Endpoint: `POST /test-route`
Local URL: `http://localhost:8080/test-route`

Example (curl):
```bash
curl -X POST http://localhost:8080/test-route
```

## Auth

Endpoint: `POST /api/auth/register`
Local URL: `http://localhost:8080/api/auth/register`

Payload (JSON):
```json
{
  "name": "Asha Verma",
  "email": "asha@example.com",
  "password": "StrongPass123"
}
```

Example (curl):
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha Verma","email":"asha@example.com","password":"StrongPass123"}'
```

Endpoint: `POST /api/auth/login`
Local URL: `http://localhost:8080/api/auth/login`

Payload (JSON):
```json
{
  "email": "asha@example.com",
  "password": "StrongPass123"
}
```

Example (curl):
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"asha@example.com","password":"StrongPass123"}'
```

Endpoint: `POST /api/auth/logout`
Local URL: `http://localhost:8080/api/auth/logout`

Payload (JSON):
```json
{
  "user_id": "64f1c6c0d5f4f6a2a1234567"
}
```

Example (curl):
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"user_id":"64f1c6c0d5f4f6a2a1234567"}'
```

Endpoint: `POST /api/auth/google`
Local URL: `http://localhost:8080/api/auth/google`

Payload (JSON):
```json
{
  "name": "Asha Verma",
  "email": "asha@example.com"
}
```

Example (curl):
```bash
curl -X POST http://localhost:8080/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha Verma","email":"asha@example.com"}'
```

## Law Simplification

Endpoint: `POST /api/law/simplify`
Local URL: `http://localhost:8080/api/law/simplify`

Option A: Text payload (JSON)
```json
{
  "text": "Section 420 of the Indian Penal Code deals with cheating...",
  "userId": "64f1c6c0d5f4f6a2a1234567"
}
```

Example (curl):
```bash
curl -X POST http://localhost:8080/api/law/simplify \
  -H "Content-Type: application/json" \
  -d '{"text":"Section 420 of the Indian Penal Code deals with cheating...","userId":"64f1c6c0d5f4f6a2a1234567"}'
```

Option B: PDF upload (`multipart/form-data`)

Fields:
- `file`: PDF file
- `userId`: optional

Example (curl):
```bash
curl -X POST http://localhost:8080/api/law/simplify \
  -F "file=@/path/to/indian-law.pdf" \
  -F "userId=64f1c6c0d5f4f6a2a1234567"
```

## Judgement Simplification

Endpoint: `POST /api/judgement/simplify`
Local URL: `http://localhost:8080/api/judgement/simplify`

Option A: Text payload (JSON)
```json
{
  "text": "In the Supreme Court of India, the matter of...",
  "userId": "64f1c6c0d5f4f6a2a1234567"
}
```

Example (curl):
```bash
curl -X POST http://localhost:8080/api/judgement/simplify \
  -H "Content-Type: application/json" \
  -d '{"text":"In the Supreme Court of India, the matter of...","userId":"64f1c6c0d5f4f6a2a1234567"}'
```

Option B: PDF upload (`multipart/form-data`)

Fields:
- `file`: PDF file
- `userId`: optional

Example (curl):
```bash
curl -X POST http://localhost:8080/api/judgement/simplify \
  -F "file=@/path/to/judgement.pdf" \
  -F "userId=64f1c6c0d5f4f6a2a1234567"
```

## Chat (RAG)

Endpoint: `POST /api/chat`
Local URL: `http://localhost:8080/api/chat`

Option A: Message only (JSON)
```json
{
  "message": "Summarize the key points from Article 21 of the Indian Constitution."
}
```

Example (curl):
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Summarize the key points from Article 21 of the Indian Constitution."}'
```

Option B: Message + PDF (`multipart/form-data`)

Fields:
- `message`: required
- `file`: PDF file (optional)

Example (curl):
```bash
curl -X POST http://localhost:8080/api/chat \
  -F "message=Please summarize the attached document." \
  -F "file=@/path/to/document.pdf"
```

## Law Question Suggestions

Endpoint: `GET /api/chat/lawQuestionSuggestion`
Local URL: `http://localhost:8080/api/chat/lawQuestionSuggestion`

Example (curl):
```bash
curl http://localhost:8080/api/chat/lawQuestionSuggestion
```

## Dashboard

Endpoint: `GET /api/dashboard/user/:userId/stats`
Local URL: `http://localhost:8080/api/dashboard/user/64f1c6c0d5f4f6a2a1234567/stats`

Example (curl):
```bash
curl http://localhost:8080/api/dashboard/user/64f1c6c0d5f4f6a2a1234567/stats
```

Endpoint: `GET /api/dashboard/user/:userId/law-simplifications`
Local URL: `http://localhost:8080/api/dashboard/user/64f1c6c0d5f4f6a2a1234567/law-simplifications`

Optional query params:
- `page` (default `1`)
- `limit` (default `20`, max `100`)

Example (curl):
```bash
curl "http://localhost:8080/api/dashboard/user/64f1c6c0d5f4f6a2a1234567/law-simplifications?page=1&limit=20"
```

Endpoint: `GET /api/dashboard/user/:userId/judgement-simplifications`
Local URL: `http://localhost:8080/api/dashboard/user/64f1c6c0d5f4f6a2a1234567/judgement-simplifications`

Optional query params:
- `page` (default `1`)
- `limit` (default `20`, max `100`)

Example (curl):
```bash
curl "http://localhost:8080/api/dashboard/user/64f1c6c0d5f4f6a2a1234567/judgement-simplifications?page=1&limit=20"
```

Endpoint: `GET /api/dashboard/user/:userId/all-simplifications`
Local URL: `http://localhost:8080/api/dashboard/user/64f1c6c0d5f4f6a2a1234567/all-simplifications`

Response includes both law and judgement entries merged by `createdAt` (desc). Each item includes:
- `type`: `law` or `judgement`
- `userQuery`: user-provided text or extracted PDF text
- `aiResponse`: LLM response

This endpoint always returns the latest 5 combined entries.

Example (curl):
```bash
curl "http://localhost:8080/api/dashboard/user/64f1c6c0d5f4f6a2a1234567/all-simplifications"
```
