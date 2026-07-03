# Grindly Backend

NestJS + Fastify TypeScript backend with Redis caching for Grindly application.

## Features

- **Fastify Framework**: 2x faster routing than Express
- **NestJS Structure**: Modular, scalable, type-safe architecture
- **Redis Caching**: Built-in caching layer for database queries
- **Prisma ORM**: Type-safe database access

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
DATABASE_URL=postgresql://user:password@localhost:5432/grindly
REDIS_URL=redis://localhost:6379
```

4. Setup database:
```bash
npm run db:generate
npm run db:migrate
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
│   ├── main.ts                 # App entry point
│   ├── app.module.ts           # Root module
│   ├── prisma/
│   │   └── prisma.service.ts   # Database service
│   ├── redis/
│   │   ├── redis.service.ts    # Cache service
│   │   ├── redis.module.ts     # Cache module
│   │   └── cache.decorator.ts  # Caching decorator
│   ├── health/
│   │   ├── health.controller.ts
│   │   ├── health.service.ts
│   │   └── health.module.ts
│   └── types/                  # TypeScript types
├── dist/                       # Compiled JavaScript (generated)
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
└── .env.example                # Environment template
```

## API Endpoints

- `GET /api/health` - Health check endpoint (cached for 30s)
