# Dataset Format Guide

Actra organizes demonstration and annotation data into a structured dataset pipeline that is suitable for robotics and embodied-AI training workflows.

## Dataset components

A dataset may contain:

- metadata and task description
- contributor identity and consent metadata
- capture context such as location and setup
- time-aligned action sequences
- quality ratings and review states
- licensing and usage constraints

## Recommended fields

- `id`
- `name`
- `focus`
- `status`
- `qualityScore`
- `demoCount`
- `durationHours`
- `sourceType`
- `license`
- `createdAt`

## Review and approval flow

1. Capture demonstration data.
2. Run validation and scoring.
3. Route through human review.
4. Approve or reject based on quality and compliance.
5. Publish to the marketplace or internal dataset catalog.

## Governance

All dataset operations should preserve consent, provenance, and licensing information. Treat dataset rights as distinct from source code licensing.
