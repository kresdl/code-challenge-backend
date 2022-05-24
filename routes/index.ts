import { cors } from "../controllers";
import user from "./user";
import express from "express";

const router = express.Router();

router.use("/", cors, user);

export default router;
