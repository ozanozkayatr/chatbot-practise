const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  userId: String,
  question: String,
  answer: String,
  aiResponse: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
