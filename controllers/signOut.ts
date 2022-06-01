import { RequestHandler } from "express";
import { deleteUser } from "../models";
import { getAuth } from "../utils";

const signOut: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  try {
    await deleteUser(auth);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default signOut;
