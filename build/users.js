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
const users = new Map();
const notify = (user, auth) => __awaiter(void 0, void 0, void 0, function* () {
    const { position, phoneNumber, lastArea } = user;
    if (!position)
        return;
    try {
        const { data: areasXML } = yield axiosClient.get(srTrafficAreasAPI, {
            params: position,
        });
        const areas = yield parseXML(areasXML);
        const area = areas.sr.area[0].$.name;
        const today = new Date().toDateString();
        const now = new Date().toString();
        // If user entered a new area, get all messages for the day
        const lastUpdateAt = lastArea !== area ? today : user.lastUpdateAt;
        const thisUpdateAt = now;
        const { data: messagesXML } = yield axiosClient.get(srTrafficMessagesAPI, {
            params: {
                trafficareaname: area,
                date: today,
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
            body: "\n" + formattedMessages.join("\n\n"),
            from: sendingNumber,
            to: phoneNumber,
        });
        users.set(auth, Object.assign(Object.assign({}, user), { lastUpdateAt: thisUpdateAt, lastArea: area }));
    }
    catch (error) {
        console.error(error);
    }
});
export const notifyUser = (auth) => {
    const user = users.get(auth);
    if (user)
        notify(user, auth);
};
export const notifyAllUsers = () => {
    users.forEach(notify);
};
export default users;
//# sourceMappingURL=users.js.map