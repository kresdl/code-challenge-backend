import axios, { AxiosError } from "axios";
import { SRResponse, User } from "./types";
import { compareMessageByDate, parseXML } from "./utils";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sendingNumber = process.env.TWILIO_NUMBER;
const srTrafficAreasAPI = process.env.SR_TRAFFIC_AREAS_API;

if (!accountSid) throw Error("TWILIO_ACCOUNT_SID not set");
if (!authToken) throw Error("TWILIO_AUTH_TOKEN not set");
if (!sendingNumber) throw Error("TWILIO_NUMBER not set");
if (!srTrafficAreasAPI) throw Error("SR_TRAFFIC_AREAS_API not set");

const twilioClient = twilio(accountSid, authToken);

const now = () => new Date().toString();

const users = new Map<string, User>();

export const broadcast = () => {
  users.forEach(async (user, auth) => {
    const { latitude, longitude, lastUpdateAt: lastUpdate, phoneNumber } = user;
    try {
      const response = await axios.get(srTrafficAreasAPI, {
        params: { latitude, longitude },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      try {
        const data = await parseXML<SRResponse>(response.data);
        const messages = data.sr.messages[0].message.filter(compareMessageByDate(lastUpdate)).map(msg => {
          const priority = "Priority: " + msg.$.priority;
          const createDate = "Time: " + msg.createddate;
          const exactLocation = "Location: " + msg.exactlocation;
          const description = "Description: " + msg.description;
          return [msg.title, priority, createDate, exactLocation, description].join("\n");
        });
        if (!messages.length) return;
        twilioClient.messages.create({
          body: messages.join("\n\n"),
          from: sendingNumber,
          to: phoneNumber,
        });
        users.set(auth, { ...user, lastUpdateAt: now() });
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError.message);
    }
  });
};

export default users;
