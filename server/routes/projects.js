const express = require("express");
const { body, param } = require("express-validator");
const {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const userAuth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const validate = require("../middleware/validation");
const { STATUS, ROLES } = require("../utils/constants");

const router = express.Router();

router.get("/", getProjects);
router.get("/:slug", getProjectBySlug);

router.post(
  "/",
  userAuth,
  allowRoles(ROLES.ADMIN, ROLES.EDITOR),
  validate([
    body("title").notEmpty().withMessage("Title is required"),
    body("body").notEmpty().withMessage("Body is required"),
    body("status")
      .optional()
      .isIn(Object.values(STATUS))
      .withMessage("Invalid status"),
  ]),
  createProject
);

router.patch(
  "/:id",
  userAuth,
  allowRoles(ROLES.ADMIN, ROLES.EDITOR),
  validate([
    param("id").isMongoId().withMessage("Valid project id is required"),
    body("status")
      .optional()
      .isIn(Object.values(STATUS))
      .withMessage("Invalid status"),
  ]),
  updateProject
);

router.delete(
  "/:id",
  userAuth,
  allowRoles(ROLES.ADMIN),
  validate([
    param("id").isMongoId().withMessage("Valid project id is required"),
  ]),
  deleteProject
);

module.exports = router;
