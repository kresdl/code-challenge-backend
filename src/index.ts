import router from "./router";
import express from "express";
import { notifyAllUsers } from "./notifications";

const { PORT, HOST } = process.env;
if (!PORT) throw Error("PORT not set");
if (!HOST) throw Error("HOST not set");

const UPDATE_INTERVAL = 30000;

const app = express();

app.disable("x-powered-by");
app.use(router);

const server = app.listen(~~PORT, HOST, () => {
  console.log(`Listening on port ${PORT}...`);
  setInterval(notifyAllUsers, UPDATE_INTERVAL);
});

const shutdown = () => {
  server.close(err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
