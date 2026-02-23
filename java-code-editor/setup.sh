#!/bin/bash

echo "=========================================="
echo "Java Code Editor - Setup Script"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker is installed"

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker."
    exit 1
fi

echo "✅ Docker is running"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker Compose is installed"
echo ""

# Pull required Docker image
echo "📦 Pulling OpenJDK 17 image..."
docker pull openjdk:17-slim

if [ $? -eq 0 ]; then
    echo "✅ OpenJDK image pulled successfully"
else
    echo "❌ Failed to pull OpenJDK image"
    exit 1
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "To start the application:"
echo "  docker-compose up --build"
echo ""
echo "To start in detached mode:"
echo "  docker-compose up -d --build"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo ""
echo "To stop the application:"
echo "  docker-compose down"
echo ""
echo "=========================================="
