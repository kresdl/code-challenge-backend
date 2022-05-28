import { cors, signIn, auth, signOut, subscribe, updatePosition } from "./controllers";
import express from "express";
import bodyParser from "body-parser";

const router = express.Router();

router.use("/", cors, bodyParser.json());
router.post("/signin", signIn);
router.post("/signout", signOut);
router.use("/", auth);
router.get("/subscribe", subscribe);
router.get("/update", updatePosition);

export default router;
