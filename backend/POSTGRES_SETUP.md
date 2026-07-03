# PostgreSQL Database Setup

## Local Development with Docker

The easiest way to run PostgreSQL locally is with Docker:

```bash
docker run --name grindly-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=grindly \
  -p 5432:5432 \
  -d postgres:16-alpine
```

## Alternative: Direct PostgreSQL Installation

### macOS (Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16
createdb grindly
```

### Ubuntu/Debian
```bash
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb grindly
```

### Windows
Download and install from https://www.postgresql.org/download/windows/

## Update .env

Set your `.env` file with the correct DATABASE_URL:

```bash
# Docker (default)
DATABASE_URL=postgresql://user:password@localhost:5432/grindly

# Local installation on macOS
DATABASE_URL=postgresql://localhost/grindly

# With specific user
DATABASE_URL=postgresql://username:password@localhost:5432/grindly
```

## Install Dependencies

```bash
cd backend
npm install
```

## Create Initial Schema

```bash
npm run db:migrate
```

This will:
1. Create the initial migration
2. Apply it to your database
3. Generate Prisma Client

## View Database

Open Prisma Studio to browse your data:

```bash
npm run db:studio
```

This opens an interactive UI at `http://localhost:5555`

## Common Commands

- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open database browser
- `npm run db:generate` - Regenerate Prisma Client after schema changes

## Stopping Docker Container

```bash
docker stop grindly-postgres
docker rm grindly-postgres
```

## Troubleshooting

**Port 5432 already in use:**
```bash
docker run ... -p 5433:5432 ...  # Use different port
# Then update DATABASE_URL to use port 5433
```

**Connection refused:**
- Verify PostgreSQL is running
- Check DATABASE_URL matches your setup
- Ensure firewall allows port 5432

**Migration errors:**
- Delete `backend/prisma/migrations` folder and restart (dev only)
- Or manually fix issues in the migration file before applying
