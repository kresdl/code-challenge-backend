import { cors, signIn, auth, signOut, subscribe } from "./controllers";
import express from "express";
import bodyParser from "body-parser";

const router = express.Router();

router.use("/", cors, bodyParser.json());
router.post("/signin", signIn);
router.use("/", auth);
router.get("/subscribe", subscribe);
router.post("/signout", signOut);

export default router;