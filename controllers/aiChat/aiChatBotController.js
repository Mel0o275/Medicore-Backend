require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const asyncWrapper = require("../../middleware/asyncWrapper");
const HttpStatus = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const aiChatBotController = asyncWrapper(async (req, res, next) => {
  const { prompt } = req.body;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt || "Explain how AI works in a few words",
  });

 const reply =
    response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    return next(appError.create("AI failed", 500, HttpStatus.FAIL));
  }

  const formattedReply = response.text.replace(/\n/g, "<br />");

  return res.status(200).json({
    status: HttpStatus.SUCCESS,
    data: {
      reply: formattedReply,
    },
  });
});

module.exports = aiChatBotController;
