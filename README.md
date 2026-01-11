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
- **Optional**: OpenAI API (for document extraction)

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL (for database)

### Installation

```bash
# Install all dependencies
npm run install:all
```

### Development

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3000 (or configured port)
```

## Features

### Property Dashboard
- List all properties with name, type, and unique number
- Create new property button

### Property Creation Flow (3 Steps)
1. **General Info**: Management type (WEG/MV), property name, manager/accountant, Teilungserklärung upload
2. **Building Data**: Multiple buildings per property
3. **Units**: Add units to buildings with detailed information

## License

Private - Buena Tech Case Study
