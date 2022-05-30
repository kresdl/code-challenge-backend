var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAuth } from "./utils";
import users from "./users";
import { OAuth2Client } from "google-auth-library";
const oAuthTokenEndpoint = process.env.OAUTH_TOKEN_ENDPOINT;
const oAuthClientId = process.env.OAUTH_CLIENT_ID;
const oAuthClientSecret = process.env.OAUTH_CLIENT_SECRET;
if (!oAuthTokenEndpoint)
    throw Error("OAUTH_TOKEN_ENDPOINT not set");
if (!oAuthClientId)
    throw Error("OAUTH_CLIENT_ID not set");
if (!oAuthClientSecret)
    throw Error("OAUTH_CLIENT_SECRET not set");
const oAuthClient = new OAuth2Client(oAuthClientId);
const validateIdToken = (idToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield oAuthClient.verifyIdToken({
        idToken,
        audience: oAuthClientId,
    });
    return !!ticket.getPayload();
});
export const cors = (req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.set("Access-Control-Allow-Headers", "*, Authorization");
    res.set("Access-Control-Expose-Headers", "*, Authorization");
    if (req.method === "OPTIONS")
        return res.sendStatus(200);
    next();
};
export const auth = (req, res, next) => {
    const auth = getAuth(req);
    if (!validateIdToken(auth))
        return res.sendStatus(403);
    next();
};
export const signOut = (req, res) => {
    const auth = getAuth(req);
    users.delete(auth);
    res.sendStatus(200);
};
export const subscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = getAuth(req);
    const { phoneNumber } = req.body;
    const today = new Date().toDateString();
    const user = { phoneNumber, lastUpdateAt: today };
    users.set(auth, user);
    res.sendStatus(200);
});
export const updatePosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = getAuth(req);
    const user = users.get(auth);
    if (!user)
        return res.sendStatus(400);
    const { latitude, longitude } = req.body;
    const position = { latitude, longitude };
    users.set(auth, Object.assign(Object.assign({}, user), { position }));
    res.sendStatus(200);
});
//# sourceMappingURL=controllers.js.map