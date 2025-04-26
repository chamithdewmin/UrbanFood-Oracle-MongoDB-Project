require("dotenv").config();  // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Feedback = require("./models/Feedback");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection using the MONGO_URI environment variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// POST route for feedback submission
app.post("/api/feedback", async (req, res) => {
  const { name, message } = req.body;

  try {
    const feedback = new Feedback({ name, message });
    await feedback.save();
    res.status(200).send("Feedback submitted successfully");
  } catch (error) {
    res.status(500).send("Error: Unable to submit feedback");
  }
});

// Start the server using the PORT environment variable
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
