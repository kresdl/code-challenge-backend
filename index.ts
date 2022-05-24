import routes from "./routes";
import dotenv from "dotenv";
import express from "express";

const app = express();

dotenv.config();

const { PORT = "3000" } = process.env;

const port = ~~PORT;

app.disable("x-powered-by");

app.use(routes);

app.listen(port, "localhost", () => {
  console.log(`Listening on port ${port}...`);
});
