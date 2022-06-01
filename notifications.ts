import axios from "axios";
import { SRTrafficMessages, SRTrafficAreas } from "./types";
import { compareMessageByDate, formatDate, formatDateTime, parseXML } from "./utils";
import twilio from "twilio";
import { getUser, updateLast } from "./models";
import getUsers from "./models/getUsers";
import { User } from "./models/User";

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER, SR_TRAFFIC_AREAS_API, SR_TRAFFIC_MESSAGES_API } =
  process.env;
if (!TWILIO_ACCOUNT_SID) throw Error("TWILIO_ACCOUNT_SID not set");
if (!TWILIO_AUTH_TOKEN) throw Error("TWILIO_AUTH_TOKEN not set");
if (!TWILIO_NUMBER) throw Error("TWILIO_NUMBER not set");
if (!SR_TRAFFIC_AREAS_API) throw Error("SR_TRAFFIC_AREAS_API not set");
if (!SR_TRAFFIC_MESSAGES_API) throw Error("SR_TRAFFIC_MESSAGES_API not set");

const axiosClient = axios.create({
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const notify = async (user: User) => {
  const { auth, phoneNumber, latitude, longitude, lastArea } = user;
  if (!latitude || !longitude) return;

  try {
    const { data: areasXML } = await axiosClient.get(SR_TRAFFIC_AREAS_API, {
      params: { latitude, longitude },
    });

    const areas = await parseXML<SRTrafficAreas>(areasXML);
    const area = areas.sr.area[0].$.name;
    const today = formatDate(new Date());
    const now = formatDateTime(new Date());

    // If user entered a new area, get all messages for the day
    const lastUpdateAt = lastArea !== area ? today : user.lastUpdateAt;
    const thisUpdateAt = now;

    const { data: messagesXML } = await axiosClient.get(SR_TRAFFIC_MESSAGES_API, {
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
      from: TWILIO_NUMBER,
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
