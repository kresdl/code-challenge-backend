import xml2js from "xml2js";
export const parseXML = (xml) => new Promise((resolve, reject) => {
    xml2js.parseString(xml, (error, result) => {
        if (error)
            reject(error);
        else
            resolve(result);
    });
});
export const compareMessageByDate = (date) => ({ createddate }) => new Date(createddate) > new Date(date);
export const getAuth = (req) => { var _a, _b, _c; return (_c = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.match(/Bearer\s(.+)/)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : ""; };
//# sourceMappingURL=utils.js.map