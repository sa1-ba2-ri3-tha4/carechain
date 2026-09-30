# CARECHAIN

From discharge instructions to completed recovery.

CARECHAIN is a full-stack TypeScript demo for coordinating recovery after discharge. It uses simulated data and is not for clinical use.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Install and run

```powershell
cd carechain
npm install
Copy-Item .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

The Vite app runs at http://localhost:5173 and the REST API at http://localhost:4000. Verify the API with `Invoke-RestMethod http://localhost:4000/api/health`.

## Checks

```powershell
npm run typecheck
npm test
npm run build
```

The demo login accepts any email, a password of `demo`, and one of the available roles. Authentication uses a signed demo JWT; do not use real patient information or deploy this demo as a clinical system.