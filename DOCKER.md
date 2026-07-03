# Docker Setup Guide

Grindly uses Docker for containerized development and deployment.

## Prerequisites

- Docker Desktop or Docker Engine 20.10+
- Docker Compose 2.0+

## Environment Setup

1. Create a `.env` file at the project root:

```bash
# Database
POSTGRES_USER=grindly
POSTGRES_PASSWORD=grindly_password
POSTGRES_DB=grindly

# Backend
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

2. Create a `.env.local` file in root for frontend env vars (Next.js specific):

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

## Development with Docker

### Start all services

```bash
docker-compose up --build
```

This starts:
- **PostgreSQL** on port 5432
- **Redis** on port 6379
- **Backend (NestJS)** on port 5000
- **Frontend (Next.js)** on port 3000

### Access services

- Frontend: http://localhost:3000
- Backend Health: http://localhost:5000/api/health
- Database (psql): `psql -h localhost -U grindly -d grindly`

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Stop services

```bash
docker-compose down
```

To remove volumes:

```bash
docker-compose down -v
```

## Production Build

### Build images

```bash
docker-compose build
```

### Run in production mode

Update `.env` with:
```bash
NODE_ENV=production
```

Then:
```bash
docker-compose up
```

## Troubleshooting

### Port already in use

If ports are in use, change them in `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "3001:3000"  # Map 3001 to 3000 inside container
```

### Database connection failed

Ensure PostgreSQL is healthy:

```bash
docker-compose ps
```

Wait for PostgreSQL health check to pass (status "healthy").

### Clear everything

```bash
docker-compose down -v
docker system prune -a
```

## Advanced

### Run single service

```bash
docker-compose up postgres
docker-compose up redis
docker-compose up backend
docker-compose up frontend
```

### Execute commands in container

```bash
# Run Prisma migrations
docker-compose exec backend npm run db:migrate

# Database shell
docker-compose exec postgres psql -U grindly -d grindly
```

### View image details

```bash
docker images
docker inspect grindly-backend
```

## Performance Tips

1. Use `.dockerignore` to exclude unnecessary files
2. Multi-stage builds reduce final image size
3. Cache layers by ordering COPY statements: dependencies first, code last
4. Use Alpine Linux images for smaller footprint

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
