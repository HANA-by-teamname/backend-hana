const express = require("express");
const Favorite = require("../models/favorite");
const { authenticateJWT } = require("../middlewares/authenticateJWT");
const router = express.Router();

module.exports = (Feed) => {
  // 피드 검색 (JWT 인증 필요)
  router.post("/feeds/search", authenticateJWT, async (req, res) => {
    const { keyword, faculty, sort } = req.body;
    const user_id = req.user.id;

    // 검색 조건
    const query = {};
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } }
      ];
    }
    if (faculty && Array.isArray(faculty) && faculty.length > 0) {
      query.faculty = { $in: faculty };
    }

    // 정렬 조건
    let sortOption = {};
    if (sort === "정확도순" && keyword) {
      sortOption = { date: -1 };
    } else {
      sortOption = { date: -1 };
    }

    try {
      const feeds = await Feed.find(query).sort(sortOption);

      // 사용자의 관심 피드 목록 조회
      const favorites = await Favorite.find({ user_id });
      const favoriteFeedIds = favorites.map(fav => String(fav.feed_id));

      const result = feeds.map((feed) => ({
        feed_id: feed._id,
        title: feed.title,
        link: feed.link,
        faculty: feed.faculty,
        date: feed.date.toISOString().slice(0, 10),
        favorite: favoriteFeedIds.includes(String(feed._id))
      }));

      res.json({ feeds: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
};