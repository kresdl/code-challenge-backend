import xml2js from "xml2js";
import { Message } from "./types";
import dayjs from "dayjs";
import { OAuth2Client } from "google-auth-library";

const { OAUTH_CLIENT_ID } = process.env;
if (!OAUTH_CLIENT_ID) throw Error("OAUTH_CLIENT_ID not set");

export const parseXML = <T>(xml: string) =>
  new Promise<T>((resolve, reject) => {
    xml2js.parseString(xml, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });

export const compareMessageByDate =
  (date: dayjs.Dayjs) =>
  ({ createddate }: Message) =>
    date.isBefore(createddate);

const oAuthClient = new OAuth2Client(OAUTH_CLIENT_ID);

export const getUserId = async (authorizationHeader: string) => {
  const idToken = authorizationHeader.match(/Bearer\s(.+)/)?.[1];
  if (!idToken) throw Error("Could not find bearer token");
  const ticket = await oAuthClient.verifyIdToken({
    idToken,
    audience: OAUTH_CLIENT_ID,
  });
  const userId = ticket.getUserId();
  if (!userId) throw Error("Could not find user id in id token");
  return userId;
};
