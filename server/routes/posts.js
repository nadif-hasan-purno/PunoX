const express = require("express");
const { body, param } = require("express-validator");
const {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
} = require("../controllers/postController");
const userAuth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const validate = require("../middleware/validation");
const { STATUS, ROLES } = require("../utils/constants");

const router = express.Router();

router.get("/", getPosts);
router.get("/:slug", getPostBySlug);

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
  createPost
);

router.patch(
  "/:id",
  userAuth,
  allowRoles(ROLES.ADMIN, ROLES.EDITOR),
  validate([
    param("id").isMongoId().withMessage("Valid post id is required"),
    body("status")
      .optional()
      .isIn(Object.values(STATUS))
      .withMessage("Invalid status"),
  ]),
  updatePost
);

module.exports = router;
