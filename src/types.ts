import { NextFunction, Request, Response } from "express";

export interface Message {
  $: {
    priority: string;
  };
  createddate: string;
  title: string;
  exactlocation: string;
  description: string;
  category: string;
}

export interface SRTrafficMessages {
  sr: {
    messages: [
      {
        message: Message[];
      }
    ];
  };
}

export interface SRTrafficAreas {
  sr: {
    area: [
      {
        $: {
          name: string;
        };
      }
    ];
  };
}

export type AsyncRequestHandler = (request: Request, resposne: Response, next: NextFunction) => Promise<void>;
