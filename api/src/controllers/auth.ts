import { RequestHandler } from "express";
import { OAuth2Client } from "google-auth-library";
import { getAuth } from "../utils";

const { OAUTH_CLIENT_ID } = process.env;
if (!OAUTH_CLIENT_ID) throw Error("OAUTH_CLIENT_ID not set");

const oAuthClient = new OAuth2Client(OAUTH_CLIENT_ID);

const getUserId = async (idToken: string) => {
  const ticket = await oAuthClient.verifyIdToken({
    idToken,
    audience: OAUTH_CLIENT_ID,
  });
  return ticket.getUserId();
};

const auth: RequestHandler = async (req, res, next) => {
  const denyAccess = () => res.status(401).send("Unauthorized");
  const auth = getAuth(req);
  if (!auth) return denyAccess();
  try {
    const userId = await getUserId(auth);
    res.locals.userId = userId;
    next();
  } catch (error) {
    console.error(error);
    denyAccess();
  }
};

export default auth;
