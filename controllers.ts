import { RequestHandler } from "express";
import { getAuth } from "./utils";
import users, { notifyUser } from "./users";
import { User } from "./types";
import { OAuth2Client } from "google-auth-library";

const oAuthTokenEndpoint = process.env.OAUTH_TOKEN_ENDPOINT;
const oAuthClientId = process.env.OAUTH_CLIENT_ID;
const oAuthClientSecret = process.env.OAUTH_CLIENT_SECRET;

if (!oAuthTokenEndpoint) throw Error("OAUTH_TOKEN_ENDPOINT not set");
if (!oAuthClientId) throw Error("OAUTH_CLIENT_ID not set");
if (!oAuthClientSecret) throw Error("OAUTH_CLIENT_SECRET not set");

const oAuthClient = new OAuth2Client(oAuthClientId);

const validateIdToken = async (idToken: string) => {
  const ticket = await oAuthClient.verifyIdToken({
    idToken,
    audience: oAuthClientId,
  });
  return !!ticket.getPayload();
};

export const cors: RequestHandler = (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "*, Authorization");
  res.set("Access-Control-Expose-Headers", "*, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
};

export const auth: RequestHandler = (req, res, next) => {
  const auth = getAuth(req);
  if (!validateIdToken(auth)) return res.sendStatus(403);
  next();
};

export const signOut: RequestHandler = (req, res) => {
  const auth = getAuth(req);
  users.delete(auth);
  res.sendStatus(200);
};

export const subscribe: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const { phoneNumber } = req.body;
  const today = new Date().toDateString();
  const user: User = { phoneNumber, lastUpdateAt: today };
  users.set(auth, user);
  res.sendStatus(200);
};

export const updatePosition: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const user = users.get(auth);
  if (!user) return res.sendStatus(400);
  const { latitude, longitude } = req.body;
  const position = { latitude, longitude };
  users.set(auth, { ...user, position });
  res.sendStatus(200);
};
