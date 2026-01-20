// Express
const express = require("express");
// Router
const router = express.Router();

const aiChatBotController = require("../controllers/aiChat/aiChatBotController");

router.route("/aiChatBot").post(aiChatBotController);


module.exports = router;
