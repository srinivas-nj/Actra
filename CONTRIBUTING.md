# Contributing

Thanks for your interest in contributing to Actra.

## Development setup

1. Clone the repository.
2. Copy `.env.example` to `.env` and fill in the local values for your environment.
3. Start PostgreSQL locally or via Docker Compose.
4. Start the backend:
   - `cd backend`
   - `./mvnw spring-boot:run`
5. Start the frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Code standards

- Keep configuration in environment variables instead of hardcoded local values.
- Do not commit secrets or production credentials.
- Prefer minimal, focused changes.
- Run the relevant backend tests and frontend build before creating a pull request.

## Pull requests

- Create a feature branch from `main`.
- Keep pull requests scoped to one concern.
- Include a brief summary of the change and validation steps.
