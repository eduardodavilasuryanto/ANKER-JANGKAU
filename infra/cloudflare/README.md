# Cloudflare deployment adapter

This folder was created from the official `create-cloudflare` Worker template in an isolated directory, then reconciled with the existing React application. It does not deploy anything by itself.

The Worker serves `frontend/dist` as a single-page application and forwards same-origin `/api/*` requests to a separately deployed `jangkau-api` Worker through a service binding. This keeps browser requests same-origin and keeps API credentials off the client.

## Local setup

```sh
cd infra/cloudflare
npm install
npm run build
npm run cf-typegen
npm run typecheck
npm run dev
```

Deploy only after the `jangkau-api` Worker exists under the configured service name:

```sh
npm run deploy
```

The API Worker must be the AI/Data team's FastAPI service adapted to Cloudflare's Python ASGI runtime. This frontend adapter intentionally does not change recommendation or scoring logic.

## R2 and D1

R2 stores approved versioned derived releases. D1 is optional and only records active release metadata; neither replaces the team’s offline PostGIS analysis.

Create provider resources with Wrangler, then copy the returned D1 ID into a private local configuration derived from `wrangler.bindings.example.jsonc`. Do not commit live resource IDs, MAPID tokens, raw MAPID/community data, private survey data, or R2 credentials.

The release manifest URL remains a public frontend configuration value only when the referenced artifacts are approved for public access. A private release must instead be read through an allowlisted server-side endpoint.
