const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  faculty: { type: String, required: true },
  date: { type: Date, required: true },
  content: { type: String, required: true }
});

const Feed = mongoose.model("Feed", feedSchema);

module.exports = Feed;