require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 4000;
const SECRET_KEY = "your_secret_key";

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect("mongodb://localhost:27017/hana", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 스키마
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true },
  gender: { type: String, required: true },
  birthdate: { type: Date, required: true },
  school: { type: String, required: true },
  native_language: { type: String, required: true },
  terms_agreement: { type: Boolean, required: true },
  privacy_agreement: { type: Boolean, required: true },
  marketing_agreement: { type: Boolean, required: true },
  third_party_agreement: { type: Boolean, required: true },
});

const User = mongoose.model("User", userSchema);

// 회원가입
app.post("/users/signup", async (req, res) => {
  const {
    email,
    password,
    nickname,
    gender,
    birthdate,
    school,
    native_language,
    terms_agreement,
    privacy_agreement,
    marketing_agreement,
    third_party_agreement,
  } = req.body;

  const errors = [];

  if (!nickname) {
    errors.push({ field: "nickname", reason: "닉네임을 입력해주세요." });
  } else {
    const existingUser = await User.findOne({ nickname });
    if (existingUser) {
      errors.push({ field: "nickname", reason: "이미 존재하는 닉네임입니다." });
    }
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    errors.push({ field: "email", reason: "이미 존재하는 이메일입니다." });
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

  if (!terms_agreement) {
    errors.push({
      field: "terms_agreement",
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
      nickname,
      gender,
      birthdate: new Date(birthdate), // ✅ 문자열 → Date 객체 변환
      school,
      native_language,
      terms_agreement,
      privacy_agreement,
      marketing_agreement,
      third_party_agreement,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ success: true, token }); // ✅ 프론트에서 바로 로그인 처리 가능!

  } catch (error) {
    console.error('❌ 회원가입 에러:', error);
    res.status(500).json({
      success: false,
      errors: [{ field: "exception", reason: error.message || "알 수 없는 오류" }],
    });
  }
});

// 로그인
app.post("/users/login", async (req, res) => {
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

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({ success: true, token });

  } catch (error) {
    console.error('❌ 로그인 에러:', error);
    res.status(500).json({
      success: false,
      errors: [{ field: "exception", reason: error.message || "알 수 없는 오류" }],
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
