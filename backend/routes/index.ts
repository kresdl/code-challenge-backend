import express from "express";
import bodyParser from "body-parser";
import { cors, response } from "../controllers";
import user from "./user";

const router = express.Router();

router.use("/", cors, bodyParser.json(), response, user);

module.exports = router;
