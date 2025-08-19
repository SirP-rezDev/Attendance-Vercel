const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Temporary storage (in-memory)
let attendance = [];

// POST route to save data
app.post("/attendance", (req, res) => {
  const { lastName, firstName, section, status } = req.body;
  const record = { 
    lastName, 
    firstName, 
    section, 
    status, 
    date: new Date() 
  };
  attendance.push(record);
  res.json({ message: "Attendance saved!", record });
});

// GET route to fetch all data
app.get("/attendance", (req, res) => {
  res.json(attendance);
});

module.exports = app;
