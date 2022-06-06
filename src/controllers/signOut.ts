import { deleteUser } from "../models";
import { AsyncRequestHandler } from "../types";

const signOut: AsyncRequestHandler = async (_, res) => {
  try {
    await deleteUser(res.locals.userId);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default signOut;
