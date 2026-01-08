const Post = require("../models/Post");
const slugify = require("../utils/slugify");
const { STATUS } = require("../utils/constants");

const normalizeArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value].filter(Boolean);
};

const buildSlug = (title, providedSlug) => {
  const base = providedSlug || title;
  return slugify(base);
};

exports.getPosts = async (_req, res) => {
  const posts = await Post.find({ status: STATUS.PUBLISHED }).sort({
    publishedAt: -1,
    createdAt: -1,
  });
  return res.json({ posts });
};

exports.getPostBySlug = async (req, res) => {
  const post = await Post.findOne({
    slug: req.params.slug,
    status: STATUS.PUBLISHED,
  });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  return res.json({ post });
};

exports.createPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const status = req.body.status || STATUS.DRAFT;
    const post = await Post.create({
      title,
      slug: buildSlug(title, req.body.slug),
      excerpt: req.body.excerpt,
      tags: normalizeArray(req.body.tags),
      coverImage: req.body.coverImage,
      body,
      status,
      publishedAt: status === STATUS.PUBLISHED ? new Date() : undefined,
      seoTitle: req.body.seoTitle,
      seoDescription: req.body.seoDescription,
    });

    return res.status(201).json({ post });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Failed to create post" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const fields = [
      "title",
      "excerpt",
      "body",
      "status",
      "coverImage",
      "seoTitle",
      "seoDescription",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        post[field] = req.body[field];
      }
    });

    if (req.body.tags !== undefined) post.tags = normalizeArray(req.body.tags);
    if (req.body.slug || req.body.title) {
      post.slug = buildSlug(req.body.title || post.title, req.body.slug);
    }

    if (post.status === STATUS.PUBLISHED && !post.publishedAt) {
      post.publishedAt = new Date();
    }

    await post.save();
    return res.json({ post });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Failed to update post" });
  }
};
