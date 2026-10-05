# API Reference

This document describes the current backend contract and expected API usage.

## Base URL

The frontend reads the API URL from `VITE_API_URL` and the backend server port from `SERVER_PORT`.

Default local values:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

## Authentication

The application uses JWT-based authentication. All protected routes expect a valid bearer token.

## Available endpoints

The current backend exposes a set of operational and domain endpoints used by the frontend, including:

- `/api/overview`
- `/api/datasets`
- `/api/tasks`
- `/api/requests`
- `/api/queue`
- authentication endpoints for sign-in and registration
- company, admin, and contributor routes

## Response conventions

The project uses straightforward REST responses and JSON payloads. The exact schema may evolve as the application matures.

## Security notes

- Use HTTPS in production.
- Validate all origins in `CORS_ALLOWED_ORIGINS`.
- Keep JWT secrets in environment variables or a managed secret store.
- Avoid exposing internal service endpoints publicly.
