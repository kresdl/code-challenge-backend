import { RequestHandler } from "express";
import { register } from "../models";
import { stripTime } from "../utils";

const validateInput = (body: any) => {
  return /\+\d+/.test(body.phoneNumber);
};

const subscribe: RequestHandler = async (req, res) => {
  const { body } = req;
  if (!validateInput(body)) return res.status(400).send("Invalid phone number format");
  const { phoneNumber } = body;
  const lastUpdateAt = stripTime(new Date());
  try {
    await register({
      id: res.locals.userId,
      phoneNumber,
      lastUpdateAt,
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export default subscribe;
