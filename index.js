require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 4000;
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/hana";

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 스키마
const User = require("./models/user");
const Feed = require("./models/feed");

const signupRouter = require("./routes/signup")(User);
const loginRouter = require("./routes/login")(User);
const feedRouter = require("./routes/feed")(Feed);
const favoriteRouter = require("./routes/favorite");
const socialRouter = require("./routes/social");

app.use(signupRouter);
app.use(loginRouter);
app.use(feedRouter);
app.use(favoriteRouter);
app.use(socialRouter);

app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
