# Contributing to Grindly

First off, thank you for taking the time to contribute! Grindly is built to help engineers master system design and the full SDLC, and your contributions help make this ecosystem better for everyone.

By contributing to this project, you agree to abide by our code quality standards and development workflows.

---

## 🛠️ Code of Conduct & Standards

To maintain the integrity of Grindly as an educational and robust engineering ecosystem, all contributions must align with our core engineering principles:
*   **Test-Driven Development (TDD):** Write tests before or alongside your feature implementation.
*   **SOLID Principles:** Ensure code is modular, extensible, and follows single-responsibility patterns.
*   **Clean Code:** Use meaningful variable names, keep functions small, and eliminate redundant logic.
*   **Type Safety:** Explicitly type your TypeScript code. Avoid using `any`.

---

## 🚀 Development Workflow

### 1. Fork and Clone
Fork the repository on GitHub, then clone your fork locally:
```bash
git clone https://github.com
cd Grindly
```

### 2. Set Up Your Branch
Always create a descriptive feature branch from the main branch:
```bash
# For features:
git checkout -b feature/AmazingFeature

# For bug fixes:
git checkout -b fix/BugDescription
```

### 3. Environment & Local Setup
Follow the `README.md` to configure your `.env` and `.env.local` files. 

*   **Docker Setup (Recommended):** Run `docker-compose up --build` to launch the entire stack.
*   **Manual Setup:** Run `npm run dev` in the root for the frontend, and `cd backend && npm run dev` for the backend.

---

## 📁 Technical Guidelines

### Frontend (Next.js 16 / React 19)
*   **Styling:** Use Tailwind CSS 4 variables and utility classes. Keep styles local to the component.
*   **Components:** Leverage `shadcn/ui` and `Base UI` primitives. Ensure custom components are accessible.
*   **State:** Use React hooks efficiently. Avoid unnecessary re-renders on the Architecture Canvas or Monaco Editor instances.

### Backend (NestJS + Fastify)
*   **Routing:** Maintain NestJS controller patterns optimized for Fastify performance.
*   **Database:** Modify the database via Prisma schema transformations only. 
*   **Migrations:** If you alter `backend/prisma/schema.prisma`, you must run and commit the migration:
    ```bash
    cd backend
    npm run db:migrate
    npm run db:generate
    ```
*   **Caching:** Use decorator-based Redis caching for highly hit endpoints (e.g., canvas template fetching).

---

## 📝 Commit & Pull Request Guidelines

### Commit Messages
We follow structured commit guidelines to keep the git history readable:
*   `feat: add AI reviewer token validation`
*   `fix: resolve multi-file IDE layout shift on resize`
*   `docs: update backend setup prerequisites`
*   `refactor: clean up architecture canvas event listeners`

### Submitting a Pull Request (PR)
1.  **Format and Lint:** Ensure your code passes all local linting rules.
2.  **Test Your Changes:** Verify that local tests pass and your feature does not break existing Canvas or IDE functionality.
3.  **Push:** Push your branch to your fork:
    ```bash
    git push origin feature/AmazingFeature
    ```
4.  **Open PR:** Open a PR against Grindly's main branch.
5.  **Describe Changes:** Provide a clear description of what your PR solves, screenshots of visual changes (if applicable), and steps to test it.

---

## 💡 Areas Needing Contributions
We love contributions across the entire ecosystem, but we are actively looking for help with:
*   **AI Reviewer Prompts:** Improving the Google GenAI code/architecture evaluation feedback loop.
*   **Canvas Components:** Adding new drag-and-drop architectural blocks (e.g., Load Balancers, Message Queues).
*   **Workflow Automation:** Building out simulated SDLC environments and pipeline statuses.
