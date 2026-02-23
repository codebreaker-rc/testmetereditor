import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface Context {
  userId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }
      return await prisma.user.findUnique({
        where: { id: context.userId },
      });
    },

    questions: async (_: any, args: { language?: string; difficulty?: string; category?: string }) => {
      const where: any = {};
      if (args.language) where.language = args.language;
      if (args.difficulty) where.difficulty = args.difficulty;
      if (args.category) where.category = args.category;

      return await prisma.question.findMany({
        where,
        include: { testCases: true },
        orderBy: { createdAt: 'desc' },
      });
    },

    question: async (_: any, args: { id: string }) => {
      return await prisma.question.findUnique({
        where: { id: args.id },
        include: { testCases: true },
      });
    },

    mySubmissions: async (_: any, args: { questionId?: string }, context: Context) => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }

      const where: any = { userId: context.userId };
      if (args.questionId) where.questionId = args.questionId;

      return await prisma.submission.findMany({
        where,
        include: {
          user: true,
          question: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    },

    submission: async (_: any, args: { id: string }, context: Context) => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }

      const submission = await prisma.submission.findUnique({
        where: { id: args.id },
        include: {
          user: true,
          question: true,
        },
      });

      if (!submission || submission.userId !== context.userId) {
        throw new Error('Submission not found or unauthorized');
      }

      return submission;
    },
  },

  Mutation: {
    register: async (_: any, args: { email: string; username: string; password: string }) => {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: args.email }, { username: args.username }],
        },
      });

      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(args.password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: args.email,
          username: args.username,
          password: hashedPassword,
        },
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      } as jwt.SignOptions);

      return {
        token,
        user,
      };
    },

    login: async (_: any, args: { email: string; password: string }) => {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email: args.email },
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      } as jwt.SignOptions);

      return {
        token,
        user,
      };
    },

    submitCode: async (
      _: any,
      args: { questionId: string; code: string; language: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }

      // Create submission with PENDING status
      const submission = await prisma.submission.create({
        data: {
          userId: context.userId,
          questionId: args.questionId,
          code: args.code,
          language: args.language as any,
          status: 'PENDING',
        },
        include: {
          user: true,
          question: true,
        },
      });

      // Note: Actual code execution will be handled by the existing executor
      // This is just creating the submission record
      return submission;
    },
  },
};
