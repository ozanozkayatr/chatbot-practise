const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Please make sure that API key is set in .env file
});

async function generateChatResponse(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    throw new Error("Failed to generate response from OpenAI");
  }
}

module.exports = { generateChatResponse };
