import express from "express";
import { register, login, validateInput } from "../controllers/users";
import { body } from "express-validator";

const oneOrMore = "Must be 1 character or more";

const firstName = body("first_name").notEmpty().withMessage(oneOrMore);
const lastName = body("last_name").notEmpty().withMessage(oneOrMore);
const email = body("email").isEmail().withMessage("Must be an email");
const password = body("password").isLength({ min: 5 }).withMessage("Must be 5 characters or more");

const router = express.Router();

router.post("/register", firstName, lastName, email, password, validateInput, register);
router.post("/login", email, password, validateInput, login);

export default router;
