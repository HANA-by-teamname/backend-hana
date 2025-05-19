const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feed_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Feed', required: true }
}, {
  timestamps: true
});

// favorite_id는 _id 필드를 그대로 사용합니다.
const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;