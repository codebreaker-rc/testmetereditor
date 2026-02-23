import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { executeJavaCode } from './executor';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/execute', async (req: Request, res: Response) => {
  try {
    const { code, input, projectType, pom } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: code is required and must be a string',
      });
    }

    if (code.length > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Code is too long (max 50KB)',
      });
    }

    const result = await executeJavaCode(code, input || '', projectType, pom);

    res.json(result);
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Java Execution Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🐳 Docker enabled: ${process.env.DOCKER_ENABLED || 'true'}`);
  console.log(`⏱️  Execution timeout: ${process.env.EXECUTION_TIMEOUT || 5000}ms`);
});
