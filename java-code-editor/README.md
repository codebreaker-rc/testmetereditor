# Java Code Editor & Compiler

A production-ready, web-based Java code editor and compiler with secure containerized execution using Next.js 14, TypeScript, and Docker.

## 🚀 Features

### Core Functionality
- **Monaco Editor Integration** - Full VS Code editor experience with Java syntax highlighting
- **Real-time Compilation & Execution** - Compile and run Java code with instant feedback
- **STDIN Support** - Provide input to your programs
- **Execution Metrics** - View execution time and memory usage
- **Error Handling** - Clear compilation and runtime error messages

### Advanced Features
- **Code Templates** - Pre-built examples (Hello World, I/O, Arrays, Fibonacci, Sorting, OOP)
- **Theme Switcher** - Light/Dark mode support
- **Execution History** - Track your last 10 executions with metrics
- **Code Download** - Save your code as `.java` files
- **Code Formatting** - Auto-format your code
- **Copy Output** - Copy console output to clipboard

### Security Features
- **Docker Isolation** - Each execution runs in an isolated Docker container
- **Network Disabled** - No network access during code execution
- **Resource Limits** - CPU and memory constraints (256MB RAM, 1 CPU core)
- **Timeout Protection** - 5-second execution timeout to prevent infinite loops
- **Read-only Filesystem** - Code runs in read-only environment
- **Rate Limiting** - 20 requests per minute per IP
- **Input Validation** - Code size limits (50KB max)

## 📁 Project Structure

```
java-code-editor/
├── frontend/                 # Next.js 14 frontend application
│   ├── app/
│   │   ├── globals.css      # Global styles with Tailwind
│   │   ├── layout.tsx       # Root layout with theme provider
│   │   └── page.tsx         # Main page
│   ├── components/
│   │   ├── CodeEditor.tsx   # Main editor component
│   │   └── ThemeProvider.tsx # Theme context provider
│   ├── lib/
│   │   └── templates.ts     # Java code templates
│   ├── Dockerfile           # Frontend Docker configuration
│   ├── next.config.mjs      # Next.js configuration
│   ├── tailwind.config.ts   # Tailwind CSS configuration
│   └── package.json
│
├── backend/                  # Node.js execution microservice
│   ├── src/
│   │   ├── server.ts        # Express server with API routes
│   │   └── executor.ts      # Docker-based Java execution engine
│   ├── Dockerfile           # Backend Docker configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json
│
├── docker-compose.yml        # Multi-container orchestration
└── README.md                # This file
```

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Editor**: Monaco Editor (VS Code)
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast

### Backend (Node.js Microservice)
- **Runtime**: Node.js 18 with TypeScript
- **Framework**: Express.js
- **Security**: Helmet, CORS, Rate Limiting
- **Execution**: Docker-based isolation

### Execution Flow
```
User writes code → Frontend sends to Backend API → 
Backend creates Docker container → Compiles Java code → 
Executes with timeout/limits → Returns output → 
Frontend displays results
```

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** 18+ 
- **Docker** & Docker Compose
- **npm** or **yarn**

### Local Development (Without Docker)

#### 1. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

#### 2. Environment Variables

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

**Backend** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
EXECUTION_TIMEOUT=5000
MAX_MEMORY_MB=256
MAX_CPU_CORES=1
DOCKER_ENABLED=false
```

> **Note**: Set `DOCKER_ENABLED=false` for local development without Docker, but you'll need Java JDK installed locally.

#### 3. Run Development Servers

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

Access the application at `http://localhost:3000`

### Production Deployment (With Docker)

#### Option 1: Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application at `http://localhost:3000`

#### Option 2: Individual Docker Containers

**Pull Java Runtime Image:**
```bash
docker pull openjdk:17-slim
```

**Build Backend:**
```bash
cd backend
docker build -t java-executor-backend .
docker run -d -p 3001:3001 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/tmp \
  --privileged \
  --name java-backend \
  java-executor-backend
```

**Build Frontend:**
```bash
cd frontend
docker build -t java-executor-frontend .
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_URL=http://localhost:3001 \
  --name java-frontend \
  java-executor-frontend
```

## 🚢 Deployment to Cloud

### Frontend Deployment (Vercel)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set root directory to `frontend`
   - Add environment variable:
     ```
     NEXT_PUBLIC_BACKEND_URL=<your-backend-url>
     ```
   - Deploy

### Backend Deployment (Railway/Render/AWS)

#### Railway
1. Create new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Add environment variables:
   ```
   PORT=3001
   NODE_ENV=production
   DOCKER_ENABLED=true
   EXECUTION_TIMEOUT=5000
   MAX_MEMORY_MB=256
   FRONTEND_URL=<your-frontend-url>
   ```
5. Enable Docker socket access in Railway settings
6. Deploy

#### Render
1. Create new Web Service on [Render](https://render.com)
2. Connect repository
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables (same as above)
5. Enable Docker in Render settings
6. Deploy

#### AWS (EC2)
```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance

# Install Docker
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Clone repository
git clone <your-repo-url>
cd java-code-editor

# Run with Docker Compose
docker-compose up -d --build

# Configure security group to allow ports 3000 and 3001
```

## 🔒 Security Implementation

### Container Isolation
- **Network Isolation**: `--network none` prevents all network access
- **Read-only Filesystem**: `--read-only` prevents file modifications
- **Temporary Storage**: Limited tmpfs for compilation artifacts
- **Resource Limits**: 
  - Memory: 256MB max
  - CPU: 1 core max
  - Process limit: 50 PIDs
  - Execution timeout: 5 seconds

### Code Execution Safety
```typescript
// Docker command structure
docker run --rm \
  --network none \              // No network access
  --memory="256m" \              // Memory limit
  --cpus="1.0" \                 // CPU limit
  --pids-limit=50 \              // Process limit
  --read-only \                  // Read-only filesystem
  --tmpfs /tmp:rw,noexec,nosuid,size=10m \  // Temp storage
  -v "${tempDir}:/workspace:ro" \  // Mount code as read-only
  -w /workspace \
  openjdk:17-slim \
  bash -c "javac Main.java && timeout 5s java Main < input.txt"
```

### API Security
- **Helmet.js**: Security headers
- **CORS**: Restricted to frontend origin
- **Rate Limiting**: 20 requests/minute per IP
- **Input Validation**: Code size limits, type checking
- **Error Sanitization**: No system information leakage

## 🎯 Usage Guide

### Writing Code
1. Select a template from the dropdown or write your own
2. Use the Monaco editor with full IntelliSense support
3. Format code using the "Format" button

### Providing Input
1. Enter input data in the "Input (STDIN)" section
2. Each line will be available via `Scanner` or `System.in`

### Running Code
1. Click "Compile & Run"
2. View compilation errors (if any)
3. See runtime output, execution time, and memory usage
4. Check execution history for past runs

### Advanced Features
- **Download**: Save your code as `Main.java`
- **Copy Output**: Copy console output to clipboard
- **Theme Toggle**: Switch between light and dark modes
- **Clear Output**: Reset the console

## 🧪 Testing

### Test Compilation Error
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello"  // Missing semicolon
    }
}
```

### Test Runtime Error
```java
public class Main {
    public static void main(String[] args) {
        int[] arr = new int[5];
        System.out.println(arr[10]); // ArrayIndexOutOfBoundsException
    }
}
```

### Test Timeout
```java
public class Main {
    public static void main(String[] args) {
        while(true) {
            System.out.println("Infinite loop");
        }
    }
}
```

### Test Input/Output
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        System.out.println("Hello, " + name + "!");
    }
}
```
Input: `Alice`
Output: `Hello, Alice!`

## 📊 Performance & Scalability

### Current Limits
- **Execution Timeout**: 5 seconds
- **Memory Limit**: 256MB per execution
- **Code Size**: 50KB max
- **Rate Limit**: 20 requests/minute per IP

### Scaling Strategies

#### Horizontal Scaling
- Deploy multiple backend instances behind a load balancer
- Use Redis for rate limiting across instances
- Implement queue system (Bull, RabbitMQ) for execution requests

#### Vertical Scaling
- Increase container resource limits
- Use more powerful EC2/compute instances
- Optimize Docker image size

#### Future Enhancements
- **Execution Queue**: Handle burst traffic with job queues
- **Caching**: Cache compilation results for identical code
- **Multi-language Support**: Add Python, C++, JavaScript
- **Code Sharing**: Generate shareable links
- **User Authentication**: Save code snippets per user
- **Collaborative Editing**: Real-time multi-user editing
- **Test Cases**: Run code against predefined test cases
- **Performance Profiling**: Detailed execution analytics

## 🐛 Troubleshooting

### Docker Issues
```bash
# Check if Docker is running
docker ps

# Pull Java image manually
docker pull openjdk:17-slim

# Check Docker socket permissions
ls -la /var/run/docker.sock
sudo chmod 666 /var/run/docker.sock
```

### Backend Connection Issues
```bash
# Check backend health
curl http://localhost:3001/health

# View backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Frontend Build Issues
```bash
# Clear Next.js cache
rm -rf frontend/.next

# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables Reference

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `http://localhost:3001` |

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `DOCKER_ENABLED` | Use Docker for execution | `true` |
| `EXECUTION_TIMEOUT` | Max execution time (ms) | `5000` |
| `MAX_MEMORY_MB` | Memory limit (MB) | `256` |
| `MAX_CPU_CORES` | CPU core limit | `1` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🙏 Acknowledgments

- **Monaco Editor** - Microsoft's VS Code editor
- **Next.js** - React framework by Vercel
- **Docker** - Containerization platform
- **OpenJDK** - Java runtime environment

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ using Next.js, TypeScript, Docker, and modern web technologies**
