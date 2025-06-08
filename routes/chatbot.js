const express = require("express");
const axios = require("axios");
const { authenticateJWT } = require("../middlewares/authenticateJWT");
const router = express.Router();
const ChatbotLog = require("../models/chatbotLog");

// Ollama REST API 엔드포인트
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434/api/chat";

// 챗봇 질문 및 답변 생성
router.post("/chatbot/message", authenticateJWT, async (req, res) => {
  const user_id = req.user.id;
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, error: "메시지가 필요합니다." });
  }

  try {
    // Ollama REST API 호출
    const ollamaRes = await axios.post(OLLAMA_API_URL, {
      model: "llama3", // 실제 사용 모델명으로 변경
      messages: [{ role: "user", content: message }]
    });

    const answer = ollamaRes.data.message?.content || "답변을 생성할 수 없습니다.";

    // 대화 이력 저장
    await ChatbotLog.create({
      user_id,
      message,
      answer
    });

    res.json({ success: true, answer });
  } catch (error) {
    console.error("❌ Ollama API 오류:", error.message);
    res.status(500).json({ success: false, error: "챗봇 응답 생성 중 오류가 발생했습니다." });
  }
});

// 대화 이력 조회
router.get("/chatbot/history", authenticateJWT, async (req, res) => {
  const user_id = req.user.id;
  try {
    // 로그인한 사용자의 전체 대화 이력 조회 (오래된 순)
    const history = await ChatbotLog.find({ user_id })
      .sort({ createdAt: 1 })
      .select("message answer createdAt -_id"); // message, answer, createdAt만 반환
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: "대화 이력 조회 중 오류가 발생했습니다." });
  }
});

module.exports = router;