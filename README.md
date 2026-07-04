# 🏗️ Grindly

**Grindly** is an end-to-end engineering ecosystem designed to bridge the gap between "writing code" and "architecting systems." Moving beyond simple syntax tutorials, Grindly immerses users in the full **Software Development Lifecycle (SDLC)** through an interactive environment.

---

## 🚀 Core Features

*   **Interactive Multi-file IDE:** A robust coding environment powered by the `monaco-editor`.
*   **Architecture Canvas:** A drag-and-drop interface for designing complex system architectures.
*   **AI-Driven Architect Reviewer:** Automated feedback to ensure code and designs align with industry best practices.
*   **SDLC Immersion:** Real-world workflow automation and lifecycle management.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui, Base UI
- **Editor:** Monaco Editor
- **State:** React hooks
- **Deployment:** Docker, Vercel-ready

### Backend
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** NestJS + Fastify (2x faster routing)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Caching:** Redis with decorator-based caching
- **Development:** Hot reload with watch mode

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Services:** PostgreSQL, Redis
- **Health Checks:** Built-in service monitoring

### Additional Services
- **AI Integration:** Google GenAI
- **Authentication:** Firebase
- **Notifications:** Canvas Confetti
- **Design Tokens:** Tailwind CSS variables

### Key Concepts
Test-Driven Development (TDD), SOLID Principles, Scalable Architecture, System Design Patterns, and Clean Code Refactoring.

## 🏁 Getting Started

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm
- Docker & Docker Compose (for full stack) or PostgreSQL + Redis

### Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/getgrindly/Grindly.git
   cd Grindly
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   cp .env.local.example .env.local
   # Update with your API keys
   ```

3. **Start all services**
   ```bash
   docker-compose up --build
   ```

Services start automatically:
- **Frontend:** http://localhost:3000 (Next.js)
- **Backend:** http://localhost:5000 (NestJS + Fastify)
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

See [DOCKER.md](./DOCKER.md) for detailed Docker guide.

### Local Development (Without Docker)

#### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.local.example .env.local
   # Update with your API keys
   ```

3. **Start dev server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

#### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up PostgreSQL & Redis**
   ```bash
   # PostgreSQL
   brew install postgresql@16  # macOS
   # or use Docker: docker run -d -p 5432:5432 postgres:16-alpine

   # Redis
   brew install redis  # macOS
   # or use Docker: docker run -d -p 6379:6379 redis:7-alpine
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Run database migrations**
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

5. **Start backend server**
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

### Full Stack Development (Local)

Run both concurrently:
- **Terminal 1:** `npm run dev` (frontend on port 3000)
- **Terminal 2:** `cd backend && npm run dev` (backend on port 5000)

### Database Management

- **View data:** `npm run db:studio` (opens Prisma Studio)
- **Create migrations:** `npm run db:migrate` (after schema changes)
- **Generate types:** `npm run db:generate`

## 📁 Project Structure

```
Grindly/
├── src/                          # Frontend source
│   ├── components/              # React components
│   ├── services/                # Service integrations
│   ├── lib/                     # Utilities
│   └── main.tsx                # Entry point
├── backend/                     # Backend source
│   ├── src/
│   │   ├── index.ts            # Express app
│   │   ├── lib/                # Utilities (Prisma, etc.)
│   │   ├── types/              # TypeScript types
│   │   └── middleware/         # Express middleware
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── package.json
│   └── tsconfig.json
├── components/                  # UI components
├── package.json                 # Frontend dependencies
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Whether it's improving the AI reviewer or adding new canvas components:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
