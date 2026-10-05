# Architecture Overview

Actra is structured as a modern full-stack application with a React frontend and a Java Spring Boot backend.

## Runtime architecture

- Frontend: Vite + React + TypeScript for the experience layer
- Backend: Spring Boot 3 with Spring Security and JPA for business logic and APIs
- Persistence: PostgreSQL for production and H2 for dev-safe local fallback
- AI integration: Ollama-compatible model endpoints for inference and analysis
- Storage: filesystem-backed storage for uploaded artifacts and generated outputs

## Request flow

1. Contributors interact with the React interface and browser camera capture flow.
2. The frontend calls the backend REST API using configurable environment values.
3. Spring Security validates JWT-based sessions and role permissions.
4. The backend stores structured data in PostgreSQL and exposes dataset or task endpoints.
5. AI features can call an Ollama service for processing tasks and annotations.

## Domain boundaries

### Frontend responsibilities

- Presentation and page flows
- Browser camera acquisition
- User interaction for capture and review workflows
- API requests to the backend

### Backend responsibilities

- Authentication and authorization
- Domain models and repositories
- Task, dataset, and submission orchestration
- Security policy and CORS configuration
- Storage integration and AI service calls

## Operational considerations

- Keep API and frontend URLs configurable through environment variables.
- Use HTTPS and a managed secret store in deployment.
- Ensure the storage directory is writable and outside the Git working tree for production deployments.
- Restrict CORS origins to trusted hostnames.
