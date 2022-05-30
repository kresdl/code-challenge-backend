import { cors, auth, signOut, subscribe, updatePosition } from "./controllers";
import express from "express";
import bodyParser from "body-parser";
const router = express.Router();
router.use("/", cors, bodyParser.json(), auth);
router.post("/signout", signOut);
router.post("/subscribe", subscribe);
router.post("/update", updatePosition);
export default router;
//# sourceMappingURL=routes.js.map