const express = require("express");
const { body, param } = require("express-validator");
const {
  getDocs,
  getDocBySlug,
  createDoc,
  updateDoc,
} = require("../controllers/docController");
const userAuth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const validate = require("../middleware/validation");
const { STATUS, ROLES } = require("../utils/constants");

const router = express.Router();

router.get("/", getDocs);
router.get("/:slug", getDocBySlug);

router.post(
  "/",
  userAuth,
  allowRoles(ROLES.ADMIN, ROLES.EDITOR),
  validate([
    body("title").notEmpty().withMessage("Title is required"),
    body("section").notEmpty().withMessage("Section is required"),
    body("body").notEmpty().withMessage("Body is required"),
    body("status")
      .optional()
      .isIn(Object.values(STATUS))
      .withMessage("Invalid status"),
  ]),
  createDoc
);

router.patch(
  "/:id",
  userAuth,
  allowRoles(ROLES.ADMIN, ROLES.EDITOR),
  validate([
    param("id").isMongoId().withMessage("Valid doc id is required"),
    body("status")
      .optional()
      .isIn(Object.values(STATUS))
      .withMessage("Invalid status"),
  ]),
  updateDoc
);

module.exports = router;
