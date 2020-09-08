import express from "express";
import health from "./health";
import { authentication401Middleware } from "../auth";
import logger from "../logger";

const routes = express.Router();

// Unprotected health route for health checks
routes.use(health);

// Enable auth for all route declarations below
if (
  process.env.NODE_ENV !== "test" &&
  (process.env.NODE_ENV === "production" || process.env.FORCE_SSO === "true")
) {
  logger.info(
    `SSO Auth Enabled for backend middleware (Forced: ${process.env.FORCE_SSO})`
  );
  routes.use(authentication401Middleware);
}

export default routes;
