const express = require("express");
const bcrypt = require("bcrypt");
const { issueJWT } = require("../middlewares/authenticateJWT");
const router = express.Router();

module.exports = (User) => {
  router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          errors: [{ field: "email", reason: "존재하지 않는 email입니다." }],
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          errors: [{ field: "password", reason: "비밀번호 오류입니다." }],
        });
      }

      const token = issueJWT(user);
      return res.status(200).json({ success: true, token });
    } catch (error) {
      console.error("❌ 로그인 에러:", error);
      res.status(500).json({
        success: false,
        errors: [{ field: "exception", reason: error.message || "알 수 없는 오류" }],
      });
    }
  });

  return router;
};