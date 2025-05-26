const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  gender: { type: String, required: true },
  birthdate: { type: Date, required: true },
  faculty: { type: String, required: true },
  native_language: { type: String, required: true },
  terms_agreement: { type: Boolean, required: true },
  privacy_agreement: { type: Boolean, required: true },
  marketing_agreement: { type: Boolean, required: true },
  third_party_agreement: { type: Boolean, required: true }
});

const User = mongoose.model("User", userSchema);

module.exports = User;