const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true},
  author: { type: String, required: true },
  imageFile: { type: Object, required: false },
  publishedDate: { type: String, required: true },
  updatedDate: { type: String, required: false },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
});

module.exports = mongoose.model("Blog", BlogSchema);