import express from "express";

const app = express();

const port = 8080;

app.use(express.json());

let teaData = [];
let nextId = 1;

//create tea
app.post("/teas", (req, res) => {
  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  return res
    .status(201)
    .json({ message: "Tea created successfully", tea: newTea });
});

//get all teas
app.get("/teas", (req, res) => {
  return res.status(200).send(teaData);
});

//get tea by id
app.get("/teas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const tea = teaData.find((t) => t.id === id);
  if (!tea) {
    return res.status(404).json({ message: "Tea not found" });
  }
  return res.status(200).json(tea);
});

//update tea by id
app.put("/teas/:id", (req, res) => {
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
  res.send("Hi Tea lovers");
});

app.listen(port, () => {
  console.log(teaData);
  console.log(`Server in running on port ${port}`);
});
