const mongoose = require("mongoose");
const { STATUS } = require("../utils/constants");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: String,
    tags: {
      type: [String],
      default: [],
    },
    coverImage: String,
    body: { type: String, required: true },
    status: {
      type: String,
      enum: [STATUS.DRAFT, STATUS.PUBLISHED],
      default: STATUS.DRAFT,
    },
    publishedAt: Date,
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

postSchema.pre("save", function setPublishDate(next) {
  if (
    this.isModified("status") &&
    this.status === STATUS.PUBLISHED &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);
