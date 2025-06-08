const express = require("express");
const bcrypt = require("bcrypt");
const { issueJWT } = require("../middlewares/authenticateJWT");
const router = express.Router();

module.exports = (User) => {
  router.post("/users/signup", async (req, res) => {
    const {
      email,
      password,
      name,
      nickname,
      gender,
      birthdate,
      faculty,
      data_sources,
      native_language,
      terms_agreement,
      privacy_agreement,
      marketing_agreement,
      third_party_agreement,
    } = req.body;

    const errors = [];

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      errors.push({ field: "email", reason: "이미 존재하는 이메일입니다." });
    }

    if (!name) {
      errors.push({ field: "name", reason: "이름을 입력해주세요." });
    }

    if (!nickname) {
      errors.push({ field: "nickname", reason: "닉네임을 입력해주세요." });
    } else {
      const existingUser = await User.findOne({ nickname });
      if (existingUser) {
        errors.push({ field: "nickname", reason: "이미 존재하는 닉네임입니다." });
      }
    }

    if (!gender) {
      errors.push({ field: "gender", reason: "성별을 선택해주세요." });
    }

    if (!birthdate || !/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
      errors.push({
        field: "birthdate",
        reason: "잘못된 날짜 형식입니다. (YYYY-MM-DD 형식 필수)",
      });
    }

    if (!faculty) {
      errors.push({ field: "faculty", reason: "학부를 입력해주세요." });
    }

    if (!data_sources || !Array.isArray(data_sources) || data_sources.length === 0) {
      errors.push({ field: "data_sources", reason: "데이터 소스를 1개 이상 선택해야 합니다." });
    }

    if (!native_language) {
      errors.push({ field: "native_language", reason: "모국어를 선택해주세요." });
    }

    if (!terms_agreement) {
      errors.push({
        field: "terms_agreement",
        reason: "필수 항목이므로 반드시 동의해야 합니다.",
      });
    }

    if (!privacy_agreement) {
      errors.push({
        field: "privacy_agreement",
        reason: "필수 항목이므로 반드시 동의해야 합니다.",
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
        name,
        nickname,
        gender,
        birthdate: new Date(birthdate),
        faculty,
        data_sources,
        native_language,
        terms_agreement,
        privacy_agreement,
        marketing_agreement,
        third_party_agreement,
      });
      await newUser.save();
      const token = issueJWT(newUser);
      res.status(201).json({ success: true, token });
    } catch (error) {
      console.error('❌ 회원가입 에러:', error);
      res.status(500).json({
        success: false,
        errors: [{ field: "exception", reason: error.message || "알 수 없는 오류" }],
      });
    }
  });

  return router;
};