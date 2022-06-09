import { cors, auth, unsubscribe, subscribe, updatePosition } from "./controllers";
import express from "express";
import bodyParser from "body-parser";

const router = express.Router();

router.use("/", cors, bodyParser.json());
router.use("/unsubscribe/:userId?", unsubscribe);
router.use("/", auth);
router.post("/subscribe", subscribe);
router.post("/update", updatePosition);

export default router;
