/* eslint-disable @typescript-eslint/camelcase */
import 'jest';
import supertest from 'supertest';
import { app } from '../../app';

describe('/health', () => {
  it('returns status, details, and timestamp', async () => {
    const healthResponse = await supertest(app).get('/api/health');
    const health = healthResponse.body;

    expect(health.status).toBe('ok');
    expect(health.details).toBe('Everything is just peachy 🍑');
    expect(health.time).toBeDefined();
    expect(new Date(health.time)).toBeInstanceOf(Date);
  });
});
