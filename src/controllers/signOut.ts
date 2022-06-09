import { deleteUser } from "../models";
import { AsyncRequestHandler } from "../types";

const signOut: AsyncRequestHandler = async (req, res) => {
  const userId = res.locals.userId ?? req.params.userId;
  try {
    await deleteUser(userId);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default signOut;
