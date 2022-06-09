import { cors, auth, unsubscribe, subscribe, updatePosition } from "./controllers";
import express from "express";
import bodyParser from "body-parser";

const router = express.Router();

router.get("/unsubscribe/:userId", unsubscribe);
router.use("/", cors, bodyParser.json(), auth);
router.post("/unsubscribe", unsubscribe);
router.post("/subscribe", subscribe);
router.post("/update", updatePosition);

export default router;
