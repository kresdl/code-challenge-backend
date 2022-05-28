import { AxiosError } from "axios";
import { Request, RequestHandler } from "express";
import axios from "axios";
import cookie from "cookie";
import twilio from "twilio";

declare global {
  namespace Express {
    interface Request {
      auth: string;
      user: User;
    }
  }
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sendingNumber = process.env.TWILIO_NUMBER;

const twilioClient = twilio(accountSid, authToken);

interface Position {
  latitude: number;
  longitude: number;
}

interface User {
  phoneNumber?: string;
  position?: Position;
}

const users = new Map<string, User>();

const getAuth = (req: Request) => cookie.parse(req.headers.cookie ?? "").auth;

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

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const { data } = await axios.post("https://oauth2.googleapis.com/token", params, config);
    const { id_token } = data;
    users.set(id_token, {});
    const setCookie = cookie.serialize("auth", id_token, {
      maxAge: 60 * 60 * 24,
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
  const user = users.get(auth);
  if (!user) return res.sendStatus(403);
  Object.assign(req, { auth, user });
  next();
};

export const subscribe: RequestHandler = async (req, res) => {
  const { phoneNumber } = req.body;
  users.set(req.auth, { phoneNumber });
  res.sendStatus(200);
};

export const updatePosition: RequestHandler = async (req, res) => {
  const { latitude, longitude } = req.body;
  const position = { latitude: +latitude, longitude: +longitude };
  users.set(req.auth, { ...req.user, position });
  res.sendStatus(200);
};

/*
  const params = new URLSearchParams({ latitude, longitude });
  try {
    const response = await axios.get("http://api.sr.se/api/v2/traffic/messages", { params });
    response.data
  }
*/
