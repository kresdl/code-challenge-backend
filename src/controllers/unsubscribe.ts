import { deleteUser } from "../models";
import { AsyncRequestHandler } from "../types";

const unsubscribe: AsyncRequestHandler = async (req, res) => {
  const userId = res.locals.userId ?? req.params.userId;
  try {
    const match = await deleteUser(userId);
    if (!match) res.sendStatus(404);
    else res.status(200).send("Good bye");
  } catch (error) {
    res.status(500).send(error);
  }
};

export default unsubscribe;
