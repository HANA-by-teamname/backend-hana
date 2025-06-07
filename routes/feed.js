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

    try {
      let feeds = [];

      if (sort === "최신순") {
        feeds = await Feed.find(query).sort({ date: -1 });

      } else if (sort === "인기순") {
        const allFeeds = await Feed.find(query);

        const favoriteCounts = await Favorite.aggregate([
          { $match: { feed_id: { $in: allFeeds.map(feed => feed._id) } } },
          { $group: { _id: "$feed_id", count: { $sum: 1 } } }
        ]);
        const countMap = new Map(favoriteCounts.map(f => [String(f._id), f.count]));

        const feedsWithCount = allFeeds.map(feed => ({
          ...feed.toObject(),
          favoriteCount: countMap.get(String(feed._id)) || 0
        }));

        feeds = feedsWithCount.sort((a, b) => {
          if (b.favoriteCount !== a.favoriteCount) {
            return b.favoriteCount - a.favoriteCount;
          }
          return new Date(b.date) - new Date(a.date);
        });

      } else if (sort === "정확도순") {
        const allFeeds = await Feed.find(query);
        feeds = allFeeds.sort((a, b) => {
          const aCount =
            (a.title.match(new RegExp(keyword, "gi")) || []).length +
            (a.content.match(new RegExp(keyword, "gi")) || []).length;
          const bCount =
            (b.title.match(new RegExp(keyword, "gi")) || []).length +
            (b.content.match(new RegExp(keyword, "gi")) || []).length;
          return bCount - aCount;
        });

      } else {
        return res.status(400).json({
          success: false,
          error: "sort 값이 필요합니다. (정확도순, 최신순, 인기순)"
        });
      }

      const favorites = await Favorite.find({ user_id });
      const favoriteFeedIds = favorites.map(fav => String(fav.feed_id));

      const result = feeds.map(feed => ({
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
