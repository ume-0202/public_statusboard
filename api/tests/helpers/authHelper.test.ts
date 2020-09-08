/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import "jest";
import logger from "../../logger";

const endpointsMethods = [
  "getLogoutEndpoint",
  "getUserInfoEndpoint",
  "getAuthEndpoint",
  "getTokenEndpoint"
];

describe("getUserInfoEndpoint", () => {
  beforeEach(() => {
    jest.resetModules();

    // Silence output
    logger.info = jest.fn();
  });

  it("returns different routes for each endpoint method for production", () => {
    endpointsMethods.forEach(routeMethod => {
      process.env.NODE_ENV = "production";
      let method = require("../../helpers/authHelper")[routeMethod];
      const route = method();
      expect(route).toBeDefined();
      jest.resetModules();

      process.env.NODE_ENV = "test";
      method = require("../../helpers/authHelper")[routeMethod];
      const testRoute = method();
      expect(testRoute).toBeDefined();
      // TODO: uncomment after prod data is added
      // expect(testRoute).not.toBe(route);
      jest.resetModules();

      process.env.NODE_ENV = "development";
      method = require("../../helpers/authHelper")[routeMethod];
      const devRoute = method();
      expect(devRoute).toBeDefined();
      // TODO: uncomment after prod data is added
      // expect(devRoute).not.toBe(route);
    });
  });

  it("returns a different client id for production", () => {
    const prodClientId = "statusboard";
    const otherClientId = "statusboard-dev";

    process.env.NODE_ENV = "production";
    let { getClientId } = require("../../helpers/authHelper");
    expect(getClientId()).toEqual(prodClientId);

    process.env.NODE_ENV = "test";
    getClientId = require("../../helpers/authHelper").getClientId;
    expect(getClientId()).toEqual(otherClientId);

    process.env.NODE_ENV = "development";
    getClientId = require("../../helpers/authHelper").getClientId;
    expect(getClientId()).toEqual(otherClientId);
  });
});
