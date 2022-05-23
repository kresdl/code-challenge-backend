import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const cors = (req: Request, res: Response, next: NextFunction) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "*, Authorization");
  res.set("Access-Control-Expose-Headers", "*, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
};

// jsonwebtoken authorization

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.get("Authorization");

  if (auth) {
    const token = auth.split(" ")[1];

    if (token) {
      try {
        const id = jwt.verify(token, process.env.JWT_SECRET).user,
          user = await User.byId(id);

        if (user) {
          res.locals.user = id;
          return next();
        } else {
          return res.fail(403, "Token valid but unable find user in database");
        }
      } catch (err) {
        console.error(err);
        return res.fail(403, "Invalid token");
      }
    }
  }
  res.fail(403, "Access denied");
};

// Assign customized response methods to conform to JSend-specification

export const response = (_: Request, res: Response, next: NextFunction) => {
  res.success = (status = 200, data = "Operation succeeded") => {
    res.status(status).json({
      status: "success",
      data,
    });
  };

  res.fail = (status = 400, data = "Operation failed") => {
    res.status(status).json({
      status: "fail",
      data,
    });
  };

  res.error = (status = 500, message = "Internal error") => {
    res.status(status).json({
      status: "error",
      message,
    });
  };

  next();
};

// input validators

export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  res.fail(422, errors.array());
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    await User.register({
      firstName: first_name,
      lastName: last_name,
      email,
      password,
    });

    res.success(200, "User created");
  } catch (err) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      res.fail(409, "User already exists");
    } else {
      res.error();
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.login({ email, password });

    if (user) {
      res.success(200, jwt.sign({ user: user.id }, process.env.JWT_SECRET));
    } else {
      res.fail(403, "Email/password mismatch");
    }
  } catch (err) {
    console.error(err);
    res.error();
  }
};
