import axios from "axios";
import { SRTrafficMessages, SRTrafficAreas } from "./types";
import { compareMessageByDate, formatDate, formatDateTime, parseXML } from "./utils";
import twilio from "twilio";
import { getUser, updateLast } from "./models";
import getUsers from "./models/getUsers";
import { User } from "./models/User";

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

const notify = async (user: User) => {
  const { auth, phoneNumber, latitude, longitude, lastArea } = user;
  if (!latitude || !longitude) return;

  try {
    const { data: areasXML } = await axiosClient.get(srTrafficAreasAPI, {
      params: { latitude, longitude },
    });

    const areas = await parseXML<SRTrafficAreas>(areasXML);
    const area = areas.sr.area[0].$.name;
    const today = formatDate(new Date());
    const now = formatDateTime(new Date());

    // If user entered a new area, get all messages for the day
    const lastUpdateAt = lastArea !== area ? today : user.lastUpdateAt;
    const thisUpdateAt = now;

    const { data: messagesXML } = await axiosClient.get(srTrafficMessagesAPI, {
      params: {
        trafficareaname: area,
        date: today,
      },
    });

    const messages = await parseXML<SRTrafficMessages>(messagesXML);

    const formattedMessages = messages.sr.messages[0].message.filter(compareMessageByDate(lastUpdateAt)).map(msg => {
      const priority = "Priority: " + msg.$.priority;
      const createDate = "Time: " + msg.createddate;
      const exactLocation = "Location: " + msg.exactlocation;
      const description = "Description: " + msg.description;
      const category = "Category: " + msg.category;
      return [msg.title, priority, createDate, exactLocation, description, category].join("\n");
    });

    if (!formattedMessages.length) return;

    twilioClient.messages.create({
      body: formattedMessages.join("\n\n"),
      from: sendingNumber,
      to: phoneNumber,
    });
    updateLast(auth, {
      lastUpdateAt: thisUpdateAt,
      lastArea: area,
    });
  } catch (error) {
    console.error(error);
  }
};

export const notifyUser = async (auth: string) => {
  const user = await getUser(auth);
  if (user) notify(user);
};

export const notifyAllUsers = async () => {
  const users = await getUsers();
  users.forEach(notify);
};