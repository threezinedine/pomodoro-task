import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential } = req.body;

    if (!credential) {
      res.status(400).json({ error: 'No Google credential provided' });
      return;
    }

    // 1. Verify the Google ID Token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ error: 'Invalid Google token payload' });
      return;
    }

    const { sub: googleId, email } = payload;

    // 2. Upsert User in Database
    const user = await prisma.user.upsert({
      where: { email },
      update: { googleId },
      create: {
        email,
        googleId,
        preferences: "{}", // Default empty preferences json string
      },
    });

    // 3. Generate internal JWT session token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '365d' }
    );

    // 4. Set HTTP-Only Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    res.status(200).json({ 
      message: 'Login successful', 
      user: { id: user.id, email: user.email } 
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

// --- MOCK API FOR TESTING ---
export const mockLogin = async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  try {
    const email = 'testuser@example.com';
    const googleId = 'mock_google_id_123';

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        googleId,
        preferences: "{}", 
      },
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '365d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ 
      message: 'Mock login successful', 
      user: { id: user.id, email: user.email } 
    });
  } catch (error) {
    console.error('Mock login error:', error);
    res.status(500).json({ error: 'Internal server error during mock authentication' });
  }
};
