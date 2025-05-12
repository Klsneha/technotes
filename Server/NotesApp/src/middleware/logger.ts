import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs, { promises as fsPromises } from "fs";
import path from "path";
import { NextFunction, Request, Response } from "express";
export const logEvents = async (message: string, logFileName: string) => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..","log"))) {
      await fsPromises.mkdir(path.join(__dirname, "..","log"));
    }
    await fsPromises.appendFile(path.join(__dirname, "..","log",logFileName), logItem);
  } catch (error) {
    console.log(error);
  }
};

export const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.url}`, "reqLog.log");
  console.log(`${req.method} ${req.url}`);
  next();
};


