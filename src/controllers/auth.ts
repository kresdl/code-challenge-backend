import { AsyncRequestHandler } from "../types";
import { getUserId } from "../utils";

export const UNAUTHORIZED_MESSAGE = "Unauthorized";

const auth: AsyncRequestHandler = async (req, res, next) => {
  try {
    const userId = await getUserId(req.headers.authorization ?? "");
    res.locals.userId = userId;
    next();
  } catch (error) {
    res.status(401).send(UNAUTHORIZED_MESSAGE);
  }
};

export default auth;
