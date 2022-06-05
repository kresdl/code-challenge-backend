import { RequestHandler } from "express";
import { deleteUser } from "../models";

const signOut: RequestHandler = async (_, res) => {
  try {
    await deleteUser(res.locals.userId);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default signOut;
