import "dotenv/config";

import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import express, { Request, Response } from "express";

import { connectionToDB } from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "healthy!!!",
  });
});

app.listen(4004, async () => {
  console.log(`SERVER RUNNING ON PORT:: ${PORT} in ${NODE_ENV} environment`);
  await connectionToDB();
});
