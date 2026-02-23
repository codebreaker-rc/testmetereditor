# Quick Start Guide

Get the Java Code Editor running in 5 minutes!

## Prerequisites

- **Docker** installed and running
- **Docker Compose** installed
- **Git** (to clone the repository)

## Installation Steps

### 1. Clone or Navigate to Project

```bash
cd /home/rchandra/WebProjects/texteditor/java-code-editor
```

### 2. Pull Required Docker Image

```bash
docker pull openjdk:17-slim
```

### 3. Start with Docker Compose (Recommended)

```bash
docker-compose up --build
```

This will:
- Build the frontend (Next.js)
- Build the backend (Node.js)
- Start both services
- Configure networking between them

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### 4. Alternative: Run Without Docker

If you prefer to run without Docker (requires Java JDK installed):

**Terminal 1 - Backend:**
```bash
cd backend
npm install
# Edit .env and set DOCKER_ENABLED=false
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## First Test

1. Open http://localhost:3000
2. You'll see the default "Hello World" template
3. Click **"Compile & Run"**
4. See the output: `Hello, World!`

## Try Different Templates

Use the dropdown menu to try:
- **Input/Output**: Test STDIN functionality
- **Array Operations**: See array manipulation
- **Fibonacci**: Recursive algorithm
- **Sorting**: Bubble sort implementation
- **OOP Example**: Object-oriented programming

## Test with Input

1. Select **"Input/Output"** template
2. In the **Input (STDIN)** section, type: `John`
3. Click **"Compile & Run"**
4. Output: `Hello, John!`

## Features to Explore

### Theme Switching
- Click the sun/moon icon in the header
- Toggle between light and dark modes

### Code Formatting
- Click the **"Format"** button above the editor
- Your code will be auto-formatted

### Download Code
- Click the download icon
- Saves as `Main.java`

### Copy Output
- Click the copy icon in the console
- Output copied to clipboard

### Execution History
- View your last 10 executions
- See execution time and memory usage
- Track success/failure status

## Common Issues

### Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :3000
sudo lsof -i :3001

# Kill the process
sudo kill -9 <PID>
```

### Docker Not Running
```bash
# Start Docker
sudo systemctl start docker

# Check Docker status
docker ps
```

### Permission Denied (Docker Socket)
```bash
sudo chmod 666 /var/run/docker.sock
```

### Backend Connection Failed
```bash
# Check backend is running
curl http://localhost:3001/health

# Should return: {"status":"healthy","timestamp":"..."}
```

## Stop the Application

```bash
# If using Docker Compose
docker-compose down

# If running manually
# Press Ctrl+C in both terminal windows
```

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [SECURITY.md](SECURITY.md) for security details
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design

## Need Help?

- Check the troubleshooting section in README.md
- Review the logs: `docker-compose logs -f`
- Open an issue on GitHub

---

**Enjoy coding with the Java Code Editor! 🚀**
