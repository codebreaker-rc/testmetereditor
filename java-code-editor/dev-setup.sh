#!/bin/bash

echo "=========================================="
echo "Java Code Editor - Development Setup"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm -v) is installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..
echo ""

# Create .env files if they don't exist
if [ ! -f "frontend/.env.local" ]; then
    echo "📝 Creating frontend/.env.local..."
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
EOF
    echo "✅ Created frontend/.env.local"
fi

if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env..."
    cat > backend/.env << EOF
PORT=3001
NODE_ENV=development
EXECUTION_TIMEOUT=5000
MAX_MEMORY_MB=256
MAX_CPU_CORES=1
DOCKER_ENABLED=true
FRONTEND_URL=http://localhost:3000
EOF
    echo "✅ Created backend/.env"
fi

echo ""
echo "=========================================="
echo "Development Setup Complete!"
echo "=========================================="
echo ""
echo "To start development servers:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Access the application:"
echo "  http://localhost:3000"
echo ""
echo "=========================================="
