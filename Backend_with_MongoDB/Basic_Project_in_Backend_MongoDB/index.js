import logger from "./logger.js";
import morgan from "morgan";
import express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const app = express();

const port = process.env.PORT || 8080;

app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  }),
);

let teaData = [];
let nextId = 1;

//create tea
app.post("/teas", (req, res) => {
  console.log("POST");
  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  return res
    .status(201)
    .json({ message: "Tea created successfully", tea: newTea });
});

//get all teas
app.get("/teas", (req, res) => {
  console.log("GET");
  return res.status(200).send(teaData);
});

//get tea by id
app.get("/teas/:id", (req, res) => {
  console.log("GET");
  const id = parseInt(req.params.id);
  const tea = teaData.find((t) => t.id === id);
  if (!tea) {
    return res.status(404).json({ message: "Tea not found" });
  }
  return res.status(200).json(tea);
});

//update tea by id
app.put("/teas/:id", (req, res) => {
  console.log("PUT");
  const id = parseInt(req.params.id);
  const { name, price } = req.body;
  const teaIndex = teaData.findIndex((t) => t.id === id);

  if (teaIndex === -1) {
    return res.status(404).json({ message: "Tea not found" });
  }

  teaData[teaIndex] = { id, name, price };
  return res
    .status(200)
    .json({ message: "Tea updated successfully", tea: teaData[teaIndex] });
});

//delete tea by ID
app.delete("/teas/:id", (req, res) => {
  console.log("DELETE");
  const id = parseInt(req.params.id);
  const teaIndex = teaData.findIndex((t) => t.id === id);
  if (teaIndex === -1) {
    return res.status(404).json({ message: "Tea not found" });
  }

  teaData.splice(teaIndex, 1);

  return res.status(200).json({ message: "Tea deleted successfully" });
});

//Home Page
app.get("/", (req, res) => {
  logger.info("GET");
  res.send("Hi Tea lovers");
});

app.listen(port, () => {
  console.log(teaData);
  console.log(`Server in running on port ${port}`);
});
