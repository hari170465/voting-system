# 🗳 Voting System – Full-Stack App
<p align="center">
  <img src="assets/page.png" alt="Voting System Banner" width="600">
</p>

A complete voting web application with:

- **Frontend:** Next.js + React  
- **Backend:** Express + Prisma + PostgreSQL  
- **Features:** User signup/login, single-vote enforcement, candidate management, results visualization (charts)  
- **Bonus:** Floating AI chat assistant powered by [Ollama](https://ollama.com/) (local LLM)

---

## 📦 Prerequisites

| Tool             | Version / Notes |
|-----------------|----------------|
| [Node.js](https://nodejs.org/) | 20+ (LTS recommended) |
| npm             | Installed with Node |
| [Docker](https://www.docker.com/) | To run PostgreSQL |
| [Ollama](https://ollama.com/) *(optional)* | For local AI chat |

---

## 📁 Project Structure
```bash
voting-system/
├── backend/ 
├── frontend/
├── README.md
└── .gitignore
```

---

## ⚙️ Environment Setup

### 1️⃣ Clone & Install Dependencies

```bash
git clone https://github.com/<your-username>/voting-system.git
cd voting-system

# Root (installs orchestrator)
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2️⃣ Start PostgreSQL (via Docker)

Create the container (first time only):

```bash
docker run -d ^
  --name voting-postgres ^
  -e POSTGRES_USER=postgres ^
  -e POSTGRES_PASSWORD=postgres ^
  -e POSTGRES_DB=votingdb ^
  -p 5432:5432 ^
  postgres:16
```

Subsequent runs:
```bash
docker start voting-postgres
```

### 3️⃣ Backend Environment (backend/.env)
```ini
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/votingdb?schema=public"
JWT_SECRET="change_me"
CORS_ORIGIN="http://localhost:3000"
NODE_ENV="development"
PORT=4000
OLLAMA_MODEL="llama3.2"   # Optional
```

Apply migrations:
```bash
cd backend
npx prisma migrate dev --name init
```

(Optional) Open DB GUI to add candidates manually:
```bash
npx prisma studio
```

### 4️⃣ Frontend Environment (frontend/.env.local)
```ini
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```
### 5️⃣ (Optional) Setup AI Chat with Ollama
Download Ollama: https://ollama.com/download

Pull a model:

```bash
ollama pull llama3.2
```

## 🚀 Running Locally

From the project **root**:

### Backend + Frontend only
```bash
npm run dev
```
Then opem http://localhost:3000 in the browser

## 🧪 Features
- ✅ Signup & Login: /signup and /login
- ✅ Vote: /vote (only once per user)
- ✅ View Results: /results (live chart)
- ✅ Admin Panel: /admin (add/remove candidates)
- ✅ Chat: Floating button → /chat (AI helper answers setup/deploy questions)

## 👥 Contributors
- Built by **Hariharasudan Muralidaran**