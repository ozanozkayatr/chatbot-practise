const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  sessionStartTime: { type: Date, required: true },
  sessionEndTime: { type: Date },
  conversation: [
    {
      question: { type: String },
      answer: { type: String },
    },
  ],
});

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
