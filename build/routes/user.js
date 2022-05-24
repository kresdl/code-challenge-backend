import { signIn, auth, signOut } from "../controllers";
import express from "express";
const router = express.Router();
router.post("/signin", signIn);
router.use("/", auth, (req, res) => { });
router.post("/signout", signOut);
export default router;
