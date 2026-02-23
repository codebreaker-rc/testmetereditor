# Implementation Plan: Authentication & Multi-Language Support

## Current Status: ✅ Backend Foundation Complete

### ✅ Completed:
1. Database schema (Prisma)
2. GraphQL schema and resolvers
3. Backend dependencies installed
4. Sample questions seed file
5. Environment configuration

### 🔄 In Progress:
- Backend server integration with GraphQL
- Database setup

### ⏳ Remaining Work:

## Phase 1: Backend Completion (2-3 hours)

### Step 1: Database Setup
```bash
# Run this command:
./SETUP_DATABASE.sh
```

This will:
- Create PostgreSQL database
- Run Prisma migrations
- Seed sample questions

### Step 2: Fix TypeScript Errors
The backend has some TypeScript configuration issues that need to be resolved:
- Update tsconfig.json to include proper types
- Fix Apollo Server v4 integration
- Add proper type annotations

### Step 3: Start Backend Server
```bash
cd backend
npm run dev
```

Expected endpoints:
- REST API: http://localhost:3001/api/execute
- GraphQL: http://localhost:3001/graphql
- Health: http://localhost:3001/health

## Phase 2: Frontend Implementation (4-5 hours)

### Step 1: Install Frontend Dependencies
```bash
cd frontend
npm install @apollo/client graphql
npm install @tanstack/react-query  # For state management
npm install js-cookie @types/js-cookie  # For token storage
```

### Step 2: Create Authentication Context
File: `frontend/lib/auth-context.tsx`
- User state management
- Login/logout functions
- Token storage
- Protected route wrapper

### Step 3: Create Authentication Pages

**Login Page**: `frontend/app/(auth)/login/page.tsx`
- Email/password form
- GraphQL mutation for login
- Redirect to language selection on success

**Register Page**: `frontend/app/(auth)/register/page.tsx`
- Email/username/password form
- GraphQL mutation for register
- Redirect to language selection on success

### Step 4: Create Language Selection Page
File: `frontend/app/language-select/page.tsx`
- Display 3 language cards (Java, Python, JavaScript)
- Click to navigate to editor with language parameter
- Protected route (requires authentication)

### Step 5: Update Editor Page
File: `frontend/app/editor/[lang]/page.tsx`
- Add questions sidebar (left panel)
- Fetch questions via GraphQL
- Filter by selected language
- Click question to load as comment
- Keep existing code execution functionality

### Step 6: Create Questions Component
File: `frontend/components/QuestionsList.tsx`
- Display questions list
- Filter by difficulty/category
- Click handler to load question
- Show question details

## Phase 3: Integration & Testing (1-2 hours)

### Step 1: Connect Code Execution to Submissions
- Update execute API to save submissions
- Link submissions to questions
- Track user progress

### Step 2: Add Navigation
- Header with logout button
- Language switcher
- User profile display

### Step 3: Testing
- Test registration flow
- Test login flow
- Test language selection
- Test question loading
- Test code execution
- Test submission tracking

## File Structure (Final)

```
java-code-editor/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          ✅ Done
│   │   └── seed.ts                ✅ Done
│   ├── src/
│   │   ├── graphql/
│   │   │   ├── schema.ts          ✅ Done
│   │   │   ├── resolvers.ts       ✅ Done
│   │   │   └── context.ts         ✅ Done
│   │   ├── server-graphql.ts      🔄 In Progress
│   │   └── executor.ts            ✅ Existing
│   ├── package.json               ✅ Updated
│   └── .env                       ✅ Updated
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx     ⏳ TODO
│   │   │   └── register/page.tsx  ⏳ TODO
│   │   ├── language-select/
│   │   │   └── page.tsx           ⏳ TODO
│   │   ├── editor/[lang]/
│   │   │   └── page.tsx           ⏳ TODO (Update existing)
│   │   └── page.tsx               ⏳ TODO (Landing page)
│   ├── components/
│   │   ├── AuthProvider.tsx       ⏳ TODO
│   │   ├── QuestionsList.tsx      ⏳ TODO
│   │   └── CodeEditor.tsx         ✅ Existing (needs update)
│   ├── lib/
│   │   ├── apollo-client.ts       ⏳ TODO
│   │   └── auth-context.tsx       ⏳ TODO
│   └── package.json               ⏳ TODO (Update)
│
└── SETUP_DATABASE.sh              ✅ Done
```

## Quick Start Commands

### 1. Setup Database (Run Once)
```bash
./SETUP_DATABASE.sh
```

### 2. Start Backend
```bash
cd backend
npm run dev
```

### 3. Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- GraphQL Playground: http://localhost:3001/graphql

## Environment Variables Summary

### Backend (.env)
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/codeeditor?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3001/graphql
```

## Next Immediate Steps

1. **Run database setup**: `./SETUP_DATABASE.sh`
2. **Fix backend TypeScript errors** (I can help with this)
3. **Start backend server** to verify it works
4. **Then proceed with frontend** implementation

Would you like me to:
A) Continue fixing the backend TypeScript issues and get the server running?
B) Skip to frontend implementation and come back to backend later?
C) Create a minimal working version first, then add features incrementally?

Let me know which approach you prefer!
