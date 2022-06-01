import { RequestHandler } from "express";
import { register } from "../models";
import { formatDate, getAuth } from "../utils";

const subscribe: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const { phoneNumber } = req.body;
  if (!/\+\d+/.test(phoneNumber)) return res.sendStatus(400);
  const lastUpdateAt = formatDate(new Date());
  try {
    await register({ auth, phoneNumber, lastUpdateAt });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export default subscribe;
