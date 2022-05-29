import "./config";
import routes from "./routes";
import express from "express";
import { broadcast } from "./users";

const app = express();

const { PORT = "3000" } = process.env;

const port = ~~PORT;

app.disable("x-powered-by");

app.use(routes);

app.listen(port, "localhost", () => {
  console.log(`Listening on port ${port}...`);
  //  setInterval(broadcast, 60000);
});
