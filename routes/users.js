const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { authenticateJWT } = require('../middlewares/authenticateJWT'); // 이 라인도 추가

// ✅ GET /users/me — 로그인된 사용자 정보 조회
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // 비밀번호 제외하고 전달
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user);
  } catch (error) {
    console.error('❌ 사용자 정보 조회 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 기존 닉네임 중복 확인
router.get('/check-nickname', async (req, res) => {
  const { nickname } = req.query;
  if (!nickname) {
    return res.status(400).json({ exists: false, reason: '닉네임이 필요합니다.' });
  }

  try {
    const existing = await User.findOne({ nickname });
    return res.json({ exists: !!existing });
  } catch (err) {
    console.error('❌ 닉네임 확인 오류:', err);
    return res.status(500).json({ exists: false, reason: '서버 오류' });
  }
});

module.exports = router;
