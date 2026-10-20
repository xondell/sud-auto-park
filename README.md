# SUD Auto Park

Responsive vehicle-catalog prototype for **SUD Auto Park, Chișinău**. It helps visitors browse cars, motorcycles and minibuses, narrow the catalogue by their needs, and inspect an individual vehicle before getting in touch.

## What is included

- catalogue cards for cars, motorcycles and minibuses;
- search by make or model;
- filters for vehicle type, make and price;
- dedicated vehicle-detail routes;
- Russian-language interface tailored to the local market;
- browser-based catalogue assistant;
- lightweight administration screen for adding and removing vehicle cards.

> The administration screen is a front-end prototype: changes are stored only in the browser that makes them. It is not an authenticated production CMS.

## Technology

- React 19 + TypeScript
- Vite + Tailwind CSS
- Wouter routing
- tRPC / Express project structure
- Drizzle ORM migrations
- Vitest

## Run locally

Requirements: Node.js 22+ and pnpm.

```bash
pnpm install
pnpm dev
```

The development server runs from the `server` entry point. Open the local URL it prints in the terminal.

## Useful commands

```bash
pnpm check       # TypeScript check
pnpm test        # Run tests
pnpm build       # Build the production bundle
pnpm start       # Start the production server
pnpm db:push     # Generate and apply Drizzle migrations
```

## Project structure

```text
client/src/pages/       public catalogue, detail and admin views
client/src/data/        seed vehicle data and browser persistence
client/src/components/  catalogue assistant, map and shared UI
server/                 API, storage and routing layer
drizzle/                database schema and migrations
```

## Status

This repository represents a catalogue and interface prototype. Before a production launch, connect the admin workflow to authenticated server-side storage, move vehicle media to managed storage, and configure the environment for the chosen hosting and database providers.

## Static hosting and backend capabilities

The repository also includes a GitHub Pages build:

```bash
pnpm build:pages
```

The workflow [deploy-pages.yml](.github/workflows/deploy-pages.yml) publishes `dist/public`. This static build does not run the Express/tRPC server: database-backed administration and other server endpoints require a backend deployment.

[netlify.toml](netlify.toml) configures the same frontend output plus the functions in [netlify/functions](netlify/functions). Inspect that configuration when deploying the lead and Telegram webhook handlers.

Data-model changes belong in [drizzle/schema.ts](drizzle/schema.ts); the browser routes live in [client/src/App.tsx](client/src/App.tsx), and API procedures in [server/routers.ts](server/routers.ts).
