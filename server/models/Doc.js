const mongoose = require("mongoose");
const { STATUS } = require("../utils/constants");

const docSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    section: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
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

docSchema.index({ section: 1, order: 1 });

docSchema.pre("save", function setPublishDate(next) {
  if (
    this.isModified("status") &&
    this.status === STATUS.PUBLISHED &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Doc", docSchema);
