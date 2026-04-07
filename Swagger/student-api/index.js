const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();
app.use(express.json());

const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let students = [];

// GET students
app.get("/students", (req, res) => {
  res.json(students);
});

// POST student
app.post("/students", (req, res) => {
  students.push(req.body);
  res.status(201).json(req.body);
});

// GET student by id
app.get("/students/:id", (req, res) => {
  const student = students[req.params.id];
  res.json(student);
});

// DELETE student
app.delete("/students/:id", (req, res) => {
  students.splice(req.params.id, 1);
  res.send("Deleted");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
