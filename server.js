const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ============================
// 🔗 MongoDB Connection
// ============================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected...");
  } catch (err) {
    console.error("❌ Error: ", err.message);
    process.exit(1);
  }
};
connectDB();

// ============================
// 📌 Event Schema & Model
// ============================
const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDescription: { type: String, required: true },
  teamSize: { type: Number, required: true },
  registrationStarts: { type: Date, required: true },
  registrationEnds: { type: Date, required: true },
  venue: { type: String, required: true },
  organisers: { type: [String], required: true },
  eventLink: { type: String, required: true },
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

// ============================
// 🎯 Controllers
// ============================

// Add Event
const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get All Events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Multiple Events by IDs
const getMultipleEvents = async (req, res) => {
  try {
    const { ids } = req.body; // expects { "ids": ["id1","id2",...] }
    const events = await Event.find({ _id: { $in: ids } });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ============================
// 🚏 Routes
// ============================
app.post("/api/events", createEvent);              // Add event
app.get("/api/events", getEvents);                 // Get all events
app.post("/api/events/multiple", getMultipleEvents); // Get multiple events by IDs

// ============================
// 🚀 Server Start
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
