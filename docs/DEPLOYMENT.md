# Deployment Guide

This project is designed to run as a paired frontend and backend service, with PostgreSQL for persistence and optional local Ollama support for AI features.

## Required environment variables

Copy `.env.example` to `.env` and configure values for your target environment.

Key variables:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`
- `VITE_API_URL`
- `STORAGE_PATH`
- `OLLAMA_BASE_URL`

## Production recommendations

- Use HTTPS for all public traffic.
- Keep secrets in a managed secret store rather than in source-controlled files.
- Restrict `CORS_ALLOWED_ORIGINS` to the exact production frontend domains.
- Use a strong `JWT_SECRET` of at least 32 characters.
- Run PostgreSQL in a managed service or a dedicated hosting environment.
- Ensure the app has a writable storage directory for uploaded/generated content.

## Example backend startup

```bash
cd backend
export $(grep -v '^#' ../.env | xargs)
./mvnw spring-boot:run
```

## Example frontend startup

```bash
cd frontend
npm install
VITE_API_URL=https://api.example.com npm run build
```

## Hosting notes

The frontend is static-site friendly and can be hosted on Netlify, Vercel, or similar providers. The backend is a Spring Boot Java service and should be deployed to a Java-capable host such as Azure App Service, Azure Container Apps, or a VM.
