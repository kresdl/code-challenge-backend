import { RequestHandler } from "express";

const cors: RequestHandler = (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "*, Authorization");
  res.set("Access-Control-Expose-Headers", "*, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
};

export default cors;
