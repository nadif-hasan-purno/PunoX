const Doc = require("../models/Doc");
const slugify = require("../utils/slugify");
const { STATUS } = require("../utils/constants");

const buildSlug = (title, providedSlug) => {
  const base = providedSlug || title;
  return slugify(base);
};

exports.getDocs = async (req, res) => {
  const filter = { status: STATUS.PUBLISHED };
  if (req.query.section) {
    filter.section = req.query.section;
  }

  const docs = await Doc.find(filter).sort({ section: 1, order: 1 });
  return res.json({ docs });
};

exports.getDocBySlug = async (req, res) => {
  const doc = await Doc.findOne({
    slug: req.params.slug,
    status: STATUS.PUBLISHED,
  });
  if (!doc) {
    return res.status(404).json({ message: "Doc not found" });
  }
  return res.json({ doc });
};

exports.createDoc = async (req, res) => {
  try {
    const { title, section, body } = req.body;
    if (!title || !section || !body) {
      return res
        .status(400)
        .json({ message: "Title, section, and body are required" });
    }

    const status = req.body.status || STATUS.DRAFT;
    const doc = await Doc.create({
      title,
      slug: buildSlug(title, req.body.slug),
      section,
      order: req.body.order || 0,
      body,
      status,
      publishedAt: status === STATUS.PUBLISHED ? new Date() : undefined,
      seoTitle: req.body.seoTitle,
      seoDescription: req.body.seoDescription,
    });

    return res.status(201).json({ doc });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Failed to create doc" });
  }
};

exports.updateDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Doc.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Doc not found" });
    }

    const fields = [
      "title",
      "section",
      "order",
      "body",
      "status",
      "seoTitle",
      "seoDescription",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        doc[field] = req.body[field];
      }
    });

    if (req.body.slug || req.body.title) {
      doc.slug = buildSlug(req.body.title || doc.title, req.body.slug);
    }

    if (doc.status === STATUS.PUBLISHED && !doc.publishedAt) {
      doc.publishedAt = new Date();
    }

    await doc.save();
    return res.json({ doc });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Failed to update doc" });
  }
};
