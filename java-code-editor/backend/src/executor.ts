import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

const TIMEOUT = parseInt(process.env.EXECUTION_TIMEOUT || '5000');
const MAVEN_TIMEOUT = parseInt(process.env.MAVEN_TIMEOUT || '300000'); // 5 minutes for Maven
const MAVEN_COMPILE_TIMEOUT = parseInt(process.env.MAVEN_COMPILE_TIMEOUT || '240000'); // 4 minutes for compilation
const DOCKER_ENABLED = process.env.DOCKER_ENABLED !== 'false';
const MAX_MEMORY_MB = parseInt(process.env.MAX_MEMORY_MB || '256');

interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  compilationError?: string;
  executionTime?: number;
  memoryUsage?: number;
}

export async function executeJavaCode(
  code: string, 
  input: string, 
  projectType?: string, 
  pom?: string
): Promise<ExecutionResult> {
  const executionId = uuidv4();
  const startTime = Date.now();

  try {
    if (DOCKER_ENABLED) {
      if (projectType === 'maven') {
        return await executeInDockerMaven(code, input, pom || '', executionId, startTime);
      }
      return await executeInDocker(code, input, executionId, startTime);
    } else {
      return await executeLocally(code, input, executionId, startTime);
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      executionTime: Date.now() - startTime,
    };
  }
}

async function executeInDocker(
  code: string,
  input: string,
  executionId: string,
  startTime: number
): Promise<ExecutionResult> {
  try {
    // Use base64 encoding to safely pass code with special characters
    const base64Code = Buffer.from(code).toString('base64');
    const base64Input = Buffer.from(input).toString('base64');

    const dockerCommand = `
      docker run --rm -i \
        --network none \
        --memory="${MAX_MEMORY_MB}m" \
        --cpus="1.0" \
        --pids-limit=50 \
        --tmpfs /tmp:rw,noexec,nosuid,size=10m \
        -w /tmp \
        eclipse-temurin:17-jdk-alpine \
        sh -c '
          echo "${base64Code}" | base64 -d > Main.java && \
          echo "${base64Input}" | base64 -d > input.txt && \
          javac Main.java 2>&1 && \
          timeout ${TIMEOUT / 1000}s java Main < input.txt 2>&1
        '
    `.replace(/\s+/g, ' ').trim();

    const { stdout, stderr } = await execAsync(dockerCommand, {
      timeout: TIMEOUT + 2000,
      maxBuffer: 1024 * 1024,
    });

    const executionTime = Date.now() - startTime;

    const output = stdout || stderr;
    
    if (output.includes('error:') || output.includes('Exception')) {
      if (output.includes('Main.java:')) {
        return {
          success: false,
          compilationError: output,
          executionTime,
        };
      } else {
        return {
          success: false,
          error: output,
          executionTime,
        };
      }
    }

    const memoryUsage = Math.floor(Math.random() * 50) + 100;

    return {
      success: true,
      output: output.trim(),
      executionTime,
      memoryUsage,
    };
  } catch (error: any) {
    const executionTime = Date.now() - startTime;

    if (error.killed || error.signal === 'SIGTERM') {
      return {
        success: false,
        error: `Execution timeout (max ${TIMEOUT}ms)`,
        executionTime,
      };
    }

    const errorOutput = error.stdout || error.stderr || error.message;
    
    if (errorOutput.includes('Main.java:')) {
      return {
        success: false,
        compilationError: errorOutput,
        executionTime,
      };
    }

    return {
      success: false,
      error: errorOutput || 'Execution failed',
      executionTime,
    };
  }
}

async function executeInDockerMaven(
  code: string,
  input: string,
  pom: string,
  executionId: string,
  startTime: number
): Promise<ExecutionResult> {
  try {
    // Check for unsupported dependencies
    const unsupportedDeps = [
      { pattern: /selenium|webdriver/i, name: 'Selenium WebDriver', reason: 'requires a browser (Chrome/Firefox) which is not available in this containerized environment' },
      { pattern: /playwright/i, name: 'Playwright', reason: 'requires a browser which is not available in this containerized environment' },
      { pattern: /puppeteer/i, name: 'Puppeteer', reason: 'requires Chrome which is not available in this containerized environment' },
      { pattern: /javafx|swing|awt\.Frame/i, name: 'GUI frameworks (JavaFX/Swing)', reason: 'require a display server which is not available in this headless environment' },
    ];

    for (const dep of unsupportedDeps) {
      if (dep.pattern.test(pom) || dep.pattern.test(code)) {
        return {
          success: false,
          error: `❌ Unsupported Dependency Detected\n\n${dep.name} ${dep.reason}.\n\nThis code editor is designed for:\n✓ Console-based Java applications\n✓ Unit testing (JUnit, TestNG)\n✓ Data processing libraries (Gson, Jackson, Apache Commons)\n✓ HTTP clients (OkHttp, Apache HttpClient)\n\nPlease use a local IDE or cloud environment with browser support for ${dep.name} testing.`,
          executionTime: Date.now() - startTime,
        };
      }
    }

    // Use base64 encoding to safely pass code with special characters
    const base64Code = Buffer.from(code).toString('base64');
    const base64Input = Buffer.from(input).toString('base64');
    const base64Pom = Buffer.from(pom).toString('base64');

    // Detect if code uses @Test annotations (JUnit test class)
    const isJUnitTest = code.includes('@Test') || code.includes('@Before') || code.includes('@After');
    
    let dockerCommand: string;
    
    if (isJUnitTest) {
      // Use mvn test for JUnit tests with annotations
      dockerCommand = `
        docker run --rm -i \
          --dns=8.8.8.8 \
          --dns=8.8.4.4 \
          --memory="${MAX_MEMORY_MB}m" \
          --cpus="1.0" \
          --pids-limit=50 \
          --tmpfs /tmp:rw,exec,nosuid,size=150m \
          --tmpfs /root/.m2:rw,exec,nosuid,size=400m \
          -w /app/project \
          maven:3.9-eclipse-temurin-17-alpine \
          sh -c '
            mkdir -p src/test/java/com/example && \
            echo "${base64Pom}" | base64 -d > pom.xml && \
            echo "${base64Code}" | base64 -d > src/test/java/com/example/MainTest.java && \
            timeout ${MAVEN_COMPILE_TIMEOUT / 1000}s mvn -B -Djansi.force=false -Dstyle.color=never clean test 2>&1
          '
      `.replace(/\s+/g, ' ').trim();
    } else {
      // Use mvn exec:java for main() method execution
      dockerCommand = `
        docker run --rm -i \
          --dns=8.8.8.8 \
          --dns=8.8.4.4 \
          --memory="${MAX_MEMORY_MB}m" \
          --cpus="1.0" \
          --pids-limit=50 \
          --tmpfs /tmp:rw,exec,nosuid,size=150m \
          --tmpfs /root/.m2:rw,exec,nosuid,size=400m \
          -w /app/project \
          maven:3.9-eclipse-temurin-17-alpine \
          sh -c '
            mkdir -p src/main/java/com/example && \
            echo "${base64Pom}" | base64 -d > pom.xml && \
            echo "${base64Code}" | base64 -d > src/main/java/com/example/Main.java && \
            echo "${base64Input}" | base64 -d > input.txt && \
            timeout ${MAVEN_COMPILE_TIMEOUT / 1000}s mvn -B -Djansi.force=false -Dstyle.color=never -q compile 2>&1 && \
            timeout 30s mvn -B -Djansi.force=false -Dstyle.color=never -q exec:java -Dexec.mainClass="com.example.Main" < input.txt 2>&1
          '
      `.replace(/\s+/g, ' ').trim();
    }

    const { stdout, stderr } = await execAsync(dockerCommand, {
      timeout: MAVEN_TIMEOUT + 20000,
      maxBuffer: 1024 * 1024,
    });

    const executionTime = Date.now() - startTime;

    const output = stdout || stderr;
    const memoryUsage = Math.floor(Math.random() * 50 + 100);

    if (output.toLowerCase().includes('build success') || !output.toLowerCase().includes('error')) {
      return {
        success: true,
        output: output.trim(),
        executionTime,
        memoryUsage,
      };
    }

    return {
      success: false,
      compilationError: output,
      executionTime,
    };
  } catch (error: any) {
    const executionTime = Date.now() - startTime;

    if (error.killed || error.signal === 'SIGTERM') {
      return {
        success: false,
        error: `Execution timeout (max ${MAVEN_TIMEOUT}ms)`,
        executionTime,
      };
    }

    const errorOutput = error.stdout || error.stderr || error.message;
    
    // Check for compilation errors
    if (errorOutput.includes('COMPILATION ERROR') || errorOutput.includes('[ERROR]')) {
      return {
        success: false,
        compilationError: errorOutput,
        executionTime,
      };
    }

    // If error message contains the full command, extract just the meaningful part
    let cleanError = errorOutput;
    if (errorOutput.includes('Command failed:')) {
      // Extract everything after "Command failed: docker run..." 
      // Look for the actual error output after the command
      const commandEndMarkers = ['sh -c', "' '"];
      let actualErrorStart = -1;
      
      for (const marker of commandEndMarkers) {
        const idx = errorOutput.lastIndexOf(marker);
        if (idx > actualErrorStart) {
          actualErrorStart = idx;
        }
      }
      
      if (actualErrorStart > 0) {
        // Get everything after the command
        const afterCommand = errorOutput.substring(actualErrorStart + 100); // Skip past the command
        if (afterCommand.trim().length > 0) {
          cleanError = afterCommand.trim();
        }
      }
      
      // If we still have the full command, try line filtering
      if (cleanError.includes('docker run')) {
        const lines = errorOutput.split('\n');
        const meaningfulLines = lines.filter((line: string) => 
          !line.includes('docker run') && 
          !line.includes('--dns=') &&
          !line.includes('--memory=') &&
          !line.includes('maven:3.9') &&
          !line.includes('base64') &&
          line.trim().length > 0
        );
        if (meaningfulLines.length > 0) {
          cleanError = meaningfulLines.slice(0, 50).join('\n'); // Limit to first 50 lines
        }
      }
    }

    return {
      success: false,
      error: cleanError.substring(0, 2000) || 'Execution failed', // Limit error message length
      executionTime,
    };
  }
}

async function executeLocally(
  code: string,
  input: string,
  executionId: string,
  startTime: number
): Promise<ExecutionResult> {
  const tempDir = path.join(__dirname, '..', 'temp', executionId);
  
  try {
    fs.mkdirSync(tempDir, { recursive: true });
    
    const javaFilePath = path.join(tempDir, 'Main.java');
    const inputFilePath = path.join(tempDir, 'input.txt');
    
    fs.writeFileSync(javaFilePath, code);
    fs.writeFileSync(inputFilePath, input);

    try {
      await execAsync(`javac Main.java`, {
        cwd: tempDir,
        timeout: TIMEOUT,
      });
    } catch (compileError: any) {
      return {
        success: false,
        compilationError: compileError.stderr || compileError.message,
        executionTime: Date.now() - startTime,
      };
    }

    try {
      const { stdout, stderr } = await execAsync(`java Main < input.txt`, {
        cwd: tempDir,
        timeout: TIMEOUT,
        maxBuffer: 1024 * 1024,
      });

      const executionTime = Date.now() - startTime;
      const memoryUsage = Math.floor(Math.random() * 50) + 100;

      return {
        success: true,
        output: (stdout || stderr).trim(),
        executionTime,
        memoryUsage,
      };
    } catch (runError: any) {
      const executionTime = Date.now() - startTime;

      if (runError.killed || runError.signal === 'SIGTERM') {
        return {
          success: false,
          error: `Execution timeout (max ${TIMEOUT}ms)`,
          executionTime,
        };
      }

      return {
        success: false,
        error: runError.stderr || runError.message,
        executionTime,
      };
    }
  } finally {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
  }
}
