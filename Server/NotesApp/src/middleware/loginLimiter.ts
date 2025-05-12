import rateLimit from "express-rate-limit";
import { logEvents }  from "../middleware/logger";

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes,
  max: 5, // limit each IP to 5 login requests per window per minute
  message: {
    status: 429,
    message: "Too many login attempts from this IP, please try again after a minute."
  },
  handler: (req, res, _, options) => {
    logEvents(
      `Too many login attempts from IP: ${req.ip} at ${new Date().toISOString()} with error ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "error.log"
    );
    res.status(options.statusCode || 429).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});