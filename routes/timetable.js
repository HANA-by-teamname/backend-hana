const express = require("express");
const router = express.Router();
const Timetable = require("../models/timetable");
const { authenticateJWT } = require("../middlewares/authenticateJWT");

// 1. 과목 추가
router.post("/timetable/add", authenticateJWT, async (req, res) => {
  const user_id = req.user.id;
  const { subject, day, start_time, end_time, professor, location } = req.body;
  // 모든 항목이 필수
  if (!subject || !day || !start_time || !end_time || !professor || !location) {
    return res.status(400).json({ success: false, error: "모든 항목을 입력해야 합니다." });
  }

  // 시간 겹침 체크
  // start_time, end_time은 "HH:mm" 형식 문자열로 가정
  // 겹치는 조건: (기존.start < 새.end) && (새.start < 기존.end)
  const overlap = await Timetable.findOne({
    user_id,
    day,
    $or: [
      {
        start_time: { $lt: end_time },
        end_time: { $gt: start_time }
      }
    ]
  });

  if (overlap) {
    return res.status(400).json({ success: false, error: "해당 시간에 이미 등록된 과목이 있습니다." });
  }

  try {
    const newSubject = await Timetable.create({
      user_id,
      subject,
      day,
      start_time,
      end_time,
      professor,
      location
    });
    // _id, user_id, __v를 제외하고 반환
    const { _id, user_id: _, __v, ...subjectWithoutId } = newSubject.toObject();
    res.json({ success: true, timetable: subjectWithoutId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. 과목 삭제
router.delete("/timetable/delete", authenticateJWT, async (req, res) => {
  const user_id = req.user.id;
  const { subject, day, start_time } = req.body;
  if (!subject || !day || !start_time) {
    return res.status(400).json({ success: false, error: "삭제할 과목 정보가 부족합니다." });
  }
  try {
    const result = await Timetable.deleteOne({ user_id, subject, day, start_time });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "해당 과목을 찾을 수 없습니다." });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. 시간표 조회
router.get("/timetable/list", authenticateJWT, async (req, res) => {
  const user_id = req.user.id;
  try {
    // _id, user_id, __v를 제외하고 반환
    const timetable = await Timetable.find({ user_id }).select("-_id -user_id -__v");
    res.json({ success: true, timetable });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;