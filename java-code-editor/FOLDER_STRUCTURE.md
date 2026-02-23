# Complete Folder Structure

```
java-code-editor/
│
├── frontend/                           # Next.js 14 Frontend Application
│   ├── app/                           # Next.js App Router
│   │   ├── globals.css               # Global styles with Tailwind directives
│   │   ├── layout.tsx                # Root layout with theme provider & toaster
│   │   └── page.tsx                  # Main page (renders CodeEditor)
│   │
│   ├── components/                    # React Components
│   │   ├── CodeEditor.tsx            # Main editor component with all features
│   │   └── ThemeProvider.tsx         # Theme context provider (dark/light mode)
│   │
│   ├── lib/                          # Utility libraries
│   │   └── templates.ts              # Java code templates (Hello World, I/O, etc.)
│   │
│   ├── public/                       # Static assets (auto-created by Next.js)
│   │
│   ├── .dockerignore                 # Docker ignore file
│   ├── .env.local                    # Environment variables (local)
│   ├── .gitignore                    # Git ignore file
│   ├── Dockerfile                    # Frontend Docker configuration
│   ├── next.config.mjs               # Next.js configuration
│   ├── package.json                  # Frontend dependencies
│   ├── postcss.config.mjs            # PostCSS configuration
│   ├── tailwind.config.ts            # Tailwind CSS configuration
│   └── tsconfig.json                 # TypeScript configuration
│
├── backend/                           # Node.js Backend Microservice
│   ├── src/                          # Source code
│   │   ├── server.ts                 # Express server with routes & middleware
│   │   └── executor.ts               # Docker-based Java execution engine
│   │
│   ├── dist/                         # Compiled JavaScript (generated)
│   ├── temp/                         # Temporary execution files (auto-cleaned)
│   │
│   ├── .dockerignore                 # Docker ignore file
│   ├── .env                          # Environment variables
│   ├── .gitignore                    # Git ignore file
│   ├── Dockerfile                    # Backend Docker configuration
│   ├── package.json                  # Backend dependencies
│   └── tsconfig.json                 # TypeScript configuration
│
├── .gitignore                        # Root git ignore
├── docker-compose.yml                # Multi-container orchestration
│
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick start guide
├── DEPLOYMENT.md                     # Deployment instructions
├── SECURITY.md                       # Security architecture & implementation
├── ARCHITECTURE.md                   # System architecture documentation
├── FOLDER_STRUCTURE.md              # This file
│
├── setup.sh                          # Production setup script
└── dev-setup.sh                      # Development setup script
```

## File Descriptions

### Frontend Files

#### `app/layout.tsx`
- Root layout component
- Wraps entire app with ThemeProvider
- Includes Toaster for notifications
- Sets up metadata (title, description)

#### `app/page.tsx`
- Main page component
- Renders CodeEditor component
- Applies background styling

#### `app/globals.css`
- Tailwind CSS directives
- Custom CSS variables for theming
- Dark mode styles

#### `components/CodeEditor.tsx`
**Main component with:**
- Monaco Editor integration
- Code execution logic
- Input/Output panels
- Template selector
- Theme toggle
- Download/Copy functionality
- Execution history
- Format button
- Loading states
- Error handling

#### `components/ThemeProvider.tsx`
- React Context for theme management
- LocalStorage persistence
- Theme toggle function
- Dark/Light mode switching

#### `lib/templates.ts`
**Java code templates:**
- Hello World
- Input/Output
- Array Operations
- Fibonacci
- Sorting
- OOP Example

#### `next.config.mjs`
- Next.js configuration
- Standalone output for Docker
- Environment variables

#### `tailwind.config.ts`
- Tailwind CSS configuration
- Dark mode class strategy
- Custom theme extensions

#### `tsconfig.json`
- TypeScript compiler options
- Path aliases (@/*)
- Strict mode enabled

#### `package.json`
**Dependencies:**
- next: 14.2.3
- react: 18.3.1
- @monaco-editor/react: 4.6.0
- react-hot-toast: 2.4.1
- lucide-react: 0.378.0
- tailwindcss: 3.4.3
- typescript: 5.4.5

#### `Dockerfile`
- Multi-stage build
- Node 18 Alpine base
- Standalone output
- Production optimized

### Backend Files

#### `src/server.ts`
**Express server with:**
- Helmet (security headers)
- CORS (origin control)
- Rate limiting (20 req/min)
- JSON body parser
- Health check endpoint
- Execute endpoint
- Error handling

#### `src/executor.ts`
**Execution engine with:**
- UUID generation
- Temp directory management
- Docker command builder
- Timeout handling
- Output parsing
- Error categorization
- Cleanup logic
- Local execution fallback

#### `tsconfig.json`
- TypeScript compiler options
- CommonJS modules
- ES2020 target
- Strict mode

#### `package.json`
**Dependencies:**
- express: 4.18.2
- cors: 2.8.5
- helmet: 7.1.0
- express-rate-limit: 7.1.5
- uuid: 9.0.1
- typescript: 5.3.3

#### `.env`
**Environment variables:**
- PORT=3001
- NODE_ENV=development
- EXECUTION_TIMEOUT=5000
- MAX_MEMORY_MB=256
- DOCKER_ENABLED=true

#### `Dockerfile`
- Node 18 Alpine base
- Docker CLI included
- OpenJDK 17 included
- Production build
- Security configured

### Root Files

#### `docker-compose.yml`
**Services:**
- frontend (port 3000)
- backend (port 3001)
- Network configuration
- Volume mounts
- Environment variables

#### `README.md`
**Comprehensive documentation:**
- Features overview
- Project structure
- Architecture explanation
- Installation instructions
- Usage guide
- Security details
- Deployment options
- Troubleshooting
- Performance metrics
- Future enhancements

#### `QUICKSTART.md`
- 5-minute setup guide
- Basic usage examples
- Common issues
- Quick commands

#### `DEPLOYMENT.md`
**Deployment guides for:**
- Vercel + Railway
- Render
- AWS EC2
- DigitalOcean
- Environment configs
- Monitoring setup
- Scaling strategies

#### `SECURITY.md`
**Security documentation:**
- Threat model
- Multi-layer security
- Docker isolation details
- Test cases
- Best practices
- Monitoring
- Incident response

#### `ARCHITECTURE.md`
**System design:**
- High-level overview
- Component architecture
- Data flow diagrams
- Security layers
- Scalability design
- Technology stack
- Performance metrics

#### `setup.sh`
**Production setup script:**
- Docker verification
- Image pulling
- Setup instructions

#### `dev-setup.sh`
**Development setup script:**
- Node.js verification
- Dependency installation
- Environment file creation

## Generated Directories

### Frontend
- `.next/` - Next.js build output
- `node_modules/` - NPM dependencies
- `out/` - Static export (if used)

### Backend
- `dist/` - Compiled TypeScript
- `node_modules/` - NPM dependencies
- `temp/` - Temporary execution files

## Environment Files

### `frontend/.env.local`
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### `backend/.env`
```env
PORT=3001
NODE_ENV=development
EXECUTION_TIMEOUT=5000
MAX_MEMORY_MB=256
MAX_CPU_CORES=1
DOCKER_ENABLED=true
FRONTEND_URL=http://localhost:3000
```

## Docker Files

### `frontend/Dockerfile`
- Multi-stage build
- Dependencies layer
- Builder layer
- Runner layer
- Optimized for production

### `backend/Dockerfile`
- Node.js runtime
- Docker CLI
- OpenJDK 17
- Production build

### `docker-compose.yml`
- Frontend service
- Backend service
- Network bridge
- Volume mounts

## Total File Count

- **TypeScript/JavaScript**: 8 files
- **Configuration**: 12 files
- **Documentation**: 6 files
- **Docker**: 4 files
- **Scripts**: 2 files
- **Total**: ~32 files (excluding node_modules, dist, .next)

## Lines of Code (Approximate)

- Frontend TypeScript: ~600 lines
- Backend TypeScript: ~350 lines
- Configuration: ~200 lines
- Documentation: ~2,500 lines
- **Total**: ~3,650 lines

---

**This structure follows best practices for:**
- Separation of concerns
- Scalability
- Maintainability
- Security
- Documentation
