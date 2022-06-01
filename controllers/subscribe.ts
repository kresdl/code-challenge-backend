import { RequestHandler } from "express";
import register from "../models/register";
import { getAuth } from "../utils";

const subscribe: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const { phoneNumber } = req.body;
  if (!/\+\d+/.test(phoneNumber)) return res.sendStatus(400);
  const lastUpdateAt = new Date().toDateString();
  register({ auth, phoneNumber, lastUpdateAt });
  res.sendStatus(200);
};

export default subscribe;
