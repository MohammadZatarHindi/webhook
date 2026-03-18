# Changelog

All notable changes to this project will be documented in this file.

## [v0.1] - 2026-03-17
- Initial pipelines module implemented
- POST /api/pipelines & GET /api/pipelines endpoints
- TypeScript interfaces (`Pipeline`, `ActionType`)
- Zod input validation
- PostgreSQL integration (`pipelines` table)
- README.md, .gitignore, .env.example added

## [v0.2] - 2026-03-18
- Webhooks module implemented
- `webhooks` table added in PostgreSQL
- POST /api/webhooks endpoint to receive and store webhooks
- Manual and HTTP tests verified
- Status tracking (`pending`, `processed`, `failed`) added
- JSONB payload storage for flexible webhook data
- Optional extras discussed: validation, security, indexing, cleanup

## [Unreleased]
- Async queue processing
- Jobs table to link webhooks → pipelines
- Pipeline actions (uppercase, reverse, log)