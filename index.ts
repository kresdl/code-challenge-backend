import "./config";
import router from "./router";
import express from "express";
import { notifyAllUsers } from "./notifications";

const app = express();

const { PORT = "3000" } = process.env;

const port = ~~PORT;

app.disable("x-powered-by");

app.use(router);

app.listen(port, "0.0.0.0", async () => {
  console.log(`Listening on port ${port}...`);
  setInterval(notifyAllUsers, 30000);
});
