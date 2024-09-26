const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const chatRoutes = require("./routes/chat");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/Chatbot", {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use("/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
