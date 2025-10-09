import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  authorHandle: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});
const Article = mongoose.model("Article", articleSchema);

export default Article;
