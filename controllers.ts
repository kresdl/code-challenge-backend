import { AxiosError } from "axios";
import { RequestHandler } from "express";
import axios from "axios";
import { getAuth } from "./utils";
import users, { notify } from "./users";

const oAuthTokenEndpoint = process.env.OAUTH_TOKEN_ENDPOINT;
const oAuthClientId = process.env.OAUTH_CLIENT_ID;
const oAuthClientSecret = process.env.OAUTH_CLIENT_SECRET;

if (!oAuthTokenEndpoint) throw Error("OAUTH_TOKEN_ENDPOINT not set");
if (!oAuthClientId) throw Error("OAUTH_CLIENT_ID not set");
if (!oAuthClientSecret) throw Error("OAUTH_CLIENT_SECRET not set");

const auths = new Set<string>();

export const cors: RequestHandler = (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "*, Authorization");
  res.set("Access-Control-Expose-Headers", "*, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
};

export const signIn: RequestHandler = async (req, res) => {
  const params = new URLSearchParams({
    code: req.body.code,
    redirect_uri: req.body.redirect_uri ?? "",
    client_id: oAuthClientId,
    client_secret: oAuthClientSecret,
    grant_type: "authorization_code",
  });

  try {
    const { data } = await axios.post(oAuthTokenEndpoint, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const { id_token } = data;
    auths.add(id_token);
    res.json({ id_token });
  } catch (err) {
    console.error(err);
    const { response } = err as AxiosError;
    const status = response && response.status;
    res.sendStatus(status ?? 500);
  }
};

export const signOut: RequestHandler = (req, res) => {
  const auth = getAuth(req);
  auths.delete(auth);
  users.delete(auth);
  res.sendStatus(200);
};

export const auth: RequestHandler = (req, res, next) => {
  const auth = getAuth(req);
  const isAuth = auths.has(auth);
  if (!isAuth) return res.sendStatus(403);
  next();
};

export const subscribe: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const { phoneNumber, latitude, longitude } = req.body;

  const lastUpdate = new Date().toDateString();
  const user = { phoneNumber, latitude, longitude, lastUpdateAt: lastUpdate };
  users.set(auth, user);
  notify(user, auth);
  res.sendStatus(200);
};

export const updatePosition: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const user = users.get(auth);
  if (!user) return res.sendStatus(400);
  const { latitude, longitude } = req.body;
  users.set(auth, { ...user, latitude, longitude });
  res.sendStatus(200);
};
