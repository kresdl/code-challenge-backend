import { RequestHandler } from "express";
import { getAuth } from "../utils";
import { updatePosition as update } from "../models";

const validateInput = (body: any) => {
  return Number.isFinite(body.latitude) && Number.isFinite(body.longitude);
};

const updatePosition: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const { body } = req;
  if (!validateInput(body)) return res.status(400).send("Invalid position");
  try {
    await update(auth, body);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export default updatePosition;
