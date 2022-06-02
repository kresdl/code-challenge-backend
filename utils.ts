import xml2js from "xml2js";
import { Message } from "./types";
import { Request } from "express";

export const parseXML = <T>(xml: string) =>
  new Promise<T>((resolve, reject) => {
    xml2js.parseString(xml, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });

export const compareMessageByDate =
  (date: Date) =>
  ({ createddate }: Message) =>
    new Date(createddate) > date;

export const getAuth = (req: Request) => req.headers.authorization?.match(/Bearer\s(.+)/)?.[1] ?? "";

export const stripTime = (date: Date) => {
  return new Date(date.toDateString());
};
