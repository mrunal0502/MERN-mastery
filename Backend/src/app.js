import express from "express";
import cors from "cors";

const app = express();

app.get("/", (req, res) => {++
  res.send("Welcome to basecampy");
});

//basic configurations

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//cors configurations

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// import the routes
import healthCheckRouter from "./routes/healthcheck.routes.js";

import authRouter from "./routes/auth.routes.js";

// use the routes
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/healthcheck", healthCheckRouter);

export default app;
