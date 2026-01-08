const Project = require("../models/Project");
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

exports.getProjects = async (_req, res) => {
  const projects = await Project.find({ status: STATUS.PUBLISHED }).sort({
    publishedAt: -1,
    createdAt: -1,
  });
  return res.json({ projects });
};

exports.getProjectBySlug = async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.slug,
    status: STATUS.PUBLISHED,
  });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  return res.json({ project });
};

exports.createProject = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const status = req.body.status || STATUS.DRAFT;
    const project = await Project.create({
      title,
      slug: buildSlug(title, req.body.slug),
      excerpt: req.body.excerpt,
      stack: normalizeArray(req.body.stack),
      tags: normalizeArray(req.body.tags),
      gallery: normalizeArray(req.body.gallery),
      body,
      featured: Boolean(req.body.featured),
      status,
      publishedAt: status === STATUS.PUBLISHED ? new Date() : undefined,
      seoTitle: req.body.seoTitle,
      seoDescription: req.body.seoDescription,
    });

    return res.status(201).json({ project });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Failed to create project" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const fields = [
      "title",
      "excerpt",
      "body",
      "featured",
      "status",
      "seoTitle",
      "seoDescription",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    if (req.body.stack !== undefined)
      project.stack = normalizeArray(req.body.stack);
    if (req.body.tags !== undefined)
      project.tags = normalizeArray(req.body.tags);
    if (req.body.gallery !== undefined)
      project.gallery = normalizeArray(req.body.gallery);

    if (req.body.slug || req.body.title) {
      project.slug = buildSlug(req.body.title || project.title, req.body.slug);
    }

    if (project.status === STATUS.PUBLISHED && !project.publishedAt) {
      project.publishedAt = new Date();
    }

    await project.save();
    return res.json({ project });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Failed to update project" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();
    return res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete project" });
  }
};
