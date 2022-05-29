import xml2js from "xml2js";
import cookie from "cookie";
import { SRMessage } from "./types";
import { Request } from "express";

export const parseXML = <T>(xml: string) =>
  new Promise<T>((resolve, reject) => {
    xml2js.parseString(xml, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });

export const compareMessageByDate =
  (date: string) =>
  ({ createddate }: SRMessage) =>
    new Date(createddate) > new Date(date);

export const getAuth = (req: Request) => cookie.parse(req.headers.cookie ?? "").auth;
