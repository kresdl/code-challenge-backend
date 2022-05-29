var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import cookie from "cookie";
import { getAuth } from "./utils";
import users from "./users";
const oAuthTokenEndpoint = process.env.OAUTH_TOKEN_ENDPOINT;
if (!oAuthTokenEndpoint)
    throw Error("OAUTH_TOKEN_ENDPOINT not set");
const COOKIE_MAX_AGE = 60 * 60 * 24;
const auths = new Set();
export const cors = (req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.set("Access-Control-Allow-Headers", "*, Authorization");
    res.set("Access-Control-Expose-Headers", "*, Authorization");
    if (req.method === "OPTIONS")
        return res.sendStatus(200);
    next();
};
export const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const params = new URLSearchParams({
        code: req.body.code,
        redirect_uri: (_a = req.body.redirect_uri) !== null && _a !== void 0 ? _a : "",
        client_id: (_b = process.env.CLIENT_ID) !== null && _b !== void 0 ? _b : "",
        client_secret: (_c = process.env.CLIENT_SECRET) !== null && _c !== void 0 ? _c : "",
        grant_type: "authorization_code",
    });
    try {
        const { data } = yield axios.post(oAuthTokenEndpoint, {
            params,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const { id_token } = data;
        auths.add(id_token);
        const setCookie = cookie.serialize("auth", id_token, {
            maxAge: COOKIE_MAX_AGE,
        });
        res.setHeader("Set-Cookie", setCookie);
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        const { response } = err;
        const status = response && response.status;
        res.sendStatus(status !== null && status !== void 0 ? status : 500);
    }
});
export const signOut = (req, res) => {
    const auth = getAuth(req);
    users.delete(auth);
    res.sendStatus(200);
};
export const auth = (req, res, next) => {
    const auth = getAuth(req);
    const isAuth = auths.has(auth);
    if (!isAuth)
        return res.sendStatus(403);
    next();
};
export const subscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = getAuth(req);
    const { phoneNumber, latitude, longitude } = req.body;
    const lastUpdate = new Date().toDateString();
    users.set(auth, { phoneNumber, latitude, longitude, lastUpdateAt: lastUpdate });
    res.sendStatus(200);
});
export const updatePosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = getAuth(req);
    const user = users.get(auth);
    if (!user)
        return res.sendStatus(400);
    const { latitude, longitude } = req.body;
    users.set(auth, Object.assign(Object.assign({}, user), { latitude, longitude }));
    res.sendStatus(200);
});
