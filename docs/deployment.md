# Deployment Guide

Actra can be run locally without paid cloud services. H2 is the default database for local development; PostgreSQL and Ollama are optional local services.

## Current status and cost

Azure deployment infrastructure is prepared but requires an Azure subscription to provision. It has not been provisioned, and no Azure resources or cloud charges have been created by this project setup.

The Azure Bicep template includes App Service, PostgreSQL, Storage, Key Vault, and monitoring resources. These resources can incur charges if provisioned. The template itself does not create resources or charges. Review current provider pricing and the template before any future deployment.

Optional hosting providers, custom domains, external storage, hosted AI services, and hardware/network use may have costs. Free tiers have provider-specific limits and terms; local development is the no-cloud-cost path.

## Configuration

`.env.example` documents configuration variables but is not automatically loaded by Maven or Vite.

Always set `JWT_SECRET` to a randomly generated value of at least 32 characters before starting the backend. The backend uses H2 by default. For PostgreSQL only, activate the `postgres` Spring profile and set `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD`.

Set `CORS_ALLOWED_ORIGINS` to the exact frontend origin when hosting the frontend and backend separately. Set `VITE_API_URL` to the backend URL when building the frontend for a hosted backend. Leave `OLLAMA_BASE_URL` pointed to a locally running Ollama service if using its optional local integration.

## Local startup

In PowerShell, from the repository root:

```powershell
Set-Location backend
$env:JWT_SECRET = (& node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))")
mvn spring-boot:run
```

In a second terminal from the repository root:

```powershell
Set-Location frontend
npm install
npm run dev
```

## Future hosting

Hosting is optional and may incur costs; check provider pricing and free-tier limits before use. Azure deployment is prepared but not provisioned. Do not deploy the Azure scaffold unless you intentionally choose Azure and review the resources and costs.
