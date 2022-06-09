import { deleteUser } from "../models";
import { AsyncRequestHandler } from "../types";

const unsubscribe: AsyncRequestHandler = async (req, res) => {
  const userId = res.locals.userId ?? req.params.userId;
  try {
    await deleteUser(userId);
    res.status(200).send("Good bye");
  } catch (error) {
    res.status(500).send(error);
  }
};

export default unsubscribe;
