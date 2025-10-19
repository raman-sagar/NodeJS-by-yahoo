const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/users.model");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));

// Connect MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/users_demo")
  .then(() => console.log("Database Connected!"));

// Get all users

app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json({ data: users });
});

//Add record in users_demo database
app.post("/api/users", async (req, res) => {
  try {
    const record = await User.create(req.body);
    if (!record) {
      return res.status(404).json({ message: "Record not inserted" });
    }
    res.json({ record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => console.log("Server started"));
