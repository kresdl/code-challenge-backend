import { RequestHandler } from "express";
import { getAuth } from "../utils";
import invariant from "ts-invariant";
import users from "../users";

const updatePosition: RequestHandler = async (req, res) => {
  const auth = getAuth(req);
  const user = users.get(auth);
  invariant(user, "user not set");
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) return res.sendStatus(400);
  const position = { latitude, longitude };
  users.set(auth, { ...user, position });
  res.sendStatus(200);
};

export default updatePosition;
