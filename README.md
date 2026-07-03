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
- **Framework:** React 19
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui, Base UI
- **Editor:** Monaco Editor
- **State:** React hooks
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Development:** tsx with hot reload

### Additional Services
- **AI Integration:** Google GenAI
- **Authentication:** Firebase
- **Notifications:** Canvas Confetti
- **Design Tokens:** Tailwind CSS variables

### Key Concepts
Test-Driven Development (TDD), SOLID Principles, Scalable Architecture, System Design Patterns, and Clean Code Refactoring.

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn
- PostgreSQL 16+ (or Docker)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/getgrindly/Grindly.git
   cd Grindly
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Start frontend dev server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

### Backend Setup

1. **Set up PostgreSQL**
   ```bash
   # Using Docker (recommended)
   docker run --name grindly-postgres \
     -e POSTGRES_USER=user \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=grindly \
     -p 5432:5432 \
     -d postgres:16-alpine
   ```
   Or follow the detailed guide in `backend/POSTGRES_SETUP.md`

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Update .env with your DATABASE_URL if needed
   ```

4. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

5. **Start backend dev server**
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

### Full Stack Development

Run both frontend and backend concurrently:
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
