const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: "인증 토큰이 필요합니다." });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: "유효하지 않은 토큰입니다." });
    }
    req.user = user;
    next();
  });
}

// JWT 토큰 발급 함수
function issueJWT(user) {
  return jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
}

module.exports = {
  authenticateJWT,
  issueJWT
};