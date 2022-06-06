import { register } from "../models";
import dayjs from "dayjs";
import { AsyncRequestHandler } from "../types";

const validateInput = (body: any) => {
  return /\+\d+/.test(body.phoneNumber);
};

const subscribe: AsyncRequestHandler = async (req, res) => {
  const { body } = req;
  if (!validateInput(body)) {
    res.status(400).send("Invalid phone number format");
    return;
  }
  const { phoneNumber } = body;
  const lastUpdateAt = dayjs().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss");
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
