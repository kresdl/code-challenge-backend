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
export const cors = (req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.set("Access-Control-Allow-Headers", "*, Authorization");
    res.set("Access-Control-Expose-Headers", "*, Authorization");
    if (req.method === "OPTIONS")
        return res.sendStatus(200);
    next();
};
const users = new Map();
export const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const cookies = cookie.parse((_a = req.headers.cookie) !== null && _a !== void 0 ? _a : "");
    const config = {
        headers: {
            Authorization: (_b = users.get(cookies.auth)) !== null && _b !== void 0 ? _b : "",
        },
    };
    try {
        const response = yield axios.get("https://www.googleapis.com/oauth2/v3/userinfo", config);
        if (response.data)
            return next();
        res.sendStatus((_c = response.status) !== null && _c !== void 0 ? _c : 500);
    }
    catch (err) {
        console.error(err);
        const { response } = err;
        const status = response && response.status;
        res.sendStatus(status == 400 ? 403 : status !== null && status !== void 0 ? status : 500);
    }
});
export const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    const params = new URLSearchParams({
        code: req.body.code,
        redirect_uri: (_d = req.body.redirect_uri) !== null && _d !== void 0 ? _d : "",
        client_id: (_e = process.env.CLIENT_ID) !== null && _e !== void 0 ? _e : "",
        client_secret: (_f = process.env.CLIENT_SECRET) !== null && _f !== void 0 ? _f : "",
        grant_type: "authorization_code",
    });
    const config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
    try {
        const { data } = yield axios.post("https://oauth2.googleapis.com/token", params, config);
        const { id_token, access_token } = data;
        users.set(id_token, access_token);
        const setCookie = cookie.serialize("auth", id_token, {
            maxAge: 60 * 60 * 24,
        });
        res.setHeader("Set-Cookie", setCookie);
        res.json({ jwt: id_token });
    }
    catch (err) {
        console.error(err);
        const { response } = err;
        const status = response && response.status;
        res.sendStatus(status !== null && status !== void 0 ? status : 500);
    }
});
export const signOut = (req, res) => {
    var _a;
    const cookies = cookie.parse((_a = req.headers.cookie) !== null && _a !== void 0 ? _a : "");
    users.delete(cookies.auth);
    res.sendStatus(200);
};
