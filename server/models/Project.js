const mongoose = require("mongoose");
const { STATUS } = require("../utils/constants");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: String,
    stack: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    gallery: {
      type: [String],
      default: [],
    },
    body: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
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

projectSchema.pre("save", function setPublishDate(next) {
  if (
    this.isModified("status") &&
    this.status === STATUS.PUBLISHED &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Project", projectSchema);
