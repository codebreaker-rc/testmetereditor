import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { executeJavaCode } from './executor';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { createContext } from './graphql/context';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Helmet configuration for GraphQL
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));

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

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Existing code execution endpoint (REST API)
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

// Initialize Apollo Server
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    formatError: (error: any) => {
      console.error('GraphQL Error:', error);
      return error;
    },
  });

  await server.start();
  
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }: { req: any }) => createContext({ req }),
    })
  );

  console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}/graphql`);

  // 404 handler - must be registered AFTER GraphQL route
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Start HTTP server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Java Execution Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🐳 Docker enabled: ${process.env.DOCKER_ENABLED || 'true'}`);
    console.log(`⏱️  Execution timeout: ${process.env.EXECUTION_TIMEOUT || 5000}ms`);
    console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  });
}

// Start server
startApolloServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
