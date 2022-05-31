import { RequestHandler } from "express";
import { OAuth2Client } from "google-auth-library";
import { getAuth } from "../utils";

const oAuthClientId = process.env.OAUTH_CLIENT_ID;
if (!oAuthClientId) throw Error("OAUTH_CLIENT_ID not set");

const oAuthClient = new OAuth2Client(oAuthClientId);

const validateIdToken = async (idToken: string) => {
  const ticket = await oAuthClient.verifyIdToken({
    idToken,
    audience: oAuthClientId,
  });
  return !!ticket.getPayload();
};

const auth: RequestHandler = (req, res, next) => {
  const auth = getAuth(req);
  if (!validateIdToken(auth)) return res.sendStatus(403);
  next();
};

export default auth;
