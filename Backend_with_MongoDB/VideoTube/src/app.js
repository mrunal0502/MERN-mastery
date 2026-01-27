import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//common middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

console.log("In app.js");

//calling healthcheck route
import healthcheckRoute from "./routes/healthcheck.routes.js";
console.log("Entering health check Router");
app.use("/api/v1/healthcheck", healthcheckRoute);

import userRouter from "./routes/user.routes.js";
console.log("Entering userRouter");
app.use("/api/v1/users", userRouter);

//handle error
import { errorHandler } from "./middlewares/error.middlewares.js";
app.use(errorHandler);

export default app;
