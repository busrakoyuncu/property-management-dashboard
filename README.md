# Buena Case Study - Property Management Dashboard

A full-stack property management system with a guided property creation flow.

## Project Structure

This is a monorepo containing:

- **frontend/**: Next.js + TypeScript application
- **backend/**: NestJS + Node.js API server

## Tech Stack

- **Frontend**: Next.js, TypeScript
- **Backend**: NestJS, Node.js
- **Database**: PostgreSQL
- **Third Party**: OpenAI API (for document extraction)

## Getting Started

### Option 1: Docker (Recommended)

The easiest way to run the application is using Docker Compose:

**Note:** Before running Docker, create a `backend/.env` file with the following keys:
```
DATABASE_URL=database_url
OPENAI_API_KEY=api_key
```

Then start the containers with:
```bash
docker-compose up -d --build
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432

### Option 2: Local Development

#### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL

#### Installation

```bash
# Install all dependencies
npm run install:all
```

#### Development

```bash
# Run both frontend and backend concurrently (from root)
npm run dev

# Or run them separately (from root):
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001

# Or run directly in each directory:
cd frontend && npm run dev
cd backend && npm run start:dev
```

## Testing

### Run All Tests

```bash
# Backend tests
cd backend && npm run test

# Frontend tests
cd frontend && npm run test
```

### Test with Coverage

```bash
# Backend coverage
cd backend && npm run test:cov

# Frontend coverage
cd frontend && npm run test:coverage
```

## Features

### Property Dashboard
- List all properties
- Create new property button

### Property Creation Flow (3 Steps)
1. **General Info**: Management type (WEG/MV), property name, manager/accountant, Teilungserklärung upload
2. **Building Data**: Multiple buildings per property
3. **Units**: Add units to buildings with detailed information

### AI-Powered PDF Parsing
- Upload Teilungserklärung (Declaration of Division) PDFs
- Automatic extraction of property, building, and unit information using OpenAI
- Auto-fill all form fields with parsed data
- Integrated into the property creation wizard

