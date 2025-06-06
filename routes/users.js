// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // 경로는 프로젝트 구조에 따라 조정

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
