# Authentication & Multi-Language Setup Guide

This guide explains the new features being added to the Code Editor application.

## 🎯 New Features

### 1. **Authentication System**
- User registration and login
- JWT-based authentication
- Secure password hashing with bcrypt

### 2. **Multi-Language Support**
- Java (existing)
- Python (new)
- JavaScript (new)

### 3. **Programming Questions**
- Question bank with difficulty levels
- Category-based filtering
- Starter code templates
- Test cases for validation

### 4. **Enhanced UI**
- Home page with login/registration
- Language selection page
- Questions panel in editor (left sidebar)
- Click to load question as comment

## 📦 Technology Stack

**Backend:**
- PostgreSQL database
- Prisma ORM
- GraphQL (Apollo Server)
- JWT authentication
- bcrypt for password hashing

**Frontend:**
- Next.js 14 with App Router
- Apollo Client for GraphQL
- TailwindCSS for styling
- Monaco Editor (existing)

## 🗄️ Database Schema

### Tables:
1. **User** - User accounts
2. **Question** - Programming questions
3. **TestCase** - Test cases for questions
4. **Submission** - User code submissions

## 🚀 Setup Instructions

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- @prisma/client
- apollo-server-express
- graphql
- bcryptjs
- jsonwebtoken
- dotenv

### Step 2: Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE codeeditor;

# Exit
\q
```

### Step 3: Run Prisma Migrations

```bash
cd backend
npx prisma migrate dev --name init
```

This creates all database tables.

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

### Step 5: Seed Database with Sample Questions

```bash
npm run db:seed
```

This adds:
- 4 Java questions (Two Sum, Reverse String, Palindrome, FizzBuzz)
- 1 Python question
- 1 JavaScript question

### Step 6: Update Frontend Dependencies

Frontend changes will include:
- Apollo Client for GraphQL
- Authentication context
- Protected routes
- New pages (home, language selection)

## 📁 New File Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data
├── src/
│   ├── graphql/
│   │   ├── schema.ts          # GraphQL schema
│   │   └── resolvers.ts       # GraphQL resolvers
│   ├── server.ts              # Updated with GraphQL
│   └── executor.ts            # Existing (unchanged)

frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── language-select/       # New: Language selection
│   ├── editor/[lang]/         # Updated: Editor with questions
│   └── page.tsx               # New: Home/landing page
├── components/
│   ├── AuthProvider.tsx       # New: Auth context
│   ├── QuestionsList.tsx      # New: Questions sidebar
│   └── CodeEditor.tsx         # Updated: With question loading
```

## 🔐 Environment Variables

Backend `.env`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/codeeditor?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

## 🎨 User Flow

1. **Landing Page** → Login/Register
2. **After Login** → Language Selection (Java/Python/JavaScript)
3. **Editor Page** → 
   - Left: Questions list (filterable)
   - Center: Monaco Editor
   - Right: Output panel
4. **Click Question** → Loads as comment in editor
5. **Write Code** → Execute (existing functionality)
6. **Submit** → Saves to database

## 📝 Next Steps

I've created the backend infrastructure. The remaining work includes:

### Backend:
- [ ] Update server.ts to integrate GraphQL
- [ ] Add authentication middleware
- [ ] Connect code execution to submissions

### Frontend:
- [ ] Install Apollo Client
- [ ] Create authentication pages
- [ ] Build language selection page
- [ ] Add questions sidebar to editor
- [ ] Implement question loading
- [ ] Add protected routes

## ⚠️ Important Notes

1. **Database**: Ensure PostgreSQL is running on localhost:5432
2. **Credentials**: postgres/password (as specified)
3. **JWT Secret**: Change in production!
4. **Existing Features**: All current Java/Maven functionality remains unchanged

## 🧪 Testing

After setup, you can:
1. Register a new user
2. Login
3. Select Java
4. See 4 Java questions in sidebar
5. Click "Two Sum" → loads as comment
6. Write solution
7. Execute code (existing flow)

Would you like me to continue with the implementation?
