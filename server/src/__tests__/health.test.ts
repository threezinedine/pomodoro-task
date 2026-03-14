import request from 'supertest';
import app from '../index';

describe('Health API', () => {
  it('should return 200 OK from the health endpoint', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
