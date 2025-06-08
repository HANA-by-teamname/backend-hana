const express = require("express");
const { spawn } = require("child_process");
const { authenticateJWT } = require("../middlewares/authenticateJWT");
const ChatbotLog = require("../models/chatbotLog");

const router = express.Router();

// ✅ Python 기반 챗봇 실행 (스크립트 경로는 환경에 맞게 선택)
const PYTHON_SCRIPT = process.env.PYTHON_SCRIPT_PATH || "./python-ai/chatbot.py";

// ✅ 챗봇 메시지 처리
router.post("/chatbot/message", authenticateJWT, async (req, res) => {
  const user_id = req.user.id;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: "메시지를 입력하세요." });
  }

  try {
    const python = spawn("python", [PYTHON_SCRIPT, message]);

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", async (code) => {
      try {
        if (code !== 0 || errorOutput) {
          console.error("❌ Python 오류:", errorOutput);
          return res.status(500).json({ success: false, error: "챗봇 응답 생성 중 오류가 발생했습니다." });
        }

        // ✅ JSON 파싱
        let parsed;
        try {
          parsed = JSON.parse(output.trim());
        } catch (err) {
          console.error("❌ JSON 파싱 오류:", err.message, "output:", output);
          return res.status(500).json({ success: false, error: "챗봇 응답 파싱 중 오류가 발생했습니다." });
        }

        const answer = parsed.answer || parsed.error || "챗봇 응답이 없습니다.";

        // ✅ MongoDB에 대화 이력 저장
        await ChatbotLog.create({
          user_id,
          message,
          answer
        });

        res.json({ success: true, answer });
      } catch (err) {
        console.error("❌ 서버 내부 오류:", err.message);
        res.status(500).json({ success: false, error: "서버 오류가 발생했습니다." });
      }
    });
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err.message);
    res.status(500).json({ success: false, error: "서버 오류가 발생했습니다." });
  }
});

// ✅ 대화 이력 조회
router.get("/chatbot/history", authenticateJWT, async (req, res) => {
  const user_id = req.user.id;
  try {
    const history = await ChatbotLog.find({ user_id })
      .sort({ createdAt: 1 })
      .select("message answer createdAt -_id");

    res.json({ success: true, history });
  } catch (err) {
    console.error("❌ 이력 조회 오류:", err.message);
    res.status(500).json({ success: false, error: "대화 이력 조회 중 오류가 발생했습니다." });
  }
});

module.exports = router;
