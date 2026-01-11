# Frontend - Buena Property Management

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Shadcn/ui.

## Tech Stack

### Core
- **Next.js 14+** (App Router) - Framework
- **TypeScript** - Type safety
- **React 18** - UI library

### Styling
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/ui** - Component library (built on Radix UI)
- **Lucide React** - Icons

### Forms & Validation
- **React Hook Form** - Form management (performant for 60+ units)
- **Zod** - Schema validation with TypeScript inference

### State Management
- **Zustand** - Lightweight state management for multi-step forms

### Data Fetching
- **TanStack Query (React Query)** - Server state, caching, and synchronization
- **Axios** - HTTP client

### Tables & Performance
- **TanStack Table** - Powerful table with sorting/filtering
- **TanStack Virtual** - Virtualization for 60+ units

### File Upload
- **react-dropzone** - Drag & drop file upload

### Utilities
- **date-fns** - Date manipulation
- **clsx + tailwind-merge** - Conditional class names

### Optional
- **pdf-parse** - PDF text extraction
- **OpenAI API** - AI-powered document parsing

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Format code
npm run format
```

## Project Structure

```
frontend/
├── app/              # Next.js App Router pages
├── components/       # React components
│   └── ui/          # Shadcn/ui components
├── lib/             # Utility functions
│   └── api/         # API client functions
├── hooks/           # Custom React hooks
├── stores/          # Zustand stores
└── types/           # TypeScript type definitions
```
