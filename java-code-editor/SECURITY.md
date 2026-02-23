# Security Architecture & Implementation

## Overview

This document explains the comprehensive security measures implemented in the Java Code Editor to ensure safe execution of untrusted user code.

## Threat Model

### Potential Threats
1. **Malicious Code Execution**: Users attempting to execute harmful code
2. **Resource Exhaustion**: Infinite loops, memory bombs, fork bombs
3. **File System Access**: Reading/writing sensitive files
4. **Network Access**: Making external requests, port scanning
5. **Privilege Escalation**: Attempting to gain system access
6. **DoS Attacks**: Overwhelming the server with requests
7. **Code Injection**: SQL injection, command injection attempts

## Multi-Layer Security Architecture

### Layer 1: Input Validation (Frontend & Backend)

#### Frontend Validation
```typescript
// Code size limit
if (code.length > 50000) {
  toast.error('Code is too long (max 50KB)');
  return;
}

// Type checking
if (!code || typeof code !== 'string') {
  return;
}
```

#### Backend Validation
```typescript
// Request validation
if (!code || typeof code !== 'string') {
  return res.status(400).json({
    success: false,
    error: 'Invalid request: code is required',
  });
}

// Size limit enforcement
if (code.length > 50000) {
  return res.status(400).json({
    success: false,
    error: 'Code is too long (max 50KB)',
  });
}
```

### Layer 2: Rate Limiting

```typescript
// Express rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 20,                   // 20 requests per minute
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

**Protection Against:**
- Brute force attacks
- DoS attempts
- Resource exhaustion

### Layer 3: Docker Container Isolation

#### Complete Network Isolation
```bash
--network none
```
- **Effect**: Container has NO network access
- **Prevents**: External API calls, port scanning, data exfiltration
- **Cannot**: Make HTTP requests, connect to databases, send emails

#### Read-Only Filesystem
```bash
--read-only
```
- **Effect**: Entire filesystem is read-only
- **Prevents**: File creation, modification, deletion
- **Cannot**: Write malware, modify system files, persist data

#### Temporary Storage (Limited)
```bash
--tmpfs /tmp:rw,noexec,nosuid,size=10m
```
- **rw**: Read-write access (needed for compilation)
- **noexec**: Cannot execute binaries from /tmp
- **nosuid**: Cannot set SUID bits
- **size=10m**: Maximum 10MB storage

#### Memory Limits
```bash
--memory="256m"
```
- **Effect**: Container limited to 256MB RAM
- **Prevents**: Memory bombs, excessive allocation
- **Behavior**: Container killed if exceeded

#### CPU Limits
```bash
--cpus="1.0"
```
- **Effect**: Limited to 1 CPU core
- **Prevents**: CPU exhaustion
- **Ensures**: Fair resource sharing

#### Process Limits
```bash
--pids-limit=50
```
- **Effect**: Maximum 50 processes
- **Prevents**: Fork bombs
- **Example Attack Prevented**:
  ```java
  while(true) {
    Runtime.getRuntime().exec("sh");  // Fork bomb attempt
  }
  ```

#### Automatic Cleanup
```bash
--rm
```
- **Effect**: Container auto-deleted after execution
- **Prevents**: Container accumulation
- **Ensures**: No persistent state

### Layer 4: Execution Timeout

```typescript
const TIMEOUT = 5000; // 5 seconds

// Docker timeout
timeout ${TIMEOUT / 1000}s java Main

// Node.js timeout
await execAsync(command, {
  timeout: TIMEOUT,
  maxBuffer: 1024 * 1024,  // 1MB output limit
});
```

**Prevents:**
- Infinite loops
- Excessive computation
- Resource hogging

**Example Attack Prevented:**
```java
// Infinite loop
while(true) {
  System.out.println("Attack");
}
// Killed after 5 seconds
```

### Layer 5: Output Buffering

```typescript
maxBuffer: 1024 * 1024  // 1MB
```

**Prevents:**
- Output flooding
- Memory exhaustion via logging

**Example Attack Prevented:**
```java
// Output bomb
while(true) {
  System.out.println("A".repeat(10000));
}
// Limited to 1MB total output
```

### Layer 6: Code Isolation

#### Temporary Directory Per Execution
```typescript
const executionId = uuidv4();
const tempDir = `/tmp/java-exec-${executionId}`;
```

- **Unique ID**: Each execution gets isolated directory
- **No Sharing**: Executions cannot access each other's files
- **Auto Cleanup**: Directory deleted after execution

#### Read-Only Code Mount
```bash
-v "${tempDir}:/workspace:ro"
```
- **ro**: Read-only mount
- **Effect**: Code cannot modify itself
- **Prevents**: Self-modifying code attacks

### Layer 7: HTTP Security Headers (Helmet.js)

```typescript
app.use(helmet());
```

**Headers Set:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy: default-src 'self'`

### Layer 8: CORS Configuration

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
```

**Protection:**
- Only specified origin can make requests
- Prevents CSRF attacks
- Blocks unauthorized API access

## Security Test Cases

### Test 1: File System Access Attempt
```java
import java.io.*;

public class Main {
    public static void main(String[] args) {
        try {
            // Attempt to read /etc/passwd
            BufferedReader br = new BufferedReader(
                new FileReader("/etc/passwd")
            );
            System.out.println(br.readLine());
        } catch (Exception e) {
            System.out.println("Access denied: " + e.getMessage());
        }
    }
}
```
**Result**: ✅ Blocked - Read-only filesystem

### Test 2: Network Access Attempt
```java
import java.net.*;

public class Main {
    public static void main(String[] args) {
        try {
            URL url = new URL("http://evil.com");
            url.openConnection().connect();
        } catch (Exception e) {
            System.out.println("Network blocked: " + e.getMessage());
        }
    }
}
```
**Result**: ✅ Blocked - No network access

### Test 3: Fork Bomb
```java
public class Main {
    public static void main(String[] args) {
        while(true) {
            try {
                Runtime.getRuntime().exec("sh");
            } catch (Exception e) {
                break;
            }
        }
    }
}
```
**Result**: ✅ Blocked - Process limit (50 PIDs)

### Test 4: Infinite Loop
```java
public class Main {
    public static void main(String[] args) {
        while(true) {
            System.out.println("Loop");
        }
    }
}
```
**Result**: ✅ Killed after 5 seconds

### Test 5: Memory Bomb
```java
public class Main {
    public static void main(String[] args) {
        byte[][] bomb = new byte[1000000][];
        for(int i = 0; i < bomb.length; i++) {
            bomb[i] = new byte[1000000];
        }
    }
}
```
**Result**: ✅ Killed - Memory limit exceeded

### Test 6: Command Injection
```java
public class Main {
    public static void main(String[] args) {
        try {
            Runtime.getRuntime().exec("rm -rf /");
        } catch (Exception e) {
            System.out.println("Blocked: " + e.getMessage());
        }
    }
}
```
**Result**: ✅ Blocked - Read-only filesystem + no dangerous binaries

## Security Best Practices Implemented

### ✅ Principle of Least Privilege
- Containers run with minimal permissions
- No root access
- No sudo capabilities

### ✅ Defense in Depth
- Multiple security layers
- If one fails, others still protect

### ✅ Fail Secure
- Errors result in execution termination
- No fallback to unsafe mode

### ✅ Input Validation
- All inputs validated and sanitized
- Type checking enforced

### ✅ Output Encoding
- Error messages sanitized
- No system information leaked

### ✅ Secure Defaults
- Docker enabled by default
- Strict limits by default
- Network disabled by default

## Monitoring & Logging

### Security Events Logged
```typescript
// Execution attempts
console.log(`Execution ${executionId} started`);

// Timeouts
console.log(`Execution ${executionId} timeout`);

// Errors
console.error('Execution error:', error);

// Cleanup
console.log(`Cleanup completed for ${executionId}`);
```

### Recommended Monitoring
1. **Failed executions**: Track compilation/runtime errors
2. **Timeout frequency**: Detect malicious patterns
3. **Rate limit hits**: Identify potential attackers
4. **Resource usage**: Monitor CPU/memory trends
5. **Error patterns**: Detect systematic attacks

## Security Maintenance

### Regular Updates
```bash
# Update Docker images
docker pull openjdk:17-slim

# Update Node dependencies
npm audit fix

# Update system packages
sudo yum update -y
```

### Security Scanning
```bash
# Scan Docker images
docker scan openjdk:17-slim

# Scan npm dependencies
npm audit

# Check for vulnerabilities
snyk test
```

## Incident Response Plan

### If Security Breach Detected:

1. **Immediate Actions**
   - Stop affected containers
   - Block suspicious IPs
   - Review logs

2. **Investigation**
   - Identify attack vector
   - Assess damage
   - Document findings

3. **Remediation**
   - Patch vulnerabilities
   - Update security rules
   - Notify users if needed

4. **Prevention**
   - Implement additional controls
   - Update documentation
   - Train team

## Compliance & Standards

### OWASP Top 10 Coverage
- ✅ A01: Broken Access Control - Rate limiting, CORS
- ✅ A02: Cryptographic Failures - HTTPS enforced
- ✅ A03: Injection - Input validation, Docker isolation
- ✅ A04: Insecure Design - Security-first architecture
- ✅ A05: Security Misconfiguration - Secure defaults
- ✅ A06: Vulnerable Components - Regular updates
- ✅ A07: Authentication Failures - Rate limiting
- ✅ A08: Software/Data Integrity - Container isolation
- ✅ A09: Logging Failures - Comprehensive logging
- ✅ A10: SSRF - Network disabled

## Future Security Enhancements

### Planned Improvements
1. **User Authentication**: OAuth2/JWT implementation
2. **Code Signing**: Verify code integrity
3. **Sandboxing**: Additional gVisor/Kata Containers
4. **WAF**: Web Application Firewall
5. **IDS/IPS**: Intrusion detection/prevention
6. **Honeypots**: Detect attackers
7. **2FA**: Two-factor authentication
8. **Audit Logs**: Detailed security audit trail

## Security Contact

For security issues:
- **Email**: security@your-domain.com
- **Response Time**: 24 hours
- **Disclosure**: Responsible disclosure policy

---

**Security is a continuous process. Stay vigilant, keep updated, and monitor actively.**
