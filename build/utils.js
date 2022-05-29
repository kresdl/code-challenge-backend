import xml2js from "xml2js";
import cookie from "cookie";
export const parseXML = (xml) => new Promise((resolve, reject) => {
    xml2js.parseString(xml, (error, result) => {
        if (error)
            reject(error);
        else
            resolve(result);
    });
});
export const compareMessageByDate = (date) => ({ createddate }) => new Date(createddate) > new Date(date);
export const getAuth = (req) => { var _a; return cookie.parse((_a = req.headers.cookie) !== null && _a !== void 0 ? _a : "").auth; };
