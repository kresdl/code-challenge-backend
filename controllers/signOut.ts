import { RequestHandler } from "express";
import users from "../users";
import { getAuth } from "../utils";

const signOut: RequestHandler = (req, res) => {
  const auth = getAuth(req);
  users.delete(auth);
  res.sendStatus(200);
};

export default signOut;
