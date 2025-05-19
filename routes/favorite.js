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

  // 피드 존재 여부 확인
  const feed = await Feed.findById(feed_id);
  if (!feed) {
    errors.push({ field: "feedId", reason: "유효한 공지 ID가 아닙니다." });
    return res.json({ success: false, errors });
  }

  // 이미 관심목록에 있는지 확인
  const exists = await Favorite.findOne({ user_id, feed_id });
  if (exists) {
    return res.json({ success: true, errors: [] });
  }

  await Favorite.create({ user_id, feed_id });
  res.json({ success: true, errors: [] });
});

// 관심목록 삭제
router.post("/favorites/delete", authenticateJWT, async (req, res) => {
  const user_id = req.user.id;
  const { feed_id } = req.body;
  const errors = [];

  const favorite = await Favorite.findOne({ user_id, feed_id });
  if (!favorite) {
    errors.push({ field: "feedId", reason: "해당 공지가 관심 목록에 없습니다." });
    return res.json({ success: false, errors });
  }

  await Favorite.deleteOne({ _id: favorite._id });
  res.json({ success: true, errors: [] });
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

  res.json({ feeds });
});

module.exports = router;