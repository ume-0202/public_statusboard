import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import routes from "./routes";
import logger from "./logger";
import { ssoAuth, authenticationLoginMiddleware } from "./auth";

export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "development") {
  app.use(cors());
}

// Add the SSO authentication middleware
app.use(ssoAuth);

// Put routes that have special authentication here
app.use("/api", routes); // Returns an HTTP 401 if not already authenticated for all routes except /backend/health

// Enable auth for all remaining routes
if (
  process.env.NODE_ENV !== "test" &&
  (process.env.NODE_ENV === "production" || process.env.FORCE_SSO === "true")
) {
  logger.info(`SSO Auth Enabled (Forced: ${process.env.FORCE_SSO})`);
  app.use(authenticationLoginMiddleware);
} else if (process.env.NODE_ENV !== "test") {
  logger.info("SSO Auth disabled; see README for more info");
}

// Serve the front end as static resources
app.use(express.static("./build"));
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (_req: express.Request, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

export const init = async (): Promise<void> => {
  // Do any stuff you need to initialize your app here
};
