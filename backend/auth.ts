/* eslint-disable @typescript-eslint/camelcase */
import express, { NextFunction } from 'express';
import session from 'express-session';
import passport from 'passport';
import fetch from 'node-fetch';
import OAuth2Strategy from 'passport-oauth2';
import logger from './logger';
import {
  getLogoutEndpoint,
  getAuthEndpoint,
  getTokenEndpoint,
  getClientId,
  getUserInfoEndpoint,
} from './helpers/authHelper';

// General Auth Flow
// Login: app -> IDP -> SiteMinder (create session) -> IDP (create session) -> app (create session)
// Logout: app (remove session) -> SiteMinder (remove session) -> IDP (remove session) -> app

export const ssoAuth = express.Router();

const authenticateError = (err: { name: string }, _req: express.Request, res: express.Response): void => {
  // custom error handler to catch any errors, such as TokenError
  logger.error('Error in authentication callback:', err);
  if (err.name === 'TokenError') {
    // TODO: Display error message to user
    res.redirect('/auth/'); // redirect them back to the login page
  } else {
    // TODO: handle other errors here
    throw err;
  }
  res.send('Invalid response from auth proivder.');
};

const authenticateSuccess = (_req: express.Request, res: express.Response): void => {
  // TODO: Find the path for the last request and use that for the redirect uri
  res.redirect('/');
};


ssoAuth.use(
  session({
    secret: process.env.SESSION_SECRET || 'shhhhh this is secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1200000, secure: process.env.NODE_ENV === 'production' }, // Require cookie to use SSL
  }),
);

// Initialize middleware (runs once)
ssoAuth.use(passport.initialize());
ssoAuth.use(passport.session());

// Create a listener to save new session details for users after auth
ssoAuth.use(
  '/auth/callback',
  // Register middleware for auth
  passport.authenticate('oauth2', { session: true, successReturnToOrRedirect: '/' }),
  authenticateError,
  authenticateSuccess,
);

const tokenToProfile = async (
  _req: express.Request,
  accessToken: string,
  _refreshToken: string,
  _params: { id_token: string },
  _profile: object,
  done: OAuth2Strategy.VerifyCallback,
): Promise<void> => {
  const res = await fetch(getUserInfoEndpoint(), {
    method: 'POST',
    headers: { authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    done(new Error('Cannot get user information'));
    return;
  }

  const user = await res.json();
  done(null, user);
};

const strategy = new OAuth2Strategy(
  {
    state: true,
    authorizationURL: getAuthEndpoint(),
    tokenURL: getTokenEndpoint(),
    clientID: getClientId(),
    clientSecret: '',
    callbackURL: '/auth/callback',
    scope: 'openid',
    passReqToCallback: true, // Sends the original request as the redirect after auth
  },
  tokenToProfile,
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  // The user object in the arguments is the result of the authentication process
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  // The user object in the arguments is what we have stored in the session
  done(null, user);
});

/**
 * Authentication middleware that will redirect to a login flow if the incomming request isn't authenticated
 *
 * @param req the express reuqest object
 * @param res the express response object (optional)
 * @param next the express next function (optional)
 */
export const authenticationLoginMiddleware = (req: express.Request, res?: express.Response, next?: NextFunction): void => {
  if (!req.isAuthenticated()) {
    passport.authenticate('oauth2')(req, res, next);
    return;
  }
  next();
};

/**
 * Authentication middleware that will retun a 401 (unathorized) error if the incomming request isn't authenticated
 *
 * @param req the express reuqest object
 * @param res the express response object (optional)
 * @param next the express next function (optional)
 */
export const authentication401Middleware = (req: express.Request, res?: express.Response, next?: NextFunction): void => {
  if (!req.isAuthenticated()) {
    res.status(401).send('Unauthorized');
    return;
  }

  next();
};

// TODO: Session time outs

ssoAuth.get('/auth/logout', (req, res) => {
  req.session.destroy(() => res.redirect(getLogoutEndpoint()));
});
