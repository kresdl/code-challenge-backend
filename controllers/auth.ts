import { RequestHandler } from "express";
import { OAuth2Client } from "google-auth-library";
import { getAuth } from "../utils";

const { OAUTH_CLIENT_ID } = process.env;
if (!OAUTH_CLIENT_ID) throw Error("OAUTH_CLIENT_ID not set");

const oAuthClient = new OAuth2Client(OAUTH_CLIENT_ID);

const validateIdToken = async (idToken: string) => {
  try {
    await oAuthClient.verifyIdToken({
      idToken,
      audience: OAUTH_CLIENT_ID,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const auth: RequestHandler = async (req, res, next) => {
  const denyAccess = () => res.status(401).send("Unauthorized");

  const auth = getAuth(req);
  if (!auth) return denyAccess();
  const isTokenValid = await validateIdToken(auth);
  if (!isTokenValid) denyAccess();
  else next();
};

export default auth;
