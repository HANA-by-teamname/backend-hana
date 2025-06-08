const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true }, // 예: "오픈소스SW프로젝트"
  day: { type: String, required: true }, // 예: "월"
  start_time: { type: String, required: true }, // 예: "13:00"
  end_time: { type: String, required: true },   // 예: "15:00"
  professor: { type: String, required: true }, // 예: "김영빈"
  location: { type: String, required: true } // 예: "310관 727호"
});

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;