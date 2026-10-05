# Dataset and Licensing Notes

Actra may ingest or process external content and user-submitted data. The project should be configured and operated with clear separation between application code, generated data, and any third-party datasets.

## Data handling expectations

- Do not commit real customer or production data to the repository.
- Store generated or uploaded files under a configured writable storage directory such as `./storage`.
- Treat any dataset used for training, evaluation, or benchmarking as a separate artifact from application source code.
- Ensure your deployment environment includes appropriate retention, privacy, and access controls.

## Licensing guidance

- Review all third-party datasets, models, and media assets before use in production.
- Confirm that data license terms permit the intended reuse, transformation, and distribution.
- Keep a record of source provenance for any model or dataset dependency used by the application.
- If you ship a bundled dataset or model artifact, include the relevant license text in the repository or release packaging.

## Recommended operational policy

- Use a separate production data store and restricted access controls.
- Keep model-generated outputs isolated from source-controlled content.
- Document any compliance or legal constraints in your deployment documentation.
