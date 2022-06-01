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
  (date: string) =>
  ({ createddate }: Message) =>
    new Date(createddate) > new Date(date);

export const getAuth = (req: Request) => req.headers.authorization?.match(/Bearer\s(.+)/)?.[1] ?? "";

const zeroPad = (value: number) => `0${value}`.slice(-2);

export const formatDate = (date: Date) => {
  const year = date.getFullYear().toString();
  const month = zeroPad(date.getMonth() + 1);
  const day = zeroPad(date.getDate());
  return `${year}-${month}-${day}`;
};

export const formatDateTime = (date: Date) => {
  const datePart = formatDate(date);
  const hours = zeroPad(date.getHours());
  const minutes = zeroPad(date.getMinutes());
  const seconds = zeroPad(date.getSeconds());
  return `${datePart} ${hours}:${minutes}:${seconds}`;
};
