# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Next.js Frontend (Port 3000)                   │ │
│  │  - Monaco Editor                                       │ │
│  │  - React Components                                    │ │
│  │  - Theme Provider                                      │ │
│  │  - Toast Notifications                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/HTTP
                            │ POST /api/execute
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend Microservice (Port 3001)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express.js Server                                     │ │
│  │  - Rate Limiting (20 req/min)                         │ │
│  │  - CORS Protection                                     │ │
│  │  - Helmet Security Headers                            │ │
│  │  - Input Validation                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Executor Service                                      │ │
│  │  - UUID Generation                                     │ │
│  │  - Temp Directory Creation                            │ │
│  │  - Docker Command Builder                             │ │
│  │  - Timeout Management                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Docker API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Docker Engine                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Isolated Container (per execution)                    │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  OpenJDK 17 Slim                                 │ │ │
│  │  │  - Network: NONE                                 │ │ │
│  │  │  - Filesystem: READ-ONLY                         │ │ │
│  │  │  - Memory: 256MB                                 │ │ │
│  │  │  - CPU: 1 Core                                   │ │ │
│  │  │  - PIDs: 50 max                                  │ │ │
│  │  │  - Timeout: 5 seconds                            │ │ │
│  │  │                                                   │ │ │
│  │  │  Execution Flow:                                 │ │ │
│  │  │  1. javac Main.java (compile)                    │ │ │
│  │  │  2. java Main < input.txt (execute)              │ │ │
│  │  │  3. Return output/errors                         │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  Auto-removed after execution (--rm)                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Architecture

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   │   ├── ThemeProvider   # Dark/Light theme context
│   │   └── Toaster         # Notification system
│   │
│   ├── page.tsx            # Main page component
│   │   └── CodeEditor      # Main editor component
│   │
│   └── globals.css         # Tailwind + custom styles
│
├── components/
│   ├── CodeEditor.tsx      # Main editor component
│   │   ├── Monaco Editor   # Code editing
│   │   ├── Input Panel     # STDIN input
│   │   ├── Output Console  # Execution results
│   │   ├── Control Buttons # Run, Format, Download
│   │   ├── Template Selector
│   │   └── History Panel   # Execution history
│   │
│   └── ThemeProvider.tsx   # Theme management
│       ├── Context API
│       ├── LocalStorage
│       └── Theme Toggle
│
└── lib/
    └── templates.ts        # Java code templates
```

### Backend Architecture

```
backend/
├── src/
│   ├── server.ts           # Express server
│   │   ├── Middleware
│   │   │   ├── Helmet (Security headers)
│   │   │   ├── CORS (Origin control)
│   │   │   ├── Rate Limiter (DoS protection)
│   │   │   └── JSON Parser (Body parsing)
│   │   │
│   │   ├── Routes
│   │   │   ├── GET /health (Health check)
│   │   │   └── POST /api/execute (Code execution)
│   │   │
│   │   └── Error Handling
│   │
│   └── executor.ts         # Execution engine
│       ├── executeJavaCode()
│       │   ├── UUID generation
│       │   ├── Temp directory setup
│       │   └── Execution routing
│       │
│       ├── executeInDocker()
│       │   ├── File preparation
│       │   ├── Docker command build
│       │   ├── Container execution
│       │   ├── Output parsing
│       │   └── Cleanup
│       │
│       └── executeLocally() (Fallback)
│           ├── Java compilation
│           ├── Java execution
│           └── Cleanup
```

## Data Flow

### Execution Request Flow

```
1. User Action
   ├── User writes code in Monaco Editor
   ├── User provides input (optional)
   └── User clicks "Compile & Run"

2. Frontend Processing
   ├── Validate code (not empty, size < 50KB)
   ├── Set loading state
   ├── Clear previous output
   └── Send POST request to backend

3. Network Request
   POST http://backend:3001/api/execute
   Headers: {
     Content-Type: application/json
   }
   Body: {
     code: "public class Main {...}",
     input: "user input data"
   }

4. Backend Middleware
   ├── Rate Limiter: Check request count
   ├── CORS: Validate origin
   ├── Helmet: Add security headers
   └── JSON Parser: Parse request body

5. Backend Validation
   ├── Check code exists
   ├── Check code is string
   ├── Check code size < 50KB
   └── Sanitize input

6. Execution Preparation
   ├── Generate UUID: "a1b2c3d4-..."
   ├── Create temp dir: /tmp/java-exec-a1b2c3d4/
   ├── Write Main.java
   ├── Write input.txt
   └── Record start time

7. Docker Execution
   ├── Build Docker command with security flags
   ├── Execute container
   ├── Compile: javac Main.java
   │   ├── Success: Continue to execution
   │   └── Failure: Return compilation error
   ├── Execute: java Main < input.txt
   │   ├── Success: Capture output
   │   ├── Runtime Error: Capture error
   │   └── Timeout: Kill container
   └── Calculate execution time

8. Cleanup
   ├── Container auto-removed (--rm flag)
   ├── Delete temp directory
   └── Free resources

9. Response Generation
   {
     success: true/false,
     output: "program output",
     error: "runtime error" (if any),
     compilationError: "compile error" (if any),
     executionTime: 234, // ms
     memoryUsage: 128    // KB
   }

10. Frontend Processing
    ├── Receive response
    ├── Update execution history
    ├── Format output display
    ├── Show success/error toast
    └── Clear loading state

11. User Feedback
    ├── View output in console
    ├── See execution metrics
    ├── Check history panel
    └── Copy/download if needed
```

## Security Architecture

### Defense Layers

```
Layer 1: Frontend Validation
├── Code size limit (50KB)
├── Type checking
└── Empty code prevention

Layer 2: Network Security
├── HTTPS encryption (production)
├── CORS origin validation
├── Rate limiting (20/min)
└── Security headers (Helmet)

Layer 3: Input Sanitization
├── Request validation
├── Size enforcement
├── Type verification
└── SQL injection prevention

Layer 4: Docker Isolation
├── Network disabled (--network none)
├── Filesystem read-only (--read-only)
├── Memory limit (--memory 256m)
├── CPU limit (--cpus 1.0)
├── Process limit (--pids-limit 50)
└── Temporary storage (--tmpfs)

Layer 5: Execution Control
├── Timeout (5 seconds)
├── Output buffer limit (1MB)
├── Automatic cleanup
└── Error handling

Layer 6: Resource Management
├── Unique execution IDs
├── Isolated temp directories
├── Automatic container removal
└── File cleanup
```

## Scalability Design

### Current Architecture (Single Instance)

```
┌──────────────┐
│   Frontend   │ ──────┐
└──────────────┘       │
                       ▼
                ┌──────────────┐
                │   Backend    │
                └──────────────┘
                       │
                       ▼
                ┌──────────────┐
                │    Docker    │
                └──────────────┘
```

### Horizontal Scaling (Future)

```
                ┌──────────────┐
                │ Load Balancer│
                └──────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Backend 1   │ │  Backend 2   │ │  Backend 3   │
└──────────────┘ └──────────────┘ └──────────────┘
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                ┌──────────────┐
                │ Docker Swarm │
                │  or K8s      │
                └──────────────┘
```

### Queue-Based Architecture (High Load)

```
Frontend ──► API Gateway ──► Message Queue ──► Workers ──► Docker
                                  │
                                  ▼
                              Database
                            (Job Status)
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2.3
- **Language**: TypeScript 5.4.5
- **Styling**: Tailwind CSS 3.4.3
- **Editor**: Monaco Editor 4.6.0
- **Icons**: Lucide React 0.378.0
- **Notifications**: React Hot Toast 2.4.1
- **Runtime**: Node.js 18+

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5.3.3
- **Security**: 
  - Helmet 7.1.0
  - CORS 2.8.5
  - Express Rate Limit 7.1.5
- **Utilities**: UUID 9.0.1

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Java Runtime**: OpenJDK 17 Slim
- **Base Images**: 
  - node:18-alpine (Backend)
  - openjdk:17-slim (Execution)

## Performance Characteristics

### Latency Breakdown

```
Total Request Time: ~500-2000ms

├── Network (Frontend → Backend): 10-50ms
├── Backend Processing: 5-10ms
├── Docker Container Startup: 100-300ms
├── Java Compilation: 200-800ms
├── Java Execution: 1-5000ms (timeout)
├── Output Processing: 5-10ms
├── Cleanup: 10-50ms
└── Network (Backend → Frontend): 10-50ms
```

### Resource Usage (Per Execution)

```
Memory:
├── Frontend: ~50MB (browser)
├── Backend: ~100MB (Node.js)
└── Docker Container: 256MB (limit)

CPU:
├── Frontend: Minimal
├── Backend: <5% (idle), 10-20% (executing)
└── Docker Container: 1 core (limit)

Disk:
├── Code File: <50KB
├── Compiled .class: ~1-5KB
├── Input File: <10KB
└── Temp Directory: Auto-cleaned
```

### Throughput

```
Single Backend Instance:
├── Max Concurrent Executions: 10-20
├── Requests per Minute: 20 (rate limited)
├── Requests per Hour: 1,200
└── Daily Capacity: ~28,800 executions
```

## Monitoring Points

### Health Checks
- **Endpoint**: GET /health
- **Frequency**: Every 30 seconds
- **Metrics**: Status, timestamp

### Metrics to Track
1. **Request Metrics**
   - Total requests
   - Success rate
   - Error rate
   - Average response time

2. **Execution Metrics**
   - Compilation success rate
   - Runtime success rate
   - Average execution time
   - Timeout frequency

3. **Resource Metrics**
   - CPU usage
   - Memory usage
   - Disk usage
   - Docker container count

4. **Security Metrics**
   - Rate limit hits
   - Failed validations
   - Suspicious patterns

## Deployment Architecture

### Development
```
localhost:3000 (Frontend) ──► localhost:3001 (Backend) ──► Docker
```

### Production (Vercel + Railway)
```
vercel.app (Frontend) ──► railway.app (Backend) ──► Docker
      │                          │
      └──────── CDN ─────────────┘
```

### Production (Self-Hosted)
```
                ┌─────────────┐
                │   Nginx     │ (Port 80/443)
                └─────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼                             ▼
┌──────────────┐              ┌──────────────┐
│  Frontend    │              │   Backend    │
│  (Port 3000) │              │  (Port 3001) │
└──────────────┘              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │    Docker    │
                              └──────────────┘
```

## Future Enhancements

### Planned Features
1. **User Authentication**: JWT-based auth
2. **Code Persistence**: Save code snippets
3. **Collaboration**: Real-time multi-user editing
4. **Advanced Analytics**: Detailed metrics dashboard
5. **Multi-Language**: Python, C++, JavaScript support
6. **Test Cases**: Automated testing framework
7. **Code Sharing**: Shareable links
8. **API Access**: Public API for integrations

### Architecture Evolution
1. **Microservices**: Separate compilation and execution services
2. **Message Queue**: RabbitMQ/Redis for job processing
3. **Database**: PostgreSQL for user data
4. **Caching**: Redis for frequently used code
5. **CDN**: CloudFlare for static assets
6. **Kubernetes**: Container orchestration at scale

---

**This architecture prioritizes security, scalability, and maintainability while providing excellent user experience.**
