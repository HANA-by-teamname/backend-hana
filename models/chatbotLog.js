const mongoose = require("mongoose");

// 대화 이력 스키마 및 모델
const chatbotLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ChatbotLog = mongoose.model("ChatbotLog", chatbotLogSchema, "chatbotlog");

module.exports = ChatbotLog;