import dotenv from "dotenv";
import routes from "./routes";
import express from "express";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.disable("x-powered-by");

app.use(routes);

app.listen(port, "localhost", () => {
  console.log(`Listening on port ${port}...`);
});
