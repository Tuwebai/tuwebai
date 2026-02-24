# Deployment By Environment

This repository includes two GitHub Actions deployment workflows:

- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-production.yml`

Both workflows run the same quality gate before deploy:

1. `npm ci`
2. `npm run check`
3. `npm run build:backend`
4. `npm run build:frontend`
5. `npm run smoke`
6. `npm run smoke:auth`

## Required GitHub Environments

Create environments in your repository settings:

- `staging`
- `production`

For `production`, enable required reviewers/approvals.

## Required Repository Secrets

- `RENDER_STAGING_DEPLOY_HOOK_URL`
- `RENDER_PRODUCTION_DEPLOY_HOOK_URL`

These should be Render deploy hook URLs for each environment.

## How To Deploy

1. Open GitHub Actions.
2. Run `Deploy Staging` to deploy to staging.
3. Run `Deploy Production` (manual + environment approval) to deploy to production.

## Release/Tag Promotion

- `Deploy Production` also runs automatically when pushing a tag that starts with `v` (for example, `v1.4.0`).
- Production environment approvals still apply.

## Notes

- Deploy jobs fail fast if required secrets are missing.
- Staging remains manual by design.
- Production can be triggered manually or by release tag (`v*`).

## Frontend Runtime Config (Critical)

- `VITE_API_URL` must point to the backend **origin/base URL**, without `/api` suffix.
  - Correct: `https://tuwebai-backend.onrender.com`
  - Incorrect: `https://tuwebai-backend.onrender.com/api`
- Reason: frontend endpoints already include path prefixes (`/api/...`, `/contact`, `/newsletter`); adding `/api` in base URL causes `404` by generating `/api/api/...`.
