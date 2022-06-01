import { RequestHandler } from "express";
import { OAuth2Client } from "google-auth-library";
import { getAuth } from "../utils";

const { OAUTH_CLIENT_ID } = process.env;
if (!OAUTH_CLIENT_ID) throw Error("OAUTH_CLIENT_ID not set");

const oAuthClient = new OAuth2Client(OAUTH_CLIENT_ID);

const validateIdToken = async (idToken: string) => {
  const ticket = await oAuthClient.verifyIdToken({
    idToken,
    audience: OAUTH_CLIENT_ID,
  });
  return !!ticket.getPayload();
};

const auth: RequestHandler = (req, res, next) => {
  const auth = getAuth(req);
  if (!validateIdToken(auth)) return res.status(401).send("Unauthorized");
  next();
};

export default auth;
