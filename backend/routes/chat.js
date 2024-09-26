const express = require("express");
const router = express.Router();
const { generateChatResponse } = require("../openai");
const Session = require("../models/Session");

router.post("/randomQuestion", async (req, res) => {
  const { sessionId, sessionStartTime, questionCount } = req.body;

  if (!sessionId || !sessionStartTime) {
    return res
      .status(400)
      .json({ error: "Session ID and Start Time are required." });
  }

  try {
    let session = await Session.findOne({ sessionId });
    if (!session) {
      session = new Session({ sessionId, sessionStartTime, conversation: [] });
      await session.save();
    }

    if (questionCount >= 10) {
      session.sessionEndTime = new Date();
      await session.save();
      return res.json({
        message: "Session completed",
        sessionEndTime: session.sessionEndTime,
      });
    }

    const aiResponse = await generateChatResponse(
      "Generate a non-personal random question for the user."
    );

    session.conversation.push({ question: aiResponse });
    await session.save();

    res.json({ question: aiResponse });
  } catch (error) {
    console.error("Error generating random question:", error);
    res
      .status(500)
      .json({ error: "Failed to generate random question from OpenAI" });
  }
});

router.post("/answer", async (req, res) => {
  const { sessionId, answer, questionIndex } = req.body;

  try {
    const session = await Session.findOne({ sessionId });

    if (!session || !session.conversation[questionIndex]) {
      return res
        .status(400)
        .json({ error: "Invalid session or question index" });
    }

    session.conversation[questionIndex].answer = answer;

    if (questionIndex === 9) {
      session.sessionEndTime = new Date();
      await session.save();
      return res.json({
        message: "Session ended",
        sessionEndTime: session.sessionEndTime,
      });
    }

    await session.save();
    res.json({ message: "Answer saved successfully" });
  } catch (error) {
    console.error("Error saving answer:", error);
    res.status(500).json({ error: "Failed to save answer" });
  }
});

module.exports = router;
