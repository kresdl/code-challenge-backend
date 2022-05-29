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
if (!accountSid)
    throw Error("TWILIO_ACCOUNT_SID not set");
if (!authToken)
    throw Error("TWILIO_AUTH_TOKEN not set");
if (!sendingNumber)
    throw Error("TWILIO_NUMBER not set");
if (!srTrafficAreasAPI)
    throw Error("SR_TRAFFIC_AREAS_API not set");
const twilioClient = twilio(accountSid, authToken);
const now = () => new Date().toString();
const users = new Map();
export const broadcast = () => {
    users.forEach((user, auth) => __awaiter(void 0, void 0, void 0, function* () {
        const { latitude, longitude, lastUpdateAt: lastUpdate, phoneNumber } = user;
        try {
            const response = yield axios.get(srTrafficAreasAPI, {
                params: { latitude, longitude },
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            try {
                const data = yield parseXML(response.data);
                const messages = data.sr.messages[0].message.filter(compareMessageByDate(lastUpdate)).map(msg => {
                    const priority = "Priority: " + msg.$.priority;
                    const createDate = "Time: " + msg.createddate;
                    const exactLocation = "Location: " + msg.exactlocation;
                    const description = "Description: " + msg.description;
                    return [msg.title, priority, createDate, exactLocation, description].join("\n");
                });
                if (!messages.length)
                    return;
                twilioClient.messages.create({
                    body: messages.join("\n\n"),
                    from: sendingNumber,
                    to: phoneNumber,
                });
                users.set(auth, Object.assign(Object.assign({}, user), { lastUpdateAt: now() }));
            }
            catch (error) {
                console.error(error);
            }
        }
        catch (error) {
            const axiosError = error;
            console.error(axiosError.message);
        }
    }));
};
export default users;
