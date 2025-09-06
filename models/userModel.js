const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  address: { type: String, required: false },
  avatar: { type: Object, required: false },
  email_verified: { type: Boolean, required: false },
  agreeToTerms: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", userSchema);
