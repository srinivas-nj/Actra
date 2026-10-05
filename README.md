# Actra

Turn Human Actions Into Intelligence.

Actra is a human-action data platform for collecting, structuring, annotating, validating, and licensing demonstrations for robotics and embodied AI. The platform is designed to help contributors capture real-world motion and activity patterns while giving companies a clean path to source high-quality training data for computer vision, robotics, imitation learning, and decision intelligence.

## Overview

Robotics and embodied AI teams need large quantities of high-quality, context-rich data. Actra helps turn raw human activity into organized, validated, and reusable datasets with a workflow that spans capture, review, quality scoring, and licensing.

## Features

The current product includes:

- Contributor registration and login
- Role-based access control for contributors, companies, and admins
- Task discovery and campaign management
- Webcam capture workflow
- Human hand and pose tracking via MediaPipe
- Action timeline and review flow
- Dataset quality scoring
- Dataset marketplace and listings
- Company request workflow
- Admin review queue
- JWT-based authentication
- PostgreSQL-ready persistence

## Technology stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- MediaPipe Tasks Vision

### Backend

- Java 21
- Spring Boot 3.3
- Spring Security
- Spring Data JPA
- Maven
- JWT authentication
- PostgreSQL driver
- H2 for local development

### Data and deployment

- PostgreSQL
- Docker Compose
- Browser camera APIs
- Ollama-compatible model integration

## Architecture

Contributor
  ↓
Webcam + consent capture
  ↓
Computer vision (MediaPipe)
  ↓
Landmarks and action timelines
  ↓
Quality review and admin approval
  ↓
Dataset catalog and marketplace
  ↓
Robotics / AI companies

## Local development

### 1. Clone the repository

```powershell
git clone <repository-url>
cd Actra
```

### 2. Configure environment variables

Copy the example file and update values as needed:

```powershell
Copy-Item .env.example .env
```

Then review the values in `.env` and `.env.example` before starting the app.

### 3. Start PostgreSQL

```powershell
docker compose up -d postgres
```

### 4. Start the backend

```powershell
cd backend
mvn spring-boot:run
```

The backend runs on `http://localhost:8080` by default.

### 5. Start the frontend

```powershell
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

The frontend runs on `http://localhost:5173` by default.

### 6. Optional: run the local helper script

```powershell
./scripts/run-local.sh
```

## Environment variables

The project uses environment variables for configuration. A safe example is provided in `.env.example`.

Required variables include:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`
- `FRONTEND_API_URL`
- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`
- `STORAGE_PATH`
- `SERVER_PORT`

## Production and deployment notes

- Use HTTPS in production for browser camera access and secure API traffic.
- Do not commit `.env` files or production secrets.
- Keep uploads and large datasets outside the Git repository.
- The storage layer is intentionally structured so local filesystem storage can be replaced by a cloud object-store later.

## Dataset and data rights

Actra source code is released under the MIT license. Datasets, annotations, and contributor-generated content are governed separately and should be vetted with clear legal and consent terms for each deployment.

This separation exists to avoid implying that contributor data is automatically license-free when the application is used commercially.

## Documentation

- [docs/architecture.md](docs/architecture.md)
- [docs/api.md](docs/api.md)
- [docs/dataset-format.md](docs/dataset-format.md)
- [docs/deployment.md](docs/deployment.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch, pull request, and code review guidance.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for the source-code license.

Dataset content rights, contributor consent, and company licensing terms are separate and should be documented for each deployment and collection campaign.

## Security

This project should never ship with:

- hardcoded production passwords
- committed database credentials
- committed JWT secrets
- private upload files
- user data snapshots

Use environment variables and secure secret management in all non-local deployments.
