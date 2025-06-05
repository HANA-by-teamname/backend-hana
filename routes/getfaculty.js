const express = require('express');
const router = express.Router();
const Feed = require('../models/feed');

router.get('/faculties', async (req, res) => {
  try {
    const faculties = await Feed.distinct('faculty');
    res.json({ faculties });
  } catch (err) {
    res.status(500).json({ error: '학부 목록 조회 실패' });
  }
});

module.exports = router;
