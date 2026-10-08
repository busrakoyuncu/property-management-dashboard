# PropManager

A full-stack property management dashboard for German real estate portfolios. It models properties (WEG condominium associations or MV rental management), the buildings they contain, and the individual units inside each building. A guided three-step wizard creates a whole property tree in one request, and an AI-assisted importer pre-fills the wizard from an uploaded *Teilungserklärung* (declaration of division) PDF.

## Features

- **Property dashboard** with expandable rows for buildings and units, and delete confirmation modals at every level.
- **Three-step creation wizard**
  1. General info: management type, name, property number, land-registry and notary data, property manager and accountant.
  2. Buildings: add one or more buildings with address, type, floors, elevator and accessibility flags.
  3. Units: assign apartments, offices, gardens and parking spaces to buildings.
- **Fast unit entry**: quick-add form, pattern-based generation (for example "10 apartments starting at 01"), CSV bulk import (see [example-units-import.csv](example-units-import.csv)), and an editable table with sorting, filtering and inline edits.
- **AI PDF parsing**: upload a declaration of division and the backend extracts property, building, unit and contact data with OpenAI, then fills the wizard automatically.
- **Contacts**: property managers and accountants are stored once and reused across properties; new ones can be created inline, pre-filled from the parsed PDF.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Redux Toolkit + RTK Query, Tailwind CSS, Radix UI, lucide-react |
| Backend | NestJS 10, TypeScript, class-validator / class-transformer, Multer, pdf-extraction, OpenAI SDK |
| Database | PostgreSQL 16 via Prisma 5 |
| Testing | Jest, React Testing Library, @nestjs/testing |
| Infrastructure | Docker, Docker Compose, npm workspaces |

Architecture details live in [docs/backend-architecture.md](docs/backend-architecture.md) and [docs/frontend-architecture.md](docs/frontend-architecture.md).

## Getting started

### Option 1: Docker Compose (recommended)

1. Create `backend/.env`:

   ```env
   DATABASE_URL=postgresql://propmanager_user:propmanager_password@postgres:5432/propmanager_db?schema=public
   OPENAI_API_KEY=sk-...
   ```

   `DATABASE_URL` is overridden by Docker Compose, so any value works there, but `OPENAI_API_KEY` is required because the backend refuses to start without it.

2. Build and start everything:

   ```bash
   docker-compose up -d --build
   ```

   The backend container runs `prisma migrate dev` on startup, so the schema is applied automatically.

3. Open the app:

   | Service | URL |
   | --- | --- |
   | Frontend | http://localhost:3000 |
   | Backend API | http://localhost:3001 |
   | PostgreSQL | localhost:5432 |

### Option 2: Local development

Prerequisites: Node.js 18+, npm 9+, and a running PostgreSQL instance.

```bash
# Install root, frontend and backend dependencies
npm run install:all

# Configure the backend
cat > backend/.env <<'EOF'
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/propmanager?schema=public
OPENAI_API_KEY=sk-...
EOF

# Apply the database schema and generate the Prisma client
cd backend && npm run prisma:migrate && cd ..

# Run backend (3001) and frontend (3000) together
npm run dev
```

Run them separately with `npm run dev:backend` and `npm run dev:frontend`. The frontend reads the API base URL from `NEXT_PUBLIC_API_URL` and defaults to `http://localhost:3001`.

## Testing

```bash
# Backend unit tests (services, controllers, PDF parser)
cd backend && npm test
cd backend && npm run test:cov

# Frontend component tests
cd frontend && npm test
cd frontend && npm run test:coverage
```

## Project structure

```
.
├── backend/                 NestJS API
│   ├── prisma/              schema.prisma and migrations
│   └── src/
│       ├── properties/      CRUD + PDF parsing (OpenAI)
│       ├── buildings/
│       ├── units/
│       ├── contacts/
│       └── prisma/          PrismaService wrapper
├── frontend/                Next.js app
│   ├── app/                 App Router entry (layout, page, favicon)
│   ├── components/          Dashboard, wizard steps, modals, ui primitives
│   ├── lib/store/           Redux store and RTK Query API slices
│   └── types/               Shared form and domain types
├── docs/                    Architecture documentation
├── images/                  Diagrams used in the docs
├── docker-compose.yml       Postgres + backend + frontend
└── example-units-import.csv Sample CSV for bulk unit import
```

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | backend | PostgreSQL connection string used by Prisma |
| `OPENAI_API_KEY` | backend | Required at startup; used for PDF extraction |
| `PORT` | backend | API port, defaults to 3001 |
| `NEXT_PUBLIC_API_URL` | frontend | Backend base URL, defaults to http://localhost:3001 |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` | docker-compose | Database credentials, with `propmanager_*` defaults |

## License

MIT
