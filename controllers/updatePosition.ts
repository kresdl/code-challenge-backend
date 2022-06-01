import { RequestHandler } from "express";
import { getAuth } from "../utils";
import { updatePosition as update } from "../models";

const updatePosition: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  try {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) return res.sendStatus(400);
    await update(auth, { latitude, longitude });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export default updatePosition;
