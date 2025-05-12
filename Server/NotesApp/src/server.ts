import express, {Request, Response } from "express";
import path from "path";
import router from "./routes/root";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandle";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import { corsOptions } from "./config/corsOptions";
import dotenv from "dotenv";
import { connectDB } from "./config/dbConn";
import mongoose from "mongoose";
import { logEvents } from "./middleware/logger";
import { router as userRouter } from "./routes/userRoutes";
import { router as noteRouter } from "./routes/notesRouter";
import { router as authRouter } from "./routes/authRoutes";

dotenv.config();
console.log(process.env.NODE_ENV);
connectDB();

const app = express();
const PORT = process.env.PORT || 3500
app.use(cors(corsOptions as CorsOptions));
app.use(logger);
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));



app.use("/", router);
app.use("/user", userRouter);
app.use("/note", noteRouter);
app.use("/auth", authRouter);

app.all("*", (req: Request, res: Response) => {
  console.log("Accept Header:", req.headers.accept);
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found"});
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
});

mongoose.connection.on("error", (err: any) => {
  console.log("Database connection on listener", err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,"mongoErrLog.log");
});
