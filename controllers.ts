import { AxiosError } from "axios";
import { RequestHandler } from "express";
import axios from "axios";
import cookie from "cookie";
import { getAuth } from "./utils";
import users from "./users";

const oAuthTokenEndpoint = process.env.OAUTH_TOKEN_ENDPOINT;

if (!oAuthTokenEndpoint) throw Error("OAUTH_TOKEN_ENDPOINT not set");

const COOKIE_MAX_AGE = 60 * 60 * 24;

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
    client_id: process.env.CLIENT_ID ?? "",
    client_secret: process.env.CLIENT_SECRET ?? "",
    grant_type: "authorization_code",
  });

  try {
    const { data } = await axios.post(oAuthTokenEndpoint, {
      params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const { id_token } = data;
    auths.add(id_token);
    const setCookie = cookie.serialize("auth", id_token, {
      maxAge: COOKIE_MAX_AGE,
    });
    res.setHeader("Set-Cookie", setCookie);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const { response } = err as AxiosError;
    const status = response && response.status;
    res.sendStatus(status ?? 500);
  }
};

export const signOut: RequestHandler = (req, res) => {
  const auth = getAuth(req);
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
  users.set(auth, { phoneNumber, latitude, longitude, lastUpdateAt: lastUpdate });
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
