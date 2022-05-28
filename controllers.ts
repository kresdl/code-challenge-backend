import { AxiosError } from "axios";
import { NextFunction, Request, RequestHandler, Response } from "express";
import axios from "axios";
import cookie from "cookie";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sendingNumber = process.env.TWILIO_NUMBER;

interface Position {
  latitude: number;
  longitude: number;
}

interface User {
  accessToken: string;
  phoneNumber: string;
  position?: Position;
}

export const cors = (req: Request, res: Response, next: NextFunction) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "*, Authorization");
  res.set("Access-Control-Expose-Headers", "*, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
};

const users = new Map<string, User>();

export const auth: RequestHandler = async (req, res, next) => {
  const { auth } = cookie.parse(req.headers.cookie ?? "");
  if (!auth) return res.sendStatus(403);

  const user = users.get(auth);
  if (!user) return res.sendStatus(403);

  const config = {
    headers: {
      Authorization: user.accessToken,
    },
  };

  try {
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", config);
    if (response.data) return next();
    res.sendStatus(response.status ?? 500);
  } catch (err) {
    console.error(err);
    const { response } = err as AxiosError;
    const status = response && response.status;
    res.sendStatus(status == 400 ? 403 : status ?? 500);
  }
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
    const { id_token, access_token } = data;
    users.set(id_token, { accessToken: access_token });
    const setCookie = cookie.serialize("auth", id_token, {
      maxAge: 60 * 60 * 24,
    });
    res.setHeader("Set-Cookie", setCookie);
    res.json({ jwt: id_token });
  } catch (err) {
    console.error(err);
    const { response } = err as AxiosError;
    const status = response && response.status;
    res.sendStatus(status ?? 500);
  }
};

export const signOut: RequestHandler = (req, res) => {
  const { auth } = cookie.parse(req.headers.cookie ?? "");
  users.delete(auth);
  res.sendStatus(200);
};

export const subscribe: RequestHandler = async (req, res) => {
  const { auth } = cookie.parse(req.headers.cookie ?? "");
  const user = users.get(auth);
  if (!user) return res.sendStatus(400);
  const { phoneNumber } = req.body;

  users.set(auth, { ...user, phoneNumber });
};

export const updatePosition: RequestHandler = async (req, res) => {
  const { auth } = cookie.parse(req.headers.cookie ?? "");
  const user = users.get(auth);
  if (!user) return res.sendStatus(400);
  const { latitude, longitude } = req.body;

  users.set(auth, {
    ...user,
    position: {
      latitude: +latitude,
      longitude: +longitude,
    },
  });
};

/*
  const params = new URLSearchParams({ latitude, longitude });
  try {
    const response = await axios.get("http://api.sr.se/api/v2/traffic/messages", { params });
    response.data
  }
*/
