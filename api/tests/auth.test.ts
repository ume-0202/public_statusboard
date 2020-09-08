/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-explicit-any */
import "jest";
import supertest from "supertest";
import fetchMock from "node-fetch";
import * as auth from "../auth";
import logger from "../logger";

jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox());

describe("auth middleware", () => {
  beforeEach(() => {
    jest.resetModules();

    // Silence output
    logger.info = jest.fn();
  });

  it("ui auth will pass if the session is valid", () => {
    const req: any = {
      isAuthenticated: jest.fn(() => true)
    };

    const next = jest.fn();

    auth.authentication401Middleware(req, null, next);
    expect(next).toBeCalled();
  });

  it("api auth will throw a 401 if not authenticated", () => {
    const req: any = {
      isAuthenticated: jest.fn(() => false)
    };

    const send = jest.fn();

    const res: any = {
      status: jest.fn(() => ({ send }))
    };

    const next = jest.fn();

    auth.authentication401Middleware(req, res, next);
    expect(res.status).toBeCalledWith(401);
    expect(send).toBeCalled();
    expect(next).not.toBeCalled();
  });

  it("api auth middleware will allow authenticated requests", () => {
    const req: any = {
      isAuthenticated: jest.fn(() => true)
    };

    const next = jest.fn();

    auth.authentication401Middleware(req, null, next);
    expect(next).toBeCalled();
  });

  it("logout", done => {
    process.env.NODE_ENV = "development";
    process.env.FORCE_SSO = "true";
    const { app } = require("../app");
    supertest(app)
      .get("/auth/logout")
      .expect(302, done);
  });
});
