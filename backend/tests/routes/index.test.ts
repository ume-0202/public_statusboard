/* eslint-disable @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-explicit-any */
import 'jest';
import supertest from 'supertest';
import fetchMock from 'node-fetch';
import logger from '../../logger';

jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());

describe('/api (auth)', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'development';
    process.env.FORCE_SSO = 'true';

    // Silence output
    logger.info = jest.fn();
  });

  it('returns unauthorized when userinfo endpoint is not ok', async () => {
    (fetchMock as any).once(/.*userinfo(\.openid)?/, 401);

    const { app } = require('../../app');
    const res = await supertest(app)
      .get('/api');

    expect(res.status).toEqual(401);
  });

  it('returns 401 error when an error is thrown in the auth endpoint', async () => {
    (fetchMock as any).once(/.*userinfo(\.openid)?/, 'not json');

    const { app } = require('../../app');
    const res = await supertest(app)
      .get('/api');

    expect(res.status).toEqual(401);
  });

  it('still works without SSO', async () => {
    process.env.NODE_ENV = 'test';
    delete process.env.FORCE_SSO;

    const { app } = require('../../app');
    const res = await supertest(app)
      .get('/api');

    expect(res.status).toEqual(200);
  });

  // TODO: Test coverage for auth branches.
});
