import xml2js from "xml2js";
import { Message } from "./types";
import { Request } from "express";
import dayjs from "dayjs";

export const parseXML = <T>(xml: string) =>
  new Promise<T>((resolve, reject) => {
    xml2js.parseString(xml, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });

export const compareMessageByDate =
  (date: dayjs.Dayjs) =>
  ({ createddate }: Message) => {
    return date.isBefore(createddate);
  };

export const getAuth = (req: Request) => req.headers.authorization?.match(/Bearer\s(.+)/)?.[1] ?? "";
