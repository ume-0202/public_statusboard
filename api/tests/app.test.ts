import "jest";
import supertest from "supertest";
import logger from "../logger";

/* eslint-disable @typescript-eslint/no-var-requires, global-require */
describe("app", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("responds successfully to GET /", done => {
    const { app } = require("../app");
    supertest(app)
      .get("/")
      .expect(200, done);
  });

  it("redirects to auth for a ui request", done => {
    process.env.NODE_ENV = "development";
    process.env.FORCE_SSO = "true";
    logger.info = jest.fn();

    const { app } = require("../app");
    supertest(app)
      .get("/")
      .expect(302, done);
  });
});
