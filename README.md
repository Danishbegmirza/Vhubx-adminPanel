# VHubX Admin Panel

Admin panel for operating VHubX modules like users, partners, properties, establishments, roles/permissions, amenities, requirements, enquiries, blogs, and jobs.

## What This Repo Contains

- React + TypeScript single-page admin app
- CoreUI + Bootstrap based UI layer
- API-driven modules under `src/pages`
- Shared API/client logic in `src/services`
- Auth context and protected routing for admin access

## Tech Stack

- React 18 (`react-scripts` / CRA setup)
- TypeScript 4
- React Router 7
- CoreUI 5 and Bootstrap 5

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables (example):

```bash
REACT_APP_API_URL=http://localhost:3000/api/v1
```

3. Start development server:

```bash
npm start
```

4. Build production bundle:

```bash
npm run build
```

## Scripts

- `npm start` - Start dev server
- `npm run build` - Build production assets
- `npm test` - Run tests

## Architecture Overview

The app follows a practical layered structure:

- `src/pages`: Page-level containers (route targets, screen state, view composition)
- `src/services`: API communication and backend contracts
- `src/components`: Reusable visual and route guard components
- `src/contexts`: Cross-page state (authentication)
- `src/config`: Runtime environment configuration

### Runtime Flow

1. `src/index.tsx` boots the app.
2. `src/App.tsx` wires routes and authenticated layout.
3. Page components call service modules for data operations.
4. Service modules use `apiService.authFetch()` to attach auth headers and call backend APIs.

## Project Structure

```text
src/
  App.tsx
  components/
    DynamicSidebar.tsx
    ProtectedRoute.tsx
    CustomAlert.tsx
  config/
    env.ts
  contexts/
    AuthContext.tsx
  pages/
    Dashboard.tsx
    PartnerRequests.tsx
    ...other feature screens
  services/
    api.ts
    partnerRequestService.ts
    requirementService.ts
    ...other domain services
```

## Coding Conventions (For Reviewability)

- Keep pages focused on UI state and rendering.
- Move fetch/update logic to `src/services`.
- Prefer small reusable handlers over duplicate request code.
- Use typed response contracts for each service.
- Avoid inline business logic in JSX when it can be extracted.

## Contribution Checklist

Before opening a PR:

- Ensure behavior is unchanged unless the ticket requires it.
- Keep refactors isolated from functional changes when possible.
- Run lint/tests locally.
- Add/update docs when introducing new services, routes, or env vars.
- Include screenshots for visual changes.

## Notes

- API base URL is resolved from `REACT_APP_API_URL` in `src/config/env.ts`.
- Auth token is stored in localStorage and injected via `apiService.authFetch()`.
