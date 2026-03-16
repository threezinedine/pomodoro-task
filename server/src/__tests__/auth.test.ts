import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth API (Mock)', () => {
  beforeAll(async () => {
    // Ensure the database is clean before tests (especially using sqlite in-memory for tests)
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should allow mock login in test environment and return a cookie', async () => {
    const res = await request(app).post('/api/auth/mock');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Mock login successful');
    expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
    
    // Check if the HTTP-only cookie was set
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/token=eyJ/i); // Checking for start of standard JWT headers
  });

  it('should logout correctly by clearing the cookie', async () => {
    const res = await request(app).post('/api/auth/logout');
    
    expect(res.statusCode).toEqual(200);
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/token=;/); // Expecting token to be cleared
  });
});
