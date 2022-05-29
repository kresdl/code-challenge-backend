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
import { compareMessageByDate, parseXML } from "./utils";
import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sendingNumber = process.env.TWILIO_NUMBER;
const srTrafficAreasAPI = process.env.SR_TRAFFIC_AREAS_API;
const srTrafficMessagesAPI = process.env.SR_TRAFFIC_MESSAGES_API;
if (!accountSid)
    throw Error("TWILIO_ACCOUNT_SID not set");
if (!authToken)
    throw Error("TWILIO_AUTH_TOKEN not set");
if (!sendingNumber)
    throw Error("TWILIO_NUMBER not set");
if (!srTrafficAreasAPI)
    throw Error("SR_TRAFFIC_AREAS_API not set");
if (!srTrafficMessagesAPI)
    throw Error("SR_TRAFFIC_MESSAGES_API not set");
const axiosClient = axios.create({
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
});
const twilioClient = twilio(accountSid, authToken);
const now = () => new Date().toString();
const users = new Map();
export const notify = (user, auth) => __awaiter(void 0, void 0, void 0, function* () {
    const { latitude, longitude, lastUpdateAt, phoneNumber } = user;
    try {
        const { data: areasXML } = yield axiosClient.get(srTrafficAreasAPI, {
            params: { latitude, longitude },
        });
        const areas = yield parseXML(areasXML);
        const area = areas.sr.areas[0].area.$.name;
        const { data: messagesXML } = yield axiosClient.get(srTrafficMessagesAPI, {
            params: {
                trafficareaname: area,
                date: new Date().toDateString(),
            },
        });
        const messages = yield parseXML(messagesXML);
        const formattedMessages = messages.sr.messages[0].message.filter(compareMessageByDate(lastUpdateAt)).map(msg => {
            const priority = "Priority: " + msg.$.priority;
            const createDate = "Time: " + msg.createddate;
            const exactLocation = "Location: " + msg.exactlocation;
            const description = "Description: " + msg.description;
            return [msg.title, priority, createDate, exactLocation, description].join("\n");
        });
        if (!formattedMessages.length)
            return;
        twilioClient.messages.create({
            body: formattedMessages.join("\n\n"),
            from: sendingNumber,
            to: phoneNumber,
        });
        users.set(auth, Object.assign(Object.assign({}, user), { lastUpdateAt: now() }));
    }
    catch (error) {
        console.error(error);
    }
});
export const broadcast = () => {
    users.forEach(notify);
};
export default users;
//# sourceMappingURL=users.js.map