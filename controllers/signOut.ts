import { RequestHandler } from "express";
import { deleteUser } from "../models";
import { getAuth } from "../utils";

const signOut: RequestHandler = (req, res) => {
  const auth = getAuth(req);
  deleteUser(auth);
  res.sendStatus(200);
};

export default signOut;
