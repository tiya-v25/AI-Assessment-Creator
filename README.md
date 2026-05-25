# AI Assessment Creator — VedaAI Assignment

An AI-powered tool for teachers to create professional examination papers from study material, with real-time generation progress and clean PDF export.

## 🚀 Live Demo

> Frontend: *(Vercel URL after deployment)*  
> Backend API: *(Railway URL after deployment)*

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 14)                │
│  Create Page → Submit Form → WebSocket Progress → Result    │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API + WebSocket
┌────────────────────────▼────────────────────────────────────┐
│                    BACKEND (Express + TypeScript)            │
│  POST /api/assessments → Add to BullMQ Queue                │
│  GET  /api/assessments/:id → Fetch result                   │
│  Socket.IO → Emit real-time job progress                    │
└──────┬──────────────────────────────────┬───────────────────┘
       │ BullMQ Job Queue                 │ MongoDB
┌──────▼──────────┐               ┌───────▼───────┐
│  Redis (Queue)  │               │  MongoDB Atlas │
│  Worker Process │               │  Assessments   │
└──────┬──────────┘               └───────────────┘
       │ Generate via Groq API
┌──────▼──────────┐
│  Groq (Llama 3.3│
│  70B Versatile) │
└─────────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript | UI & routing |
| State | Zustand | Client-side state management |
| Styling | TailwindCSS + Vanilla CSS | Design system |
| Backend | Express.js + TypeScript | REST API |
| Real-time | Socket.IO | Live generation progress |
| Queue | BullMQ + Redis | Async job processing |
| Database | MongoDB (Mongoose) | Assessment persistence |
| AI | Groq API (Llama 3.3 70B) | Question generation |

---

## ✨ Features

- **Assignment Creation** — Material input (text/file upload), question type blueprint builder, due date, additional instructions
- **AI Question Generation** — Structured prompt engineering → Groq generates sections, questions with difficulty tags (Easy/Moderate/Hard), options for MCQs, and an answer key
- **Real-time Progress** — WebSocket updates show generation steps live (Analyzing → Blueprinting → Generating → Formatting)
- **Professional Output Page** — Formatted exam paper with sections, student info fields, difficulty badges, marks
- **Toggle Answer Key** — Teacher can show/hide answer key without leaving the page
- **Download as PDF** — Browser print with CSS `@media print` rules ensuring each section starts on a new page
- **Regenerate** — One-click to go back and regenerate a new paper
- **Assignment History** — List all past assessments from the dashboard
- **Mobile Responsive** — Bottom navigation for mobile, full sidebar for desktop

---

## 🛠️ Local Setup

### Prerequisites

- Node.js 18+
- Docker (for MongoDB + Redis)
- Groq API key ([get one free at console.groq.com](https://console.groq.com))

### 1. Clone & Install

```bash
git clone https://github.com/tiya-v25/AI-Assessment-Creator
cd AI-Assessment-Creator

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Start Infrastructure (Docker)

```bash
# From project root
docker-compose up -d
```

This starts MongoDB on port 27017 and Redis on port 6379.

### 3. Configure Environment

**backend/.env:**
```env
MONGODB_URI=mongodb://localhost:27017/ai_assessments
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=your_groq_key_here
PORT=4001
FRONTEND_URL=http://localhost:4000
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4001
```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open [http://localhost:4000](http://localhost:4000)

---

## 🌐 Production Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend + Worker | Railway |
| Database | MongoDB Atlas |
| Redis | Railway Redis Plugin |

### Environment Variables (Production)

**Backend (Railway):**
```
MONGODB_URI=mongodb+srv://...atlas...
REDIS_URL=redis://...railway...
GROQ_API_KEY=gsk_...
FRONTEND_URL=https://your-app.vercel.app
PORT=4001
```

**Frontend (Vercel):**
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## 📐 Approach & Design Decisions

### AI Prompt Engineering
- Structured system prompt with strict JSON schema enforced via `response_format: json_object`
- Blueprint-driven: teacher specifies exact question types, counts, and marks
- Difficulty distribution built into prompt rules (40% easy / 40% medium / 20% hard)
- No raw LLM output ever shown — always parsed and rendered through typed React components

### Async Job Architecture
- Generation is handled by BullMQ workers (not in the HTTP request cycle) — prevents timeouts
- Socket.IO room per job ID — clients subscribe and receive granular progress steps
- 3 retry attempts with exponential backoff on failure

### PDF Export
- Pure CSS print media query approach — no headless browser needed
- `break-before: page` on each section boundary ensures clean pagination
- `break-inside: avoid` on each question prevents mid-question page splits
- Difficulty badge colors preserved in print via inline styles

---

## 📁 Project Structure

```
AI-Assessment-Creator/
├── backend/
│   └── src/
│       ├── index.ts           # Express + Socket.IO server
│       ├── models/
│       │   └── Assessment.ts  # Mongoose schema
│       ├── routes/
│       │   └── assessments.ts # REST API routes
│       ├── services/
│       │   └── openai.ts      # Groq/OpenAI integration
│       ├── workers/
│       │   └── assessmentWorker.ts  # BullMQ worker
│       └── socket/
│           └── index.ts       # Socket.IO emitter helper
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx       # Dashboard
│       │   ├── create/        # Assessment creation flow
│       │   └── result/[id]/   # Result viewer
│       ├── components/
│       │   └── result/
│       │       └── ExamPaper.tsx  # Exam paper renderer
│       └── lib/
│           ├── api.ts         # API client
│           └── socket.ts      # Socket.IO client
└── docker-compose.yml         # Local MongoDB + Redis
```
