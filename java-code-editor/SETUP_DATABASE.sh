#!/bin/bash

echo "🗄️  Setting up PostgreSQL database for Code Editor..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running on localhost:5432"
    echo "Please start PostgreSQL and try again"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Create database
echo "📦 Creating database 'codeeditor'..."
PGPASSWORD=password psql -U postgres -h localhost -c "CREATE DATABASE codeeditor;" 2>/dev/null || echo "Database already exists"

# Navigate to backend directory
cd backend

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run migrations
echo "📊 Running database migrations..."
npx prisma migrate dev --name init

# Seed database
echo "🌱 Seeding database with sample questions..."
npm run db:seed

echo "✅ Database setup complete!"
echo ""
echo "You can view your database with: cd backend && npx prisma studio"
