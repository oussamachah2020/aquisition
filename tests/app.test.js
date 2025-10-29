import request from 'supertest';
import app from '../src/app.js';

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /', () => {
    it('should return API message', async () => {
      const response = await request(app).get('/api').expect(200);

      expect(response.body).toHaveProperty('message', 'Acquisition API');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/nonexistent').expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});
