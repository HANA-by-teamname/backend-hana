const express = require("express");
const Favorite = require("../models/favorite");
const Feed = require("../models/feed");
const { authenticateJWT } = require("../middlewares/authenticateJWT");
const router = express.Router();

// 관심목록 추가
router.post("/favorites/add", authenticateJWT, async (req, res) => {
  const user_id = req.user.id;
  const { feed_id } = req.body;
  const errors = [];

  // 이미 관심목록에 있는지 확인
  const exists = await Favorite.findOne({ user_id, feed_id });
  if (exists) {
    return res.status(409).json({
      success: false,
      errors: [{ field: "feedId", reason: "이미 관심목록에 추가된 공지입니다." }]
    });
  }

  // 관심목록에 없으면 추가
  await Favorite.create({ user_id, feed_id });
  res.status(201).json({ success: true, errors: [] });
});

// 관심목록 삭제
router.post("/favorites/delete", authenticateJWT, async (req, res) => {
  const user_id = req.user.id;
  const { feed_id } = req.body;
  const errors = [];

  const favorite = await Favorite.findOne({ user_id, feed_id });
  if (!favorite) {
    errors.push({ field: "feedId", reason: "해당 공지가 관심 목록에 없습니다." });
    return res.status(404).json({ success: false, errors });
  }

  await Favorite.deleteOne({ _id: favorite._id });
  res.status(200).json({ success: true, errors: [] });
});

// 관심목록 조회
router.get("/favorites/list", authenticateJWT, async (req, res) => {
  const user_id = req.user.id;
  const favorites = await Favorite.find({ user_id }).populate("feed_id");

  const feeds = favorites.map(fav => {
    const feed = fav.feed_id;
    return {
      feed_id: feed._id,
      title: feed.title,
      link: feed.link,
      faculty: feed.faculty,
      date: feed.date.toISOString().slice(0, 10),
      favorited: true
    };
  });

  res.status(200).json({ feeds });
});

module.exports = router;