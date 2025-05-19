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
  faculty: { type: String, required: true },
  native_language: { type: String, required: true },
  terms_agreement: { type: Boolean, required: true },
  privacy_agreement: { type: Boolean, required: true },
  marketing_agreement: { type: Boolean, required: true },
  third_party_agreement: { type: Boolean, required: true },
});

const User = mongoose.model("User", userSchema);

const signupRouter = require("./routes/signup")(User, SECRET_KEY);
const loginRouter = require("./routes/login")(User, SECRET_KEY);

app.use(signupRouter);
app.use(loginRouter);

app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
