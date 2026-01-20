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

  if (!response || !response.text) {
    const error = appError.create("AI failed", 500, HttpStatus.FAIL);
    return next(error);
  }
  reply.replace(/\n/g, "<br />");

  return res.status(200).json({
    status: HttpStatus.SUCCESS,
    data: {
      reply: response.text,
    },
  });
});

module.exports = aiChatBotController;
