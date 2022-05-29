import { cors, signIn, auth, signOut, subscribe, updatePosition } from "./controllers";
import express from "express";
import bodyParser from "body-parser";

const router = express.Router();

router.use("/", (req, _res, next) => {
  console.log(req.url, req.headers.authorization);
  next();
});
router.use("/", cors, bodyParser.json());
router.post("/signin", signIn);
router.post("/signout", signOut);
router.use("/", auth);
router.post("/subscribe", subscribe);
router.post("/update", updatePosition);

export default router;
