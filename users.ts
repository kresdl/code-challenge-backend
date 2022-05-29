import axios from "axios";
import { SRTrafficMessages, SRTrafficAreas, User } from "./types";
import { compareMessageByDate, parseXML } from "./utils";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sendingNumber = process.env.TWILIO_NUMBER;
const srTrafficAreasAPI = process.env.SR_TRAFFIC_AREAS_API;
const srTrafficMessagesAPI = process.env.SR_TRAFFIC_MESSAGES_API;

if (!accountSid) throw Error("TWILIO_ACCOUNT_SID not set");
if (!authToken) throw Error("TWILIO_AUTH_TOKEN not set");
if (!sendingNumber) throw Error("TWILIO_NUMBER not set");
if (!srTrafficAreasAPI) throw Error("SR_TRAFFIC_AREAS_API not set");
if (!srTrafficMessagesAPI) throw Error("SR_TRAFFIC_MESSAGES_API not set");

const axiosClient = axios.create({
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

const twilioClient = twilio(accountSid, authToken);

const now = () => new Date().toString();

const users = new Map<string, User>();

export const notify = async (user: User, auth: string) => {
  const { latitude, longitude, lastUpdateAt, phoneNumber } = user;
  try {
    const { data: areasXML } = await axiosClient.get(srTrafficAreasAPI, {
      params: { latitude, longitude },
    });

    const areas = await parseXML<SRTrafficAreas>(areasXML);
    const area = areas.sr.areas[0].area.$.name;

    const { data: messagesXML } = await axiosClient.get(srTrafficMessagesAPI, {
      params: {
        trafficareaname: area,
        date: new Date().toDateString(),
      },
    });

    const messages = await parseXML<SRTrafficMessages>(messagesXML);

    const formattedMessages = messages.sr.messages[0].message.filter(compareMessageByDate(lastUpdateAt)).map(msg => {
      const priority = "Priority: " + msg.$.priority;
      const createDate = "Time: " + msg.createddate;
      const exactLocation = "Location: " + msg.exactlocation;
      const description = "Description: " + msg.description;
      return [msg.title, priority, createDate, exactLocation, description].join("\n");
    });

    if (!formattedMessages.length) return;

    twilioClient.messages.create({
      body: formattedMessages.join("\n\n"),
      from: sendingNumber,
      to: phoneNumber,
    });
    users.set(auth, { ...user, lastUpdateAt: now() });
  } catch (error) {
    console.error(error);
  }
};

export const broadcast = () => {
  users.forEach(notify);
};

export default users;
