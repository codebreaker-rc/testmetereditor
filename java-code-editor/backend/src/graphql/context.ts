import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface Context {
  userId?: string;
}

export function createContext({ req }: any): Context {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return {};
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return { userId: decoded.userId };
  } catch (error) {
    return {};
  }
}
