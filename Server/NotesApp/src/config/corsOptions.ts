import { allowedOrigins } from "./allowedOrigins";
type StaticOrigin = boolean | string | RegExp | Array<boolean | string | RegExp>;
export const corsOptions = {
  origin: (
    requestOrigin: string,
    callback: (err: Error | null, origin?: StaticOrigin) => void) => {
      console.log("** requestOrigin", requestOrigin);
    if (allowedOrigins.indexOf(requestOrigin) !== -1 || !requestOrigin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization']
};