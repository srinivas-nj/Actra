# Actra

Turn Human Actions Into Intelligence.

Actra is a human-action data platform for collecting, structuring, annotating, validating, and licensing demonstrations for robotics and embodied AI. The platform is designed to help contributors capture real-world motion and activity patterns while giving companies a clean path to source high-quality training data for computer vision, robotics, imitation learning, and decision intelligence.

## Overview

Robotics and embodied AI teams need large quantities of high-quality, context-rich data. Actra helps turn raw human activity into organized, validated, and reusable datasets with a workflow that spans capture, review, quality scoring, and licensing.

## Current prototype

The current implementation includes backend registration/login endpoints that issue JWTs, read APIs for task and dataset catalogs, a metadata-only submission endpoint persisted in H2/PostgreSQL, and browser-side MediaPipe hand/pose landmark preview. The dashboard also displays illustrative seeded data.

This is not yet an end-to-end data-collection or marketplace product: video recording/upload, semantic action classification, annotation editing, automated quality scoring, consent verification, dataset creation, company request submission, admin review decisions, and JWT/role authorization enforcement are not implemented.

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

Intended workflow (not yet end-to-end implemented):

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

### 2. Start the backend locally (H2, no cloud or database service required)

```powershell
Set-Location backend
$env:JWT_SECRET = (& node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))")
mvn spring-boot:run
```

The backend runs on `http://localhost:8080` by default.

### 3. Start the frontend

```powershell
Set-Location frontend
npm install
npm run dev -- --host 0.0.0.0
```

The frontend runs on `http://localhost:5173` by default.
Run the frontend command in a second terminal. `.env.example` documents configuration but is not automatically loaded by Maven or Vite.

PostgreSQL is optional for local development. To use it, start the local PostgreSQL service and activate the `postgres` Spring profile with `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD` set. Docker Compose is an optional local tool, not a cloud requirement.

### 4. Optional: run the local helper script

```powershell
./scripts/run-local.sh
```

## Environment variables

The project uses environment variables for configuration. `.env.example` is a reference template and is not loaded automatically; do not copy it into a committed `.env` file.

Required for local backend startup:

- `JWT_SECRET`

Optional variables include `CORS_ALLOWED_ORIGINS`, `VITE_API_URL`, `STORAGE_PATH`, `OLLAMA_BASE_URL`, and `OLLAMA_MODEL`. PostgreSQL variables (`DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD`) are needed only when activating the `postgres` profile.

## Production and deployment notes

- Use HTTPS in production for browser camera access and secure API traffic.
- Do not commit `.env` files or production secrets.
- Keep uploads and large datasets outside the Git repository.
- The storage layer is intentionally structured so local filesystem storage can be replaced by a cloud object-store later.
- Azure deployment infrastructure is prepared but requires an Azure subscription to provision.
- No Azure resources have been provisioned. The local app can be run without paid cloud services; provisioning the prepared Azure resources may incur charges.

## Prototype verification scope

The UI and backend currently demonstrate seeded catalog/task/queue views, backend registration and login endpoints, a contributor submission metadata endpoint, and browser-side hand/pose landmark preview. Seeded dashboard values and catalog/task/request/queue entries are illustrative sample data. Video recording and upload, semantic action classification, annotation editing, quality-review decisions, dataset creation, company request submission, and admin queue decisions are not currently end-to-end workflows. JWTs are issued by the auth endpoints, but the backend does not yet enforce JWT authentication or role authorization on API routes.

## Dataset and data rights

Actra source code is released under the MIT license. Datasets, annotations, and contributor-generated content are governed separately and should be vetted with clear legal and consent terms for each deployment.

This separation exists to avoid implying that contributor data is automatically license-free when the application is used commercially.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/API.md](docs/API.md)
- [docs/DATASET-FORMAT.md](docs/DATASET-FORMAT.md)
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
