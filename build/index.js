import "./config";
import routes from "./routes";
import express from "express";
import { notifyAllUsers } from "./users";
const app = express();
const { PORT = "3000" } = process.env;
const port = ~~PORT;
app.disable("x-powered-by");
app.use(routes);
app.listen(port, "0.0.0.0", () => {
    console.log(`Listening on port ${port}...`);
    setInterval(notifyAllUsers, 30000);
});
//# sourceMappingURL=index.js.map