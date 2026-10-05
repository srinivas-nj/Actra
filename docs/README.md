# Product documentation

Actra is designed around three roles: contributor, company, and admin. The platform collects video-based human demonstrations that are converted into structured action datasets for robotics, computer vision, and embodied AI.

## Core flows

- Contributors record demonstrations and submit them for review.
- Companies browse curated datasets or launch custom collection campaigns.
- Admins review submissions, approve quality checks, and publish dataset bundles.

## Future extensibility

The platform is built to support robot teleoperation, imitation learning, VLA models, and custom action-recognition pipelines.

## Current persistence model

The backend uses Spring Data JPA with seeded entities for datasets, tasks, review requests, and admin queue items. Local development defaults to an H2 in-memory database, while PostgreSQL can be used for a production-style deployment via Docker.
