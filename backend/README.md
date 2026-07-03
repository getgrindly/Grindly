# Grindly Backend

Express.js TypeScript backend for Grindly application.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file from template:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Development

Start the development server with auto-reload:
```bash
npm run dev
```

The server will run at `http://localhost:5000`

## Build

Build TypeScript to JavaScript:
```bash
npm run build
```

## Production

Start the production server:
```bash
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts           # App entry point
│   ├── types/             # TypeScript types
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes (to be added)
│   └── services/          # Business logic (to be added)
├── dist/                  # Compiled JavaScript (generated)
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies
└── .env.example          # Environment template
```

## API Endpoints

- `GET /api/health` - Health check endpoint
