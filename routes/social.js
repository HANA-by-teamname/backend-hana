const express = require("express");
const axios = require("axios");
const User = require("../models/user");
const { issueJWT } = require("../middlewares/authenticateJWT");
const router = express.Router();

// 카카오 소셜 로그인
router.get("/users/social/kakao", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ success: false, errors: [{ field: "code", reason: "인가 코드가 없습니다." }] });
  }

  try {
    const tokenRes = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_CLIENT_ID, // .env에 등록 필요
          redirect_uri: process.env.KAKAO_REDIRECT_URI, // .env에 등록 필요
          code,
        },
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    // access_token 추출
    const { access_token } = tokenRes.data;

    // access_token을 이용해 카카오 사용자 정보 요청
    const kakaoRes = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const kakaoAccount = kakaoRes.data.kakao_account;
    const email = kakaoAccount.email;
    if (!email) {
      return res.status(400).json({ success: false, errors: [{ field: "email", reason: "카카오 계정에 이메일 정보가 없습니다." }] });
    }

    let user = await User.findOne({ email });
    if (user) {
      // 이미 가입된 이메일이면 바로 로그인(JWT 발급)
      const token = issueJWT(user);
      return res.status(200).json({ success: true, token });
    } else {
      // 가입되지 않은 이메일이면 프론트에서 회원가입 진행
      return res.status(200).json({ success: true, email });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: [{ field: "exception", reason: error.response?.data?.error_description || error.message }],
    });
  }
});

// 구글 소셜 로그인
router.get("/users/social/google", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ success: false, errors: [{ field: "code", reason: "인가 코드가 없습니다." }] });
  }

  try {
    // access_token 발급
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID, // .env에 등록 필요
          client_secret: process.env.GOOGLE_CLIENT_SECRET, // .env에 등록 필요
          redirect_uri: process.env.GOOGLE_REDIRECT_URI, // .env에 등록 필요
          grant_type: "authorization_code"
        },
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        }
      }
    );
    const { access_token } = tokenRes.data;

    // access_token으로 사용자 정보 요청
    const googleRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const email = googleRes.data.email;
    if (!email) {
      return res.status(400).json({ success: false, errors: [{ field: "email", reason: "구글 계정에 이메일 정보가 없습니다." }] });
    }

    let user = await User.findOne({ email });
    if (user) {
      // 이미 가입된 이메일이면 바로 로그인(JWT 발급)
      const token = issueJWT(user);
      return res.status(200).json({ success: true, token });
    } else {
      // 가입되지 않은 이메일이면 프론트에서 회원가입 진행
      return res.status(200).json({ success: true, email });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: [{ field: "exception", reason: error.response?.data?.error_description || error.message }],
    });
  }
});

module.exports = router;