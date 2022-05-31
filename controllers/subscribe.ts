import { RequestHandler } from "express";
import { User } from "../types";
import users from "../users";
import { getAuth } from "../utils";

const subscribe: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const { phoneNumber } = req.body;
  if (!/\+\d+/.test(phoneNumber)) return res.sendStatus(400);
  const today = new Date().toDateString();
  const user: User = { phoneNumber, lastUpdateAt: today };
  users.set(auth, user);
  res.sendStatus(200);
};

export default subscribe;
